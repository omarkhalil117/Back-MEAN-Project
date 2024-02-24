const mongoose = require('mongoose');
const { autoInc }= require('auto-increment-group')

const schema = mongoose.Schema({
  ID :{
  type: String,
  },
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
  photo : String,
});

schema.plugin(autoInc,{
  field:'ID',
  unique:true,
  startAt:1,
  incrementBy: 1,
  groupBy:'firstName',
});

const Authors = mongoose.model('Authors', schema);

module.exports = Authors;
