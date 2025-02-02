const express = require('express');
const router = express.Router();

// Endpoint for adding news
router.post('/add-news', (req, res) => {
    const newsData = req.body;

    // Validate received data
    if (!newsData || !Array.isArray(newsData)) {
        return res.status(400).json({ error: 'Invalid news data' });
    }

    // Simulate storing the news in the database
    console.log('Received news:', newsData);

    // Success response
    res.status(200).json({ message: 'News received successfully' });
});

module.exports = router;
