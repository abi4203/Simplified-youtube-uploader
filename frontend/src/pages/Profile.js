import React, { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext'; // Correct import path
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useUser(); // Get user and setUser from UserContext

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

  if (!user) {
    return <p>Loading user data...</p>;
  }

  // Render based on user type
  const renderProfileBasedOnType = () => {
    switch (user.type) {
      case 'video-editor':
        return <Navigate to="/profile/upload" />;
      case 'content-creator':
        return <Navigate to="/profile/confirm" />;
      default:
        return <p>Invalid user type.</p>;
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>

      <p><strong>Username:</strong> {user?.username}</p>

      {renderProfileBasedOnType()}
      
      <Outlet />
    </div>
  );
};

export default Profile;
