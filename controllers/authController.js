//! built in util module that has a function make me promisify method
//! to make it return promise and can async/await it
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, {
  expiresIn: '1d',
});

// eslint-disable-next-line no-unused-vars
const register = catchAsync(async (req, res, next) => {
  let decoded
  let role
  if(req.headers.authorization !== 'Bearer null'){
     decoded = await promisify(jwt.verify)(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
     if(decoded.role === 'admin'){
      role = 'admin'
    }
  }
  if (req.file) {
    //! put photo url in body that will be sent to mongodb
    req.body.image = req.file.filename;
  }
  const {
    userName, firstName, lastName, email,
    password,image

  } = req.body;
  const newUser = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password,
    image,
    role,
  

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
  const { userName, password, role } = req.body;
  if (!userName || !password) {
    return next(new AppError('Please provide userName and password', 400));
  }
  //! 2) check if user exists and password is correct
  const user = await User.findOne({ userName }).select('+password');
  const correct = await user?.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }
  if(role === 'admin'  && user.role !== 'admin'){
    return next(new AppError(`Unauthorized as your are not ${req.body.role} 😒`, 401));
  }
  if(role === 'user' &&  user.role === 'admin'){
    return next(new AppError(`Unauthorized as your are not ${req.body.role} 😒`, 401));
  }
  //! 3) if okay send token
  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(user._id, user.role);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
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
