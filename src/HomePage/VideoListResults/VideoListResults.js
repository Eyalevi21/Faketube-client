 import VideoItem from '../videoItem/VideoItem'
 function VideoListResults({ videos, setUserData, deleteMode, onVideoClick}) {

  const newVideoList = videos && videos.length > 0 ? (
    videos.map((video) => (
      <VideoItem
        vid={video.vid} 
        imageName={video.imageName} // Adjust this according to your data structure
        title={video.title}
        artist={video.artist}
        views={video.views}
        date={video.date}
        description={video.description}
        setUserData={setUserData}
        deleteMode={deleteMode}
        onVideoClick={onVideoClick}
      />
    ))
  ) : null;  // Returns null if there are no videos
  
  
    return (
    <div className="VideosPanel">
      {newVideoList} 
    </div>
    );
     
 }

 export default VideoListResults;