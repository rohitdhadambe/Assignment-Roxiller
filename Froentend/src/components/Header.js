import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Store, ShieldCheck, Key, LayoutDashboard } from 'lucide-react';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to highlight active links
    const isActive = (path) => location.pathname === path ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-800';

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <Store size={18} />
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight hidden sm:block">
                        Rating<span className="text-slate-400">Hub</span>
                    </span>
                </div>

                <nav className="flex items-center gap-6">
                    {!isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                Login
                            </Link>
                            <Link to="/login" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            {/* Role-based Links */}
                            <div className="hidden md:flex items-center gap-6 border-r border-slate-200 pr-6 mr-2">
                                {user.role === 'Normal User' && (
                                    <Link to="/stores" className={`text-sm font-bold flex items-center gap-2 pb-1 transition-all ${isActive('/stores')}`}>
                                        <Store size={16} /> Stores
                                    </Link>
                                )}
                                {user.role === 'Store Owner' && (
                                    <Link to="/owner/dashboard" className={`text-sm font-bold flex items-center gap-2 pb-1 transition-all ${isActive('/owner/dashboard')}`}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                )}
                                {user.role === 'System Administrator' && (
                                    <Link to="/admin/dashboard" className={`text-sm font-bold flex items-center gap-2 pb-1 transition-all ${isActive('/admin/dashboard')}`}>
                                        <ShieldCheck size={16} /> Admin
                                    </Link>
                                )}
                                <Link to="/change-password" className={`text-sm font-bold flex items-center gap-2 pb-1 transition-all ${isActive('/change-password')}`}>
                                    <Key size={16} /> Security
                                </Link>
                            </div>

                            {/* Profile & Logout Section */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col text-right">
                                    <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user.role}</span>
                                </div>
                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                                    <User size={18} />
                                </div>
                                <button 
                                    onClick={handleLogout} 
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Log Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;