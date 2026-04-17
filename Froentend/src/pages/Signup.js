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
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-50 overflow-y-auto overflow-x-hidden px-6 py-12">
            <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 my-auto relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Create Account
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Join us by filling out the details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="text-xs font-medium text-red-500 bg-red-50/50 border border-red-100 rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name</label>
                        <input
                            name="name"
                            placeholder="Johnathan Doe Middle"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Min. 8 chars, Upper & Special"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700 ml-1">Address</label>
                        <textarea
                            name="address"
                            placeholder="Your full delivery address"
                            onChange={handleChange}
                            required
                            rows="2"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 mt-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-slate-200"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Sign In</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;