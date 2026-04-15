const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, async (req, res) => {
    const userId = req.user.userId;
    const { name, address } = req.query;

    let query = `
        SELECT
            s.store_id,
            s.name AS "Store Name",
            s.address AS "Address",
            ROUND(AVG(all_ratings.rating), 2) AS "Overall Rating",
            user_rating.rating AS "User's Submitted Rating"
        FROM stores s
        LEFT JOIN ratings all_ratings ON s.store_id = all_ratings.store_id
        LEFT JOIN ratings user_rating ON s.store_id = user_rating.store_id AND user_rating.user_id = $1
        WHERE 1=1
    `;

    const values = [userId];
    let paramIndex = 2;

    if (name) {
        query += ` AND s.name ILIKE $${paramIndex++}`;
        values.push(`%${name}%`);
    }

    if (address) {
        query += ` AND s.address ILIKE $${paramIndex++}`;
        values.push(`%${address}%`);
    }

    query += `
        GROUP BY s.store_id, s.name, s.address, user_rating.rating
        ORDER BY s.store_id ASC
    `;

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
