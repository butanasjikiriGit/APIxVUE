const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { verify, verifyAdmin } = require('../auth.js');


// Router for user registration
router.post('/register', userController.registerUser);

// Router for user login
router.post('/login', userController.loginUser);

// Router for getting user details
router.get('/details', verify, userController.userDetails);

// Router for updating user details
router.patch('/update-details', verify, userController.updateUserProfile);






module.exports = router;