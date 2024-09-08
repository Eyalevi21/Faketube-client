import React, { useState, useEffect } from 'react';
import ToolBar from '../ToolBar/ToolBar';
import VideosPanel from './VideosPanel/VideosPanel';
import SideMenu from './SideMenu/SideMenu';
import './HomePage.css';


function HomePage({ userData, setUserData}) {
  console.log("theuserdata: ",userData)
  return (
    <div className = "home-page-con">
      <SideMenu />
      <div className="HomePage">
        <ToolBar userData={userData} setUserData={setUserData} />
        <div className="user-info">
          {/* Display user info as needed */}
        </div>
        <VideosPanel  setUserData={setUserData}/>
      </div>
    </div>
  );
}

export default HomePage;
