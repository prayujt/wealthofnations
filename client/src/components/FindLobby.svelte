<script>
	import Game from './Game.svelte';
	import Lobby from './Lobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';

	export let database;
	export let user;

	let gameID;
	let inputGameID;
	let inLobby = false;

	const joinGame = () => {
		database
			.ref('lobbies/' + inputGameID)
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					database.ref('lobbies/' + inputGameID).set({
						players: [...snapshot.val().players, user.id],
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
			players: [user.id],
		});
		inLobby = true;
	};

	const generateCode = () => {
		return Math.floor(100000 + Math.random() * 900000);
	};
</script>

<div>
	{#if !inLobby}
		<TextInput
			bind:value={inputGameID}
			labelText="UUID"
			placeholder="Enter game UUID"
		/>
		<Button on:click={joinGame}>Join</Button>
		<Button on:click={createGame}>Create Game</Button>
	{:else}
		<Lobby {gameID} {database} />
	{/if}
</div>
