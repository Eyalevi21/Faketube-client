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
import Upload from './upload video page/Upload.js';
import UploadDetails from './upload video page/UploadDetails.js';

function App() {
  const [userData, setUserData] = useState(() => localStorage.getItem('user') || null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  const [videos, setVideos] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [searchResult, setSearchResult] = useState([]);
  const fetchVideos = async () => {
    try {    
      const response = await fetch('http://localhost:880/api/videos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };
  useEffect(() => {
    console.log('Fetching videos...');
    fetchVideos(); // This will fetch videos when the app first loads
  }, []);
  useEffect(() => {
    // Function to check server health, if the server is down the localStorage will be cleared
    const checkServerHealth = async () => {
        try {
            const response = await fetch('http://localhost:880/api/connection-check');
            if (!response.ok) {
                throw new Error('Server is down');
            }            
        } catch (error) {
            console.error('Server unreachable, logging out:', error);
            if (userData) {                
                alert("The server is currently down. Please try logging in again once the server is back online.");
            }
            setUserData(null);
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
        }
    };

    // Set an interval to periodically check server health
    const intervalId = setInterval(checkServerHealth, 60000); // Check every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
  // Apply the current theme to the document element
    document.documentElement.setAttribute('data-theme', theme);

  // Store the theme in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

   const toggleTheme = () => {
    // Toggle between light and dark themes
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };;

  return (
    <div className= "App">
    <BrowserRouter>
    <Routes>
    <Route path="/" element= {<HomePage userData = {userData} setUserData={setUserData} theme={theme} toggleTheme={toggleTheme} fetchVideos={fetchVideos}  videos={videos}  setVideos={setVideos} /> }/>
      <Route path="/login" element={<Login userData = {userData} setUserData={setUserData} theme={theme} toggleTheme={toggleTheme}/> } />
      <Route path="/register" element={<Reg theme={theme} toggleTheme={toggleTheme}/> } />
      <Route path="/welcome" element={<Welcome/> } />  
      <Route path="/videos/:vid" element={<VideoWatchPage setUserData={setUserData} userData={userData} setSearchResult={setSearchResult} theme={theme} toggleTheme={toggleTheme} setVideos={setVideos} fetchVideos={fetchVideos} />} />
      <Route path="/user/:username" element={<UserPage setUserData={setUserData} userData={userData} setSearchResult={setSearchResult} theme={theme} toggleTheme={toggleTheme} setVideos={setVideos}  fetchVideos={fetchVideos} />} />
      <Route path="/upload" element={<Upload  theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/upload-details" element={<UploadDetails  userData={userData}   theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/video-watch/:id" element={<VideoWatchPage setUserData={setUserData} userData={userData} theme={theme} toggleTheme={toggleTheme} setVideos={setVideos} />} />
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;
