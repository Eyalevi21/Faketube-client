import MyComponent from '../videoUtils';
import React, { useState, useEffect, useRef } from 'react';
import './VideoWatchPage.css'; // Import the CSS file
import ToolBar from '../ToolBar/ToolBar';
import MiniVideoItem from './miniVideoItem/MiniVideoItem';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function VideoWatchPage({ userData, setUserData, theme, toggleTheme, setSearchResult }) {
    const navigate = useNavigate();
    const { vid } = useParams();
    const videoRef = useRef(null);
    const [artistName, setArtistName] = useState(null);
    const [artistProfile, setArtistProfile] = useState(null);
    const [videoList, setVideoList] = useState(null);
    const [videoData, setVideoData] = useState(null);



    const { doSearch } = MyComponent();
    const [likes, setLikes] = useState({});
    const [dislikes, setDislikes] = useState({});
    const [newComment, setNewComment] = useState('');
    const [userReactions, setUserReactions] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [comments, setComments] = useState({});



    const isConnected = !!userData;
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:880/api/videos', {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    setVideoList(data);
                } else {
                    throw new Error('Failed to fetch videos');
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
            }
        };

        fetchVideos();
    }, []);


    useEffect(() => {
        if (videoList && vid) {
            const matchingVideo = videoList.find(video => video.vid === vid);
            if (matchingVideo) {
                setArtistName(matchingVideo.artist);
            }
        }
    }, [videoList, vid]);


    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${artistName}/videos/${vid}`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
                const data = await response.json();
                setVideoData(data);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };

        fetchVideoData();
    }, [vid]);

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

    //important for rendering video when refresh
    useEffect(() => {
        if (videoRef.current && videoData) {
            videoRef.current.load();
        }
    }, [videoData]);

    

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

    //works without it (to check)
    //const videoSrc = videoFile && videoFile.startsWith('blob:') ? videoFile : `/videofiles/${videoFile}`;


    if (!videoData) {
        return <div>Loading...</div>;
    }
    const { title, artist, date, views, imageName, videoFile, description } = videoData;
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
                        <video ref={videoRef} width="250" controls>
                            <source src={`http://localhost:880/videofiles/${videoFile}`} type="video/mp4" />
                        </video>

                        <div className="artist-container">
                            <div className="artist-info">
                                <img
                                    src={`data:image/png;base64,${artistProfile}`}
                                    alt="Artist Profile"
                                    className="artist-image"
                                    onClick={() => {
                                        navigate(`/user/${artist}`);
                                    }
                                    }
                                />
                                <h1 className="h1-font">
                                    {artist} - {isEditing ? (
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
                                </h1>
                            </div>

                            <div className="artist-details">
                                <p className="views-font">{views} views on {date}</p>
                                <h2 className="description-font">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                        />
                                    ) : (
                                        description
                                    )}
                                </h2>
                            </div>
                        </div>

                        <div className="video-actions">
                            <button onClick={handleLike} disabled={userReactions[vid] === 'like'}>
                                Like ({likes[vid] || 0})
                            </button>
                            <button onClick={handleDislike} disabled={userReactions[vid] === 'dislike'}>
                                Dislike ({dislikes[vid] || 0})
                            </button>
                            <button>Share</button>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h2>Comments</h2>
                        {comments[vid] && comments[vid].map((comment, index) => (
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

                <div className="related-videos">
                    {videoList.map((video) => {
                        return (
                            <MiniVideoItem
                                vid={video.vid}
                                imageName={video.imageName}
                                title={video.title}
                                artist={video.artist}
                                views={video.views}
                                date={video.date}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default VideoWatchPage;
