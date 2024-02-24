const router = require('express').Router();
const { register, login } = require('../controllers/userController');

//! POST register
router.post('/register', register);

//! Post login
router.post('/login', login);

module.exports = router;
