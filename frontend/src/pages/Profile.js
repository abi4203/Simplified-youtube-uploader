import React, { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext'; // Correct import path
import { Routes, Route, Navigate, Link, Outlet,useNavigate } from 'react-router-dom'; // Import Link for routing

const Profile = () => {
    const { user, setUser } = useUser(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user', {
                    withCredentials: true,
                });
                setUser(response.data.user); // Update user in context
                console.log('User data:', response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch user data only if user is not already in context
        if (!user) {
            fetchUserData();
        }
    }, [user, setUser]); // Re-run effect when user or setUser changes

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/logout', null, {
                withCredentials: true,
            });

            if (response && response.status === 200) {
                setUser(null); // Clear user from context
                console.log('Logged out successfully');
                navigate('/');
            } else {
                console.error('Error logging out:', response);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!user) {
        return <p>Loading user data...</p>;
    }

    // Render based on user type
    const renderProfileBasedOnType = () => {
        switch (user.type) {
            case 'video-editor':
                return (
                    <>
                        <h3>Video Editor Profile</h3>
                        <p><strong>Username:</strong> {user?.username}</p>
                        <Link to="/profile/upload" className="btn btn-primary mr-2">Upload edited video to creator</Link>
                    </>
                );
            case 'content-creator':
                return (
                    <>
                        <h3>Content Creator Profile</h3>
                        <p><strong>Username:</strong> {user?.username}</p>
                        <Link to="/profile/confirm" className="btn btn-primary mr-2">View videos to confirm for youtube upload</Link>
                    </>
                );
            default:
                return <p>Invalid user type.</p>;
        }
    };

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            {renderProfileBasedOnType()}
            <Outlet />
        </div>
    );
};

export default Profile;
