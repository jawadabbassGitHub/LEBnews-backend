// Required modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const upload = require('express-fileupload');
const cors = require('cors');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const topicsRouter = require('./routes/topics');
const subTopicsRouter = require('./routes/sub-topics');
const newsRouter = require('./routes/news');
const loginRoute = require('./routes/login');
const bestNewsRouter = require('./routes/best-news');
const bodyParser = require('body-parser');

// API routes
const topicApiRouter = require('./routes/api-topics');
const newsApiRouter = require('./routes/api-news');
const loginApiRouter = require('./routes/api-login');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with actual frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
};
app.use(cors(corsOptions));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware configuration
app.use(logger('dev'));

// Configure body size limits
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Adjust the limit as needed

// Additional middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // For form submissions
app.use(bodyParser.json({ limit: '10mb' })); // For JSON requests
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(upload());
app.use(expressLayout);

// Main routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/topics', topicsRouter);
app.use('/sub-topics', subTopicsRouter);
app.use('/news', newsRouter);
app.use('/login', loginRoute);

// API routes
app.use('/api/topics', topicApiRouter);
app.use('/api/news', newsApiRouter);
app.use('/api/login', loginApiRouter);

// Web scraping routes
app.use('/best-news', bestNewsRouter);

// Catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
