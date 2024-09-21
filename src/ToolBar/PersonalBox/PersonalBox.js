import React, { useState, useEffect } from 'react';
import './PersonalBox.css';
import { useNavigate } from 'react-router-dom';

const PersonalBox = ({ userData, setUserData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      setUserData(null);
    }
  }, [setUserData]);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:880/api/users/${userData.username}`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const { secondToken, user } = await response.json();
        setNickname(user.nickname);
        setProfile(user.profile);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [userData]);

  const handleUploadClick = () => {
    navigate('/Upload');
  };
  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleProfileClick = () => {
    setShowButtons(!showButtons);
  };
  const handleSignOutClick = () => {
    { setUserData(null) }
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
  };

  return (
    <div className="PersonalBox">
      <div className="GreetingText">Hello, {nickname}!</div>
      <div className="UserProfile" >
        <img src={`http://localhost:880/uploads/${profile}`} alt={nickname} onClick={handleProfileClick} className="UserImage" />
        <div className={`ButtonContainer ${showButtons ? 'show' : ''}`}>
          <button className="Button" onClick={handleSignOutClick} disabled={!showButtons}>
            Sign Out
          </button>
          <button className="Button" onClick={handleUploadClick} disabled={!showButtons}>
            Upload
          </button>
        </div>
      </div>


    </div>
  );
};

export default PersonalBox;
