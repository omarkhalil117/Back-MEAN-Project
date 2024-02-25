const express = require("express");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();

router
  .route("/")
  .post(reviewController.createReview)
  .get(reviewController.getReviews);

module.exports = router;
