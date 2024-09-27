import { useState, useEffect } from 'react';
import ToolBar from '../ToolBar/ToolBar';
import VideosPanel from './VideosPanel/VideosPanel';
import SideMenu from './SideMenu/SideMenu';
import './HomePage.css';


function HomePage({ theme, toggleTheme, userData, setUserData}) {
  const [videos, setVideos] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    const storedUserData = localStorage.getItem('user');
    if (storedToken && storedUserData) {
      // JWT and userData exist, set userData from localStorage
      setUserData(JSON.parse(storedUserData));
      setToken(storedToken);
    } else {
      // JWT does not exist, clear userData and token
      setUserData(null);
      setToken(null)
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    }
  }, [setUserData]);

  // Fetch videos from the server when the component mounts
  useEffect(() => {
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
  
    fetchVideos();
  }, []);
  
  return (
    <div className = "home-page-con">
      <SideMenu theme={theme} toggleTheme={toggleTheme} userData={userData}/>
      <div className="HomePage">
        <ToolBar  setToken={setToken} token={token} theme={theme} toggleTheme={toggleTheme} userData={userData} setUserData={setUserData} setVideos={setVideos} />
        <div className="user-info">
          {/* Display user info as needed */}
        </div>
        <VideosPanel theme={theme} toggleTheme={toggleTheme} videos={videos} setUserData={setUserData} />
      </div>
    </div>
  );
}

export default HomePage;
