<script>
	export let gameID;
	export let database;

	let players;

	const checkGameStatus = () => {
		//firebase garbage
	};

	database.ref('lobbies/' + gameID).on('value', (snapshot) => {
		players = snapshot.val().players;
	});

	$: console.log(players);
</script>

<div>Players:</div>
{#each players as player}
	<li>{player}</li>
{/each}
