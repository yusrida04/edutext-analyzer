import React, { useState } from 'react';
import InputSection from './components/InputSection';
import AnalysisResults from './components/AnalysisResults';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputInfo, setInputInfo] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleAnalyzeText = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.data);
        setInputInfo({ type: 'text', name: 'Teks yang diinputkan' });
      } else {
        setError(data.message || "Gagal menganalisis teks");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFile = async (file) => {
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/file`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.data);
        setInputInfo({ type: 'file', name: file.name });
      } else {
        setError(data.message || data.detail || "Gagal menganalisis file");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setInputInfo(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>EduText Analyzer</h1>
        <p>Analisis keterbacaan & penyederhanaan teks pendidikan berbahasa Indonesia.</p>
      </header>
      
      {error && (
        <div style={{backgroundColor: 'var(--hard-bg)', color: 'var(--hard)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center'}}>
          {error}
        </div>
      )}

      <main className={`main-content ${!results ? 'single-column' : 'two-columns'}`}>
        <InputSection 
          onAnalyzeText={handleAnalyzeText} 
          onAnalyzeFile={handleAnalyzeFile} 
          isLoading={isLoading} 
          hasResult={!!results}
          inputInfo={inputInfo}
          stats={results?.stats}
          onReset={handleReset}
        />
        
        {results && <AnalysisResults results={results} />}
      </main>
    </div>
  );
}

export default App;
