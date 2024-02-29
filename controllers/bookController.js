const Book = require("../models/Book");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Author = require("../models/Author");

exports.getBooksWithPagination = catchAsync(async (req, res, next) => {
  const page = (req.params.page - 1 ) || 0;
  const limit = 8;
  const skip = page * limit;
  const books = await Book.find({})
    .populate({
      path: 'authorID',
      model: Author,
      select: 'firstName lastName',
    })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    result: books.length,
    data: {
      books,
    },
  });
  return true;
});

exports.getAllbooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('categoryID').populate('authorID');
    console.log(books);

    res.status(200).json({
      status: 'success',
      data: {
        books,
      },
    });
    next();
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
    next()
  }
};

// eslint-disable-next-line consistent-return
exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate("authorID")
    .populate("categoryID");
    
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
  return true;
});

exports.createBook = catchAsync(async (req, res) => {
  if (req.file) {
    //! put photo url in body that will be sent to mongodb
    req.body.cover = req.file.filename;
  }
  let newBook = await Book.create(req.body);
  newBook = await Book.findById(newBook._id)
  .populate("authorID")
  .populate("categoryID");
  res.status(201).json({
    status: "success",
    data: {
      Book: newBook,
    },
  });
});

// eslint-disable-next-line consistent-return
exports.deleteBook = catchAsync(async (req, res, next) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);

  if (!deletedBook) {
    return next(new AppError("No book found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Book deleted successfully",
  });
});

// eslint-disable-next-line consistent-return
exports.updateBook = catchAsync(async (req, res, next) => {
  if (req.file) {
    //! put photo url in body that will be sent to mongodb
    req.body.cover = req.file.filename;
  }
  // const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
  const updatedBook = await Book.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
    }
  );

  if (!updatedBook) {
    return next(new AppError("No book found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedBook,
    },
  });
});

exports.reviewBook = catchAsync(async (req, res, next) => {
  const { ratingBook, reviewBook } = req.body;

  const book = await Book.findById(req.params.id);

  const review = {
    ratingBook: Number(ratingBook),
    reviewBook,
  };

  book.rating = book.reviews.length + 1;

  book.reviews.push(review);
  if (book.reviews.length === 0) {
    book.avgRate = 0;
  } else {
    book.avgRate = (
      book.reviews.reduce((total, item) => total + item.ratingBook, 0) /
      book.reviews.length
    ).toFixed();
  }

  await book.save();
  res.status(201).json({
    message: "Book has a review now",
  });
});
