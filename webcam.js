document.addEventListener('DOMContentLoaded', async (event) => {
    const videoElement = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('capture');
    const cameraSelect = document.getElementById('cameraSelect');
    const gallery = document.getElementById('gallery');

    captureButton.addEventListener('click', function() {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        const imgDataUrl = canvas.toDataURL('image/png');
        const imgElement = document.createElement('img');
        imgElement.src = imgDataUrl;
        gallery.appendChild(imgElement); // Adds the image to the gallery.
    });

    const getCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            cameraSelect.innerHTML = videoDevices
                .map(device => `<option value="${device.deviceId}">${device.label || 'Camera ' + (cameraSelect.length + 1)}</option>`)
                .join('');

            // If there are any cameras, set the stream to the first one
            if (videoDevices.length > 0) {
                await switchCamera(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error('Error getting devices', error);
        }
    };

    const switchCamera = async (deviceId) => {
        const constraints = {
            video: { deviceId: deviceId ? { exact: deviceId } : undefined }
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = stream;
        } catch (error) {
            console.error('Error switching cameras', error);
        }
    };

    cameraSelect.addEventListener('change', async () => {
        await switchCamera(cameraSelect.value);
    });

    await getCameras(); // Get the list of cameras on load.
});
