const Review = require("./../models/Review");
const AppError = require("../utils/appError");


exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findById(req.params.id);

    if (!reviews) {
      return next(new AppError("No reviews found", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        Review: newReview,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
