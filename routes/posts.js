const { Router } = require('express');

// Importing the handlers
const ctrl = require('../controllers/posts.ctrl');

// New instance of Router to work with
const router = new Router();

// ROUTES
// GET all posts
router.get('/', ctrl.getAll);

// GET one post with given id
router.get('/:id', ctrl.getById);

// POST => create a brand new post
router.post('/', ctrl.createPost);

// PUT => update the post with given id
router.put('/:id', ctrl.updatePost);

// DELETE => remove the post with given id
router.delete('/:id', ctrl.deletePost);

// Exporting
module.exports = router;
