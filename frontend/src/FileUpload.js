import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [isUploading, setIsUploading] = useState(false);  // State to manage uploading status

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction('');  // Reset prediction when selecting a new file
  };

  const handleUpload = async () => {
    if (!file) {
      setPrediction('Please select a file first.');
      return;
    }

    setIsUploading(true); // Set uploading to true

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5050/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPrediction(`Predicted Character: ${response.data.predicted_class.slice(0, -4)}`);
    } catch (error) {
      console.error('Upload failed:', error);
      setPrediction('Prediction failed. Please try again.');
    } finally {
      setIsUploading(false); // Reset uploading status once the process is finished
    }
  };

  return (
    <div className='upload-container'>
      <label htmlFor="file-upload" className="custom-choose-file">
        Choose File
      </label>
      <input
        className="choose-file"
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      
      {/* Only display the selected file name after clicking Upload */}
      {file && !isUploading && !prediction && <p>Selected File: {file.name}</p>}

      <button
        className="upload-file"
        onClick={handleUpload}
        disabled={isUploading} // Disable button during upload
      >
        {isUploading ? 'Uploading...' : 'Upload & Predict'}
      </button>

      {prediction && !isUploading && (
        <div className="prediction-container">
          <p className="prediction">{prediction}</p>
          <img src={URL.createObjectURL(file)} alt="Uploaded File" className="predicted-image" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
