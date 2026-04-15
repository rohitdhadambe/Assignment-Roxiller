import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import RatingInput from '../components/RatingInput';
import { useAuth } from '../context/AuthContext';

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
            const res = await axios.post('/ratings', { storeId, rating: ratingValue });
            alert(res.data.msg);
            // Re-fetch the stores to update the table immediately
            fetchStores(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Rating submission failed.');
        }
    };

    if (loading) return <div>Loading stores...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>Store Listings</h2>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <h3>Search Stores</h3>
                <input 
                    name="name" 
                    placeholder="Search by Store Name" 
                    value={search.name} 
                    onChange={handleSearchChange} 
                    style={{ marginRight: '10px' }}
                />
                <input 
                    name="address" 
                    placeholder="Search by Address" 
                    value={search.address} 
                    onChange={handleSearchChange}
                />
                <button onClick={fetchStores} style={{ marginLeft: '10px' }}>Apply Search</button>
            </div>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Store Name</th>
                        <th>Address</th>
                        <th>Overall Rating</th>
                        <th>Your Submitted Rating</th>
                        <th>Submit/Modify Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store) => (
                        <tr key={store.store_id}>
                            <td>{store["Store Name"]}</td>
                            <td>{store.Address}</td>
                            <td>{store["Overall Rating"] || 'N/A'}</td>
                            <td>{store["User's Submitted Rating"] || 'Not Rated'}</td>
                            <td>
                                <RatingInput
                                    currentRating={store["User's Submitted Rating"]}
                                    onRate={(ratingValue) => handleRatingSubmit(store.store_id, ratingValue)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserStoreList;