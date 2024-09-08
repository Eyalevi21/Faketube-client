import React from 'react';
import './UploadButton.css'
import { useLocation, useNavigate } from 'react-router-dom';



function UploadButton({ videoList, userData }) {
    const navigate = useNavigate();
    const handleUploadClick = () => {
        navigate('/Upload' ,{ state: { userData, videoList }}); 
    };
    return (
        <div className="UploadButton">
            <i className="icon-upload" onClick={handleUploadClick}></i>
            <span>Upload Video</span>
        </div>
    );
}
export default UploadButton;
