const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('./error.ctrl').catchAsync;
const { createSendToken } = require('./auth.ctrl');

// Filtering the gaining object from body
const filterObj = (obj, ...fields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Getting full info about current user
const getSelf = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('You are not logged in!', 404));
  }

  res.status(200).json({
    user,
  });
};

// Updating the current logged in USER credentials
const updateSelf = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for the update password!', 400)
    );
  }

  const filteredBody = filterObj(req.body, 'username', 'email');
  filteredBody['updatedAt'] = Date.now();

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'Success',
    data: { updatedUser },
  });
});

// Deleting the current logged in USER
const deleteSelf = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

// change password
const updatePassword = catchAsync(async (req, res, next) => {
  // Getting user from database
  const user = await UserModel.findById(req.user.id).select('+password');
  // Check if user password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  // Updating password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // Log the user in and send JWT
  createSendToken(user, 200, res);
});

// EXPORTING
module.exports = {
  getSelf,
  updateSelf,
  updatePassword,
  deleteSelf,
};
