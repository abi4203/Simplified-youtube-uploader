import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { type } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data from backend when component mounts
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/profile');
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error.response.data.error);
                alert('An error occurred while fetching user data: ' + error.response.data.error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="container mt-5">
            <h2>{type === 'content_creator' ? 'Content Creator' : 'Video Editor'} Profile</h2>
            {userData ? (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Channel Name:</strong> {userData.channelName}</p>
                    <p><strong>Channel ID:</strong> {userData.channelId}</p>
                    <p><strong>Country:</strong> {userData.country}</p>
                    <p><strong>Language:</strong> {userData.language}</p>
                    <p><strong>Type:</strong> {type === 'content_creator' ? 'Content Creator' : 'Video Editor'}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;


