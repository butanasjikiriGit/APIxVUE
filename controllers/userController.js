const User = require('../models/userModel.js');



// Controller for user registration
module.exports.registerUser = (req, res) => {

	if (!req.body.firstName || req.body.firstName === ""){
		return res.send({
			message: 'First name should not be empty'
		});
	} else if (!req.body.lastName || req.body.lastName === ""){
		return res.send({
			message: 'Last name should not be empty'
		});
	} else if (!req.body.email || !req.body.email.includes('@') || !req.body.email.includes('.com')){
		return res.send({
			message: 'email/gmail syntax should contain @ / .com'
		});
	} else if (!req.body.password || req.body.password.length <= 8){
		return res.send({
			message: 'The password should contain greater than 8 characters'
		});
	} else if (!req.body.mobileNum || req.body.mobileNum.length !== 11){
		return res.send({
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
					message: `User with (${existing.email}) email and (${existing.firstName}) as first name is already registed.`
				})
			} else {

				let newUser = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: req.body.password,
					mobileNum: req.body.mobileNum
				})

				return newUser.save()
				.then((result) => {
					res.send({
						message: 'Registered successfully',
					});
				})
				.catch((error) => {
					res.send({
						message: 'Register failed!',
					});
				})

			}
		})

	}

}





// Get All user
module.exports.allUser = (req, res) => {
	return User.find({})
	.select('-password')
	.then((result) => {
		if (!result){
			return res.send({
				message: 'No existing user!'
			})
		} else {
			return res.send({
				message: 'These are the following user',
				data: result
			})
		}
	})
	.catch((err) => err);
}