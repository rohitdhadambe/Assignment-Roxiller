import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserStoreList from './pages/UserStoreList';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePassword from './components/ChangePassword';
import Header from './components/Header';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/change-password" element={
                        <ProtectedRoute allowedRoles={['System Administrator', 'Normal User', 'Store Owner']}>
                            <ChangePassword />
                        </ProtectedRoute>
                    } />
                    <Route path="/stores" element={
                        <ProtectedRoute allowedRoles={['Normal User']}>
                            <UserStoreList />
                        </ProtectedRoute>
                    } />
                    <Route path="/owner/dashboard" element={
                        <ProtectedRoute allowedRoles={['Store Owner']}>
                            <StoreOwnerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['System Administrator']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/unauthorized" element={<h1>403 - Access Denied</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
