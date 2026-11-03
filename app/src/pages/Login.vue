<style scoped>
	
	.row{
		display: flex;
		justify-content: center;
	}

	.inner-login{
		padding: 20px;
		border: solid 1px lightgray;
		border-radius: 10px;
		position: relative;
	}

	.input-text{
		width: 100%;
		margin-bottom: 10px;
	}

	label{
		
	}

	.text-field{
		width: 100%;
		padding: 5px;
		font-size: 16px;
		border: none;
		border-bottom: solid 1px lightgray;
	}

	.text-field:focus {
		outline: none;
	}

	button{
		width: 100%;
		background-color: royalblue;
		color: white;
		letter-spacing: 5px;
		font-weight: 700;
		padding: 5px;
		border-radius: 5px;
		border: none;
		margin-top: 10px;
	}

	.text-center{
		font-weight: bolder;
		letter-spacing: 5px;
	}

</style>
<template>
	
	<div class="container-fluid p-5">
		<div class="row">
			<div class="col-3">
				<form @submit.prevent="handleSubmit">
					<div class="inner-login">
						<h1 class="text-center">Login</h1>
						<div class="input-text">
							<label for="email">Email:</label>
							<input type="text" id="email" v-model="email" class="text-field" required autocomplete="off">
						</div>
						<div class="input-text">
							<label for="Password">Password:</label>
							<input type="password" id="Password" v-model="password" class="text-field" required>
						</div>
						<button type="submit" v-if="isEnable">Login</button>
						<button type="submit" class="bg-danger" v-else disabled>Login</button>
					</div>
				</form>
			</div>
		</div>
	</div>

</template>

<script setup>
	
	import { ref, watch, onBeforeMount } from 'vue';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';
	import api from '../api.js';
	import { useRouter } from 'vue-router';

	const email = ref("");
	const password = ref("");
	const isEnable = ref(false);

	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	});
	const { getUserDetails, user } = useGlobalStore();

	watch([email, password], (currentValue, oldValue) => {
		if (currentValue.every(input => input !== "")){
			isEnable.value = true;
		} else {
			isEnable.value = false;
		}
	})

	async function handleSubmit() {
		try{

			if (!email.value.includes('@') || !email.value.includes('.com')){
				notyf.error('Invalid email format');
				return;
			} 

			let response = await api.post('/users/login', {
				email: email.value,
				password: password.value
			})



			if (response.data) {

				notyf.success(response.data.message);
				localStorage.setItem('token', response.data.access);

				getUserDetails(response.data.access);

				email.value = "";
				password.value = "";

				router.push({
					path: '/home'
				})

			}

		}catch(e){

			notyf.error('Login Failed. Please contact administrator.');

		}
	}

	onBeforeMount(() => {
		if (user.token){
			router.push({
				path: '/home'
			})
		}
	})

</script>