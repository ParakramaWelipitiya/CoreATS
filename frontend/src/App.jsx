import { useState } from 'react';
import axios from 'axios';
import { 
  FileText, Briefcase, Zap, AlertTriangle, 
  CheckCircle, Sparkles, ScanLine, FileSearch, Layers
} from 'lucide-react';
import './App.css';

function App() {
  const [mode, setMode] = useState('matchmaker'); // 'matchmaker' or 'audit'
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setResult(null); // Clear previous results when switching modes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a CV.');
      return;
    }
    if (mode === 'matchmaker' && !jobDescription) {
      alert('Please provide a Job Description for the Matchmaker.');
      return;
    }

    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('cv', file);
    if (mode === 'matchmaker') formData.append('jobDescription', jobDescription);

    const endpoint = mode === 'matchmaker' ? '/api/analyze/match' : '/api/analyze/audit';

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data.data);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to analyze CV. Check the backend terminal.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="flex-icon-title" style={{ color: 'var(--primary)' }}>
          <ScanLine size={40} /> CoreATS
        </h1>
        <p>AI-driven resume optimization and ATS parsing</p>
      </header>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <button 
          onClick={() => handleModeSwitch('matchmaker')}
          style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: mode === 'matchmaker' ? 'var(--primary)' : 'white', color: mode === 'matchmaker' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Briefcase size={18} /> Matchmaker
        </button>
        <button 
          onClick={() => handleModeSwitch('audit')}
          style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: mode === 'audit' ? 'var(--primary)' : 'white', color: mode === 'audit' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileSearch size={18} /> General Audit
        </button>
      </div>
      
      <main className="content-grid">
        {/* Left Column: Input Form */}
        <section className="card">
          <form onSubmit={handleSubmit}>
            {mode === 'matchmaker' && (
              <div className="input-group">
                <label className="flex-icon-title" style={{ justifyContent: 'flex-start' }}>
                  <Briefcase size={18} /> Target Job Description
                </label>
                <textarea 
                  rows="8" 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements, skills, and responsibilities here..."
                />
              </div>
            )}

            <div className="input-group">
              <label className="flex-icon-title" style={{ justifyContent: 'flex-start' }}>
                <FileText size={18} /> Upload Resume
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <div className="btn-content">
                {loading ? <Zap className="skeleton-pulse" size={20} /> : <Sparkles size={20} />}
                {loading ? 'Analyzing with AI...' : `Run ${mode === 'matchmaker' ? 'Match' : 'Audit'}`}
              </div>
            </button>
          </form>
        </section>

        {/* Right Column: Results Dashboard */}
        <section className="card">
          {!result && !loading && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '15px' }}>
              <ScanLine size={48} style={{ opacity: 0.3 }} />
              <p>Upload your documents to see the {mode === 'matchmaker' ? 'ATS analysis' : 'Audit report'} here.</p>
            </div>
          )}

          {loading && (
            <div className="skeleton-pulse animate-slide-up">
              <div className="score-card">
                <div className="skeleton-box skeleton-circle"></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton-box skeleton-line short"></div>
                  <div className="skeleton-box skeleton-line"></div>
                </div>
              </div>
            </div>
          )}

          {/* Results: Matchmaker Mode */}
          {result && !loading && mode === 'matchmaker' && (
            <div className="dashboard-results animate-slide-up">
              <div className="score-card">
                <div 
                  className="score-circle" 
                  style={{ 
                    backgroundColor: getScoreColor(result.matchPercentage),
                    boxShadow: `0 8px 16px -4px ${getScoreColor(result.matchPercentage)}60`
                  }}
                >
                  {result.matchPercentage}%
                </div>
                <div className="score-text">
                  <h2>Match Score</h2>
                  <p>Based on semantic keyword alignment.</p>
                </div>
              </div>

              <h3 className="section-title" style={{ color: 'var(--danger-text)' }}>
                <AlertTriangle size={20} /> Missing Keywords
              </h3>
              <div className="chip-container">
                {result.missingKeywords?.length > 0 ? result.missingKeywords.map((kw, i) => (
                  <span key={i} className="chip">{kw}</span>
                )) : (
                  <span style={{ color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                    <CheckCircle size={18} /> All critical keywords found!
                  </span>
                )}
              </div>

              <h3 className="section-title" style={{ color: 'var(--primary)' }}>
                <Sparkles size={20} /> Optimization Strategy
              </h3>
              <ul className="suggestions-list">
                {result.suggestions?.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Results: General Audit Mode */}
          {result && !loading && mode === 'audit' && (
            <div className="dashboard-results animate-slide-up">
              <div className="score-card">
                <div 
                  className="score-circle" 
                  style={{ 
                    backgroundColor: getScoreColor(result.healthScore),
                    boxShadow: `0 8px 16px -4px ${getScoreColor(result.healthScore)}60`
                  }}
                >
                  {result.healthScore}%
                </div>
                <div className="score-text">
                  <h2>Overall Health</h2>
                  <p>Based on ATS readability, structure, and action verbs.</p>
                </div>
              </div>

              {/* Missing Sections */}
              <h3 className="section-title" style={{ color: 'var(--danger-text)' }}>
                <Layers size={20} /> Missing Standard Sections
              </h3>
              <div className="chip-container">
                {result.missingSections?.length > 0 ? result.missingSections.map((sec, i) => (
                  <span key={i} className="chip">{sec}</span>
                )) : <span style={{ color: 'var(--success-text)' }}>Core sections present!</span>}
              </div>

              {/* Formatting Issues */}
              <h3 className="section-title" style={{ color: 'var(--primary)' }}>
                <AlertTriangle size={20} /> Formatting Issues
              </h3>
              <ul className="suggestions-list" style={{ marginBottom: '30px' }}>
                {result.formattingIssues?.length > 0 ? result.formattingIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                )) : <li style={{ color: 'var(--success-text)' }}>No major parsing issues detected.</li>}
              </ul>

              {/* Weak Verbs */}
              <h3 className="section-title" style={{ color: '#f59e0b' }}>
                <Zap size={20} /> Weak Action Verbs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.weakVerbs?.length > 0 ? result.weakVerbs.map((item, i) => (
                  <div key={i} style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <strong>Replace:</strong> <span style={{ color: '#b45309', textDecoration: 'line-through' }}>{item.verb}</span><br/>
                    <strong>Try:</strong> {item.suggestions?.join(', ')}
                  </div>
                )) : <span style={{ color: 'var(--success-text)' }}>Great use of strong action verbs!</span>}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;