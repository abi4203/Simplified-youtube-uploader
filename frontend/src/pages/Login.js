import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../components/UserContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const { setUser } = useUser();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {

        const checkLoggedIn = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user', {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {

            }
        };

        checkLoggedIn();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData, {
                withCredentials: true,
            });

            if (response && response.status === 200) {
                alert('Login successful!');
                setUser(response.data.user);
                navigate('/profile');
            } else {
                console.error('Invalid response:', response);
                alert('An error occurred while logging in.');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data?.error || 'An error occurred.');
            alert('An error occurred while logging in.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <button className="btn btn-secondary me-3  mt-2 " onClick={() => {
                    navigate(-1)
                }}>Back</button>
                <button type="submit" className="btn btn-primary mt-2">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
