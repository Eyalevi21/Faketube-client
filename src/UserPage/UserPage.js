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
    const [token, setToken] = useState(localStorage.getItem('jwt'));
    const [tokenValid, setTokenValid] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNickname, seteditedNickname] = useState('');
    const [editedProfile, setEditedProfile] = useState('');

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
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
                const { token, user } = await response.json();
                setUserDetails(user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
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

    const verifyToken = async () => {
        if (!token) {
            console.log('No token to verify');
            return;
        }

        try {
            const response = await fetch('http://localhost:880/api/tokens/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();
            if (data.valid) {
                setTokenValid(true);
            } else {
                setTokenValid(false);
                console.error('Token is invalid or expired:', data.message);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

    const handleEdit = async () => {
        if (tokenValid && (userDetails.username)) {
            setIsEditing(true);
            seteditedNickname(userDetails.nickname);
        }
    };


    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:880/api/users/${userData.username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nickname: editedNickname,
                    profile: editedProfile,   
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log('User updated successfully:', result);
                userDetails.nickname = editedNickname;
                setIsEditing(false);
                setUserData(userDetails);
            } else {
                console.error('Failed to update user:', result.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };


    useEffect(() => {
        verifyToken();
    }, [token]);

    const isConnected = !!userData;
    return (
        <div className="home-page-con">
            <SideMenu userData={userData}/>
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
                                <p className="nickname">{isEditing ? (
                                    <input
                                        type="text"
                                        value={editedNickname}
                                        onChange={(e) => seteditedNickname(e.target.value)}
                                    />
                                ) : (
                                    userDetails.nickname
                                )}{isConnected && !isEditing && (userData.username === userDetails.username) && (
                                    <i className="icon-edit" onClick={handleEdit} />
                                )}
                                    {isEditing && (
                                        <i className="icon-save" onClick={handleSave} />
                                    )}
                                </p>
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
