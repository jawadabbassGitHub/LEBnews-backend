const https = require('https');

// Function to create an empty object based on the structure of a given object
function createEmptyObject(templateObject) {
  const emptyObject = {};
  for (const key in templateObject) {
    if (typeof templateObject[key] === "string") {
      emptyObject[key] = ""; // Set empty string for strings
    } else if (typeof templateObject[key] === "number") {
      emptyObject[key] = 0; // Set 0 for numbers
    } else if (templateObject[key] instanceof Array) {
      emptyObject[key] = []; // Set empty array for arrays
    } else if (typeof templateObject[key] === "object" && templateObject[key] !== null) {
      emptyObject[key] = createEmptyObject(templateObject[key]); // Recursively handle nested objects
    } else {
      emptyObject[key] = null; // Set null for other types
    }
  }
  return emptyObject;
}

// Generate 10+ unique templates with IDs
function generateNewsTemplates(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    headline: "",
    underheadline: "",
    content: "",
    image: "",
    date: "",
    url: "",
  }));
}

// Fetch news from API
async function fetchNewsFromAPI() {
  const options = {
    method: 'GET',
    hostname: 'arabic-news-api.p.rapidapi.com',
    port: null,
    path: '/aljazeera',
    headers: {
      'x-rapidapi-key': '640412f33emsh6881a832f0e6219p1def3cjsn857e9c7cedaf',
      'x-rapidapi-host': 'arabic-news-api.p.rapidapi.com',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const body = Buffer.concat(chunks);
          const news = JSON.parse(body.toString()).results;

          // Generate templates
          const templates = generateNewsTemplates(10);

          // Validate and sanitize the news structure
          const sanitizedNews = news.map((item, index) => ({
            ...createEmptyObject(templates[index % templates.length]), // Cycle through templates
            ...item, // Merge with fetched data
            id: item.id || Date.now() + index, // Ensure unique ID
            image: item.image || '/images/default.png', // Default image
          }));

          resolve(sanitizedNews);
        } catch (error) {
          reject(new Error('Error parsing API response'));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

// Save approved news to a temporary array (can be replaced with a database)
let approvedNews = [];

function saveSelectedNews(newsItems) {
  approvedNews = newsItems; // Save the selected news
}

function fetchApprovedNews() {
  return approvedNews; // Return approved news
}

module.exports = { fetchNewsFromAPI, saveSelectedNews, fetchApprovedNews };
