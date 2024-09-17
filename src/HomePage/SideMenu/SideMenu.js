import React from 'react';
import './SideMenu.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


function SideMenu({ userData }) {
    const navigate = useNavigate();

    return (
        <div className="side-menu">
            <div className="menu-item" onClick={() => navigate('/')}>
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