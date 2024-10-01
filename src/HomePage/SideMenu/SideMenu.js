import React from 'react';
import './SideMenu.css'; // Import CSS file for styling
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


function SideMenu({ userData, fetchVideos}) {
    const navigate = useNavigate();    
    const location = useLocation();
    const handleHomeClick = () => {
        if (location.pathname === '/') {
            fetchVideos();  // Call fetchVideos directly if already on the home page
        } else {
            navigate('/');  // Navigate to home page if not already there
        }
    };
    return (
        <div className="side-menu">
            <div className="menu-item" onClick={handleHomeClick}>
                <i className="icon-home"></i>
                <span>Home</span>
            </div>
            <div className="menu-item" onClick={() => navigate(`/user/${userData.username}`)}>
                <i className="icon-you"></i>
                <span>You</span>
            </div>
        </div>
    );
}
export default SideMenu;