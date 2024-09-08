 import VideoItem from '../videoItem/VideoItem'
 function VideoListResults({ videos, setUserData, videoList, setVideoList}) {

  const newVideoList = videos && videos.length > 0 ? (
    videos.map((video) => (
      <VideoItem
        key={video.id}  // Add a unique key for each item
        vid={video.id} 
        imageName={video.imageName} // Adjust this according to your data structure
        title={video.title}
        artist={video.artist}
        views={video.views}
        date={video.date}
        description={video.description}
        setUserData={setUserData}
        videoList={videoList}
        setVideoList={setVideoList}
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