var express = require('express');
var router = express.Router();
var database = require('../config/db_connection'); // Assuming you have this setup

// Test Database Connection
router.get('/testconnection', function(request, response, next) {
  if (database != null) {
    response.send('Database connected successfully!');
  } else {
    response.send('Database connection failed');
  }
});

// GET home page
router.get('/', function(req, res, next) {
  var people = [
    { id: 101, name: 'Lutfor Rahman', email: 'contact.lutforrahman@gmail.com' },
    { id: 102, name: 'Vrushang', email: 'info@vrushang.com' },
    { id: 103, name: 'Frank', email: 'info@frank.com' },
    { id: 104, name: 'Felix', email: 'info@felix.com' }
  ];
  res.render('index', { title: 'My Universe', people: people });
});

// GET dashboard page
router.get('/dashboard', function(req, res, next) {
  // Mock data for dashboard, you can replace this with real data from your database
  const dashboardData = {
    messages: 26,
    tasks: 11,
    orders: 123,
    tickets: 13
  };
  
  res.render('dashboard', { title: 'Dashboard', data: dashboardData });
});

// POST form data handling
router.post('/post-form', function(req, res, next) {
  const { name, email } = req.body;

  // Sanitize inputs to avoid injection attacks
  const sanitizedEmail = email.replace(/[<>]/g, "");

  if (!name || !sanitizedEmail) {
    return res.status(400).send('Invalid data!');
  }

  // Here you would insert data into your database
  // e.g. database.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, sanitizedEmail]);

  res.send(`Form submitted successfully! Name: ${name}, Email: ${sanitizedEmail}`);
});

module.exports = router;
