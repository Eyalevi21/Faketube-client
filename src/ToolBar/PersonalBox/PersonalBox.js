import React, { useState } from 'react';
import './PersonalBox.css';
import { useNavigate } from 'react-router-dom';

const PersonalBox = ({ userData, setUserData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  const handleUploadClick = () => {
      navigate('/Upload' ); 
  };
  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleProfileClick = () => {
    setShowButtons(!showButtons);
  };
  const handleSignOutClick = () => {
    {setUserData(null)}
    sessionStorage.clear();
  };

  return (
    <div className="PersonalBox">
        <div className="GreetingText">Hello, {userData.nickname}!</div>
      <div className="UserProfile" onClick={handleProfileClick}>
        <img src={`data:image/png;base64,${userData.profile}`} alt={userData.nickname} className="UserImage" />
            <div className={`ButtonContainer ${showButtons ? 'show' : ''}`}>
        <button className="Button" onClick={handleSignOutClick}>
          Sign Out
        </button>
        <button className="Button" onClick={handleUploadClick}>
          Upload
        </button>
      </div>
      </div>
      
  
    </div>
  );
};

export default PersonalBox;
