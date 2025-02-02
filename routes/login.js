// routes/login.js
const express = require('express');
const database = require('../config/db_connection'); // Adjust this path if necessary
const router = express.Router();

// Render the login page
router.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Handle login form submission
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { title: 'Login', error: 'Please provide both email and password.' });
    }

    if (database) {
        // Query the database to find a matching user
        database.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.render('login', { title: 'Login', error: 'An error occurred. Please try again.' });
            }

            if (results.length > 0) {
                // Successful login
                res.redirect('/dashboard');
            } else {
                // Invalid credentials
                res.render('login', { title: 'Login', error: 'Invalid credentials' });
            }
        });
    } else {
        res.render('login', { title: 'Login', error: 'Database connection failed' });
    }
});

module.exports = router;
