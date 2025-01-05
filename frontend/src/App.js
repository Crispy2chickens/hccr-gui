import React from 'react';
import FileUpload from './FileUpload'; 
import './App.css'; 

const App = () => {
  return (
    <div className="main-container">
      <h1>Chinese Character Classification App</h1>
      <FileUpload />
    </div>
  );
};

export default App;
