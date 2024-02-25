const mongoose = require('mongoose');
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const booksSchema = new mongoose.Schema({
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authors',
    required: [true, 'Book must have an author'],
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Book must have a category'],
  },
  name: {
    type: String,
    required: [true, 'Book must have a name'],
  },
  avgRate: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  cover: {
    type: String,
    required: [true, 'Book must have a cover'],
  },
  shelve: {
    type: String,
    enum: ['read', 'reading', 'want to read'],
  },
});

// Increment id of the book
// booksSchema.plugin(AutoIncrement, { inc_field: "id" });

const Books = mongoose.model('Books', booksSchema);

module.exports = Books;
