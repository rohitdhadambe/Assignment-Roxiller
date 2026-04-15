import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('/auth/login', formData);
            const { token, user } = res.data;
            login(token, user);

            switch (user.role) {
                case 'System Administrator':
                    navigate('/admin/dashboard');
                    break;
                case 'Store Owner':
                    navigate('/owner/dashboard');
                    break;
                case 'Normal User':
                default:
                    navigate('/stores');
                    break;
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Login failed. Invalid Credentials.');
        }
    };

    return (
        <div>
            <h2>User Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
                <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;
