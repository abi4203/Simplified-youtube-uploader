  import React, { useEffect, useState, useRef } from 'react';
  import './videoList.css';
  import axios from 'axios';

  const VideoList = ({ channelId, onSelectVideo, onModifyVideo }) => {
    const [videos, setVideos] = useState([]);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [modificationText, setModificationText] = useState('');
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

    const handleSelectVideo = (video) => {
      setSelectedVideoUrl(`http://localhost:5000/videos/${video.filename}`);
      setShowVideoPlayer(true);
    };

    const handleCloseVideo = () => {
      setSelectedVideoUrl(null);
      setShowVideoPlayer(false);
    };

    const handleModifyClick = () => {
      setShowModifyForm(true);
    };

    const handleModificationChange = (event) => {
      setModificationText(event.target.value);
    };

    const handleModifySubmit = async (video) => {
      try {
          // Add the modified video to the modify list
          setModifiedVideos([...modifiedVideos, { ...video, modificationText }]);
          // Hide the modify form
          setShowModifyForm(false);
      } catch (error) {
          console.error('Error adding modified video:', error);
      }
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

    return (
      <div>
        <ul>
          {videos.map((video, index) => (
            <li key={index}>
              <strong>Title:</strong> {video.title}<br />
              <strong>Description:</strong> {video.description}<br />
              <strong>Tags:</strong> {video.tags.join(', ')}<br />
              <strong>Filename:</strong> {video.filename}<br />
              <button className="btn btn-success mar" onClick={() => onSelectVideo(video)}>Select Video</button>
              <button className="btn btn-success mar" onClick={() => handleSelectVideo(video)}>Preview Video</button>
              <button className="btn btn-info mar" onClick={() => handleModifyClick(video)}>Modify</button>
              <button className="btn btn-danger mar" onClick={() => handleDeclineClick(video)}>Decline</button>
              {showModifyForm && (
                <div ref={videoOverlayRef} onClick={handleOverlayClick} className="video-overlay">
                  <p className="close-btn" onClick={handleCloseVideo}>x</p>
                  <div>
                    <textarea 
                      className="form-control video-element" 
                      style={{ width: '800px', height: '400px' }}
                      value={modificationText}
                      onChange={handleModificationChange} 
                    />
                    <button className="btn btn-primary mt-2 me-2" onClick={() => handleModifySubmit(video)}>Submit Modification</button>
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
