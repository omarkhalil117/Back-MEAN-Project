const router = require('express').Router();
const multer = require('multer');
const { register, login } = require('../controllers/authController');
const {
  addBookToUser,
  getAllUsersBooks,
  getUserBooksPop,
  updateUserBookShelve,
  getUser,
  updateUserRating,
} = require('../controllers/userController');

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

//! POST register
router.post(
  '/register',
  upload.single('image'),
  register,
);

//! Post login
router.post('/login', login);

//! user add book
router.patch('/:bookId', addBookToUser);

//! user get all his books
router.get('/books', getAllUsersBooks);

router.patch('/:id/book', updateUserRating);

router.patch('/:id/book/:bookId', updateUserBookShelve);

router.get('/:id/page/:num', getUserBooksPop);

router.get('/:userId', getUser);

module.exports = router;
