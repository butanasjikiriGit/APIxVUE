const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();
const { verify, verifyAdmin } = require('../auth.js');


// Router for user registration
router.post('/register', userController.registerUser);


// Router for login
router.post('/login', userController.loginUser);


// Router for getting all users
router.get('/all', verify, verifyAdmin, userController.allUser);


// Router for getting specific user buy ID
router.get('/get-user/:id', verify, verifyAdmin, userController.getUser);


// Router for deleting all existing users
router.delete('/delete', verify, verifyAdmin, userController.deleteAll);


// Router for updating user information
router.put('/update', verify, userController.updateProfile);








module.exports = router;