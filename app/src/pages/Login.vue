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
		margin-bottom: 20px;
		position: relative;
	}

	label{
		position: absolute;
		left: 10px;
		top: 8px;
		color: lightslategray;
		transition: .2s;
		pointer-events: none;
	}

	.text-field{
		width: 100%;
		padding: 8px;
		font-size: 16px;
		border-radius: 3px;
		border: solid 1px lightgray;
		letter-spacing: 2px;
	}

	.text-field:focus ~ label, .text-field:not(:placeholder-shown) ~ label{
		top: -12px;
		font-size: 14px;
		padding: 2px 5px 2px 5px;
		background-color: white;
		color: royalblue;
		font-weight: bold;
	}

	.text-field:focus{
		outline-color: royalblue;
	}

	button{
		width: 100%;
		background-color: royalblue;
		color: white;
		letter-spacing: 2px;
		font-weight: 700;
		padding: 5px;
		border-radius: 3px;
		border: none;
		margin-top: 10px;
		animation: btn .5s;
		cursor: pointer;
	}

	.login-btn{
		background-color: indianred;
	}

	@keyframes btn{
		50%{
			transform: scale(1.1);
		},
		100%{
			transform: scale(0);
		}
	}

	.text-center{
		font-weight: bolder;
		letter-spacing: 5px;
		margin-bottom: 30px;
	}

	.register-link{
		display: flex;
		flex-direction: row;
		gap: 10px;
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
							<input type="text" id="email" v-model="email" class="text-field" required autocomplete="off" placeholder="">
							<label for="email">Email <i class="bi bi-envelope-fill ms-1"></i></label>
						</div>
						<div class="input-text">
							<input type="password" id="Password" v-model="password" class="text-field" required placeholder="">
							<label for="Password">Password <i class="bi bi-key-fill ms-1"></i></label>
						</div>
						<button type="submit" v-if="isEnable">Login <i class="bi bi-box-arrow-in-right"></i></button>
						<button type="submit" title="Please fill all fields before login" class="login-btn" v-else disabled>Login <i class="bi bi-exclamation-triangle"></i></button>
						<hr>
						<div class="register-link">
							<p>Don't have account? </p>
							<router-link :to="{path:'/register'}">Create account</router-link>
						</div>
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

			if (!email.value.includes('@') || !email.value.endsWith('.com')){
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

			notyf.error('Invalid email and password');

		}
	}

	onBeforeMount(() => {
		const token = localStorage.getItem('token');
		if (token){
			router.push({
				path: '/home'
			})
		}
	})

</script>