<script>
	import {
		Button,
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		Checkbox,
		ButtonSet,
		RadioButtonGroup,
		RadioButton,
	} from 'carbon-components-svelte';

	export let gameID;
	export let database;
	export let isHost;
	export let userID;
	export let inLobby;

	let players;
	let open;

	let gameType;

	const checkGameStatus = () => {
		//firebase garbage
	};

	const saveSettings = () => {
		open = false;
		database
			.ref('lobbies/' + gameID)
			.child('settings')
			.set({
				type: gameType,
			});
	};

	const leaveLobby = () => {
		for (const [key, value] of Object.entries(players)) {
			if (key != userID) {
				database.ref('lobbies/' + gameID).update({
					host: key,
				});
				database
					.ref('lobbies/' + gameID)
					.child('players')
					.child(userID)
					.set(null);
				inLobby = false;
				return;
			}
		}
		inLobby = false;
		database.ref('lobbies/' + gameID).remove();
	};

	const startGame = () => {};

	database
		.ref('lobbies/' + gameID)
		.child('host')
		.on('value', (snapshot) => {
			console.log('host changed!');
			if (snapshot.val() == userID) {
				isHost = true;
			}
		});

	database
		.ref('lobbies/' + gameID)
		.child('players')
		.on('value', (snapshot) => {
			players = snapshot.val();
		});

	$: console.log(inLobby);
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
					<RadioButtonGroup legendText="Game Type" bind:selected={gameType}>
						<RadioButton labelText="Timed" value="0" />
						<RadioButton labelText="Last Man Standing" value="1" />
					</RadioButtonGroup>
				</ModalBody>
				<ModalFooter>
					<Button on:click={saveSettings}>Save</Button>
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
