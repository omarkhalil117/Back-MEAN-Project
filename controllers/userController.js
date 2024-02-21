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
  const userWithHisBooks = await User.findById(req.user._id).populate('books');
  res.status(200).json({
    status: 'success',
    data: {
      user: userWithHisBooks,
    },
  });
});

module.exports = {
  addBookToUser, getAllUsersBooks,
};
