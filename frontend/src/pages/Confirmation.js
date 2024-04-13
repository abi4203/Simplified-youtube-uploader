import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext';
import VideoList from '../components/VideoList';

const ConfirmationPage = () => {
    const { user } = useUser();
    const [videoDetails, setVideoDetails] = useState(null);

    // Function to handle video selection
    const handleSelectVideo = (selectedVideo) => {
        console.log('Selected Video:', selectedVideo); // Log selected video
        setVideoDetails(selectedVideo);
    };

    const handleConfirmUpload = async () => {
        // Ensure videoDetails is not null before proceeding
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
            // You can redirect the user to another page or perform other actions
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
                    <VideoList channelId={user.channelId} onSelectVideo={handleSelectVideo} />
                    <button className="btn btn-primary mt-3" onClick={handleConfirmUpload}>Confirm Upload to YouTube</button>
                </div>
            )}
        </div>
    );
};

export default ConfirmationPage;
