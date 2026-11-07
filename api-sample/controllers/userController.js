const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');
const { errorHandler } = require('../auth');


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
					return res.status(201).send({
						message: 'Registered successfully',
					});
				})
				.catch((err) => errorHandler(err, req, res));

			}
		})
		.catch((err) => errorHandler(err, req, res));

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




 
// Get All user (Admin only)
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





// Get specific user by Id (Admin only)
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





// Delete specific user (Admin only)
module.exports.deleteUser = (req, res) => {
	return User.findByIdAndDelete(req.params.id)
	.then((deleteUser) => {
		if (deleteUser){
			return res.status(200).send({
				message: `User ${deleteUser.firstName} successfully deleted`
			})
		} else {
			return res.status(404).send({
				message: 'User does not exist'
			})
		}
	})
	.catch((err) => errorHandler(err, req, res));
}





// Delete all user (Admin only)
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
	.catch((err) => errorHandler(err, req, res));
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
			return res.status(204).send({
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




// Turn user into admin by ID (Admin only)
module.exports.userToAdmin = (req, res) => {
	const userId = req.params.id;

	const adminData = {
		isAdmin: true
	}

	return User.findById(userId)
	.then((existingAdmin) => {
		if (existingAdmin.isAdmin === true){
			return res.status(200).send({
				message: `This user is already an ADMIN`
			})
		} else {

			return User.findByIdAndUpdate(userId, adminData, { new: true})
			.then((adminRes) => {
				if (adminRes){
					return res.status(200).send({
						message: `${adminRes.firstName} ${adminRes.lastName} is now ADMIN`
					})
				} else {
					return res.status(404).send({
						message: 'User does not exist'
					})
				}
			})
			.catch((err) => errorHandler(err, req, res));

		}
	})
	.catch((err) => errorHandler(err, req, res));

}





// Turn Admin into a User by ID (Admin only)
module.exports.adminToUser = (req, res) => {
	const userId = req.params.id;

	const adminData = {
		isAdmin: false
	}

	return User.findById(userId)
	.then((existingUser) => {
		if (existingUser.isAdmin === false){
			return res.status(200).send({
				message: `${existingUser.firstName} ${existingUser.lastName} is not ADMIN`
			})
		} else {

			return User.findByIdAndUpdate(userId, adminData, { returnDocument: 'after'})
			.then((userRes) => {
				if (userRes){
					return res.status(200).send({
						message: `${userRes.firstName} ${userRes.lastName} has been demoted from ADMIN role`
					})
				} else {
					return res.status(404).send({
						message: 'User does not exist'
					})
				}
			})
			.catch((err) => errorHandler(err, req, res));

		}
	})
	.catch((err) => errorHandler(err, req, res));
}




// Change password feature for both Admin and User
module.exports.changePassword = (req, res) => {
	const userId = req.user.id;
	
	const updatePass = {
		password: bcrypt.hashSync(req.body.password, 10)
	}

	return User.findById(userId)
	.then((passRes) => {
		if (bcrypt.compareSync(req.body.password, passRes.password)){
			return res.status(200).send({
				message: 'No change has been made, password is up to date'
			})
		} else {

			if (!req.body.password || req.body.password.length <= 8){
				return res.status(400).send({
					message: 'Password should contain greater than 8 characters'
				})
			} else {

				return User.findById(userId)
				.then((existing) => {
					if (!existing){
						return res.status(404).send({
							message: 'User does not exist'
						})
					} else {

						return User.findByIdAndUpdate(userId, updatePass, { new: true})
						.then((changePass) => {
							if (changePass){
								return res.status(200).send({
									message: 'Password updated successfully'
								})
							} else {
								return res.status(400).send({
									message: 'Change password failed'
								})
							}
						})
						.catch((err) => errorHandler(err, req, res));

					}
				})
				.catch((err) => errorHandler(err, req, res));

			}

		}
	})

}


// Get user details 
module.exports.userDetails = (req, res) => {
	const userId = req.user.id;

	return User.findById(userId)
	.select('-password')
	.then((detailsRes) => {
		if (!detailsRes) {
			return res.status(404).send({
				message: 'User does not exist'
			})
		} else {
			return res.status(200).send(detailsRes);
		}
	})
	.catch((err) => errorHandler(err, req, res));
}