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
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-50 overflow-x-hidden px-6">
            <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 relative z-10">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome back
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Please enter your details to sign in
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="text-xs font-medium text-red-500 bg-red-50/50 border border-red-100 rounded-lg px-4 py-3 animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[13px] font-semibold text-slate-700">Password</label>
                            <a href="#" className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700">Forgot?</a>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-slate-200"
                    >
                        Sign in to account
                    </button>
                </form>
                
                <p className="text-center text-sm text-slate-500 mt-8">
                    Don't have an account? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contact Admin</span>
                </p>
            </div>
        </div>
    );
};

export default Login;