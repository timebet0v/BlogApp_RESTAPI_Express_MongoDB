const express = require('express');
const posts = require('./routes/posts'); // Router to /api/posts
const users = require('./routes/users'); // Router to /api/users
const profile = require('./routes/profile'); // Router to /api/profile
const auth = require('./controllers/auth.ctrl'); // Auth controller
const AppError = require('./utils/appError'); // Application handling errors
const globalErrorHandler =
  require('./controllers/error.ctrl').globalErrorHandler;
const app = express(); // INITIALIZING Express as 'app'

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
// Main page
app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    endpoints: {
      auth: {
        signUp: '/signup',
        login: '/login',
        forgotPassword: '/forgotPassword',
      },
      api: {
        posts: '/api/posts',
        users: '/api/users',
        profile: '/api/profile',
      },
    },
  });
});

// Authentication routes
app.post('/signup', auth.signUp);
app.post('/login', auth.logIn);
app.post('/forgotPassword', auth.forgotPassword);
app.patch('/resetPassword/:token', auth.resetPassword);

// API routes
app.use('/api/posts', posts);
app.use('/api/users', auth.protected, users);
app.use('/api/profile', auth.protected, profile);

// Handling all the other requests which did not define in the code
app.all('*', (req, _, next) => {
  next(
    new AppError(
      `We're sorry, however resource ${req.originalUrl} not found!`,
      404
    )
  );
});

// Global error handling middleware
app.use(globalErrorHandler);

// EXPORTING to server.app
module.exports = app;
