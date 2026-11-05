<style scoped>
	
	.navbar{
		background-color: royalblue !important;
	}

	a{
		color: white !important;
	}

</style>

<template>
	
	<nav class="navbar navbar-expand-lg bg-body-tertiary">
	  <div class="container">
	    <a class="navbar-brand" href="#">Car Rental</a>
	    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
	      <span class="navbar-toggler-icon"></span>
	    </button>
	    <div class="collapse navbar-collapse" id="navbarNav">
	      <ul class="navbar-nav ms-auto">
	        <li class="nav-item">
	          <a class="nav-link active" aria-current="page" href="#">Home</a>
	        </li>
	        <li class="nav-item">
	          <a class="nav-link" href="#">Features</a>
	        </li>
	        <li class="nav-item">
	          <a class="nav-link" href="#">Pricing</a>
	        </li>
	        <li class="nav-item">
	          <a class="nav-link" href="#" @click="handleLogout">Logout</a>
	        </li>
	      </ul>
	    </div>
	  </div>
	</nav>

</template>

<script setup>
	
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';


	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})
	const { getUserDetails } = useGlobalStore();



	function handleLogout() {
		localStorage.removeItem('token');
		notyf.success('Logged out successfully');
		getUserDetails(null);
		router.push({ path: '/'});
	}

</script>