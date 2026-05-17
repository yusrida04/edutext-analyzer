import React, { useState } from 'react';
import { Award, BarChart2, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSentence = ({ original, simplified }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="sentence-item" style={{
      cursor: 'pointer', 
      padding: '1.25rem', 
      background: 'var(--surface-alt)', 
      borderRadius: 'var(--radius-md)', 
      border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border)',
      transition: 'all 0.2s ease',
      boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
    }} onClick={() => setIsOpen(!isOpen)}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div className="sentence-original" style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600}}>
            📝 KALIMAT AKADEMIK
          </div>
          <span style={{color: 'var(--text-main)', fontWeight: isOpen ? 500 : 400, lineHeight: 1.6, fontSize: '0.95rem'}}>{original}</span>
        </div>
        <div style={{color: 'var(--text-muted)', marginLeft: '0.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: isOpen ? 'var(--bg-color)' : 'transparent'}}>
          {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
      </div>
      
      {isOpen && (
        <div className="sentence-simplified" style={{
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px dashed var(--border)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600}}>
            ✨ VERSI DISEDERHANAKAN
          </div>
          <div style={{
            background: 'var(--bg-color)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid var(--primary)',
            color: 'var(--text-main)', 
            fontWeight: 500, 
            lineHeight: 1.6,
            fontSize: '0.95rem'
          }}>
            {simplified}
          </div>
        </div>
      )}
    </div>
  );
};

const getLevelMetadata = (level) => {
  const normalized = level?.toLowerCase() || '';
  if (normalized.includes('mudah')) {
    return {
      emoji: '🟢',
      color: 'var(--easy)',
      text: 'Teks sangat mudah dipahami. Kalimat-kalimatnya lugas dan tidak menggunakan banyak istilah teknis.',
    };
  }
  if (normalized.includes('sulit')) {
    return {
      emoji: '🔴',
      color: 'var(--hard)',
      text: 'Teks cukup sulit dipahami. Membutuhkan konsentrasi lebih karena terdapat banyak istilah akademik dan struktur kalimat yang kompleks.',
    };
  }
  return {
    emoji: '🟡',
    color: 'var(--medium)',
    text: 'Teks cukup mudah dipahami, tetapi masih memiliki beberapa istilah akademik dan kalimat kompleks.',
  };
};

const AnalysisResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!results) return null;

  const { readability_score, complex_words, difficulty_level, reader_recommendation, simplified_sentences, stats } = results;
  const levelMeta = getLevelMetadata(difficulty_level);

  return (
    <div className="card">
      <div className="results-tabs">
        <button 
          className={`result-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Ringkasan
        </button>
        <button 
          className={`result-tab-btn ${activeTab === 'complex' ? 'active' : ''}`}
          onClick={() => setActiveTab('complex')}
        >
          Kata Kompleks {complex_words?.length > 0 && `(${complex_words.length})`}
        </button>
        <button 
          className={`result-tab-btn ${activeTab === 'sentences' ? 'active' : ''}`}
          onClick={() => setActiveTab('sentences')}
        >
          Penyederhanaan {simplified_sentences?.length > 0 && `(${simplified_sentences.length})`}
        </button>
      </div>

      <div className="card-content-scrollable">
        {activeTab === 'summary' && (
          <div className="results-grid">
            <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 Tingkat Keterbacaan
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{levelMeta.emoji}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: levelMeta.color }}>
                    {difficulty_level}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
                  {levelMeta.text}
                </p>
                
                <div style={{ width: '100%', marginTop: '0.5rem' }}>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(100, Math.max(0, readability_score))}%`, 
                      height: '100%', 
                      background: levelMeta.color, 
                      borderRadius: '4px',
                      transition: 'width 1s ease-in-out'
                    }} />
                  </div>
                </div>
                
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Skor analisis: {readability_score}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Jumlah Kata</h3>
              <div className="stat-value">{stats?.num_words || 0}</div>
            </div>

            <div className="stat-card">
              <h3>Kata Kompleks</h3>
              <div className="stat-value">{complex_words?.length || 0}</div>
            </div>
          </div>
        )}

        {activeTab === 'complex' && (
          <div className="complex-words-container" style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            {complex_words && complex_words.length > 0 ? (
              <div className="list-container">
                {complex_words.map((cw, idx) => (
                  <div key={idx} className="word-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem'}}>
                    <div className="word-term" style={{fontSize: '1.15rem', color: 'var(--primary)'}}>{cw.word}</div>
                    
                    <div style={{background: 'var(--bg-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', width: '100%'}}>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600}}>Makna Formal (KBBI)</div>
                      <div style={{color: 'var(--text-main)', fontSize: '0.95rem'}}>{cw.formal_explanation}</div>
                    </div>
                    
                    <div style={{width: '100%', padding: '0 0.25rem'}}>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600}}>Penjelasan Sederhana</div>
                      <div style={{color: 'var(--easy)', fontWeight: 500}}>{cw.simple_explanation}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{minHeight: '200px'}}>
                <CheckCircle size={48} color="var(--easy)" style={{marginBottom: '1rem'}}/>
                <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem'}}>Teks Anda sangat baik!</h3>
                <p>Tidak ditemukan kata kompleks yang membingungkan.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sentences' && (
          <div className="sentences-container" style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            {simplified_sentences && simplified_sentences.length > 0 ? (
              <div className="list-container">
                {simplified_sentences.map((ss, idx) => (
                  <CollapsibleSentence key={idx} original={ss.original} simplified={ss.simplified} />
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{minHeight: '200px'}}>
                <CheckCircle size={48} color="var(--easy)" style={{marginBottom: '1rem'}}/>
                <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem'}}>Kalimat sudah sederhana!</h3>
                <p>Tidak ada saran penyederhanaan kalimat yang diperlukan untuk teks ini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
