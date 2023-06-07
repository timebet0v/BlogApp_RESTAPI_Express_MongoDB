const { Router } = require('express');

// Importing the handlers
const ctrl = require('../controllers/profile.ctrl');

// New instance of Router to work with
const router = new Router();

// ROUTES
router
  .route('/')
  .get(ctrl.getSelf) // Get full info
  .put(ctrl.updateSelf) // Update info
  .patch(ctrl.updatePassword) // update password
  .delete(ctrl.deleteSelf); // delete self

// EXPORTING
module.exports = router;
