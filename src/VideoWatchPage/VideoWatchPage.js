import MyComponent from '../videoUtils';
import React, { useState, useEffect, useRef } from 'react';
import './VideoWatchPage.css'; // Import the CSS file
import ToolBar from '../ToolBar/ToolBar';
import MiniVideoItem from './miniVideoItem/MiniVideoItem';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function VideoWatchPage({ userData, setUserData, theme, toggleTheme, setVideos, fetchVideos }) {
    const [loading, setLoading] = useState(true); // Add loading state
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
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const { doSearch } = MyComponent();
    const [token, setToken] = useState(localStorage.getItem('jwt'));
    const [tokenValid, setTokenValid] = useState(false);


    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        const storedUserData = localStorage.getItem('user');
        if (storedToken && storedUserData) {
          // JWT and userData exist, set userData from localStorage
          setUserData(JSON.parse(storedUserData));
          setToken(storedToken);
        } else {
          // JWT does not exist, clear userData and token
          setUserData(null);
          setToken(null)
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
        }
      }, [navigate]);

    const isConnected = !!userData;
    const fetchVideoData = async () => {
        try {
            const response = await fetch(`http://localhost:880/api/users/${artistName}/videos/${vid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                }
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
    useEffect(() => {
        if (vid) {
            // Every time the vid parameter changes, do something with it (like fetching video data)
            console.log("Vid updated:", vid);
            fetchVideoData(); // Example function to fetch video based on vid
        }
    }, [vid]);
    useEffect(() => {
        // Wait until videoData is available before setting artist name
        if (videoData) {
            console.log("Setting artist name from videoData:", videoData.artist);
            setArtistName(videoData.artist);
        }
    }, [videoData]);

    const fetchSideVideos = async (vid) => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`http://localhost:880/api/videos/${vid}/sideVideos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                }
            });
            if (response.ok) {
                const data = await response.json();
                setVideoList(data);
            } else {
                throw new Error('Failed to fetch videos');
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setLoading(false); // End loading
        }
    };
    useEffect(() => {       
        if (vid) { // Ensure vid is available before fetching
            fetchSideVideos(vid);
        }        
    }, [vid]);


    useEffect(() => {
        if (videoList && vid) {      
            console.log("videoData: ", videoData)                
                console.log("Setting artist name:", videoData.artist); // Add debug logs
                setArtistName(videoData.artist);
            }
        
    }, [videoData]);


    useEffect(() => {
        if (!artistName) {
            console.log("Artist name is not yet available", artistName); // Debug log to see the state
            return; // Early return if artistName is not set yet
        }
    
        console.log("Fetching artist profile for:", artistName); // Add debug log to track
    
        const fetchArtistProfile = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/users/${artistName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch artist profile');
                }
    
                const { user } = await response.json();
                if (user && user.profile) {
                    console.log("Setting artist profile:", user.profile); // Add debug log to confirm profile setting
                    setArtistProfile(user.profile);
                } else {
                    console.error('Profile field is missing in the user data');
                }
            } catch (error) {
                console.error('Error fetching artist profile:', error);
            }
        };
    
        fetchArtistProfile();
    }, [artistName, token]); // Ensure this runs after artistName and token are available
    


    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const response = await fetch(`http://localhost:880/api/videos/${vid}/reactions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                    }
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
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                    }
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



    const handleEdit = async () => {
        if (tokenValid && (artistName === userData.username)) {
            setIsEditing(true);
            setEditedTitle(videoData.title);
            setEditedDescription(videoData.description);
        }

    };


    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:880/api/users/${artistName}/videos/${vid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                },
                body: JSON.stringify({
                    title: editedTitle,
                    description: editedDescription,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Video updated successfully:', result);
                videoData.title = editedTitle;
                videoData.description = editedDescription;
                setIsEditing(false);
            } else {
                console.error('Failed to update video:', result.message);
            }
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };


    const verifyToken = async () => {
        if (!token) {
            console.log('No token to verify');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:880/api/tokens/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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

    useEffect(() => {
        verifyToken(); // Automatically verify token on component mount
    }, [token]);




    const handleCommentSubmit = async () => {
        if (!tokenValid) {
            const confirmSignIn = window.confirm('In order to comment, you have to sign in. Do you want to sign in now?');
            if (confirmSignIn) {
                navigate('/login'); // Redirect to login page if user agrees
                return
            } else {
                return; // Do nothing if user declines
            }
        }
        try {
            const response = await fetch(`http://localhost:880/api/videos/${vid}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
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

    const handleReaction = async (reactionType, usernameReacted) => {
        try {
            const response = await fetch(`http://localhost:880/api/videos/${vid}/reactions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
                },
                body: JSON.stringify({
                    username: usernameReacted,
                    newReaction: reactionType,
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setLikes(data.likes);
                setUnlikes(data.unlikes);
            } else {
                console.error('Failed to update reaction:', data.message);
            }
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };



    //works without it (to check)
    //const videoSrc = videoFile && videoFile.startsWith('blob:') ? videoFile : `/videofiles/${videoFile}`;


    if (!videoData) {
        return <div>Video not found</div>;
    }
    const { title, artist, date, views, imageName, videoFile, description } = videoData;
    return (
        <div>
            <ToolBar
                token={token}
                setToken={setToken}
                theme={theme}
                toggleTheme={toggleTheme}
                doSearch={doSearch}
                userData={userData}
                setUserData={setUserData}
                setVideos={setVideos}
                fetchVideos={fetchVideos}               
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
                                    src={`http://localhost:880/profileImages/${artistProfile}`}      
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
                                    {isConnected && !isEditing && (userData.username === artistName) && (
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
                                onClick={() => handleReaction('like', userData.username)}
                            >
                                Like ({likes || 0})
                            </button>
                            <button
                                onClick={() => handleReaction('unlike', userData.username)}
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
                                    <p>
                                        <span className="comment-dot">•</span> {/* Big dot */}
                                        <strong>{comment.creator}</strong>: {comment.content}
                                    </p>
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
  {loading ? (
    <p>Loading videos...</p>  // Display a loading message or spinner while fetching
  ) : videoList && videoList.length > 0 ? (
    videoList.map((video) => (
      <MiniVideoItem
        key={video.vid} // Always include a unique key when mapping components
        vid={video.vid}
        imageName={video.imageName}
        title={video.title}
        artist={video.artist}
        views={video.views}
        date={video.date}
      />
    ))
  ) : (
    <p>No related videos found</p> // Display a fallback if no videos are found
  )}
</div>

            </div>
        </div>
    );
}

export default VideoWatchPage;
