const express = require('express');
const { fetchNewsFromAPI, saveSelectedNews, fetchApprovedNews } = require('../services/newsService');
const router = express.Router();

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route to display the "Select News" page
router.get('/select-news', asyncHandler(async (req, res) => {
  const news = await fetchNewsFromAPI();

  if (!news || news.length === 0) {
    return res.status(404).render('error', { message: 'No news available to display' });
  }

  // Add an empty placeholder item for user input
  const emptyNewsItem = {
    id: "",
    headline: "",
    underheadline: "",
    content: "",
    image: "",
    date: "",
    url: "",
  };
  news.unshift(emptyNewsItem); // Add the placeholder at the top

  req.session.fetchedNews = news; // Save news data in session
  res.render('select-news', { news }); // Pass to the view
}));

// Route to handle form submission for selected news
router.post('/submit-news', asyncHandler(async (req, res) => {
  const selectedNewsIds = req.body.news || []; // Get selected news IDs (array of IDs)

  if (!Array.isArray(selectedNewsIds) || selectedNewsIds.length === 0) {
    return res.status(400).render('error', { message: 'No news selected' });
  }

  const allNews = req.session.fetchedNews; // Retrieve all news from the session
  if (!allNews || allNews.length === 0) {
    return res.status(500).render('error', { message: 'Session data is empty or corrupted' });
  }

  // Map selected news with user inputs
  const approvedNews = selectedNewsIds.map((id) => {
    const item = allNews.find((newsItem) => newsItem.id.toString() === id);
    if (item) {
      return {
        id: item.id,
        headline: req.body[`headline-${id}`] || item.headline,
        underheadline: req.body[`underheadline-${id}`] || item.underheadline,
        content: req.body[`content-${id}`] || item.content,
        date: req.body[`date-${id}`] || item.date,
        image: item.image, // Image stays the same
        url: item.url, // URL stays the same
      };
    }
    return null;
  }).filter(Boolean); // Remove invalid items

  if (approvedNews.length === 0) {
    return res.status(400).render('error', { message: 'No valid news selected' });
  }

  await saveSelectedNews(approvedNews); // Save approved news to the database
  res.redirect('/best-news/approved-news'); // Redirect to approved news page
}));

router.get('/approved-news', asyncHandler(async (req, res) => {
  const newsList = await fetchApprovedNews(); // Fetch approved news

  if (!newsList || newsList.length === 0) {
      if (req.headers.accept === 'application/json') {
          return res.status(404).json({ message: 'No approved news available' });
      }
      return res.status(404).render('error', { message: 'No approved news available' });
  }

  if (req.headers.accept === 'application/json') {
      return res.json({ news: newsList }); // Return JSON data
  }

  res.render('approved-news', { newsList }); // Render the HTML page for non-JSON requests
}));


module.exports = router;
