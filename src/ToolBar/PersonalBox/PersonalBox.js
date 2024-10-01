import React, { useState, useEffect } from 'react';
import './PersonalBox.css';
import { useNavigate } from 'react-router-dom';

const PersonalBox = ({ userData, setUserData, token, setToken }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwt'); // Assuming token is stored under 'jwt'
    if (storedUserData && storedToken) {
      const userData = JSON.parse(storedUserData);
      setUserData(userData);
      setToken(storedToken);
      setUsername(userData.username);
      fetchUserDetails(userData); // Pass userData directly to avoid race condition
    } else {
      setUserData(null);
      setToken(null);
      setUsername(null);
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    }
  }, [setUserData, setToken]); // Correct dependency

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:880/api/users/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json' // This is optional, but good to include
        }
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
  useEffect(() => {
    if (username && token) {
        fetchUserDetails();
    }
}, [username, token]);


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
    { setUserData(null)}
    {setToken(null)}
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  return (
    <div className="PersonalBox">
      <div className="GreetingText">Hello, {nickname}!</div>
      <div className="UserProfile" >
        <img src={`http://localhost:880/profileImages/${profile}`} alt={nickname} onClick={handleProfileClick} className="UserImage" />
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
