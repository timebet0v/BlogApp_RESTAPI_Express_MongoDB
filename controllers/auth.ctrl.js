const crypto = require('crypto');
const { promisify } = require('util');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { catchAsync } = require('./error.ctrl');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// SIGNING TOKEN
const singToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and then send JWT
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user._id);

  res.status(statusCode).json({ status: 'Success', token, data: user });
};

// REGISTERING a new user
const signUp = catchAsync(async (req, res, next) => {
  const newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  await newUser.save();
  createSendToken(newUser, 201, res);
});

// LOGGING IN
const logIn = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if user provided fields: username & password
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // Check if user exists and password is correct
  const user = await UserModel.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid user credentials!', 401));
  }

  // Success case
  createSendToken(user, 200, res);
});

// PROTECTING Routes
const protected = catchAsync(async (req, res, next) => {
  // Getting token and check if it's there
  let { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  // if token does not exist
  if (!token) {
    return next(
      new AppError('You are not logged in. Please, log in to get access!', 401)
    );
  }

  // Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // Check if user still exists
  const currentUser = await UserModel.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401
      )
    );
  }

  // Check if user has changed password after the token was issued
  if (currentUser.alteredPasswordAfterJWT(decode.iat)) {
    return next(
      new AppError(
        'User recently has changed password! Please, log in again!',
        401
      )
    );
  }

  // Access
  req.user = currentUser;
  next();
});

// Putting limits on the routes
const restrictTo = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }

    next();
  };
};

// Generating new password token and sending to user via email
const forgotPassword = catchAsync(async (req, res, next) => {
  // Fetching the user via email field
  const user = await UserModel.findOne({ email: req.body.email });
  // If the user does no longer exist!
  if (!user) {
    return next(new AppError('The user with this email does not exist!', 404));
  }

  // Creating password reset token for 10 Minutes
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Making the URL to reset password with token
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  // Message to send in mail
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}.\nIf you did not forget your password, please ignore this email!`;

  // Try to send mail
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes).',
      message,
    });

    // Response to the client
    res.status(200).json({
      status: 'success',
      message: `Token sent to EMAIL: ${user.email}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error while sending the email. Try again later!',
        500
      )
    );
  }
});

// Resetting password functionality
const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // If the token has not expired yet, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // Removing reset token
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

// EXPORTING
module.exports = {
  createSendToken,
  signUp,
  logIn,
  protected,
  restrictTo,
  forgotPassword,
  resetPassword,
};
