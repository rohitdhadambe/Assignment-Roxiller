const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const calculateOverallRating = async (storeId) => {
    const result = await pool.query(
        "SELECT AVG(rating) AS overall_rating FROM ratings WHERE store_id = $1",
        [storeId]
    );
    const rating = parseFloat(result.rows[0].overall_rating);
    return rating ? Math.round(rating * 100) / 100 : null;
};

router.post('/', auth, role('System Administrator'), async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        const ownerCheck = await pool.query("SELECT role FROM users WHERE user_id = $1", [owner_id]);
        if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].role !== 'Store Owner') {
            return res.status(400).json({ msg: 'Owner ID must belong to an existing Store Owner.' });
        }

        const result = await pool.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, address, owner_id]
        );
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') return res.status(400).json({ msg: 'Store name or email already exists.' });
        res.status(500).send('Server error');
    }
});

router.get('/', auth, role('System Administrator'), async (req, res) => {
    const { name, email, address, sort, order } = req.query;

    let query = 'SELECT store_id, name, email, address FROM stores WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (name) { query += ` AND name ILIKE $${paramIndex++}`; values.push(`%${name}%`); }
    if (email) { query += ` AND email ILIKE $${paramIndex++}`; values.push(`%${email}%`); }
    if (address) { query += ` AND address ILIKE $${paramIndex++}`; values.push(`%${address}%`); }

    const allowedSortFields = ['name', 'email', 'address'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'store_id';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    try {
        const result = await pool.query(query, values);

        const storesWithRating = await Promise.all(result.rows.map(async (store) => {
            const overallRating = await calculateOverallRating(store.store_id);
            return {
                ...store,
                rating: overallRating || 'N/A'
            };
        }));

        res.json(storesWithRating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
