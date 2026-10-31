const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'username is required']
	},
	lastName: {
		type: String,
		required: [true, 'lastname is required']
	},
	email: {
		type: String,
		required: [true, 'email is required']
	},
	password: {
		type: String,
		required: [true, 'password is required']
	},
	mobileNum: {
		type: String,
		required: [true, 'mobile number is required']
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);