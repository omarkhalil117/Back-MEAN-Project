const mongoose = require('mongoose');
const { autoInc }= require('auto-increment-group')

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
  ID: {
    type: String,
  },
});

schema.plugin(autoInc, {
  field: 'ID',
  unique: true,
  digits: 1,
  startAt: 1,
  incrementBy: 1,
});

const Authors = mongoose.model('Authors', schema);

module.exports = Authors;
