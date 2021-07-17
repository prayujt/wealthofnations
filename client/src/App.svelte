<script>
	import Login from "./components/Login.svelte";
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
	import { Button, TextInput } from "carbon-components-svelte";
	export let database;

	let users = {};
	let id = "";
</script>

<svelte:head>
	<title>Game</title>
	<link
		rel="stylesheet"
		href="https://unpkg.com/carbon-components-svelte@0.30.0/css/white.css"
	/>
</svelte:head>

<main>
	<Login {database} />
</main>
