import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import RatingInput from '../components/RatingInput';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Store as StoreIcon } from 'lucide-react';

const UserStoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState({ name: '', address: '' });
    const { user } = useAuth();

    const fetchStores = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (search.name) params.name = search.name;
            if (search.address) params.address = search.address;

            const res = await axios.get('/stores', { params });
            setStores(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch stores.');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleRatingSubmit = async (storeId, ratingValue) => {
        if (user.role !== 'Normal User') {
            alert('Only Normal Users can submit ratings.');
            return;
        }

        try {
            await axios.post('/ratings', { storeId, rating: ratingValue });
            // Re-fetch to update the UI immediately
            fetchStores(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Rating submission failed.');
        }
    };

    if (loading && stores.length === 0) return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Discovering Stores...</p>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen pl-32">
            {/* Consistent Fixed Background Layer */}
            <div className="fixed inset-0 bg-slate-50 -z-10" />

            {/* Main Centered Container - Aligned with Header max-width */}
            <div className="py-10 px-6 lg:px-12 w-full max-w-7xl mx-auto space-y-10">
                
                {/* Header & Search Bar Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Store Directory</h2>
                        <p className="text-slate-500 font-medium">Find and rate your favorite local businesses</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                                name="name" 
                                placeholder="Store Name" 
                                value={search.name} 
                                onChange={handleSearchChange} 
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/5 w-44"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                                name="address" 
                                placeholder="Location" 
                                value={search.address} 
                                onChange={handleSearchChange}
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/5 w-44"
                            />
                        </div>
                        <button 
                            onClick={fetchStores} 
                            className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
                        >
                            Search
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                {/* Store Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {stores.map((store) => (
                        <div key={store.store_id} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                        <StoreIcon size={24} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Overall</p>
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="text-xl font-black text-slate-900">
                                                {store["Overall Rating"] || '0.0'}
                                            </span>
                                            <span className="text-amber-400 text-xl">★</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {store["Store Name"]}
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 font-medium flex items-start gap-2 leading-relaxed">
                                    <MapPin size={16} className="text-slate-300 flex-shrink-0 mt-0.5" /> 
                                    {store.Address}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Experience</span>
                                    <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                        {store["User's Submitted Rating"] ? `${store["User's Submitted Rating"]} / 5` : 'Not rated'}
                                    </span>
                                </div>
                                
                                <div className="flex justify-center bg-slate-50/50 py-4 rounded-[20px] border border-slate-100">
                                    <RatingInput
                                        currentRating={store["User's Submitted Rating"]}
                                        onRate={(ratingValue) => handleRatingSubmit(store.store_id, ratingValue)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {stores.length === 0 && !loading && (
                    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                        <div className="inline-flex w-16 h-16 bg-slate-50 rounded-full items-center justify-center text-slate-300 mb-4">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No results found</h3>
                        <p className="text-slate-400 mt-1">Try adjusting your search terms or location.</p>
                    </div>
                )}
            </div>
        </div>
        
    );
};

export default UserStoreList;