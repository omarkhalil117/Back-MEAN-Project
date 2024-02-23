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
  dob: Date,
  photo: String,
});

const Authors = mongoose.model('Authors', schema);

module.exports = Authors;
