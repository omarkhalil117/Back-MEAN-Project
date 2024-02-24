const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const addBookToUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findOneAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: req.user._id },

    //! Do not add book twice if o do that iwill igonre second add but i will not throw an error
    { $addToSet: { books: req.params.bookId } },
    { new: true },
  );
  if (!updatedUser) {
    return next(new AppError('no user found, you are not logged in'), 401);
  }

  res.status(200).json({
    status: 'success',
    message: 'Book added to user successfully',
    data: {
      user: updatedUser,
    },
  });
  return true;
});

const getAllUsersBooks = catchAsync(async (req, res, next) => {
  console.log("books")
  const userWithHisBooks = await User.findById(req.body._id).populate('books');
  res.status(200).json({
    status: 'success',
    data: {
      user: userWithHisBooks,
    },
  });
});

const  getUserBooksPop = catchAsync(async (req,res,next) => {
  console.log("books pop")
  const fullInfo = await User.findById(req.params.id)
  .populate({
    path : 'books.book',
    populate : [
      {path:'authorID' , model:'Authors'},
      {path:'categoryID' , model:'Category'}
    ] 
    })

  res.json({
    fullInfo
  })
})

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, {
  expiresIn: '1d',
});

const login = catchAsync(async (req, res, next) => {
  //! 1) check if email and password exist in body
  const { userName, password } = req.body;
  if (!userName || !password) {
    return next(new AppError('Please provide userName and password', 400));
  }
  //! 2) check if user exists and password is correct
  const user = await User.findOne({ userName }).select('+password');
  const correct = user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }//! 3) if okay send token
  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(user._id, user.role);
  res.status(200).json({
    status: 'success',
    token,
  });
  return true;
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
    password,
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

module.exports = {
  addBookToUser, getAllUsersBooks, login, getUserBooksPop, register
};