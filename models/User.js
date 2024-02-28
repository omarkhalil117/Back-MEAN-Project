const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter a userName 🙂"],
      unique: true,
      validate: {
        async validator(value) {
          const existingUser = await this.constructor.findOne({
            username: value,
          });
          return !existingUser;
        },
        message: "Please enter another username",
      },
    },
    firstName: {
      type: String,
      required: [true, "Please enter firstName"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter lastName"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "please enter a valid email",
        },
        {
          async validator(value) {
            const user = await this.constructor.findOne({ email: value });
            return !user;
          },
          message: "Email is already in use",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
      maxLength: 20,
      validate: {
        validator(value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long",
      },
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Books",
          unique: true,
        },
        shelve: {
          type: String,
          default: "Want to Read",
          enum: ["Want to Read", "Currently read", "Read"],
        },
        rating: {
          type: Number,
          default: 0,
        },
      },
    ],
    image: {
      type: String,
      //! make image required
    },
  },
  { timestamps: true }
);

userSchema.methods.correctPassword = function (comingPassword, realPassword) {
  return bcrypt.compare(comingPassword, realPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
