const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  ratingBook: {
    type: Number,
  },
  reviewBook: {
    type: String,
  },
}, { _id: false });

const booksSchema = new mongoose.Schema({
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authors',
    // required: [true, 'Book must have an author'],
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    // required: [true, 'Book must have a category'],
  },
  name: {
    type: String,
    required: [true, 'Book must have a name'],
  },
  reviews: {
    type: [reviewsSchema],
  },
  avgRate: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  cover: {
    type: String,
    // required: [true, 'Book must have a cover'],
  },
  shelve: {
    type: String,
    enum: ['read', 'reading', 'want to read'],
  },
});

const Books = mongoose.model('Books', booksSchema);

module.exports = Books;
