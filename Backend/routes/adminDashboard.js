const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/metrics', auth, role('System Administrator'), async (req, res) => {
    try {
        const userCountResult = await pool.query("SELECT COUNT(*) FROM users");
        const totalUsers = parseInt(userCountResult.rows[0].count);

        const storeCountResult = await pool.query("SELECT COUNT(*) FROM stores");
        const totalStores = parseInt(storeCountResult.rows[0].count);

        const ratingCountResult = await pool.query("SELECT COUNT(*) FROM ratings");
        const totalRatings = parseInt(ratingCountResult.rows[0].count);

        const metrics = {
            totalUsers,
            totalStores,
            totalRatings
        };

        res.json(metrics);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
