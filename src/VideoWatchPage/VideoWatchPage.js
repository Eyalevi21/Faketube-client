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
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0); // or an empty object {}
    const [unlikes, setUnlikes] = useState(0); // or an empty object {}
    const [userReactions, setUserReactions] = useState({}); // Default as an empty object



    const { doSearch } = MyComponent();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

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

                const {token, user} = await response.json(); // Get the full user data

                // Extract the profile field from the user data
                if (user && user.profile) {
                    setArtistProfile(user.profile); // Set the profile data in your state
                } else {
                    console.error('Profile field is missing in the user data');
                }

            } catch (error) {
                console.error('Error fetching artist profile:', error);
            }
        };

        fetchArtistProfile();
    }, [artistName]);


    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/videos/${vid}/reactions`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch reactions');
                }
                const data = await response.json();
                setLikes(data.likes);
                setUnlikes(data.unlikes);
            } catch (error) {
                console.error('Error fetching reactions:', error);
            }
        };

        fetchReactions();
    }, [vid]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setComments([]);
                setNewComment('');
                const response = await fetch(`http://localhost:880/api/videos/${vid}/comments`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [vid]);

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

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:880/api/videos/${vid}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    creator: userData.username,
                    content: newComment,
                    commentVid: vid
                }),
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments((prevComments) => {
                    if (Array.isArray(prevComments)) {
                        return [...prevComments, newCommentData];
                    } else {
                        return [newCommentData];
                    }
                });

                setNewComment('');
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleReaction = async (reactionType) => {
        try {
            const currentReaction = userReactions[vid] || '';
            console.log("currrrrrent", currentReaction);
            const response = await fetch(`http://localhost:880/api/videos/${vid}/reactions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentReaction: currentReaction || null, // Current user's reaction ('like', 'unlike', or null)
                    newReaction: reactionType,               // New reaction ('like' or 'unlike')
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the likes, unlikes, and userReactions state based on server response
                setLikes(data.likes);
                setUnlikes(data.unlikes);
                setUserReactions((prevReactions) => ({
                    ...prevReactions,
                    [vid]: reactionType, // Update user reaction for the current video
                }));
            } else {
                throw new Error('Failed to update reaction');
            }
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
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
                                    alt="Artist"
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
                            <button
                                onClick={() => handleReaction('like')}
                                disabled={userReactions[vid] === 'like'}
                            >
                                Like ({likes || 0})
                            </button>
                            <button
                                onClick={() => handleReaction('unlike')}
                                disabled={userReactions[vid] === 'unlike'}
                            >
                                Unlike ({unlikes || 0})
                            </button>
                            <button>Share</button>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h2>Comments</h2>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="comment">
                                    <p><strong>{comment.creator}</strong>: {comment.content}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet. Be the first to comment!</p>
                        )}
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
