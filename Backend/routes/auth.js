const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { validatePassword } = require('../utils/validation');

const jwtSecret = 'YOUR_SECRET_KEY';

router.post('/signup', async (req, res) => {
    const { name, email, password, address } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ msg: 'Password must be 8-16 chars, include uppercase and a special char.' });
    }

    const role = 'Normal User';

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role",
            [name, email, hashedPassword, address, role]
        );

        const token = jwt.sign(
            { userId: newUser.rows[0].user_id, role: role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);

        if (err.code === '23505') {
            return res.status(400).json({ msg: 'Email already exists.' });
        }

        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            userId: user.rows[0].user_id,
            role: user.rows[0].role
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        const { password: _, ...userInfo } = user.rows[0];

        res.json({ token, user: userInfo });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
