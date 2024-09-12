import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Login from './Login/Login.js';
import VideoWatchPage from './VideoWatchPage/VideoWatchPage.js'; 
import Reg from './Register/Reg.js';
import HomePage from './HomePage/HomePage.js';
import UserPage from './UserPage/UserPage.js';
import Welcome from './Welcome.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState('light');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {  
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element= {<HomePage userData = {userData} setUserData={setUserData} theme={theme} toggleTheme={toggleTheme}/> }/>
      <Route path="/login" element={<Login userData = {userData} setUserData={setUserData} theme={theme} toggleTheme={toggleTheme}/> } />
      <Route path="/register" element={<Reg theme={theme} toggleTheme={toggleTheme}/> } />
      <Route path="/welcome" element={<Welcome/> } />  
      <Route path="/videos/:id" element={<VideoWatchPage setUserData={setUserData} userData={userData} setSearchResult={setSearchResult} theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/user/:username" element={<UserPage setUserData={setUserData} userData={userData} setSearchResult={setSearchResult} theme={theme} toggleTheme={toggleTheme} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
