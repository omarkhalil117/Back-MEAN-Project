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

// eslint-disable-next-line no-unused-vars
const getAllUsersBooks = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  const userWithHisBooks = await User.findById(req.user._id).populate('books');
  res.status(200).json({
    status: 'success',
    data: {
      user: userWithHisBooks,
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  console.log(555555555555, req.params);
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findById(req.params.userId);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

module.exports = {
  addBookToUser, getAllUsersBooks, getUser,
};
