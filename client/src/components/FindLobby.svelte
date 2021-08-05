<script>
	import Lobby from './Lobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';
	import { onMount } from 'svelte';

	export let database;
	export let user;
	export let logout;

	let gameID;
	let inputGameID;
	let username;
	let usernameSubmitted = false;
	let inLobby = false;
	let isHost;
	let userID = user.id;

	onMount(() => {
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
		} else {
			alert('Username cannot be empty!');
			document.getElementsByName('usernameBox')[0].focus();
		}
	};

	const joinGame = () => {
		database
			.ref('lobbies/' + inputGameID)
			.get()
			.then((snapshot) => {
				if (snapshot.exists() && inputGameID != '') {
					database
						.ref('lobbies/' + inputGameID)
						.child('players')
						.set({
							...snapshot.val().players,
							[userID]: username,
						});
					database
						.ref('lobbies/' + inputGameID)
						.child('messages')
						.push({
							author: 'System',
							message: username + ' has joined the lobby.',
						});
					gameID = inputGameID;
					isHost = false;
					inLobby = true;
				} else {
					alert('Invalid Game Id!');
					document.getElementsByName('idBox')[0].focus();
				}
			});
	};

	const createGame = () => {
		gameID = generateCode();
		database.ref('lobbies/' + gameID).set({
			gameStarted: false,
			host: userID,
			players: {
				[userID]: username,
			},
		});
		isHost = true;
		inLobby = true;
	};

	const generateCode = () => {
		return Math.floor(100000 + Math.random() * 900000);
	};
</script>

<div>
	{#if !usernameSubmitted}
		<TextInput
			on:keydown={handleUsername}
			name="usernameBox"
			bind:value={username}
			labelText="Username"
			placeholder="Enter your username"
		/>
		<Button on:click={setUsername}>Next</Button>
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
		<Lobby bind:inLobby {gameID} {database} {isHost} {userID} {username} />
	{/if}
</div>
