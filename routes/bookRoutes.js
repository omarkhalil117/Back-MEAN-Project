const express = require('express');
const multer = require('multer');
const bookController = require('../controllers/bookController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage });

router
  .route('/')
  .get((req, res, next) => {
    if (!req.query.page) {
      bookController.getAllbooks(req, res, next);
    } else {
      bookController.getBooksWithPagination(req, res, next);
    }
  })
  .post(upload.single('cover'), bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(upload.single('cover'), bookController.updateBook)
  .delete(bookController.deleteBook);

router.route('/:id/reviews').post(bookController.reviewBook);

module.exports = router;
