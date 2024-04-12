import React from 'react';
import axios from 'axios';

const ConfirmationPage = ({ videoDetails }) => {
    const handleConfirmUpload = async () => {
        try {
            await axios.post('http://localhost:5000/upload-to-youtube', videoDetails);
            alert('Video uploaded to YouTube successfully!');
            // You can redirect the user to another page or perform other actions
        } catch (error) {
            console.error('Error uploading to YouTube:', error.response.data.error);
            alert('An error occurred while uploading to YouTube: ' + error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Confirmation Page</h2>
            <div>
                <strong>Title:</strong> {videoDetails.title}<br />
                <strong>Description:</strong> {videoDetails.description}<br />
                <strong>Tags:</strong> {videoDetails.tags}<br />
                <strong>Video File:</strong> {videoDetails.video.name}<br />
            </div>
            <button className="btn btn-primary mt-3" onClick={handleConfirmUpload}>Confirm Upload to YouTube</button>
        </div>
    );
};

export default ConfirmationPage;
