<style scoped>
	
	.col-12{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
	}

	.edit-profile{
		padding: 20px;
		width: 450px;
		border: solid 1px lightgray;
		border-radius: 5px;
		position: relative;
	}


	.text-box{
		width: 100%;
		position: relative;
		margin-bottom: 20px;
	}

	input{
		width: 100%;
		padding: 8px;
		border-radius: 3px;
		border: solid 1px lightgray;
	}

	label{
		position: absolute;
		left: 10px;
		top: 10px;
		color: gray;
		transition: .2s ease;
		pointer-events: none;
	}

	input:focus ~ label, input:not(:placeholder-shown) ~ label{
		top: -10px;
		font-size: 14px;
		color: royalblue;
		font-weight: bold;
		padding: 0px 3px 0px 3px;
		background-color: white;
	}

	input:focus{
		outline-color: royalblue;
	}

</style>

<template>
	
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<form @submit.prevent="handleEditProfile">
					<div class="edit-profile">
						<div class="text-box">
							<input type="text" id="firstname" v-model="firstName" required placeholder="" autocomplete="off">
							<label for="firstname">Firstname</label>
						</div>
						<div class="text-box">
							<input type="text" id="lastname" v-model="lastName" required placeholder="" autocomplete="off">
							<label for="lastname">Lastname</label>
						</div>
						<div class="text-box">
							<input type="text" id="number" v-model="mobileNum" required placeholder="" autocomplete="off">
							<label for="number">Mobile no:</label>
						</div>
						<button class="btn btn-primary" v-if="isEnabled">Save <i class="bi bi-save"></i></button>
						<button class="btn btn-danger" disabled v-else>Save <i class="bi bi-save"></i></button>
					</div>
				</form>
			</div>
		</div>
	</div>

</template>

<script setup>
	
	import { ref, watch } from 'vue';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';
	import { useRouter } from 'vue-router';
	import api from '../api.js';



	const { user } = useGlobalStore();
	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})


	const firstName = ref('');
	const lastName = ref('');
	const mobileNum = ref('');
	const isEnabled = ref(false);

	const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
	const numberRegex = /^\d+$/;

	watch([firstName, lastName, mobileNum], (currentValue, oldValue) => {
		if (currentValue.every((input) => input !== "")){
			isEnabled.value = true;
		} else {
			isEnabled.value = false;
		}
	})


	async function handleEditProfile(){
		try {

			if (!nameRegex.test(firstName.value) || !nameRegex.test(lastName.value)){
				notyf.error('Firstname and lastname should not contain numbers');
				return;
			} else if (!numberRegex.test(mobileNum.value)){
				notyf.error('Mobile number should contain numbers only');
				return;
			} else if (!mobileNum.value.startsWith("09")){
				notyf.error('Invalid number format, should start with 09');
				return;
			} else if (mobileNum.value.length !== 11){
				notyf.error('Please enter a valid 11-digit mobile number');
				return;
			}


			let response = await api.put('/users/update', {
				firstName: firstName.value,
				lastName: lastName.value,
				mobileNum: mobileNum.value
			})


			if (response.status === 200){

				notyf.success('Profile updated successfully');

				firstName.value = "";
				lastName.value = "";
				mobileNum.value = "";

				router.push({ path: '/profile'})

			} else {
				notyf.error('Failed to update profile');
			}



		} catch (err) {
			
			if (err.response.status === 204){
				notyf.error(err.response.data.message);
			} else {
				notyf.error('Failed to update profile, Please contact administrator');
			}

		}
	}



</script>