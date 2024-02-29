const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

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
  const userWithHisBooks = await User.findById(req.body._id).populate('books');
  res.status(200).json({
    status: 'success',
    data: {
      user: userWithHisBooks,
    },
  });
});

const getUserBooksPop = catchAsync(async (req,res,next) => {
  const limit = 2;
  const page = req.params.num;
  const fullInfo = await User.aggregate([
  {$match: {_id: new mongoose.Types.ObjectId(req.params.id)}},
  {$project: {_id:0,books:1}},
  {$unwind:'$books'},
  {$lookup : { from:'books' , localField: 'books.book' , foreignField: '_id', as: 'book' } },
  {$unwind: '$book'},
  {$lookup : { from:'authors' , localField: 'book.authorID' , foreignField: '_id' , as: 'author' }},
  {$lookup : { from:'categories' , localField: 'book.categoryID' , foreignField: '_id' , as: 'category' }},
  {$group: { _id: { book:'$book' , author: '$author' ,category: '$category',shelve: '$books',} }},
  {$skip: page > 0 ? ( ( page - 1 ) * limit ) : 0},
  {$limit:limit}
  ]);

  res.json({
    fullInfo
  })
})

const updateUserBookShelve = catchAsync(async (req,res,next) => {
  const updatedShelve = await User.updateOne(
   { _id: req.params.id , 'books.book': req.params.bookId },
   { $set: { 'books.$.shelve': req.body.shelve } }
)
  res.json({message:"success" , updatedShelve});
})

const updateUserRating = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updatedUserRate = await User.findOneAndUpdate(
    { _id: req.params.id, "books.book": req.query.bookId },
    { $set: { "books.$.rating": req.body.rating } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Rating updated successfully",
  });
});

const getUser = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findById(req.params.userId);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

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
  let decoded
  let role
  console.log(req.headers.authorization)
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

module.exports = {
  addBookToUser, 
  getAllUsersBooks, 
  login, 
  getUserBooksPop, 
  register, 
  updateUserBookShelve,
  updateUserRating,
  getUser,
};