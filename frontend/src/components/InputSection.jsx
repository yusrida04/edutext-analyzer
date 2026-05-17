import React, { useState, useRef } from 'react';
import { UploadCloud, Send, CheckCircle, RefreshCw } from 'lucide-react';

const InputSection = ({ onAnalyzeText, onAnalyzeFile, isLoading, hasResult, inputInfo, stats, onReset }) => {
  const [activeTab, setActiveTab] = useState('paste');
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  const handleTextSubmit = () => {
    if (text.trim()) {
      onAnalyzeText(text);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAnalyzeFile(file);
    }
  };

  const triggerFileInput = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  if (hasResult) {
    return (
      <div className="card compact-preview-card" style={{justifyContent: 'flex-start'}}>
        <h2 style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
          INPUT DOKUMEN
        </h2>
        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)'}}>
          <CheckCircle size={56} color="var(--easy)" style={{marginBottom: '1.25rem'}} />
          <h3 style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', wordBreak: 'break-word'}}>
            {inputInfo?.name || 'Teks diproses'}
          </h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem'}}>
            {stats?.num_words} kata
          </p>
          
          <button onClick={onReset} className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s ease'}}>
            <RefreshCw size={18} /> Ganti {inputInfo?.type === 'file' ? 'File' : 'Teks'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'paste' ? 'active' : ''}`}
          onClick={() => setActiveTab('paste')}
          disabled={isLoading}
        >
          Paste Teks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
          disabled={isLoading}
        >
          Upload Dokumen / Gambar
        </button>
      </div>

      {activeTab === 'paste' ? (
        <div className="textarea-container">
          <textarea 
            placeholder="Tempel teks pendidikan atau artikel di sini untuk dianalisis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          ></textarea>
          <button 
            className="btn-primary" 
            onClick={handleTextSubmit}
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? <div className="spinner"></div> : <><Send size={20} /> Analisis Sekarang</>}
          </button>
        </div>
      ) : (
        <div className="file-upload-container" onClick={triggerFileInput}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{display: 'none'}}
            accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
            disabled={isLoading}
          />
          <UploadCloud className="upload-icon" />
          <div style={{textAlign: 'center'}}>
            <h3 style={{marginBottom: '0.5rem', fontWeight: 600}}>Drag & Drop File di sini</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Mendukung: PDF, DOCX, TXT, JPG, PNG</p>
          </div>
          {isLoading ? (
            <div className="spinner" style={{borderColor: 'rgba(79, 70, 229, 0.3)', borderTopColor: 'var(--primary)', marginTop: '1rem'}}></div>
          ) : (
             <button className="btn-primary" style={{marginTop: '1rem', width: 'auto'}} onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>Pilih File</button>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSection;
