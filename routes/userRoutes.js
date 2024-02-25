const router = require('express').Router();
const { register, login , getAllUsersBooks , getUserBooksPop , updateUserBookShelve} = require('../controllers/userController');

//! POST register
router.post('/register', register);

//! Post login
router.post('/login', login);

router.get('/books', getAllUsersBooks);

router.patch('/:id/book/:bookId', updateUserBookShelve);

router.get('/:id', getUserBooksPop);


module.exports = router;
