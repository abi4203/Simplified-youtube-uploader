import React from 'react';
import { Link } from 'react-router-dom'; 

const HomePage = () => {
    return (
        <div className="container mt-5">
            <h2>Welcome to Simplified Youtube Uploader</h2>
            <h4 className='mt-4 mb-3'>Sign up:</h4>
            <div className="row">
                <div className="col-md-5">
                    <Link to="/register/content-creator">
                        <button className="btn btn-primary btn-lg btn-block">Content Creator</button>
                    </Link>
                </div>
                <div className="col-md-5">
                    <Link to="/register/video-editor">
                        <button className="btn btn-secondary btn-lg btn-block">Video Editor</button>
                    </Link>
                </div>
            </div>
            <div className="mt-3">
                <h5>Already have an account? <Link to="/login">Login</Link></h5>
            </div>
        </div>
    );
};

export default HomePage;
