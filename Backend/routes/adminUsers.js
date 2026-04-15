const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const bcrypt = require('bcrypt');

const checkIsStoreOwner = async (userId) => {
    const store = await pool.query('SELECT store_id FROM stores WHERE owner_id = $1', [userId]);
    return store.rows.length > 0;
};

router.post('/', auth, role('System Administrator'), async (req, res) => {
    const { name, email, password, address, role: newRole } = req.body;

    if (!['System Administrator', 'Normal User', 'Store Owner'].includes(newRole)) {
        return res.status(400).json({ msg: 'Invalid role provided.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role",
            [name, email, hashedPassword, address, newRole]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') return res.status(400).json({ msg: 'Email already exists.' });
        res.status(500).send('Server error');
    }
});

router.get('/', auth, role('System Administrator'), async (req, res) => {
    const { name, email, address, role: filterRole, sort, order } = req.query;

    let query = 'SELECT user_id, name, email, address, role FROM users WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (name) { query += ` AND name ILIKE $${paramIndex++}`; values.push(`%${name}%`); }
    if (email) { query += ` AND email ILIKE $${paramIndex++}`; values.push(`%${email}%`); }
    if (address) { query += ` AND address ILIKE $${paramIndex++}`; values.push(`%${address}%`); }
    if (filterRole) { query += ` AND role = $${paramIndex++}`; values.push(filterRole); }

    const allowedSortFields = ['name', 'email', 'address', 'role'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'user_id';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    try {
        const result = await pool.query(query, values);

        const usersWithDetails = await Promise.all(result.rows.map(async (user) => {
            let ratingDetail = {};
            if (user.role === 'Store Owner') {
                const storeExists = await checkIsStoreOwner(user.user_id);
                if (storeExists) {
                    ratingDetail.storeOwnerStatus = 'Store Exists';
                }
            }
            return { ...user, ...ratingDetail };
        }));

        res.json(usersWithDetails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
