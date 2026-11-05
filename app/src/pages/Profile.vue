<style scoped>
	
	.col-12{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10%;
	}

	.profile-page{
		padding: 20px 50px 20px 50px;
		border: solid 1px lightgray;
		border-radius: 5px;
		background-color: whitesmoke;
	}

</style>

<template>
	
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<div class="profile-page">
					<h2>{{user.firstName}} {{user.lastName}}</h2>
					<p>{{user.email}}</p>
					<p>{{user.mobileNum}}</p>
					<hr>
					<div class="edit-profile">
						<button class="btn btn-primary" @click.prevent="showEditBox">Edit Profile <i class="bi bi-pencil-square"></i></button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<EditProfile v-if="displayEdit" />

</template>

<script setup>
	
	import { onMounted, ref } from 'vue';	
	import { useGlobalStore } from '../stores/global.js';
	import { useRouter } from 'vue-router';


	// Routes
	import EditProfile from '../components/EditProfile.vue';



	const { user } = useGlobalStore();
	const router = useRouter();


	const displayEdit = ref(false);





	async function showEditBox(){
		displayEdit.value = !displayEdit.value;
	}





	onMounted(() => {
		if (!user.token){
			router.push({ path: '/' })
		}
	})
</script>