const router = require('express').Router();
const {
  register, login, protect, specifyRole,
} = require('../controllers/authController');
const { addBookToUser, getAllUsersBooks, getUserBooksPop, updateUserBookShelve } = require('../controllers/userController');

//! POST register
router.post('/register', register);

//! Post login
router.post('/login', login);

//! user add book
router.patch('/:bookId', protect, specifyRole('user'), addBookToUser);

//! user get all his books
router.get('/books', protect, specifyRole('user'), getAllUsersBooks);

router.patch('/:id/book/:bookId', updateUserBookShelve);

router.get('/:id', getUserBooksPop);

module.exports = router;
