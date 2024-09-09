import './VideosPanel.css'; // Import CSS file for styling
import VideoListResults from '../VideoListResults/VideoListResults';



function VideosPanel({videos, setUserData}) {  

  return (   
    <VideoListResults videos={videos} setUserData={setUserData}/>
  );
}

export default VideosPanel;
