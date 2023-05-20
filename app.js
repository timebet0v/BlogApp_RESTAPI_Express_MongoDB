const express = require('express');
const posts = require('./routes/posts'); // Router to /api/posts
const app = express(); // INITIALIZING Express as 'app'

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get('/', (_, res) => {
  res
    .status(200)
    .json({ success: true, status: 200, api: [{ posts: '/api/posts' }] });
});

// API -> Posts
app.use('/api/posts', posts);

// Handling all the other requests which did not define in the code
app.all('*', (_, res) => {
  res.status(404).json({ message: "We're sorry, however resource not found!" });
});

module.exports = app;
