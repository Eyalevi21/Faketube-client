import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ToolBar.css'
import SearchBar from './SearchBar/SearchBar';
import logo from '../data/icons/faketubeLogo.png';
import PersonalBox from './PersonalBox/PersonalBox';
import LoginButton from './LoginButton/LoginButton'
import DarkMode from '../DarkMode/DarkMode'

function ToolBar({ doSearch, videoList, userData, setUserData, setVideoList, theme, toggleTheme, setSearchResult }) {
  const navigate = useNavigate();
  const onFakeTubeClick = () => {
    navigate('/');
  }
  console.log("toolbar: ", userData)
  if (!userData) {
    return (
      <div className="ToolBar">
        <div className='WebLogo' onClick={onFakeTubeClick}>
          <img src={logo} alt='Website Logo'></img>
        </div>
        <div className='centerContainer'>
          <SearchBar />
        </div>
        <div>
        <LoginButton  userData={userData} setUserData={setUserData} />
        </div>        
        <div className="darkModeContainer">
          <DarkMode  />
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
          <SearchBar doSearch={doSearch} setSearchResult={setSearchResult} videoList={videoList} />
        </div>
        <div >
        <PersonalBox videoList={videoList} userData={userData} setUserData={setUserData} />
        </div>    
        <div className="darkModeContainer">
          <DarkMode theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    );
  }



}

export default ToolBar;
