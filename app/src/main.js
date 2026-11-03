import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'notyf/notyf.min.css';

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createPinia } from 'pinia';
import { createRouter , createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Login',
			component: Login
		},
		{
			path: '/register',
			name: 'Register',
			component: Register
		},
		{
			path: '/home',
			name: 'Home',
			component: Home
		}
	]
});

// Routes
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Home from './pages/Home.vue';



const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');