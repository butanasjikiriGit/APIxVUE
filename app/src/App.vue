<script setup>

import Navbar from './components/Navbar.vue';
import { useGlobalStore } from './stores/global.js';
import { onBeforeMount } from 'vue';

const { getUserDetails, user } = useGlobalStore();

onBeforeMount(() => {
  getUserDetails(localStorage.getItem('token'));
})



</script>

<template>

  <Navbar v-if="user.email" />
  <router-view />

</template>
