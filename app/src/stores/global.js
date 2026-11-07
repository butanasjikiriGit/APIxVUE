import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api.js';


export const useGlobalStore = defineStore('global', () => {

	let user = reactive({
		token: localStorage.getItem('token'),
		firstName: null,
		lastName: null,
		email: null,
		mobileNum: null,
		isAdmin: null
	})

	async function getUserDetails(token) {

		if (!token){
			user.token = null;
			user.firstName = null;
			user.lastName = null;
			user.email = null;
			user.mobileNum = null;
			user.isAdmin = null;

			return;
		}

		try {

			let { data } = await api.get('/users/details');

			user.token = token;
			user.firstName = data.firstName;
			user.lastName = data.lastName;
			user.email = data.email;
			user.mobileNum = data.mobileNum;
			user.isAdmin = data.isAdmin;

		} catch (error) {

			console.error('Failed to fetch user details', error);

		}

	}

	if (user.token) {
		getUserDetails(user.token);
	}

	return {
		user,
		getUserDetails
	}
})