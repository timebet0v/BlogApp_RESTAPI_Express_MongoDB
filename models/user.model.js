const crypto = require('crypto');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { catchAsync } = require('../controllers/error.ctrl');
const AppError = require('../utils/appError');

// Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Tell us your name.'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'We need your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minLegth: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
  role: {
    type: String,
    default: 'user',
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// Crypting password and getting rid of passwordConfirm field when saving the user data
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    return next(new AppError('Could not save the password!', 500));
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1000;
  next();
});

// Fetching only active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Checking if given password matches with actual one
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Checking if user credentials has changed after JWT issued
userSchema.methods.alteredPasswordAfterJWT = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp ? true : false;
  }

  // False means NOT changed
  return false;
};

// Generating Password reset token
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypting
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Setting timer for 10 minutes and afterwards token will be expired
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// EXPORTING
module.exports = model('User', userSchema);
