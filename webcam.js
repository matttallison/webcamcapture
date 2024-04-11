document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('capture');
    const cameraSelect = document.getElementById('cameraSelect');

    // Get access to the webcam and populate camera selection dropdown
    function getCameras() {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                cameraSelect.innerHTML = videoDevices.map(device => `<option value="${device.deviceId}">${device.label || 'Camera ' + (cameraSelect.length + 1)}</option>`).join('');
            });
    }

    // Switch the camera feed
    function switchCamera(deviceId) {
        const constraints = {
            video: { deviceId: deviceId ? { exact: deviceId } : undefined }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing the camera', error);
            });
    }

    // Capture the image to the canvas
    captureButton.addEventListener('click', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    // Handle camera selection change
    cameraSelect.addEventListener('change', () => {
        switchCamera(cameraSelect.value);
    });

    // Get the initial set of cameras on load
    getCameras();
});
