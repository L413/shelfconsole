const apiUrl = 'https://shelfconsole.glitch.me/cameras';
let cameras;

async function fetchJSON() {
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    cameras = data;
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

fetchJSON();

async function listCameraLinks(start, end) {
    if (start < 1 || end > cameras.length || Number(start) > Number(end)) {
        return;
    }

    // Get the cameras in the specified range
    const camerasInRange = cameras.slice(start - 1, end);

    // Create a new div for the flexbox container
    const flexContainer = document.createElement('div');
    flexContainer.style.display = 'flex';
    flexContainer.style.flexWrap = 'wrap';
    flexContainer.style.gap = '10px'; // Adjust the gap between images if needed

    // Array to hold promises for image loading
    const imageLoadPromises = [];

    // Add camera images to the new container
    camerasInRange.forEach(camera => {
        const cameraContainer = document.createElement('div');
        cameraContainer.style.flex = '1 1 calc(20% - 20px)'; // 3 columns with gap
        cameraContainer.style.maxWidth = 'calc(20% - 20px)';

        const cameraImg = document.createElement('img');
        cameraImg.src = camera.imageUrl;
        cameraImg.style.width = '100%';
        cameraImg.style.height = 'auto';
        cameraImg.style.objectFit = 'cover';

        // Create a promise that resolves when the image is loaded
        const imageLoadPromise = new Promise((resolve, reject) => {
            cameraImg.onload = () => resolve();
            cameraImg.onerror = () => reject(new Error('Image load error'));
        });

        // Add the promise to the array
        imageLoadPromises.push(imageLoadPromise);

        // Append the image to the container
        cameraContainer.appendChild(cameraImg);
        flexContainer.appendChild(cameraContainer);

        // Refresh the image every 2 seconds
        setInterval(() => {
            cameraImg.src = `${camera.imageUrl}?t=${new Date().getTime()}`; // Append timestamp to force refresh
        }, 1000);
    });

    // Append the flex container to the preContainer
    preContainer.appendChild(flexContainer);

    // Wait for all images to be loaded
    try {
        await Promise.all(imageLoadPromises);
        console.log('All images have been loaded.');
    } catch (error) {
        console.error('Error loading images:', error);
    }
}
