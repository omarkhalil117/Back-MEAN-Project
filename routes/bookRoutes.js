const express = require('express');
const multer = require('multer');
const multer = require('multer');
const bookController = require('../controllers/bookController');
const auth = require('../controllers/authController');

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
  .get(auth.protect, bookController.getAllbooks)
  .post(auth.protect, auth.specifyRole('admin'), upload.single('cover'), bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(auth.protect, auth.specifyRole('admin'), upload.single('cover'), bookController.updateBook)
  .delete(auth.protect, auth.specifyRole('admin'), bookController.deleteBook);

router
  .route('/:id/reviews')
  .post(bookController.reviewBook);

module.exports = router;
