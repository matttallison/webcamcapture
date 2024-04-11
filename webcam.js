document.addEventListener('DOMContentLoaded', async (event) => {
    const videoElement = document.getElementById('webcam');
    const cameraSelect = document.getElementById('cameraSelect');
    
    const getCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            cameraSelect.innerHTML = videoDevices
                .map(device => `<option value="${device.deviceId}">${device.label || 'Camera ' + (cameraSelect.length + 1)}</option>`)
                .join('');
        } catch (error) {
            console.error('Error listing cameras', error);
        }
    };

    const switchCamera = async (deviceId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: deviceId ? { exact: deviceId } : undefined }
            });
            videoElement.srcObject = stream;
        } catch (error) {
            console.error('Error switching camera', error);
        }
    };

    cameraSelect.addEventListener('change', () => switchCamera(cameraSelect.value));

    // Initial camera setup
    await getCameras();
    switchCamera(cameraSelect.value);
});
