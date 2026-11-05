import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api.js';

export const useGlobalStore = defineStore('global', () => {
	let user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null
	});

	async function getUserDetails(token) {
		if(!token) {
			user.token = null;
			user.email = null;
			user.isAdmin = null;
			user.firstName = null;
			user.lastName = null;
			user.mobileNum = null

			return;
		}

		let { data } = await api.get('/users/details');

		user.token = token;
		user.email = data.email;
		user.isAdmin = data.isAdmin;
		user.firstName = data.firstName;
		user.lastName = data.lastName;
		user.mobileNum = data.mobileNum;
	}

	return {
		user,
		getUserDetails
	}
})