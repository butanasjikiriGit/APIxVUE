<template>
	<h1>Welcome to HomePage</h1>
	<button @click="handleLogout">Logout</button>
</template>

<script setup>
	
	import { onMounted } from 'vue';
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








	onMounted(() => {
		const token = localStorage.getItem('token');

		if (!token){
			router.push({ path: '/'})
		}
	})

</script>