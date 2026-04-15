import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '', sort: 'user_id', order: 'ASC' });
    const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '', sort: 'store_id', order: 'ASC' });
    
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);

    const fetchMetrics = useCallback(async () => {
        try {
            const res = await axios.get('/admin/dashboard/metrics');
            setMetrics(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch metrics.');
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(userFilters).toString();
            const res = await axios.get(`/admin/users?${params}`);
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, [userFilters]);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(storeFilters).toString();
            const res = await axios.get(`/admin/stores?${params}`);
            setStores(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch stores.');
        } finally {
            setLoading(false);
        }
    }, [storeFilters]);

    useEffect(() => {
        fetchMetrics();
        fetchUsers();
        fetchStores();
    }, [fetchMetrics, fetchUsers, fetchStores]);

    const handleUserSort = (field) => {
        setUserFilters(prev => ({
            ...prev,
            sort: field,
            order: prev.sort === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
        }));
    };

    const handleStoreSort = (field) => {
        setStoreFilters(prev => ({
            ...prev,
            sort: field,
            order: prev.sort === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
        }));
    };

    const AddNewUser = ({ onSuccess }) => {
        const [userData, setUserData] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
        const [addError, setAddError] = useState('');
        const roles = ['System Administrator', 'Normal User', 'Store Owner'];

        const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(password);
        const validateName = (name) => name.length >= 20 && name.length <= 60;
        const validateAddress = (address) => address.length <= 400;

        const handleSubmit = async (e) => {
            e.preventDefault();
            setAddError('');
            if (!validateName(userData.name)) return setAddError("Name must be 20-60 characters.");
            if (!validateAddress(userData.address)) return setAddError("Address cannot exceed 400 characters.");
            if (!validatePassword(userData.password)) return setAddError("Password must be 8-16 chars, include uppercase and special char.");

            try {
                await axios.post('/admin/users', userData);
                alert('User added successfully!');
                onSuccess();
                setShowAddUser(false);
            } catch (err) {
                setAddError(err.response?.data?.msg || 'Failed to add user.');
            }
        };

        return (
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>Add New User</h4>
                <input name="name" placeholder="Name (20-60 chars)" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} required />
                <input name="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} required />
                <input name="password" placeholder="Password (8-16 chars, incl. Upper & Special)" type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} required />
                <input name="address" placeholder="Address (Max 400 chars)" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} required />
                <select name="role" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} required>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="submit">Create User</button>
                {addError && <p style={{ color: 'red' }}>{addError}</p>}
            </form>
        );
    };

    const AddNewStore = ({ onSuccess }) => {
        const [storeData, setStoreData] = useState({ name: '', email: '', address: '', owner_id: '' });
        const [addError, setAddError] = useState('');

        const handleSubmit = async (e) => {
            e.preventDefault();
            setAddError('');
            try {
                await axios.post('/admin/stores', storeData);
                alert('Store added successfully!');
                onSuccess();
                setShowAddStore(false);
            } catch (err) {
                setAddError(err.response?.data?.msg || 'Failed to add store. Check if Owner ID is valid Store Owner.');
            }
        };

        return (
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>Add New Store</h4>
                <input name="name" placeholder="Store Name" value={storeData.name} onChange={(e) => setStoreData({...storeData, name: e.target.value})} required />
                <input name="email" placeholder="Store Email" value={storeData.email} onChange={(e) => setStoreData({...storeData, email: e.target.value})} required />
                <input name="address" placeholder="Store Address" value={storeData.address} onChange={(e) => setStoreData({...storeData, address: e.target.value})} required />
                <input name="owner_id" placeholder="Owner User ID (must be Store Owner)" type="number" value={storeData.owner_id} onChange={(e) => setStoreData({...storeData, owner_id: e.target.value})} required />
                <button type="submit">Create Store</button>
                {addError && <p style={{ color: 'red' }}>{addError}</p>}
            </form>
        );
    };

    if (loading && !metrics.totalUsers) return <div>Loading Admin Dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>System Administrator Dashboard</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px', border: '1px solid #ddd', padding: '15px' }}>
                <h3>Total Users: {metrics.totalUsers}</h3>
                <h3>Total Stores: {metrics.totalStores}</h3>
                <h3>Total Ratings: {metrics.totalRatings}</h3>
            </div>
            
            <h3>User Management</h3>
            <button onClick={() => setShowAddUser(!showAddUser)} style={{ marginBottom: '15px' }}>
                {showAddUser ? 'Cancel Add User' : 'Add New User'}
            </button>
            {showAddUser && <AddNewUser onSuccess={fetchUsers} />}
            
            <div style={{ marginBottom: '10px' }}>
                <input placeholder="Filter Name" onChange={(e) => setUserFilters({...userFilters, name: e.target.value})} />
                <input placeholder="Filter Email" onChange={(e) => setUserFilters({...userFilters, email: e.target.value})} />
                <select onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}>
                    <option value="">All Roles</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Normal User">Normal User</option>
                    <option value="Store Owner">Store Owner</option>
                </select>
                <button onClick={fetchUsers}>Apply Filters</button>
            </div>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th onClick={() => handleUserSort('name')}>Name {userFilters.sort === 'name' ? (userFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => handleUserSort('email')}>Email {userFilters.sort === 'email' ? (userFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => handleUserSort('address')}>Address {userFilters.sort === 'address' ? (userFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => handleUserSort('role')}>Role {userFilters.sort === 'role' ? (userFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th>Store Owner Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                            <td>{user.role === 'Store Owner' ? (user.storeOwnerStatus || 'N/A') : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <hr style={{ marginTop: '30px', marginBottom: '30px' }} />

            <h3>Store Management</h3>
            <button onClick={() => setShowAddStore(!showAddStore)} style={{ marginBottom: '15px' }}>
                {showAddStore ? 'Cancel Add Store' : 'Add New Store'}
            </button>
            {showAddStore && <AddNewStore onSuccess={fetchStores} />}

            <div style={{ marginBottom: '10px' }}>
                <input placeholder="Filter Name" onChange={(e) => setStoreFilters({...storeFilters, name: e.target.value})} />
                <input placeholder="Filter Email" onChange={(e) => setStoreFilters({...storeFilters, email: e.target.value})} />
                <input placeholder="Filter Address" onChange={(e) => setStoreFilters({...storeFilters, address: e.target.value})} />
                <button onClick={fetchStores}>Apply Filters</button>
            </div>
            
            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th onClick={() => handleStoreSort('name')}>Store Name {storeFilters.sort === 'name' ? (storeFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => handleStoreSort('email')}>Email {storeFilters.sort === 'email' ? (storeFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => handleStoreSort('address')}>Address {storeFilters.sort === 'address' ? (storeFilters.order === 'ASC' ? '▲' : '▼') : ''}</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.store_id}>
                            <td>{store.name}</td>
                            <td>{store.email}</td>
                            <td>{store.address}</td>
                            <td>{store.rating || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
