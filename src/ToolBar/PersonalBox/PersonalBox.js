import React, { useState, useEffect } from 'react';
import './PersonalBox.css';
import { useNavigate } from 'react-router-dom';

const PersonalBox = ({ userData, setUserData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
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
        const { token, user } = await response.json();
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
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  return (
    <div className="PersonalBox">
      <div className="GreetingText">Hello, {nickname}!</div>
      <div className="UserProfile" onClick={handleProfileClick}>
        <img src={`data:image/png;base64,${profile}`} alt={nickname} className="UserImage" />
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
