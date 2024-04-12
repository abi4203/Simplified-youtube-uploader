import React, { useState } from 'react';
import axios from 'axios';

const VideoUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        video: null
    });

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

        try {
            await axios.post('http://localhost:5000/upload-video', videoData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Video uploaded successfully!');
            // You can redirect the user to another page here if needed
        } catch (error) {
            console.error('Error uploading video:', error.response.data.error);
            alert('An error occurred while uploading video: ' + error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Video Upload Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" name="tags" className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Video File</label>
                    <input type="file" name="video" className="form-control-file" onChange={handleFileChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Upload Video</button>
            </form>
        </div>
    );
};

export default VideoUploadForm;
