// VideoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = ({ channelId }) => {
  const [videos, setVideos] = useState([]);

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

  return (
    <div>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            <strong>Title:</strong> {video.title}<br />
            <strong>Description:</strong> {video.description}<br />
            <strong>Tags:</strong> {video.tags.join(', ')}<br />
            <strong>Filename:</strong> {video.filename}<br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
