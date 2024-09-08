import React from 'react';
import './VideoItem.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';



function VideoItem({ vid, imageName, title, artist, views, date, videoList, setVideoList}) {
    const navigate = useNavigate();
    const handleViewIncrement = (id) => {
        setVideoList((prevList) =>
            prevList.map((video) =>
                video.id === id ? { ...video, views: video.views + 1 } : video
            )
        );
    };
    function onVideoClick(){
        handleViewIncrement(vid);
        navigate(`/video-watch/${vid}`);
    }
    return (
        <div className="col-lg-3 col-md-4 col-sm-6">
            <a className="card" onClick={onVideoClick}>
                {/* Assuming imageName is a prop for the image source */}
                <img src={imageName} className="card-img-top" alt="Video Thumbnail" />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{artist}</p>
                    <p className="card-text">{views} views</p>
                    <p className="card-text">{date}</p>
                </div>
            </a>
        </div>
    );
}
export default VideoItem;