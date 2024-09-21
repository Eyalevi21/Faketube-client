import './VideosPanel.css'; // Import CSS file for styling
import VideoListResults from '../VideoListResults/VideoListResults';

function VideosPanel({ videos, setUserData, deleteMode, onVideoClick }) {
  // Conditionally set the class based on whether videos are available
  const panelClass = videos.length > 0 ? 'VideosPanel has-videos' : 'VideosPanel no-videos';

  return (
    <div className={panelClass}>
      <VideoListResults videos={videos} setUserData={setUserData} deleteMode={deleteMode} onVideoClick={onVideoClick}/>
    </div>
  );
}

export default VideosPanel;
