import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        channelName: '',
        channelId: '',
        country: '',
        language: ''
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
            // You can redirect the user to another page here if needed
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registration Form</h2>
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
                <div className="form-group">
                    <label>Channel Name</label>
                    <input type="text" name="channelName" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Channel ID</label>
                    <input type="text" name="channelId" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Country/Region</label>
                    <input type="text" name="country" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Language</label>
                    <input type="text" name="language" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
