import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { BiUpload } from 'react-icons/bi';
import MyComponent from '../videoUtils';

function Upload() {
  const navigate = useNavigate();
  const { generateThumbnail } = MyComponent();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      try {    
        // Generate thumbnail locally
        const thumbnailUrl = await generateThumbnail(file);
        // Navigate to the second page with file and thumbnail in state
        navigate('/upload-details', { state: { file, thumbnailUrl } });
      } catch (error) {
        console.error(error);
        alert('Failed to process video file.');
      }
    } else {
      alert('Please select a valid video file.');
      event.target.value = ''; // Reset the input so the user can select again
    }
  };

  const handleFileUploadClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleExitClick = () => {
    navigate('/');
  };

  return (
    <div className="upload-body">
      <div className="upload-container">
        <button className="upload-exit-button" onClick={handleExitClick}>×</button>
        <div className="upload-header">Upload Videos</div>
        <div className="upload-content">
          <div className="upload-circle" onClick={handleFileUploadClick}>
            <BiUpload className="bi-upload-icon" />
          </div>
          <button className="upload-button" onClick={handleFileUploadClick}>
            Choose Files
          </button>
        </div>
        <input
          type="file"
          id="file-upload"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default Upload;
