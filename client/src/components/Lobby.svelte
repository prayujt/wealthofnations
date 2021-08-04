<script>
	// import { UnorderedList, ListItem } from 'carbon-components-svelte';

	export let gameID;
	export let database;

	let players;

	const checkGameStatus = () => {
		//firebase garbage
	};

	database
		.ref('lobbies/' + gameID)
		.child('players')
		.on('value', (snapshot) => {
			players = snapshot.val();
		});

	$: console.log(players);
</script>

<div id="lobby-container">
	<div id="left">
		<h1>Game ID: {gameID}</h1>
		<br />
		<h3>Players:</h3>
		{#each Object.entries(players) as [uuid, username]}
			<li>{username}</li>
		{/each}
	</div>
	<div id="right">
		<h1>Chat</h1>
	</div>
</div>

<style>
	#lobby-container {
		display: flex;
	}

	#left {
		flex: 50%;
	}

	#right {
		flex: 50%;
	}
</style>
