const mongoose = require('mongoose');

const schema = mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 30,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 30,
    minLength: 3,
    required: true,
  },
  dob: {
    type: Date,
  },
  photo: String,
});

const Authors = mongoose.model('Authors', schema);

module.exports = Authors;
