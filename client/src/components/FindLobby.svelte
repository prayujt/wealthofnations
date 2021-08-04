<script>
	import Game from './Game.svelte';
	import Lobby from './Lobby.svelte';
	import {
		Button,
		TextInput,
		InlineNotification,
	} from 'carbon-components-svelte';

	export let database;
	export let user;
	export let logout;

	let gameID;
	let inputGameID;
	let username;
	let usernameSubmitted = false;
	let inLobby = false;

	const setUsername = () => {
		// database
		//         .ref('usernames/')
		//         .transaction(users => ({
		//             ...users,
		//             [user.id]: username
		//         })
		//         );
		usernameSubmitted = true;
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
							[user.id]: username,
						});

					inLobby = true;
					gameID = inputGameID;
				} else {
					alert('Invalid Game Id!');
				}
			});
	};

	const createGame = () => {
		gameID = generateCode();
		database.ref('lobbies/' + gameID).set({
			host: user.id,
			players: {
				[user.id]: username,
			},
		});
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
		<Lobby {gameID} {database} />
	{/if}
</div>
