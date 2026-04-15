const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validation');

router.put('/password', auth, async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user.userId;

    if (!newPassword) {
        return res.status(400).json({ msg: 'New password is required.' });
    }

    if (!validatePassword(newPassword)) {
        return res.status(400).json({ msg: 'Password must be 8-16 chars, include uppercase and a special char.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query(
            "UPDATE users SET password = $1 WHERE user_id = $2",
            [hashedPassword, userId]
        );

        res.json({ msg: 'Password updated successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
