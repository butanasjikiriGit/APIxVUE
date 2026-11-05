<style scoped>
	
	h1{
		display: flex;
		flex-direction: row;
	}

	p{
		margin-left: 20px;
		color: royalblue;
		text-shadow: 1px 1px 2px black;
	}

</style>

<template>

	<h1>Welcome <p>{{user.firstName}} {{user.lastName}}</p></h1>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global.js';


	const { user } = useGlobalStore();
	const router = useRouter();




	onMounted(() => {
		const token = localStorage.getItem('token');

		if (!token){
			router.push({ path: '/'})
		}
	})

</script>