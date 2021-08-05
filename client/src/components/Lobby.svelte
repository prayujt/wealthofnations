<script>
	import {
		Button,
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		Checkbox,
		ButtonSet,
	} from 'carbon-components-svelte';

	export let gameID;
	export let database;
	export let isHost;

	let players;
	let open;

	const checkGameStatus = () => {
		//firebase garbage
	};

	const leaveLobby = () => {};

	const startGame = () => {};

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
		<Button
			kind="danger-tertiary"
			style="position: absolute; bottom: 0px;"
			on:click={leaveLobby}>Leave Lobby</Button
		>
		{#if isHost}
			<ButtonSet style="position: absolute; bottom: 0px; right: 75px">
				<Button on:click={() => (open = true)}>Game Settings</Button>
				<Button on:click={startGame}>Start Game</Button>
			</ButtonSet>

			<ComposedModal bind:open>
				<ModalHeader label="Settings" title="Game Settings" />
				<ModalBody hasForm>
					<Checkbox labelText="I have reviewed the changes" />
				</ModalBody>
				<ModalFooter>
					<Button on:click={() => (open = false)}>Save</Button>
				</ModalFooter>
			</ComposedModal>
		{:else}
			<ButtonSet style="position: absolute; bottom: 0px; right: 75px">
				<Button disabled>Game Settings</Button>
				<Button disabled>Start Game</Button>
			</ButtonSet>
		{/if}
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
