import React, { useRef, useState } from 'react';

const Camera = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    // Camera eka on karana function eka
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Could not access the camera. Please check your permissions.");
            console.error(err);
        }
    };

    // Photo ekak ganna function eka
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            // Canvas eken image data URL ekak ganna
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            setPhoto(imageDataUrl);

            // Parent component ekata photo data eka yawanna
            onCapture(imageDataUrl);
        }
    };

    return (
        <div className="camera-component">
            <h3>Verify Your Identity</h3>
            {error && <p className="error-message">{error}</p>}
            
            <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px' }}></video>
            
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={capturePhoto}>Take Photo</button>

            {/* Photo eka display karanna */}
            {photo && (
                <div>
                    <h4>Captured Photo:</h4>
                    <img src={photo} alt="User" style={{ width: '100%', maxWidth: '400px' }} />
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default Camera;