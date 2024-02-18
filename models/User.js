const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please enter a userName 🙂'],
    unique: true,
    validate: {
      async validator(value) {
        const existingUser = await this.constructor.findOne({ username: value });
        return !existingUser;
      },
      message: 'Please enter another username',
    },
  },
  firstName: {
    type: String,
    required: [true, 'Please enter firstName'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter lastName'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [
      {
        validator: validator.isEmail,
        message: 'please enter a valid email',
      },
      {
        async validator(value) {
          const user = await this.constructor.findOne({ email: value });
          return !user;
        },
        message: 'Email is already in use',
      },
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    validate: {
      validator(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
          .test(value);
      },
      message: 'enter at least one number, one capital letter and one small letter and at least 8 character',
    },
  },
  //! waiting book schema
  image: {
    type: String,
    //! make image required
  },
});

module.exports = mongoose.model('User', userSchema);
