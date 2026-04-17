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

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">Loading Business Insights...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-md text-center">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        </div>
    );

    if (!dashboardData) return null;

    return (
        <div className="relative min-h-screen pl-32">
            {/* Consistent Fixed Background */}
            <div className="fixed inset-0 bg-slate-50 -z-10" />

            <div className="py-10 px-6 lg:px-12 w-full max-w-7xl mx-auto space-y-10">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Store Analytics</h2>
                        <p className="text-slate-500 mt-1">Review your performance and customer feedback</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase block">Store Identity</span>
                        <span className="text-sm font-mono font-bold text-slate-700">ID: {dashboardData.store_id}</span>
                    </div>
                </header>

                {/* Rating Highlight Card */}
                <div className="max-w-sm">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className={`text-5xl font-black ${dashboardData.average_rating ? 'text-emerald-600' : 'text-slate-300'}`}>
                                    {dashboardData.average_rating ? dashboardData.average_rating : '0.0'}
                                </span>
                                <span className="text-2xl text-amber-400">★</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-2 font-medium">
                                Based on {dashboardData.rated_users.length} customer reviews
                            </p>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 blur-2xl" />
                    </div>
                </div>

                {/* Feedback Table Section */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white/50">
                        <h3 className="text-lg font-bold text-slate-800">Customer Feedback</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact & Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dashboardData.rated_users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                                            No customer ratings have been submitted yet.
                                        </td>
                                    </tr>
                                ) : (
                                    dashboardData.rated_users.map((user, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                                <p className="text-[11px] text-slate-400 truncate max-w-[250px]">{user.address}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-bold">
                                                    {user.rating} <span className="text-xs text-amber-400">★</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs font-medium text-slate-500">
                                                    {new Date(user.rating_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;