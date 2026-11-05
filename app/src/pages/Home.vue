<template>
	<Navbar />
	<h1>Welcome to HomePage</h1>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import Navbar from '../components/Navbar.vue';



	const router = useRouter();




	onMounted(() => {
		const token = localStorage.getItem('token');

		if (!token){
			router.push({ path: '/'})
		}
	})

</script>