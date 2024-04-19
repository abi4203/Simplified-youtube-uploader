import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';

const Reupload = ({ username }) => {
  const [modifyVideos, setModifyVideos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchModifyVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-modify-videos-by-username/${user.username}`);
        setModifyVideos(response.data);
      } catch (error) {
        console.error('Error fetching modify videos:', error);
      }
    };

    fetchModifyVideos();
  }, [username]);

  const handleEdit = async () => {
    if (editMode) {
      try {
        await Promise.all(modifyVideos.map(async (video) => {
          const formData = new FormData();
          formData.append('title', video.title);
          formData.append('description', video.description);
          formData.append('tags', video.tags);
          if (selectedFile) {
            formData.append('file', selectedFile);
          }
          await axios.put(`http://localhost:5000/update-modify-video/${video._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }));
        setEditMode(false);
      } catch (error) {
        console.error('Error saving edited video details:', error);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleReupload = async () => {
    try {
      await Promise.all(modifyVideos.map(async (video) => {
        await axios.post(`http://localhost:5000/move-to-videos-collection/${video._id}`);
      }));
      setModifyVideos([]);
    } catch (error) {
      console.error('Error reuploading videos:', error);
    }
  };

  return (
    <div>
      <h2>Modify Videos for {username}</h2>
      <ul>
        {modifyVideos.map((video, index) => (
          <li key={index}>
            <strong>Title:</strong> {editMode ? <input type="text" value={video.title} onChange={(e) => setModifyVideos(modifyVideos.map((v, i) => i === index ? { ...v, title: e.target.value } : v))} /> : video.title}<br />
            <strong>Description:</strong> {editMode ? <textarea value={video.description} onChange={(e) => setModifyVideos(modifyVideos.map((v, i) => i === index ? { ...v, description: e.target.value } : v))} /> : video.description}<br />
            <strong>Tags:</strong> {editMode ? <input type="text" value={video.tags} onChange={(e) => setModifyVideos(modifyVideos.map((v, i) => i === index ? { ...v, tags: e.target.value.split(',') } : v))} /> : video.tags}<br />
            <strong>Filename:</strong> {editMode ? <input type="file" onChange={handleFileChange} /> : video.filename}<br />
          </li>
        ))}
      </ul>
      <button onClick={handleEdit}>{editMode ? 'Save' : 'Edit'}</button>
      <button onClick={handleReupload}>Reupload</button>
    </div>
  );
}

export default Reupload;
