const Book = require('../models/Book');
const AppError = require('../utils/appError');

exports.getAllbooks = async (req, res, next) => {
  try {
    const books = await Book.find();

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

exports.updateBook = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params.id);

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
