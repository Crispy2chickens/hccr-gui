import React, { useState } from 'react';
import axios from 'axios';
import DrawCanvas from './DrawCanvas';
import FileUpload from './FileUpload';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const App = () => {
  const [mode, setMode] = useState('draw');
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const predict = async (blob, url) => {
    setIsLoading(true);
    setError('');
    setPredictions(null);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append('file', blob, 'image.png');

    try {
      const res = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPredictions(res.data.predictions);
    } catch {
      setError('Prediction failed. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPredictions(null);
    setPreviewUrl(null);
    setError('');
  };

  const switchMode = (next) => {
    setMode(next);
    reset();
  };

  return (
    <div className="app">
      <div className="card">
        <header className="app-header">
          <h1 className="app-title">Chinese Character Recognition</h1>
          <p className="app-subtitle">Draw or upload a handwritten character to classify it</p>
        </header>

        <div className="tab-bar">
          <button className={`tab ${mode === 'draw' ? 'active' : ''}`} onClick={() => switchMode('draw')}>
            Draw
          </button>
          <button className={`tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => switchMode('upload')}>
            Upload
          </button>
        </div>

        <div className="input-area">
          {mode === 'draw'
            ? <DrawCanvas onPredict={predict} isLoading={isLoading} onReset={reset} />
            : <FileUpload onPredict={predict} isLoading={isLoading} onReset={reset} />
          }
        </div>

        {error && <p className="error-msg">{error}</p>}

        {(isLoading || predictions) && (
          <div className="results">
            {isLoading ? (
              <div className="loading">
                <div className="spinner" />
                <p>Analyzing character...</p>
              </div>
            ) : (
              <div className="predictions">
                <div className="top-prediction">
                  {previewUrl && <img src={previewUrl} alt="Input" className="preview-img" />}
                  <div className="top-info">
                    <span className="top-char">{predictions[0].character}</span>
                    <span className="top-label">Top prediction</span>
                    <span className="top-confidence">{(predictions[0].confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="confidence-bars">
                  {predictions.map((p) => (
                    <div key={p.character} className="bar-row">
                      <span className="bar-char">{p.character}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(p.confidence * 100).toFixed(1)}%` }} />
                      </div>
                      <span className="bar-pct">{(p.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="app-footer">
          DenseNet121 · 200 characters · HCCR dataset
        </footer>
      </div>
    </div>
  );
};

export default App;
