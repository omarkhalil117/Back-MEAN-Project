const bcrypt = require('bcrypt');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res, next) => {
  const {
    userName, firstName, lastName, email,
    password,

  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  res.status(201).json({ message: 'user registered successfully', newUser });
});

const login = catchAsync(async (req, res) => {

});

module.exports = {
  register, login,
};
