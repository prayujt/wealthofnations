<script>
	import Lobby from './Lobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';
	import { onMount } from 'svelte';

	export let socket;
	export let user;
	export let logout;

	let gameID;
	let inputGameID;
	let username;
	let usernameSubmitted = false;
	let inLobby = false;
	let isHost;
	let userID = user.id;

	onMount(async () => {
		document.getElementsByName('usernameBox')[0].focus();
	});

	const handleUsername = (e) => {
		if (e.which == 13) {
			e.preventDefault();
			setUsername();
		}
	};

	const handleID = (e) => {
		if (e.which == 13) {
			e.preventDefault();
			joinGame();
		}
	};

	const setUsername = () => {
		if (username != '') {
			usernameSubmitted = true;
			socket.uuid = userID;
			socket.username = username;
		} else {
			alert('Username cannot be empty!');
			document.getElementsByName('usernameBox')[0].focus();
		}
	};

	const joinGame = async () => {
		socket.emit(
			'joinGame',
			parseInt(inputGameID),
			userID,
			username,
			async (response) => {
				await response;
				if (response.status == false) {
					alert('Invalid Game Id!');
					document.getElementsByName('idBox')[0].focus();
				} else {
					socket.game = inputGameID;
					gameID = inputGameID;
					isHost = false;
					inLobby = true;
				}
			}
		);
	};

	const createGame = async () => {
		gameID = generateCode();
		socket.emit('createGame', gameID, userID, username, async (response) => {
			await response;
			console.log('response', response);
			if (response.status == true) {
				isHost = true;
				inLobby = true;
			}
		});
	};

	const generateCode = () => {
		return Math.floor(100000 + Math.random() * 900000);
	};
</script>

<div class="username-container">
	{#if !usernameSubmitted}
		<TextInput
			on:keydown={handleUsername}
			name="usernameBox"
			bind:value={username}
			labelText="Username"
			placeholder="Enter your username"
		/>
		<Button size="small" on:click={setUsername}>Next</Button>
	{:else if !inLobby}
		<TextInput
			on:keydown={handleID}
			name="idBox"
			autofocus
			bind:value={inputGameID}
			labelText="ID"
			placeholder="Enter game ID"
		/>
		<Button on:click={joinGame}>Join</Button>
		<Button on:click={createGame}>Create Game</Button>
		<Button
			kind="ghost"
			on:click={() => {
				logout();
			}}>Logout</Button
		>
		<br />
	{:else}
		<Lobby bind:inLobby {gameID} {socket} {isHost} {userID} {username} />
	{/if}
</div>

<style>
	.username-container {
	}
</style>
