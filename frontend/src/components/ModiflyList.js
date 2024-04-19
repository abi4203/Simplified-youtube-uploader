import React, { useEffect, useState, useRef } from 'react';
import './videoList.css';
import axios from 'axios';

const ModifyList = () => {
    const [modifiedVideos, setModifiedVideos] = useState([]);

    useEffect(() => {
        const fetchModifiedVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-modified-videos');
                setModifiedVideos(response.data.modified_videos);
            } catch (error) {
                console.error('Error fetching modified videos:', error);
            }
        };

        fetchModifiedVideos();
    }, []);

    return (
        <div>
            <h3>Modified Videos</h3>
            <ul>
                {modifiedVideos.map((video, index) => (
                    <li key={index}>
                        <strong>Title:</strong> {video.title}<br />
                        <strong>Description:</strong> {video.description}<br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModifyList;
