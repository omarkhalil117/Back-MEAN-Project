const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllbooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router
  .route('/:id/reviews')
  .post(bookController.reviewBook);

module.exports = router;
