import React, { useEffect, useState, useRef } from 'react';
import './videoList.css';
import axios from 'axios';

const VideoList = ({ channelId, onSelectVideo }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textEditorValue, setTextEditorValue] = useState('');
  const videoOverlayRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/videos-by-channel/${channelId}`);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [channelId]);

  const handleModifyClick = async (video) => {
    try {
      const modifiedVideo = { ...video, changes: textEditorValue }; // Update the description with the text editor value
      const response = await axios.put(`http://localhost:5000/move-to-modify-list/${video._id}`, modifiedVideo);
      console.log(response.data.message);
      // Optionally, you can remove the video from the state to reflect the change in UI
      setVideos(videos.filter(v => v._id !== video._id));
    } catch (error) {
      console.error('Error moving video to modify list:', error);
    }
  };
  

  const handleSelectVideo = (video) => {
    setSelectedVideoUrl(`http://localhost:5000/videos/${video.filename}`);
    setShowVideoPlayer(true);
  };

  const handleCloseVideo = () => {
    setSelectedVideoUrl(null);
    setShowVideoPlayer(false);
  };

  const handleDeclineClick = async (video) => {
    try {
      await axios.delete(`http://localhost:5000/decline-video/${video._id}`);
      setVideos(videos.filter(v => v._id !== video._id));
    } catch (error) {
      console.error('Error declining video:', error);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === videoOverlayRef.current) {
      handleCloseVideo();
    }
  };

  const handleSendModification = (video) => {
    setShowTextEditor(!showTextEditor); // Toggle the visibility of the overlay
    setTextEditorValue(video.description); // Set initial value of text editor to video description
  };

  const handleSaveText = () => {
    // Handle saving the text editor value
    setShowTextEditor(false);
  };

  return (
    <div className="container">
      <ul className="list-group">
        {videos.map((video, index) => (
          <li key={index} className="list-group-item">
            <strong>Title:</strong> {video.title}<br />
            <strong>Description:</strong> {video.description}<br />
            <strong>Tags:</strong> {video.tags}<br />
            <strong>Filename:</strong> {video.filename}<br />
            <button className="btn btn-success mar" onClick={() => onSelectVideo(video)}>Select Video</button>
            <button className="btn btn-success mar" onClick={() => handleSelectVideo(video)}>Preview Video</button>
            <button className="btn btn-primary mar" onClick={() => handleSendModification(video)}>Send modification</button>
            <button className="btn btn-danger mar" onClick={() => handleDeclineClick(video)}>Decline</button>
            {showTextEditor && (
              <div ref={videoOverlayRef} className="video-overlay">
                <p className="close-btn" onClick={handleCloseVideo}>x</p>
                <div className="text-editor">
                  <textarea className="form-control" style={{width:'700px',height:'400px'}}value={textEditorValue} onChange={(e) => setTextEditorValue(e.target.value)} />
                  <button className="btn btn-info mr-2 mar" onClick={() => handleModifyClick(video)}>Modify</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {showVideoPlayer && (
        <div ref={videoOverlayRef} className="video-overlay" onClick={handleOverlayClick}>
          <p className="close-btn" onClick={handleCloseVideo}>x</p>
          <video controls autoPlay className="video-element">
            <source src={selectedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

    </div>
  );
}

export default VideoList;
