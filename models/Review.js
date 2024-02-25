const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    reviewBook: {
      type: String,
    },
    bookID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: [true, "Review must have a book"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
