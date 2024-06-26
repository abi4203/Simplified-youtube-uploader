import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoUploadForm = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        video: null,
        channelId: ''
    });
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user', {
                    withCredentials: true,
                });
                setUsername(response.data.user.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, video: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const videoData = new FormData();
        videoData.append('title', formData.title);
        videoData.append('description', formData.description);
        videoData.append('tags', formData.tags);
        videoData.append('file', formData.video);
        videoData.append('channelId', formData.channelId);
        videoData.append('username', username); 

        try {
            await axios.post('http://localhost:5000/upload-video', videoData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Video uploaded successfully!');
            
            navigate('/profile');
        } catch (error) {
            console.error('Error uploading video:', error.response.data.error);
            alert('An error occurred while uploading video: ' + error.response.data.error);
        }
    };

    return (
        <div className="container ">
            <h2>Video Upload Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" className="form-control" onChange={handleChange} required />
                </div>
                <br/>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" className="form-control" onChange={handleChange} required />
                </div>
                <br/>
                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" name="tags" className="form-control" onChange={handleChange} />
                </div>
                <br/>
                <div className="form-group">
                    <label>Channel ID</label>
                    <input type="text" name="channelId" className="form-control" onChange={handleChange} required />
                </div>
                <br/>
                <div className="form-group">
                    <label>Video File:</label>
                    <input  type="file" name="video" className="form-control-file " onChange={handleFileChange} required />
                </div><br/>
                <button type="submit" className="btn btn-primary br-2">Upload Video</button>
            </form>
        </div>
    );
};

export default VideoUploadForm;
