<script setup>

import NavbarComponent from './pages/NavbarComponent.vue';
import { useGlobalStore } from './stores/global.js';
import { onBeforeMount } from 'vue';

const { getUserDetails } = useGlobalStore();

onBeforeMount(() => {
  getUserDetails(localStorage.getItem('token'));
})



</script>

<template>

  <NavbarComponent />

  <router-view />

</template>
