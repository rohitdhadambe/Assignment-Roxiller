import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const { name, password, address, email } = formData;
        if (name.length < 20 || name.length > 60) return "Name must be 20-60 characters.";
        if (address.length > 400) return "Address cannot exceed 400 characters.";
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(password)) return "Password must be 8-16 chars, include uppercase and special char.";
        if (!/\S+@\S+\.\S+/.test(email)) return "Email format is invalid.";
        return null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await axios.post('/auth/signup', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Signup failed.');
        }
    };

    return (
        <div>
            <h2>Normal User Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input name="name" placeholder="Name (20-60 chars)" onChange={handleChange} required />
                <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
                <input name="password" placeholder="Password (8-16 chars, incl. Upper & Special)" type="password" onChange={handleChange} required />
                <input name="address" placeholder="Address (Max 400 chars)" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
