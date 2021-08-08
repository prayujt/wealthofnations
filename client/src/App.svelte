<script>
	import Login from './components/login/Login.svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
	export let database;

	let users = {};
	let id = '';

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
	<Login {database} />
</main>

<style>
	main {
		margin: 0;
		padding: 0;
	}
</style>
