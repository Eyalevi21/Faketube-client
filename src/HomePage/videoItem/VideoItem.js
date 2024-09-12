import React from 'react';
import './VideoItem.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';




function VideoItem({ vid, imageName, title, artist, views, date }) {
    //imageName is what the path of the photo in mongoDB
    const navigate = useNavigate();
    function onVideoClick() {
        navigate(`/videos/${vid}`);
    }
    return (
        <div className="col-lg-3 col-md-4 col-sm-6">
            <a className="card" onClick={onVideoClick}>
                {/* Assuming imageName is a prop for the image source */}
                <img src={`http://localhost:880/videoThumbnails/${imageName}`} className="card-img-top" alt="Video Thumbnail" />
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