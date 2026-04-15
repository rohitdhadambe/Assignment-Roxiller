const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const getOwnedStoreId = async (ownerId) => {
    const store = await pool.query('SELECT store_id FROM stores WHERE owner_id = $1', [ownerId]);
    return store.rows.length > 0 ? store.rows[0].store_id : null;
};

router.get('/dashboard', auth, role('Store Owner'), async (req, res) => {
    const ownerId = req.user.userId;

    try {
        const storeId = await getOwnedStoreId(ownerId);
        if (!storeId) {
            return res.status(404).json({ msg: "No store found linked to this account." });
        }

        const avgRatingResult = await pool.query(
            "SELECT ROUND(AVG(rating), 2) AS average_rating FROM ratings WHERE store_id = $1",
            [storeId]
        );
        const averageRating = avgRatingResult.rows[0].average_rating || null;

        const userListResult = await pool.query(
            `SELECT 
                u.name, 
                u.email, 
                u.address, 
                r.rating, 
                r.created_at AS rating_date
            FROM users u
            JOIN ratings r ON u.user_id = r.user_id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC`,
            [storeId]
        );
        const ratedUsers = userListResult.rows;

        res.json({
            store_id: storeId,
            average_rating: averageRating,
            rated_users: ratedUsers
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
