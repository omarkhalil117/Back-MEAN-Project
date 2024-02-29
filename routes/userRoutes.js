const router = require('express').Router();
const multer = require('multer');
const {
  register, login, protect, specifyRole,
} = require('../controllers/authController');
const {
  addBookToUser,
  getAllUsersBooks,
  getUserBooksPop,
  updateUserBookShelve,
  getUser,
  updateUserRating
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
router.patch('/:bookId', protect, specifyRole('user'), addBookToUser);

//! user get all his books
router.get('/books', protect, specifyRole('user'), getAllUsersBooks);

router.patch('/:id/book', protect ,updateUserRating);

router.patch('/:id/book/:bookId', protect, updateUserBookShelve);

router.get('/:id/page/:num', protect, getUserBooksPop);

router.get('/:userId', getUser);


module.exports = router;
