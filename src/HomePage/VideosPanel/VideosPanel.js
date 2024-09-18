import './VideosPanel.css'; // Import CSS file for styling
import VideoListResults from '../VideoListResults/VideoListResults';



function VideosPanel({videos, setUserData, deleteMode, onVideoClick}) {  

  return (   
    <VideoListResults videos={videos} setUserData={setUserData} deleteMode={deleteMode} onVideoClick={onVideoClick}/>
  );
}

export default VideosPanel;
