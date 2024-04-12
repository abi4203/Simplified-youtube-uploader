import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        // type: type
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            alert('Login successful!');
            // Redirect to appropriate page based on type
             navigate('/upload');

        } catch (error) {
            console.error('Error logging in:', error.response.data.error);
            alert('An error occurred while logging in: ' + error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login Form for {type}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
