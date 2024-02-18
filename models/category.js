const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

 

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ID: {
    type: Number,
    required: true
  }
});

 

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
