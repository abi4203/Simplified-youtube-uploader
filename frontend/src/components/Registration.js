import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        channelName: '',
        channelId: '',
        country: '',
        language: '',
        type: type // Add the type to the form data
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', formData);
            alert('User registered successfully!');
            navigate('/login'); 
        } catch (error) {
            console.error('Error registering user:', error.response.data.error);
            alert('An error occurred while registering user: ' + error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registration Form for {type}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                {type === 'content-creator' && (
                    <>
                        <div className="form-group">
                            <label>Channel Name</label>
                            <input type="text" name="channelName" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Channel ID</label>
                            <input type="text" name="channelId" className="form-control" onChange={handleChange} required />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label>Country/Region</label>
                    <input type="text" name="country" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Language</label>
                    <input type="text" name="language" className="form-control" onChange={handleChange} required />
                </div>
                <div className='mt-2'>
                    <button className="btn btn-secondary me-1" onClick={()=>{
                        navigate(-1)
                    }}>Back</button>
                    <button type="submit" className="btn btn-primary ms-1">Register</button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
