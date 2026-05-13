import React, { useState, useRef } from 'react';

const FileUpload = ({ onPredict, isLoading, onReset }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(url);
    onReset();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    onReset();
  };

  const handlePredict = () => {
    if (!file || !previewUrl) return;
    onPredict(file, previewUrl);
  };

  return (
    <div className="upload-area">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onClick={() => !file && fileInput.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="file-preview">
            <img src={previewUrl} alt="Preview" className="drop-preview-img" />
            <p className="file-name">{file.name}</p>
            <button
              className="change-file-btn"
              onClick={(e) => { e.stopPropagation(); fileInput.current.click(); }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="drop-hint">
            <span className="drop-icon">+</span>
            <p>Drop an image here or click to browse</p>
            <p className="drop-sub">PNG, JPG, GIF supported</p>
          </div>
        )}
      </div>
      <div className="controls">
        {file && <button className="btn-secondary" onClick={clear} disabled={isLoading}>Clear</button>}
        <button
          className="btn-primary"
          onClick={handlePredict}
          disabled={!file || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Recognize'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
