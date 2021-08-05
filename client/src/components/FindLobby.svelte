<script>
	import Lobby from './Lobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';

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

	const setUsername = () => {
		if (username != '') {
			usernameSubmitted = true;
		} else {
			alert('Username cannot be empty!');
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

					gameID = inputGameID;
					isHost = false;
					inLobby = true;
				} else {
					alert('Invalid Game Id!');
				}
			});
	};

	const createGame = () => {
		gameID = generateCode();
		database.ref('lobbies/' + gameID).set({
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
			bind:value={username}
			labelText="Username"
			placeholder="Enter your username"
		/>
		<Button on:click={setUsername}>Next</Button>
	{:else if !inLobby}
		<TextInput
			bind:value={inputGameID}
			labelText="UUID"
			placeholder="Enter game UUID"
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
		<Lobby bind:inLobby {gameID} {database} {isHost} {userID} />
	{/if}
</div>
