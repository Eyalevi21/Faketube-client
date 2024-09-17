import { useState, useEffect } from 'react';
import ToolBar from '../ToolBar/ToolBar';
import VideosPanel from './VideosPanel/VideosPanel';
import SideMenu from './SideMenu/SideMenu';
import './HomePage.css';


function HomePage({ theme, toggleTheme, userData, setUserData}) {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const storedUserData = localStorage.getItem('user');
    if (token && storedUserData) {
      // JWT and userData exist, set userData from localStorage
      setUserData(JSON.parse(storedUserData));
    } else {
      // JWT does not exist, clear userData
      setUserData(null);
    }
  }, [setUserData]);

  // Fetch videos from the server when the component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:880/api/videos', {
          method: 'GET'
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
      <SideMenu userData={userData}/>
      <div className="HomePage">
        <ToolBar theme={theme} toggleTheme={toggleTheme} userData={userData} setUserData={setUserData} />
        <div className="user-info">
          {/* Display user info as needed */}
        </div>
        <VideosPanel videos={videos} setUserData={setUserData} />
      </div>
    </div>
  );
}

export default HomePage;
