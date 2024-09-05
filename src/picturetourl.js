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

  export default processImage