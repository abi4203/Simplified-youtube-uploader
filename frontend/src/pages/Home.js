import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const HomePage = () => {
    return (
        <div className="container mt-5">
            <h2>Welcome to the Application</h2>
            <p>Please select your role:</p>
            <div className="row">
                <div className="col-md-6">
                    <Link to="/register/content-creator">
                        <button className="btn btn-primary btn-lg btn-block">Content Creator</button>
                    </Link>
                </div>
                <div className="col-md-6">
                    <Link to="/register/video-editor">
                        <button className="btn btn-secondary btn-lg btn-block">Video Editor</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
