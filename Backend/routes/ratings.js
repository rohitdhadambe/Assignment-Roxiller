const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    if (!storeId || rating == null) {
        return res.status(400).json({ msg: 'Store ID and rating are required.' });
    }

    const ratingValue = parseInt(rating);
    if (ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ msg: 'Rating must be between 1 and 5.' });
    }

    try {
        const existingRating = await pool.query(
            "SELECT rating_id FROM ratings WHERE user_id = $1 AND store_id = $2",
            [userId, storeId]
        );

        if (existingRating.rows.length > 0) {
            await pool.query(
                "UPDATE ratings SET rating = $1 WHERE rating_id = $2 RETURNING *",
                [ratingValue, existingRating.rows[0].rating_id]
            );
            return res.json({ msg: 'Rating modified successfully.', action: 'MODIFIED' });
        } else {
            await pool.query(
                "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *",
                [userId, storeId, ratingValue]
            );
            return res.status(201).json({ msg: 'Rating submitted successfully.', action: 'SUBMITTED' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
