const { Router } = require('express');

// Controller
const ctrl = require('../controllers/users.ctrl');
const authCtrl = require('../controllers/auth.ctrl');

// INSTANCE of Router
const router = new Router();

// ROUTES
router.get('/', ctrl.getAllUsers); // Fetch all users

router
  .route('/:id') // Path with param id
  .get(ctrl.getUserById) // Get User by ID
  .patch(authCtrl.restrictTo('admin'), ctrl.updateUser) // Update User by ID
  .delete(authCtrl.restrictTo('admin'), ctrl.deleteUser); // Remove User by ID

module.exports = router;
