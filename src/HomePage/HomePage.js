import { useState, useEffect } from 'react';
import ToolBar from '../ToolBar/ToolBar';
import VideosPanel from './VideosPanel/VideosPanel';
import SideMenu from './SideMenu/SideMenu';
import './HomePage.css';


function HomePage({ theme, toggleTheme, userData, setUserData, videos, setVideos, fetchVideos}) {  
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


 
  
  return (
    <div className = "home-page-con">
      <SideMenu theme={theme} toggleTheme={toggleTheme} userData={userData} setVideos={setVideos} fetchVideos={fetchVideos}/>
      <div className="HomePage">
        <ToolBar  setToken={setToken} token={token} theme={theme} toggleTheme={toggleTheme} userData={userData} setUserData={setUserData} setVideos={setVideos} fetchVideos={fetchVideos} />
        <div className="user-info">
          {/* Display user info as needed */}
        </div>
        <VideosPanel theme={theme} toggleTheme={toggleTheme} videos={videos} setUserData={setUserData} />
      </div>
    </div>
  );
}

export default HomePage;
