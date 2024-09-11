import React from 'react';
import './UploadButton.css'
import { useNavigate } from 'react-router-dom';



function UploadButton({ userData }) {
    const navigate = useNavigate();
    const handleUploadClick = () => {
        navigate('/Upload' ,{ state: { userData }}); 
    };
    return (
        <div className="UploadButton">
            <i className="icon-upload" onClick={handleUploadClick}></i>
            <span>Upload Video</span>
        </div>
    );
}
export default UploadButton;
