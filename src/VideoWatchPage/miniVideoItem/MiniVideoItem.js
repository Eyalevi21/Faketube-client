import React from 'react';
import './MiniVideoItem.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';



function MiniVideoItem({ vid, imageName, title, artist, views }) {
    const navigate = useNavigate();
    function handleVidClick(){
        navigate(`/videos/${vid}`);
    }
    return (
        <div className="card mb-3" onClick={handleVidClick}>
            <div className="row g-0 video-row">
                <div className="col-md-4">
                    <img src={`http://localhost:880/videoThumbnails/${imageName}`} className="card-img-top-mini" alt="Video Thumbnail" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <p className="text-author">{artist}- {title}</p>
                        <p className="card-text">{views} views</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniVideoItem;


