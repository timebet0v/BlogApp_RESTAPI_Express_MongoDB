const { Router } = require('express');

// Importing the handlers
const ctrl = require('../controllers/posts.ctrl');
const authCtrl = require('../controllers/auth.ctrl');

// New instance of Router to work with
const router = new Router();

// ROUTES
router
  .route('/') // Route | Path
  .get(ctrl.getAllPosts) // GET all posts
  .post(authCtrl.protected, ctrl.createPost); // POST => create a brand new post

router
  .route('/:id') // Route | Path
  .get(ctrl.getPostById) // GET one post with given id
  .put(
    authCtrl.protected,
    authCtrl.restrictTo('user', 'admin'),
    ctrl.updatePost
  ) // PUT => update the post with given id
  .delete(
    authCtrl.protected,
    authCtrl.restrictTo('user', 'admin'),
    ctrl.deletePost
  ); // DELETE => remove the post with given id

// Exporting
module.exports = router;
