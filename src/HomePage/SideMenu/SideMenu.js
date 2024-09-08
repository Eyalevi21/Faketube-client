import React from 'react';
import './SideMenu.css'; // Import CSS file for styling


function SideMenu() {
    return (
        <div className="side-menu">
            <div className="menu-item">
                <i className="icon-home"></i>
                <span>Home</span>
            </div>
            <div className="menu-item">
                <i className="icon-you"></i>
                <span>You</span>
            </div>
        </div>
    );
}
export default SideMenu;