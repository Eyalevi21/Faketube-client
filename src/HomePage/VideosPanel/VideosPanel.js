import VideoItem from '../videoItem/VideoItem';
import React, { useState } from 'react';
import './VideosPanel.css'; // Import CSS file for styling
import VideoListResults from '../VideoListResults/VideoListResults';



function VideosPanel({videos, setUserData, videoList, setVideoList}) {  

  return (   
    <VideoListResults videos={videos} setUserData={setUserData} videoList={videoList} setVideoList={setVideoList}/>
  );
}

export default VideosPanel;
