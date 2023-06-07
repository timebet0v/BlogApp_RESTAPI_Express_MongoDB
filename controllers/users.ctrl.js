const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('./error.ctrl').catchAsync;

// GET all users
const getAllUsers = catchAsync(async (req, res, next) => {
  const { limit } = req.query;

  let users = await UserModel.find()
    .limit(Number(limit) || 5)
    .select('username');
  return res.status(200).json({ results: users.length, data: users });
});

// GET user by ID
const getUserById = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new AppError('Not found any user with given id!', 404));
  }
  res.status(200).json({ success: true, data: user });
});

// UPDATE the existing user by id
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newRole = req.body.role || 'user';
  const updateData = {
    username: req.body.username,
    email: req.body.email,
    role: newRole,
    updatedAt: Date.now(),
  };

  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData);
  if (!updatedUser) {
    return next(new AppError('Not found any user with given id!', 404));
  }
  res.status(200).json({ message: 'User successfully updated!', updatedUser });
});

// DELETE the existing user by id
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('Not found any user with given id!', 404));
  }

  res.status(200).json({
    success: true,
    message: `User ${user.username} successfully deleted!`,
  });
});

// EXPORTING
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
