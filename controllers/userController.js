const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');


// Controller for user registration
module.exports.registerUser = (req, res) => {

	if (!req.body.firstName || req.body.firstName === ""){
		return res.status(400).send({
			message: 'First name should not be empty'
		});
	} else if (!req.body.lastName || req.body.lastName === ""){
		return res.status(400).send({
			message: 'Last name should not be empty'
		});
	} else if (!req.body.email || !req.body.email.includes('@') || !req.body.email.includes('.com')){
		return res.status(400).send({
			message: 'email/gmail syntax should contain @ / .com'
		});
	} else if (!req.body.password || req.body.password.length <= 8){
		return res.status(400).send({
			message: 'The password should contain greater than 8 characters'
		});
	} else if (!req.body.mobileNum || req.body.mobileNum.length !== 11){
		return res.status(400).send({
			message: 'Mobile number should be 11 digits in total'
		})
	} else {

		return User.findOne({
			$or: [
				{email: req.body.email},
				{firstName: req.body.firstName}
			]
		})
		.then((existing) => {
			if (existing){
				res.send({
					message: `User with (${existing.email}) email and (${existing.firstName}) as first name is already registered.`
				})
			} else {

				let newUser = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: bcrypt.hashSync(req.body.password, 10),
					mobileNum: req.body.mobileNum
				})

				return newUser.save()
				.then((result) => {
					res.send({
						message: 'Registered successfully',
					});
				})
				.catch((error) => {
					return res.send({
						message: 'Register failed!',
					});
				})

			}
		})

	}

}





// Function for user login
module.exports.loginUser = (req, res) => {

	if (!req.body.email || !req.body.email.includes("@") || !req.body.email.includes('.com')){
		res.status(400).send({
			message: 'Invalid email format'
		})
	} else if (!req.body.password){
		res.status(400).send({
			message: 'Please input a password'
		})
	} else {
		return User.findOne({ email: req.body.email})
		.then((result) => {
			if (!result){
				res.status(404).send({
					message: 'No user found in this email'
				})
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
				if (isPasswordCorrect){
					return res.status(200).send({
						message: 'Logged in successfully',
						access: auth.createAccessToken(result)
					})
				} else {
					return res.status(401).send({
						message: 'Incorrect email or password'
					})
				}
			}
		})
		.catch((err) => {
			return res.status(500).send({
				message: `Server error during login: ${err}`
			})
		})
	}

}





// Get All user
module.exports.allUser = (req, res) => {
	return User.find({})
	.select('-password')
	.then((result) => {
		if (result.length === 0){
			return res.status(404).send({
				message: 'No existing user!'
			})
		} else {
			return res.status(200).send({
				message: 'These are the following user',
				data: result
			})
		}
	})
	.catch((err) => err);
}





// Get specific user by Id
module.exports.getUser = (req, res) => {
	return User.findById(req.params.id)
	.then((findUserRes) => {
		if (findUserRes){
			return res.status(200).send({
				message: `User ${findUserRes.firstName} ${findUserRes.lastName} found`,
				info: findUserRes
			})
		} else {
			return res.status(404).send({
				message: 'User does not exist'
			})
		}
	})
	.catch((err) => {
		return res.status(500).send({
			message: `Server error ${err}`
		})
	});
}





// Delete all user
module.exports.deleteAll = (req, res) => {
	return User.deleteMany({isAdmin: false})
	.then((deleteRes) => {
		if (deleteRes.deletedCount !== 0){
			return res.status(200).send({
				message: 'All existing user cleared!'
			})
		} else {
			return res.status(404).send({
				message: 'No existing user'
			})
		}
	})
	.catch((err) => {
		res.status(500).send({
			message: `Server error ${err}`
		})
	})
}




// Update user profile/info/details
module.exports.updateProfile = (req, res) => {
	const userId = req.user.id

	const updateInfo = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		mobileNum: req.body.mobileNum
	}

	return User.findById(userId)
	.then((isExisting) => {
		if (isExisting.firstName === req.body.firstName && isExisting.lastName === req.body.lastName && isExisting.mobileNum === req.body.mobileNum){
			return res.status(200).send({
				message: 'No change made, profile is already up to date'
			})
		} else {

			if (!req.body.firstName || req.body.firstName === ""){
				return res.status(400).send({
					message: 'Please fill in the first name'
				})
			} else if (!req.body.lastName || req.body.lastName === ""){
				return res.status(400).send({
					message: 'Please fill in the last name'
				})
			} else if (!req.body.mobileNum || req.body.mobileNum.length !== 11){
				return res.status(400).send({
					message: 'Invalid number format'
				})
			} else {

				return User.findByIdAndUpdate(userId, updateInfo, { new: true })
				.then((userRes) => {
					if (!userRes){
						return res.status(404).send({
							message: 'User does not exist'
						})
					} else {
						return res.status(200).send({
							message: `Profile updated successfully`,
							Info: userRes 
						})
					}
				})
				.catch((err) => errorHandler(err, req, res));

			}

		}
	})

}