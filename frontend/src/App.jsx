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
    
    // We must use FormData to send files over HTTP
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze/match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to analyze CV. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>CoreATS Matchmaker</h1>
      <p>Upload your CV (PDF) and paste the Job Description to test the engine.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label><strong>Job Description:</strong></label><br />
          <textarea 
            rows="6" 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job requirements here..."
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
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
          <h3>Analysis Result (Success!)</h3>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>CV Length:</strong> {result.extractedCVLength} characters</p>
          <p><strong>Preview:</strong> {result.previewCV}</p>
        </div>
      )}
    </div>
  );
}

export default App;