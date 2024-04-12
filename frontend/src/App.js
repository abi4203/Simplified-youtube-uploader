import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserRegistration from './components/Registration';
import VideoUpload from './components/VideoUpload';
import RegistrationForm from './components/Registration';

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleAddVideo = async () => {
    try {
      const newVideo = {
        video_id: videos.length + 1,
        title: 'New Video',
        description: 'Description of the new video',
        tags: ['tag1', 'tag2']
      };
      await axios.post('http://localhost:5000/videos', newVideo);
      fetchVideos();
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

 
    const handleRegister = (formData) => {
      // Implement registration logic here
      console.log('Registering user:', formData);
    };
    const handleUpload = (formData) => {
      // Implement video upload logic here
      console.log('Uploading video:', formData);
    };
  

  return (
    // <div className="container mt-5">
    //   <h1 className="mb-4">YouTube Video Upload Automation</h1>
    //   <button className="btn btn-primary mb-3" onClick={handleAddVideo}>Add Video</button>
    //   <div className="row">
    //     {videos.map(video => (
    //       <div key={video.video_id} className="col-md-4 mb-4">
    //         <div className="card">
    //           <div className="card-body">
    //             <h5 className="card-title">{video.title}</h5>
    //             <p className="card-text">{video.description}</p>
    //             <ul className="list-unstyled">
    //               {video.tags.map(tag => (
    //                 <li key={tag}>{tag}</li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    // <>
    //   <UserRegistration onRegister={handleRegister} />
    //   <VideoUpload onUpload={handleUpload} />
      <RegistrationForm />
    // </>
  );
}

export default App;
