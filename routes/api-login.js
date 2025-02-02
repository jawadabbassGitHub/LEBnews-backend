// login-api.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Remove this if passwords are not hashed
const db = require('../config/db_connection');

// POST route to handle login
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  // Query the database for a user with the given email
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // If using hashed passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (isMatch) {
        // Password matches
        return res.status(200).json({ message: 'Login successful', user });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    });

    // If using plain text passwords, replace the bcrypt.compare section with:
    /*
    if (password === user.password) {
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
    */
  });
});

module.exports = router;
