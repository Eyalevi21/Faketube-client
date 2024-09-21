import React from 'react';
import MyComponent from '../videoUtils';
import { useParams } from 'react-router-dom';
import ToolBar from '../ToolBar/ToolBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../HomePage/SideMenu/SideMenu';
import VideosPanel from '../HomePage/VideosPanel/VideosPanel';
import './UserPage.css'
import '../HomePage/HomePage.css'


function UserPage({ userData, setUserData, theme, toggleTheme, setSearchResult }) {
    const { username } = useParams();
    const { doSearch } = MyComponent();
    const [videoData, setVideoData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('jwt'));
    const [tokenValid, setTokenValid] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNickname, seteditedNickname] = useState('');
    const [editedProfile, setEditedProfile] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [deleteUserMode, setDeleteUserMode] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const storedToken = sessionStorage.getItem('jwt');
        const storedUserData = sessionStorage.getItem('user');
        if (storedToken && storedUserData) {
            // JWT and userData exist, set userData from localStorage
            setUserData(JSON.parse(storedUserData));
            setToken(storedToken);
        } else {
            // JWT does not exist, clear userData
            setUserData(null);
            setToken(null)
            sessionStorage.clear();
        }
    }, [setUserData]);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const { secondToken, user } = await response.json();
                setUserDetails(user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [username, setUserData, userData]);


    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${username}/videos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                    }
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

    const handleEditNickname = async () => {
        if (tokenValid && (userDetails.username)) {
            setIsEditing(true);
            seteditedNickname(userDetails.nickname);
        }
    };

    const handleEditProfile = () => {
        if (tokenValid && (userDetails.username === userData.username)) {
            document.getElementById('profileInput').click();
        }
    };

    const helpFunction = (e) => {
        if (tokenValid && (userDetails.username === userData.username)) {
            const file = e.target.files[0];
            setSelectedFile(file);
            handleFileChange(file);
        }
    }
    
    
    
    const handleFileChange = async (file) => {
        console.log("changed")
        if (tokenValid && (userDetails.username === userData.username)) {
            if (file) {
                console.log("the selected file is:", file)
                const formData = new FormData();
                formData.append('profileImage', file);
                formData.append('id', userDetails.username);

                try {
                    const profileRes = await fetch(`http://localhost:880/api/users/${userDetails.username}/upload-profile`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!profileRes.ok) {
                        throw new Error('Error uploading profile image');
                    }

                    const result = await profileRes.json();
                    console.log('Profile updated successfully:', result);

                    // Update the profile image in the state
                    setUserData(result);
                    setSelectedFile(null); // Clear selected file after upload
                } catch (error) {
                    console.error('Error updating profile image:', error);
                }

            }
        }
    };





    const handleSaveNickname = async () => {
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

    const handleDeleteInitiate = () => {
        setDeleteMode(true);
    };

    const handleDeleteUserInitiate = () => {
        setDeleteUserMode(true);
    };


    const handleDeleteCancel = () => {
        setDeleteMode(false);
        setVideoToDelete(null);
    };
    const handleDeleteUserCancel = () => {
        setDeleteUserMode(false);
    };

    const handleDeleteVideo = async (vid) => {
        if (!vid) {
            console.error('No video selected for deletion');
            return;
        }

        try {
            const response = await fetch(`http://localhost:880/api/users/${username}/videos/${vid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Video deleted successfully');
                // Refresh video data or navigate to a different page
                setVideoData(videoData.filter(video => video.vid !== vid));
                setDeleteMode(false);
                setVideoToDelete(null);
            } else {
                const result = await response.json();
                console.error('Failed to delete video:', result.message);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:880/api/users/${userDetails.username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('User deleted successfully');
                setUserData(null);
                setToken(null)
                sessionStorage.clear();
                navigate('/login');
            } else {
                const result = await response.json();
                console.error('Failed to delete user:', result.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        verifyToken();
    }, [token]);

    const isConnected = !!userData;
    return (
        <div className="home-page-con">
            <SideMenu userData={userData} />
            <div className="HomePage">
                <ToolBar theme={theme} toggleTheme={toggleTheme} userData={userData} setUserData={setUserData} />
                <div className="user-details-container">
                    {tokenValid && userDetails && (
                        <div className="user-details">
                            <img
                                src={`http://localhost:880/uploads/${userDetails.profile}`}
                                alt="User Profile"
                                className="profile-image"
                                onClick={handleEditProfile}
                            />
                            <input
                                type="file"
                                id="profileInput"
                                style={{ display: 'none' }} // Hidden file input
                                onChange={helpFunction}
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
                                )}{tokenValid && isConnected && !isEditing && (userData.username === userDetails.username) && (
                                    <i className="icon-edit" onClick={handleEditNickname} />
                                )}
                                    {isEditing && (
                                        <i className="icon-save" onClick={handleSaveNickname} />
                                    )}
                                </p>
                            </div>
                            {(userDetails?.username === userData?.username) && tokenValid && (
                                <div className="delete-user-zone">
                                    {deleteUserMode ? (
                                        <div>
                                            <button className="delete-button" onClick={handleDeleteUser}>
                                                Confirm Delete User
                                            </button>
                                            <button className="cancel-button" onClick={handleDeleteUserCancel}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="delete-button" onClick={handleDeleteUserInitiate}>
                                            Delete User
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <VideosPanel
                    videos={videoData}
                    setUserData={setUserData}
                    deleteMode={deleteMode}
                    onVideoClick={handleDeleteVideo}
                />
                {(userDetails?.username === userData?.username) && tokenValid && Array.isArray(videoData) && videoData.length > 0 && (
                    <div className="danger-zone">
                        <button onClick={handleDeleteInitiate}>
                            {deleteMode ? 'Click on video to delete' : 'Delete Video'}
                        </button>
                        {deleteMode && (
                            <button className="cancel-button" onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;
