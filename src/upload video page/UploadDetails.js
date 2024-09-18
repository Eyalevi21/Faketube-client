import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UploadDetails.css';

function UploadDetails({ userData, thumbnailUrl,file }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [videoName, setVideoName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send the file and metadata together
    const formData = new FormData();
    formData.append('file', file);
    formData.append('videoName', videoName);
    formData.append('description', description);
    formData.append('thumbnailUrl', thumbnailUrl);
    formData.append('artist', userData.username);
    formData.append('date', new Date().toISOString().slice(0, 10));

    try {
      // Send the form data to the server
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit video details');
      }

      alert('Video uploaded and details submitted successfully!');
      navigate('/'); // Navigate back to home after submission
    } catch (error) {
      console.error(error);
      alert('Failed to submit video details.');
    }
  };

  const handleExitClick = () => {
    navigate('/upload'); // Navigate back to the upload page
  };

  if (!file) {
    return <div>No video file selected. Please go back and select a file.</div>;
  }

  return (
    <div className="upload-details-body">
      <div className="upload-details-container">
        <h1 id="header">Enter Video Details</h1>
        <button className="upload-exit-button" onClick={handleExitClick}>×</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="videoName">Video Name:</label>
            <input
              type="text"
              id="videoName"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UploadDetails;
