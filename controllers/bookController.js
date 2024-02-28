const Book = require('../models/Book');
const AppError = require('../utils/appError');

// eslint-disable-next-line consistent-return
exports.getAllbooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('authorID');

    if (!books || books.length === 0) {
      return next(new AppError('No books found', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError('No book found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
  return true;
};

exports.createBook = async (req, res) => {
  try {
    if (req.file) {
      //! put photo url in body that will be sent to mongodb
      req.body.cover = req.file.filename;
    }
    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        Book: newBook,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.deleteBook = async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return next(new AppError('No book found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.updateBook = async (req, res, next) => {
  try {
    if (req.file) {
      //! put photo url in body that will be sent to mongodb
      req.body.cover = req.file.filename;
    }
    // const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
    const updatedBook = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return next(new AppError('No book found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedBook,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.reviewBook = async (req, res, next) => {
  try {
    const { ratingBook, reviewBook } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }

    const review = {
      ratingBook: Number(ratingBook),
      reviewBook,
    };

    book.reviews.push(review);
    if (book.reviews.length === 0) {
      book.avgRate = 0;
    } else {
      book.avgRate = book.reviews.reduce((total, item) => total + item.ratingBook, 0)
        / book.reviews.length;
    }

    res.status(201).json({
      message: 'Book has a review now',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.reviewBook = async (req, res, next) => {
  try {
    const { ratingBook, reviewBook } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }

    const review = {
      ratingBook: Number(ratingBook),
      reviewBook,
    };

    book.reviews.push(review);
    if (book.reviews.length === 0) {
      book.avgRate = 0;
    } else {
      book.avgRate = book.reviews.reduce((total, item) => total + item.ratingBook, 0)
        / book.reviews.length;
    }

    res.status(201).json({
      message: 'Book has a review now',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
