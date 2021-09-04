<script>
	import Login from './components/login/Login.svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
	import { io } from 'socket.io-client';

	let users = {};
	let id = '';
	let socket = io('localhost:8000');

	const preventLoad = (e) => {
		e.preventDefault();
	};
</script>

<svelte:head>
	<title>Game</title>
	<link
		rel="stylesheet"
		href="https://unpkg.com/carbon-components-svelte@0.30.0/css/white.css"
	/>
</svelte:head>

<main on:contextmenu={preventLoad}>
	<Login {socket} />
</main>

<style>
	main {
		margin: 0;
		padding: 0;
	}
</style>
