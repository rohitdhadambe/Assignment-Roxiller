import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const StoreOwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/storeowner/dashboard');
                setDashboardData(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to fetch dashboard data. Make sure you own a registered store.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading Store Owner Dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    if (!dashboardData) return <div>No dashboard data available.</div>;

    return (
        <div>
            <h2>Store Owner Dashboard</h2>
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>My Store Rating Summary</h3>
                <p><strong>Store ID:</strong> {dashboardData.store_id}</p>
                <p>
                    <strong>Average Rating:</strong> 
                    <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: dashboardData.average_rating ? 'green' : 'gray' }}>
                        {dashboardData.average_rating ? dashboardData.average_rating : 'No Ratings Yet'}
                    </span>
                </p>
            </div>

            <h3>Users Who Have Submitted Ratings ({dashboardData.rated_users.length})</h3>
            
            {dashboardData.rated_users.length === 0 ? (
                <p>No users have rated your store yet.</p>
            ) : (
                <table border="1" cellPadding="10" width="100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rating Submitted</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.rated_users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{user.rating}</td>
                                <td>{new Date(user.rating_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;