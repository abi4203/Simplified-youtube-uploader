import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import VideoList from './VideoList';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [videoDetails, setVideoDetails] = useState(null);

    const handleSelectVideo = (selectedVideo) => {
        console.log('Selected Video:', selectedVideo);
        setVideoDetails(selectedVideo);
    };

    const handleConfirmUpload = async () => {
        if (!videoDetails) {
            alert('No video details to upload.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/upload-to-youtube', videoDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Video uploaded to YouTube successfully!');
            navigate('/profile');

        } catch (error) {
            console.error('Error uploading to YouTube:', error.response.data.error);
            alert('An error occurred while uploading to YouTube: ' + error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            {user && user.type === 'content-creator' && (
                <div>
                    <h3>Your Videos</h3>
                    <VideoList channelId={user.channelId} onSelectVideo={handleSelectVideo}  />
                    <button className="btn btn-primary m-3" onClick={handleConfirmUpload}>Confirm selected video upload to YouTube</button>
                </div>
            )}
        </div>
    );
};

export default ConfirmationPage;
