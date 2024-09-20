import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UploadDetails.css';

function UploadDetails({ userData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, thumbnailUrl } = location.state || {}; // Get file and thumbnail from location state
  const [videoName, setVideoName] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('jwt'));
  useEffect(() => {
    console.log("file: ", file);
    console.log("thumb: ", thumbnailUrl)
    const storedToken = sessionStorage.getItem('jwt');
    const storedUserData = sessionStorage.getItem('user');
    if (storedToken && storedUserData) {
      // JWT and userData exist, set userData from localStorage      
      setToken(storedToken);
    } else {
      // JWT does not exist, clear userData
      setToken(null)
      sessionStorage.clear();
    }
  }, navigate);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare form data to send the file and metadata together
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', videoName);
    formData.append('description', description);  
    formData.append('artist', userData.username);
    formData.append('views', 0)
    formData.append('date', new Date().toISOString().slice(0, 10));
    const thumbnaiData = new FormData();
    thumbnaiData.append('file', thumbnailUrl)
    try {
      // Send the form data to the server
      const responseThumbnail = await fetch(`http://localhost:880/api/users/${userData.username}/videos/thumbnail`, {
        method: 'POST',
        headers: {         
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
      },
        body: thumbnaiData,
      });
      if (!responseThumbnail.ok) {
        throw new Error('Failed to submit video details');
      }
      else{
        const resJson = await responseThumbnail.json();
        console.log("afterJson: ", resJson.imageName)
        formData.append('imageName', resJson.imageName);
        try{
          const response = await fetch(`http://localhost:880/api/users/${userData.username}/videos`, {
            method: 'POST',
            headers: {         
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
          },
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Failed to submit video details');
          }
        }    
        catch(error){
          console.error(error);
          alert('Failed to submit video details.');
        }         
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
