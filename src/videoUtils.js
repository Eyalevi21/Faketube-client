export const MyComponent = () => {  

  const resizeImage = async (originalCanvas, targetWidth, targetHeight) => {
    const resizingCanvas = document.createElement('canvas');
    resizingCanvas.width = targetWidth;
    resizingCanvas.height = targetHeight;
    const ctx = resizingCanvas.getContext('2d');
  
    ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, 0, 0, targetWidth, targetHeight);

    return new Promise((resolve, reject) => {
      resizingCanvas.toBlob((blob) => {
        if (blob) {
          const resizedImageUrl = URL.createObjectURL(blob);
          resolve(resizedImageUrl);
        } else {
          reject('Failed to resize image');
        }
      }, 'image/jpeg');
    });
  };
  
  const generateThumbnail = async (file) => {
    const fileURL = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.src = fileURL;
  
    return new Promise((resolve, reject) => {
      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = 1.2; // Set time to capture thumbnail
      };
      videoElement.onseeked = async () => {
        const originalCanvas = document.createElement('canvas');
        originalCanvas.width = videoElement.videoWidth;
        originalCanvas.height = videoElement.videoHeight;
        const context = originalCanvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
        try {
          const resizedImageUrl = await resizeImage(originalCanvas, 320, 180); // Resize and navigate
          resolve(resizedImageUrl);
        } catch (error) {
          reject('Failed to resize thumbnail: ' + error);
        }
      };
      videoElement.onerror = () => reject('Error loading video');
    });
  };
  
  const processImage = async (file) => {
    const fileURL = URL.createObjectURL(file);
    const image = new Image();
    image.src = fileURL;
  
    return new Promise((resolve, reject) => {
      image.onload = async () => {
        const originalCanvas = document.createElement('canvas');
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        const context = originalCanvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
  
        try {
          const resizedImageUrl = await resizeImage(originalCanvas, 320, 320); // Resize and return
          resolve(resizedImageUrl);
        } catch (error) {
          reject('Failed to resize image: ' + error);
        }
      };
      image.onerror = () => reject('Error loading image');
    });
  };

  const doSearch = (query, originalList) => {
    if (!query) {
        return originalList;
    } else {
        return originalList.filter((video) => video.title.toLowerCase().includes(query.toLowerCase()));
    }
};

  return {
    resizeImage,
    generateThumbnail,
    processImage,
    doSearch,
  };
}; export default MyComponent
