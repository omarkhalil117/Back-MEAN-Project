const router = require('express').Router();
const {
  register, login, protect, specifyRole,
} = require('../controllers/authController');
const { addBookToUser, getAllUsersBooks } = require('../controllers/userController');

//! POST register
router.post('/register', register);

//! Post login
router.post('/login', login);

//! user add book
router.patch('/:bookId', protect, specifyRole('user'), addBookToUser);

//! user get all his books
router.get('/books', protect, specifyRole('user'), getAllUsersBooks);

module.exports = router;
