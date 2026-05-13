import React, { useState } from 'react';
import axios from 'axios';
import DrawCanvas from './DrawCanvas';
import FileUpload from './FileUpload';
import './App.css';

const SUPPORTED_CHARS = [
  '墨','竟','章','隐','隔','隘','隙','障','隧','隶','难','雀','雁','雄','雅','集','雇','雌',
  '雍','雏','雕','雨','雪','零','雷','雹','雾','需','霄','震','霉','霍','霓','霖','霜','霞',
  '露','霸','霹','青','靖','静','靛','非','靠','靡','面','革','靳','靴','靶','鞋','鞍','鞘',
  '鞠','鞭','韦','韧','韩','韭','音','韵','韶','页','顶','顷','项','顺','须','顽','顾','顿',
  '颁','颂','预','颅','领','颇','颈','颊','颐','频','颓','颖','颗','题','颜','额','颠','颤',
  '颧','风','飘','飞','食','餐','饥','饭','饮','饯','饰','饱','饲','饵','饶','饺','饼','饿',
  '馁','馅','馆','馈','馋','馏','馒','首','香','马','驭','驮','驯','驰','驱','驳','驴','驶',
  '驹','驻','驼','驾','骂','骄','骆','骇','骋','验','骏','骑','骗','骚','骡','骤','骨','骸',
  '髓','高','鬃','鬼','魁','魂','魄','魏','魔','鱼','鲁','鲍','鲜','鲤','鲸','鳃','鳖','鳞',
  '鸟','鸡','鸣','鸥','鸦','鸭','鸯','鸳','鸵','鸽','鸿','鹃','鹅','鹊','鹏','鹤','鹰','鹿',
  '麓','麦','麻','黄','黍','黎','黑','黔','默','鼎','鼓','鼠','鼻','齐','齿','龄','龋','龙',
  '龚','龟',
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const CharacterList = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="char-list-section">
      <button className="char-list-toggle" onClick={() => setOpen(o => !o)}>
        Supported characters ({SUPPORTED_CHARS.length}) {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="char-grid">
          {SUPPORTED_CHARS.map(c => <span key={c} className="char-cell">{c}</span>)}
        </div>
      )}
    </div>
  );
};

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
    } catch (err) {
      if (err.response?.status === 503) {
        setError('Service is warming up — the model is still loading. Wait ~1 minute and try again.');
      } else {
        setError('Prediction failed. Make sure the backend server is running.');
      }
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

        <CharacterList />

        <footer className="app-footer">
          DenseNet121 · 200 characters · HCCR dataset
        </footer>
      </div>
    </div>
  );
};

export default App;
