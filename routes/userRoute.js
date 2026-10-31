const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();


// Router for user registration
router.post('/register', userController.registerUser);


// Router for getting all users
router.get('/all', userController.allUser);








module.exports = router;