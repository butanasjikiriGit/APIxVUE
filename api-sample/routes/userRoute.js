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


// Router for getting specific user by ID
router.get('/get-user/:id', verify, verifyAdmin, userController.getUser);


// Router for deleting specific user by ID
router.delete('/delete-user/:id', verify, verifyAdmin, userController.deleteUser);


// Router for deleting all existing users
router.delete('/delete-all', verify, verifyAdmin, userController.deleteAll);


// Router for updating user information
router.put('/update', verify, userController.updateProfile);


// Router for making User into Admin by ID
router.put('/user-to-admin/:id', verify, verifyAdmin, userController.userToAdmin);


// Router for making Admin into User by ID
router.put('/admin-to-user/:id', verify, verifyAdmin, userController.adminToUser);


// Router for changes password
router.put('/changepass', verify, userController.changePassword);


// Router for get user details
router.get('/details', verify, userController.userDetails);











module.exports = router;