//! built in util module that has a function make me promisify method
//! to make it return promise and can async/await it
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: '1d',
});

const register = catchAsync(async (req, res, next) => {
  const {
    userName, firstName, lastName, email,
    password,

  } = req.body;
  const newUser = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password
  });
  //! once your register you are logged in
  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  //! 1) check if email and password exist in body
  const {email,password} = req.body
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //! 2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }//! 3) if okay send token
  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  return true;
});

const protect = catchAsync(async (req, res, next) => {
  //! 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    //! 401 data send correct but not enough to access
    return next(new AppError('You are not logged in !', 401));
  }
  //! 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //* when it decoded occure it throw two type of error
  //* 1) invalid signature (when some when change payload or jwt body)
  //! 3) Check if user still exists
  //* 2) if jwt expired
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }
  req.user = user;
  next();
  return true;
});

const specifyRole = (role) => (req, res, next) => {
  if (role === 'admin') {
    if (req.user.role === 'admin') {
      next();
    } else {
      next(new AppError('You are not an admin 😒', 403));
    }
  }
  if (role === 'user') {
    if (req.user.role === 'user') {
      next();
    } else {
      next(new AppError('You are not an user, please register', 403));
    }
  }
};

module.exports = {
  register, login, protect, specifyRole,
};
