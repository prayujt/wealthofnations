<script>
	import Auth from "./auth/Auth.svelte";
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
	import { Button, TextInput } from "carbon-components-svelte";
	export let database;

	var gameStarted = false;
	let username;
	var color;
	let users = {};
	let id = "";

	$: checkOnline();

	const initialize = (id_) => {
		id = id_;
		color =
			"#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
		database.ref("users/" + id).set({
			x: Math.floor(Math.random() * 1000),
			y: Math.floor(Math.random() * 1000),
			color: color,
			username: username,
		});
		setInterval(checkOnline, 1000);
		gameStarted = true;
	};

	const checkOnline = () => {
		console.log("checking");
		if (!(id == "")) {
			database.ref("temp/" + id).once("value", (snapshot) => {
				if (snapshot.exists()) {
					database.ref("temp/" + id).remove();
					return true;
				} else return false;
			});
		} else return false;
	};

	const deleteUser = () => {
		if (!(id == "")) database.ref("users/" + id).remove();
	};

	const handleUnload = (event) => {
		database
			.ref("users/" + id)
			.once("value")
			.then((snap) => {
				database.ref("temp/" + id).set(snap.val());
			});
	};

	const handleKeydown = (event) => {
		let key = event.key;
		let pixels = 20;
		if (key == "s" && gameStarted) {
			database.ref("users/" + id).transaction((user) => ({
				...user,
				y: user.y + pixels,
			}));
		} else if (key == "w" && gameStarted) {
			database.ref("users/" + id).transaction((user) => ({
				...user,
				y: user.y - pixels,
			}));
		} else if (key == "d" && gameStarted) {
			database.ref("users/" + id).transaction((user) => ({
				...user,
				x: user.x + pixels,
			}));
		} else if (key == "a" && gameStarted) {
			database.ref("users/" + id).transaction((user) => ({
				...user,
				x: user.x - pixels,
			}));
		}
	};

	database.ref("users").on("value", (snapshot) => {
		const data = snapshot.val();
		users = Object.keys(data ? data : []).map((k) => ({
			...data[k],
		}));
	});
</script>

<svelte:head>
	<title>Game</title>
	<link
		rel="stylesheet"
		href="https://unpkg.com/carbon-components-svelte@0.30.0/css/white.css"
	/>
</svelte:head>

<main>
	<Auth useRedirect={true} let:user let:loggedIn let:loginWithGoogle let:logout>
		{#if !loggedIn}
			<Button kind="ghost" on:click={loginWithGoogle}
				>Sign in with Google</Button
			>
		{:else}
			{#if !gameStarted}
				<TextInput
					id="username"
					bind:value={username}
					labelText="Username"
					helperText="You can change this at any time"
					placeholder="Enter user name..."
				/>
				<br /><br />
				<Button kind="ghost" on:click={initialize(user.id)}>Start</Button>
			{:else}
				{#each users as player}
					<span
						class="dot"
						style="background-color:{player.color}; position: absolute; left: {player.x}px; top: {player.y}px"
						>{player.username}</span
					>
				{/each}
			{/if}
			<Button
				kind="ghost"
				on:click={() => {
					deleteUser();
					logout();
				}}>Logout</Button
			>
		{/if}
	</Auth>
</main>

<svelte:window on:unload={handleUnload} on:keydown={handleKeydown} />

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.dot {
		height: 50px;
		width: 50px;
		border-radius: 50%;
		display: inline-block;
	}
</style>
