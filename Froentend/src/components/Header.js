import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Store Rating Platform</div>
            <nav>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: '15px' }}>Welcome, {user.name} ({user.role})</span>
                        
                        {/* Role-based Links */}
                        {user.role === 'Normal User' && <Link to="/stores" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Stores</Link>}
                        {user.role === 'Store Owner' && <Link to="/owner/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Owner Dashboard</Link>}
                        {user.role === 'System Administrator' && <Link to="/admin/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Admin Dashboard</Link>}

                        {/* General Links */}
                        <Link to="/change-password" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Change Password</Link>
                        
                        <button onClick={handleLogout} style={{ background: 'darkred', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                            Log Out
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;