import React, { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext'; // Correct import path

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

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>

      {user ? (
        <div>
          <p><strong>Username:</strong> {user?.username}</p>
          {/* Display other user details here */}
        </div>
      ) : (           
        <p>Loading user data...</p>
      )}

    </div>
  );
};

export default Profile;
