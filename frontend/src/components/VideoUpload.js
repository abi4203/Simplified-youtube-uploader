import React, { useState } from 'react';

const VideoUpload = ({ onUpload }) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('file', videoFile);
    // Perform validation, then call onUpload with the form data
    onUpload(formData);
  };

  return (
    <div>
      <h2>Video Upload</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
        <label>Description:</label>
        <textarea value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} />
        <label>Upload Video:</label>
        <input type="file" onChange={(e) => setVideoFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default VideoUpload;
