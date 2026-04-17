import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password does not meet requirements.');
            return;
        }

        try {
            setMessage('Password updated successfully!');
        } catch (err) {
            setError('Failed to update password.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6">
            {/* Consistent Fixed Background Layer */}
            <div className="fixed inset-0 bg-slate-50 -z-10" />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-900 p-4 rounded-2xl shadow-sm text-white">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                    </div>

                    <header className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Update</h2>
                        <p className="text-slate-500 mt-2 text-sm">Please enter your new account password</p>
                    </header>

                    {message && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <p className="text-emerald-700 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input 
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Requirements Checklist */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requirements</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge active={newPassword.length >= 8 && newPassword.length <= 16}>8-16 Chars</Badge>
                                <Badge active={/[A-Z]/.test(newPassword)}>Uppercase</Badge>
                                <Badge active={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}>Special</Badge>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
                        >
                            Confirm Update
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-8">
                    <button className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                        Cancel and return to profile
                    </button>
                </p>
            </div>
        </div>
    );
};

// Simple Badge helper component for requirements
const Badge = ({ active, children }) => (
    <span className={`text-[10px] px-2 py-1 rounded-md font-bold transition-colors ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
    }`}>
        {children}
    </span>
);

export default ChangePassword;