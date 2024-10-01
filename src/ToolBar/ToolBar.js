import React from 'react';
import { useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom'; 
import './ToolBar.css'
import SearchBar from './SearchBar/SearchBar';
import logo from '../data/icons/faketubeLogo.png'; 
import PersonalBox from './PersonalBox/PersonalBox';
import LoginButton from './LoginButton/LoginButton'
import DarkMode from '../DarkMode/DarkMode'

function ToolBar({userData, setUserData, theme, toggleTheme, setVideos, token, setToken, fetchVideos}) {
  const navigate = useNavigate();
  const location = useLocation();
  const onFakeTubeClick = ()=>{
    if (location.pathname === '/') {
      fetchVideos();  // Call fetchVideos directly if already on the home page
  } else {
      navigate('/');  // Navigate to home page if not already there
  }
  }
  
  if (!userData) {
    return (
      <div className="ToolBar">
          <div className='WebLogo' onClick={onFakeTubeClick}>
              <img src={logo} alt='Website Logo'></img>
          </div>
          <div className='centerContainer'>
              <SearchBar token={token} setVideos={setVideos}/>
          </div>
          <LoginButton userData={userData} setUserData={setUserData}/>
          <div className="darkmode-container"> {/* Add this class */}
          <DarkMode theme={theme} toggleTheme={toggleTheme}/>  
      </div>   
      </div>
    );
  }

  else {
    return (
      <div className="ToolBar">
          <div className='WebLogo'>
              <img src={logo} alt='Website Logo' onClick={onFakeTubeClick}></img>
          </div>
          <div className='centerContainer'>
              <SearchBar token={token} setVideos={setVideos}  />
          </div>
          <PersonalBox userData={userData} setUserData={setUserData} token={token} setToken={setToken} className="personal-box" />          
          <div className="darkmode-container"> {/* Add this class */}
          <DarkMode theme={theme} toggleTheme={toggleTheme}/>  
      </div>       
      </div>
    );
  }


  
}

export default ToolBar;
