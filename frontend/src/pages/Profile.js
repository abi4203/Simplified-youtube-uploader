        import React, { useEffect,useState} from 'react';
        import axios from 'axios';
        import { useUser } from '../components/UserContext'; 
        import { Routes, Route, Navigate, Link, Outlet,useNavigate } from 'react-router-dom'; 

        const Profile = () => {
            const { user, setUser } = useUser(); 
            const navigate = useNavigate(); 
            const [videosToModify, setVideosToModify] = useState([]);

            useEffect(() => {
                const fetchUserData = async () => {
                    try {
                        const response = await axios.get('http://localhost:5000/user', {
                            withCredentials: true,
                        });
                        setUser(response.data.user); 
                        console.log('User data:', response.data.user);
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                };

                if (!user) {
                    fetchUserData();
                }
            }, [user, setUser]); 

            const handleLogout = async () => {
                try {
                    const response = await axios.post('http://localhost:5000/logout', null, {
                        withCredentials: true,
                    });

                    if (response && response.status === 200) {
                        setUser(null); 
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

            const handleModifyVideo = (video, modificationText) => {
                // Add the video and modification text to the list of videos to modify
                setVideosToModify(prevVideos => [...prevVideos, { video, modificationText }]);
            };
            const renderProfileBasedOnType = () => {
                switch (user.type) {
                    case 'video-editor':
                        return (
                            <>
                                <h3>Video Editor Profile</h3>
                                <p><strong>Username:</strong> {user?.username}</p>
                                <Link to="/profile/upload" className="btn btn-primary mr-2">Upload edited video to creator</Link>
                                <Link to="/profile/reupload" className="btn btn-primary mr-2">Re upload video</Link>
                                                    
                            </>
                        );
                    case 'content-creator':
                        return (
                            <>
                                <h3>Content Creator Profile</h3>
                                <p><strong>Username:</strong> {user?.username}</p>
                                <Link to="/profile/confirm" className="btn btn-primary mr-2 me-3">View videos to confirm for youtube upload</Link>
                                <Link to="/profile/modify" className="btn btn-primary mr-2">Need to be modified by the video editor</Link>
                                
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
