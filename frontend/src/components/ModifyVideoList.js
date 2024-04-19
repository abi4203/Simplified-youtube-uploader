import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';

const ModifyVideoList = ({ channelId }) => {

  const [videos, setVideos] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-modify-videos/${user.channelId}`);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching modify videos:', error);
      }
    };

    fetchVideos();
  }, [channelId]);

  return (
    <div>
      <h2>Modify Videos</h2>
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
}

export default ModifyVideoList;
