import React from 'react';
import { useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom'; 
import './ToolBar.css'
import SearchBar from './SearchBar/SearchBar';
import logo from '../data/icons/faketubeLogo.png'; 
import PersonalBox from './PersonalBox/PersonalBox';
import LoginButton from './LoginButton/LoginButton'
import DarkMode from '../DarkMode/DarkMode'

function ToolBar({doSearch, userData, setUserData, theme, toggleTheme, setSearchResult}) {
  const navigate = useNavigate();
  const onFakeTubeClick = ()=>{
    navigate('/');
  }
  
  if (!userData) {
    return (
      <div className="ToolBar">
          <div className='WebLogo' onClick={onFakeTubeClick}>
              <img src={logo} alt='Website Logo'></img>
          </div>
          <div className='centerContainer'>
              <SearchBar doSearch={doSearch} setSearchResult={setSearchResult} />
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
              <SearchBar doSearch={doSearch} setSearchResult={setSearchResult} />
          </div>
          <PersonalBox userData={userData} setUserData={setUserData} className="personal-box" />          
          <div className="darkmode-container"> {/* Add this class */}
          <DarkMode theme={theme} toggleTheme={toggleTheme}/>  
      </div>       
      </div>
    );
  }


  
}

export default ToolBar;
