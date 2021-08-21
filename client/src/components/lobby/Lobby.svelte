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
		TextInput,
		TextArea,
		Slider,
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import Game from '../game/Game.svelte';

	export let gameID;
	export let database;
	export let isHost;
	export let userID;
	export let inLobby;
	export let username;

	//references
	let refLobby = database.ref('lobbies/' + gameID);
	let refServer = database.ref('server/' + gameID);
	let refPlayers = refLobby.child('players');
	let refSettings = refLobby.child('settings');
	let refMessages = refLobby.child('messages');

	let message;
	let messages = {};
	let players;
	let open;
	let initializingGame = false;
	let gameStarted = false;

	let gameType = 'timed';
	let numCities = 10;

	onMount(() => {
		document.getElementsByTagName('textarea')[0].focus();
	});

	const setUsername = () => {
		if (username == '') {
			alert('Username cannot be empty!');
		} else {
			refPlayers.update({
				[userID]: username,
			});
		}
	};

	const saveSettings = async () => {
		open = false;

		refSettings.set({
			type: gameType,
			numCities: numCities,
		});
	};

	const sendMessage = () => {
		if (message != '') {
			refMessages.push({
				author: username,
				message: message,
			});
		}
	};

	const handleMessage = (e) => {
		if (e.which == 13) {
			e.preventDefault();
			sendMessage();
			message = '';
		}
	};

	const leaveLobby = () => {
		if (isHost && !gameStarted) {
			for (const [key, value] of Object.entries(players)) {
				if (key != userID) {
					refLobby.update({
						host: key,
					});
					refPlayers.child(userID).set(null);
					refMessages.push({
						author: 'System',
						message: 'Host has left the lobby. New host is: ' + value,
					});

					inLobby = false;
					return;
				}
			}
			inLobby = false;
			refLobby.remove();
			refServer.remove();
		} else if (!isHost && !gameStarted) {
			refPlayers.child(userID).set(null);

			refMessages.push({
				author: 'System',
				message: username + 'has left the lobby.',
			});

			inLobby = false;
		}
	};

	const startGame = () => {
		saveSettings().then(() => {
			initializingGame = true;
			refServer.set({
				initializingGame: true,
			});
		});
	};

	refServer.child('initializingGame').on('value', (snapshot) => {
		if (snapshot.val() === false) {
			refServer.child('initializingGame').remove();
			gameStarted = true;
			refLobby.remove();
		}
	});

	let refHost = refLobby.child('host');
	refHost.on('value', (snapshot) => {
		if (snapshot.val() === userID) {
			isHost = true;
		}
	});

	refPlayers.on('value', (snapshot) => {
		players = snapshot.val();
	});

	refMessages.on('value', (snapshot) => {
		messages = snapshot.val();
	});
</script>

{#if !gameStarted}
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
			<div id="chat">
				<h1>Chat</h1>
				{#if messages != null}
					{#each Object.entries(messages) as [key, value]}
						<p>{value.author}: {value.message}</p>
					{/each}
				{/if}
			</div>
			<div id="username">
				<TextInput
					on:change={setUsername}
					bind:value={username}
					labelText="Username"
					placeholder={username}
				/>
			</div>
			<div
				style="display: flex; position: absolute; bottom: 0px"
				id="sendMessage"
			>
				<TextArea
					on:keydown={handleMessage}
					style="resize: none;"
					placeholder="Type a message..."
					bind:value={message}
				/>
				<Button on:click={sendMessage} kind="ghost">Send Message</Button>
			</div>
		</div>
		<div id="bottom" style="position: absolute; bottom: 0px">
			<div id="bottom-left">
				<Button kind="danger-tertiary" on:click={leaveLobby}>Leave Lobby</Button
				>
			</div>
			<div id="bottom-right">
				{#if isHost && !initializingGame}
					<ButtonSet>
						<Button on:click={() => (open = true)}>Game Settings</Button>
						<Button on:click={startGame}>Start Game</Button>
					</ButtonSet>

					<ComposedModal bind:open>
						<ModalHeader label="Settings" title="Game Settings" />
						<ModalBody hasForm>
							<RadioButtonGroup legendText="Game Type" bind:selected={gameType}>
								<RadioButton labelText="Timed" value="timed" />
								<RadioButton
									labelText="Last Man Standing"
									value="lastmanstanding"
								/>
							</RadioButtonGroup>

							<Slider
								labelText="Number of Cities"
								min={10}
								max={50}
								maxLabel="50 cities"
								bind:value={numCities}
							/>

							<!-- Add additional settings here -->
						</ModalBody>
						<ModalFooter>
							<Button on:click={saveSettings}>Save</Button>
						</ModalFooter>
					</ComposedModal>
				{:else}
					<ButtonSet>
						<Button disabled>Game Settings</Button>
						<Button disabled>Start Game</Button>
					</ButtonSet>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<Game />
{/if}

<svelte:window on:beforeunload={leaveLobby} />

<style>
	#lobby-container {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(10, 1fr);
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}

	#left {
		grid-area: 1 / 1 / 10 / 3;
	}

	#right {
		grid-area: 1 / 3 / 10 / 5;
		display: flex;
		position: relative;
	}

	#bottom {
		grid-area: 10 / 1 / 11 / 5;
		display: flex;
	}

	#chat {
		flex: 70%;
	}

	#username {
		flex: 30%;
	}
</style>
