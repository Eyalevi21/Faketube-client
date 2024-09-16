import React from 'react';
import MyComponent from '../videoUtils';
import { useParams } from 'react-router-dom';
import ToolBar from '../ToolBar/ToolBar';
import { useState, useEffect } from 'react';
import SideMenu from '../HomePage/SideMenu/SideMenu';
import VideosPanel from '../HomePage/VideosPanel/VideosPanel';
import './UserPage.css'
import '../HomePage/HomePage.css'


function UserPage({ userData, setUserData, theme, toggleTheme, setSearchResult }) {
    const { username } = useParams();
    const { doSearch } = MyComponent();
    const [videoData, setVideoData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserData = localStorage.getItem('user');
        console.log("data: ", storedUserData)
        console.log("token: ", token)
        if (token && storedUserData) {
          // JWT and userData exist, set userData from localStorage
          setUserData(JSON.parse(storedUserData));
        } else {
          // JWT does not exist, clear userData
          setUserData(null);
        }
      }, [setUserData]);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${username}`, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const {token, user} = await response.json();
                setUserDetails(user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
        console.log("artist:",userDetails);
    }, [username]);
    

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${username}/videos`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch videos');
                }
                const data = await response.json();
                setVideoData(data);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
        fetchUserVideos();
    }, [username]);

    return (
        <div className="home-page-con">
            <SideMenu />
            <div className="HomePage">
                <ToolBar theme={theme} toggleTheme={toggleTheme} userData={userData} setUserData={setUserData} />
                <div className="user-details-container">
                    {userDetails && (
                        <div className="user-details">
                            <img
                                src={`data:image/png;base64,${userDetails.profile}`}
                                alt="User Profile"
                                className="profile-image"
                            />
                            <div className="user-info">
                                <h1 className="username">{userDetails.username}</h1>
                                <p className="nickname">{userDetails.nickname}</p>
                            </div>
                        </div>
                    )}
                </div>
                <VideosPanel videos={videoData} setUserData={setUserData} />
            </div>
        </div>
    );
};

export default UserPage;
