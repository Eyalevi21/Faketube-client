import MyComponent from '../videoUtils';
import React, { useState, useEffect } from 'react';
import './VideoWatchPage.css'; // Import the CSS file
import ToolBar from '../ToolBar/ToolBar';
import MiniVideoItem from './miniVideoItem/MiniVideoItem';
import { useParams } from 'react-router-dom';

function VideoWatchPage({ userData, setUserData, theme, toggleTheme, setSearchResult }) {
    const { doSearch } = MyComponent();
    const [artistProfile, setArtistProfile] = useState(null);
    const [artistName, setArtistName] = useState(null);
    const { id } = useParams();
    const [likes, setLikes] = useState({});
    const [dislikes, setDislikes] = useState({});
    const [newComment, setNewComment] = useState('');
    const [userReactions, setUserReactions] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [comments, setComments] = useState({});

    const [videoData, setVideoData] = useState(null); // State to hold video data
    const isConnected = !!userData;
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/videos/${id}`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
                const data = await response.json();
                setVideoData(data);
                setArtistName(data.artist); // Update artistName state
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
    
        fetchVideoData();
    }, [id]);
    
    useEffect(() => {
        if (!artistName) return;
    
        const fetchArtistProfile = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${artistName}`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch artist profile');
                }
    
                const userData = await response.json(); // Get the full user data
                
                // Extract the profile field from the user data
                if (userData && userData.profile) {
                    setArtistProfile(userData.profile); // Set the profile data in your state
                } else {
                    console.error('Profile field is missing in the user data');
                }
    
            } catch (error) {
                console.error('Error fetching artist profile:', error);
            }
        };
    
        fetchArtistProfile();
    }, [artistName]);

    if (!videoData) {
        return <div>Loading...</div>;
    }

    
    const handleEdit = () => {
       
    };

    const handleSave = () => {
        
    };

    const handleCommentSubmit = () => {
        
    };

    const handleLike = () => {
        
    };

    const handleDislike = () => {
       
    };

    
    const { title, artist, date, views, imageName, videoFile, description } = videoData;

    const videoSrc = videoFile && videoFile.startsWith('blob:')
      ? videoFile
      : `/videofiles/${videoFile}`;

    return (
        <div>
            <ToolBar
                theme={theme}
                toggleTheme={toggleTheme}
                doSearch={doSearch}
                userData={userData}
                setUserData={setUserData}
                setSearchResult={setSearchResult}
            />
            <div className="main-content">
                <div className="video-watch-page">
                    <div className="video-container">
                        <video key={id} width="250" controls>
                            <source src={`http://localhost:880/videofiles/${videoFile}`} type="video/mp4" />
                        </video>
                        <img src={`data:image/png;base64,${artistProfile}`} alt="Artist Profile" />
                        <h1 className="h1-font">{artist} - {isEditing ? (
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        ) : (
                            title
                        )}
                        {isConnected && !isEditing && (
                            <i className="icon-edit" onClick={handleEdit} />
                        )}
                        {isEditing && (
                            <i className="icon-save" onClick={handleSave} />
                        )}
                        <p className="views-font">{views} views on {date}</p>
                        
                        <h2 className="description-font">{isEditing ? (
                            <input
                                type="text"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                            />
                        ) : (
                            description
                        )}
                        </h2>
                        </h1>

                        <div className="video-actions">
                            <button onClick={handleLike} disabled={userReactions[id] === 'like'}>
                                Like ({likes[id] || 0})
                            </button>
                            <button onClick={handleDislike} disabled={userReactions[id] === 'dislike'}>
                                Dislike ({dislikes[id] || 0})
                            </button>
                            <button>Share</button>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h2>Comments</h2>
                        {comments[id] && comments[id].map((comment, index) => (
                            <div key={index} className="comment">
                                <strong>{comment.username}</strong>: {comment.comment}
                            </div>
                        ))}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button onClick={handleCommentSubmit}>Submit</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default VideoWatchPage;
