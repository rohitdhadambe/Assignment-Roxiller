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
                onSuccess();
                setShowAddUser(false);
            } catch (err) {
                setAddError(err.response?.data?.msg || 'Failed to add user.');
            }
        };

        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Create New User</h4>
                    <div className="space-y-4">
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="name" placeholder="Full Name (20-60 chars)" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="email" placeholder="Email Address" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="password" placeholder="Password (8-16 chars, Upper & Special)" type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="address" placeholder="Address (Max 400 chars)" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} required />
                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="role" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} required>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    {addError && <p className="mt-4 text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{addError}</p>}
                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">Create User</button>
                    </div>
                </form>
            </div>
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
                onSuccess();
                setShowAddStore(false);
            } catch (err) {
                setAddError(err.response?.data?.msg || 'Failed to add store.');
            }
        };

        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Register New Store</h4>
                    <div className="space-y-4">
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="name" placeholder="Store Name" value={storeData.name} onChange={(e) => setStoreData({...storeData, name: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="email" placeholder="Business Email" value={storeData.email} onChange={(e) => setStoreData({...storeData, email: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="address" placeholder="Store Address" value={storeData.address} onChange={(e) => setStoreData({...storeData, address: e.target.value})} required />
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" name="owner_id" placeholder="Owner User ID" type="number" value={storeData.owner_id} onChange={(e) => setStoreData({...storeData, owner_id: e.target.value})} required />
                    </div>
                    {addError && <p className="mt-4 text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{addError}</p>}
                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={() => setShowAddStore(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">Create Store</button>
                    </div>
                </form>
            </div>
        );
    };

    if (loading && !metrics.totalUsers) return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">Syncing Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen pl-32">
            {/* This layer ensures the background color is ALWAYS 100% width/height */}
            <div className="fixed inset-0 bg-slate-50 -z-10" />

            <div className="py-10 px-6 lg:px-12 w-full max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Console</h2>
                        <p className="text-slate-500 mt-1">Manage users, stores, and global metrics</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowAddUser(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all">Add User</button>
                        <button onClick={() => setShowAddStore(true)} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 shadow-md shadow-slate-200 transition-all">Add Store</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Users', value: metrics.totalUsers, color: 'text-indigo-600' },
                        { label: 'Total Stores', value: metrics.totalStores, color: 'text-emerald-600' },
                        { label: 'Total Ratings', value: metrics.totalRatings, color: 'text-amber-600' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                            <p className={`text-3xl font-black mt-2 ${m.color}`}>{m.value || 0}</p>
                        </div>
                    ))}
                </div>

                {/* User Management Section */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
                        <h3 className="text-lg font-bold text-slate-800">User Management</h3>
                        <div className="flex flex-wrap gap-2">
                            <input className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" placeholder="Name" onChange={(e) => setUserFilters({...userFilters, name: e.target.value})} />
                            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}>
                                <option value="">All Roles</option>
                                <option value="System Administrator">Admin</option>
                                <option value="Normal User">User</option>
                                <option value="Store Owner">Owner</option>
                            </select>
                            <button onClick={fetchUsers} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all">Filter</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th onClick={() => handleUserSort('name')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Owner Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => (
                                    <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 break-all max-w-[200px]">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 break-all max-w-[200px]">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">{user.role.split(' ')[0]}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700 text-right">{user.role === 'Store Owner' ? (user.storeOwnerStatus || '0.0') : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Store Management Section */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
                        <h3 className="text-lg font-bold text-slate-800">Store Management</h3>
                        <div className="flex flex-wrap gap-2">
                            <input className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" placeholder="Store Name" onChange={(e) => setStoreFilters({...storeFilters, name: e.target.value})} />
                            <button onClick={fetchStores} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all">Filter</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th onClick={() => handleStoreSort('name')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer">Store</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stores.map(store => (
                                    <tr key={store.store_id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 break-all max-w-[200px]">{store.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 break-all max-w-[200px]">{store.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 break-all max-w-[300px]">{store.address}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center text-sm font-bold text-amber-600">★ {store.rating || '0.0'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {showAddUser && <AddNewUser onSuccess={fetchUsers} />}
            {showAddStore && <AddNewStore onSuccess={fetchStores} />}
        </div>
    );
};

export default AdminDashboard;