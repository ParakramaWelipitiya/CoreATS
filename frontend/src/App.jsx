import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      alert('Please provide both a CV and a Job Description.');
      return;
    }

    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze/match', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Set the result to the AI data object returned by the backend
      setResult(response.data.data);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to analyze CV. Check the backend terminal.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 50) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center' }}>CoreATS Matchmaker</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Upload your CV and paste the Job Description to check your ATS alignment.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <label><strong>Job Description:</strong></label><br />
          <textarea 
            rows="6" 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job requirements here..."
          />
        </div>

        <div>
          <label><strong>Upload CV (PDF or Word):</strong></label><br />
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange} 
            style={{ marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: loading ? '#9E9E9E' : '#007BFF', color: '#FFF', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Analyzing with AI...' : 'Scan Resume'}
        </button>
      </form>

      {/* Results Dashboard */}
      {result && (
        <div style={{ marginTop: '30px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid #e9ecef' }}>
            <div style={{ 
              width: '90px', height: '90px', 
              borderRadius: '50%', 
              backgroundColor: getScoreColor(result.matchPercentage),
              color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '28px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {result.matchPercentage}%
            </div>
            <div>
              <h2 style={{ margin: '0 0 5px 0' }}>Match Score</h2>
              <span style={{ color: '#666' }}>Based on semantic keyword alignment</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>🚨 Missing Critical Keywords</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.missingKeywords?.length > 0 ? result.missingKeywords.map((kw, i) => (
                <span key={i} style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
                  {kw}
                </span>
              )) : <span style={{ color: '#4CAF50' }}>No critical keywords missing!</span>}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#007BFF', margin: '0 0 10px 0' }}>💡 Optimization Suggestions</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              {result.suggestions?.map((sug, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{sug}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;