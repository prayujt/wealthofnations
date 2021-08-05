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
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import Game from './Game.svelte';

	export let gameID;
	export let database;
	export let isHost;
	export let userID;
	export let inLobby;
	export let username;

	let message;
	let messages = {};
	let players;
	let open;
	let gameStarted = false;

	let gameType;

	onMount(() => {
		document.getElementsByTagName('textarea')[0].focus();
	});

	const setUsername = () => {
		if (username == '') {
			alert('Username cannot be empty!');
		} else {
			database
				.ref('lobbies/' + gameID)
				.child('players')
				.update({
					[userID]: username,
				});
		}
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

	const sendMessage = () => {
		if (message != '') {
			database
				.ref('lobbies/' + gameID)
				.child('messages')
				.push({
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
		if (isHost) {
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
					database
						.ref('lobbies/' + gameID)
						.child('messages')
						.push({
							author: 'System',
							message: 'Host has left the lobby. New host is: ' + value,
						});
					inLobby = false;
					return;
				}
			}
			inLobby = false;
			database.ref('lobbies/' + gameID).remove();
		} else {
			database
				.ref('lobbies/' + gameID)
				.child('players')
				.child(userID)
				.set(null);
			database
				.ref('lobbies/' + gameID)
				.child('messages')
				.push({
					author: 'System',
					message: username + ' has left the lobby.',
				});
			inLobby = false;
		}
	};

	const startGame = () => {
		database.ref('server/' + gameID).set({
			initializeGame: true,
		});
		database.ref('lobbies/' + gameID).update({
			gameStarted: true,
		});
	};

	database
		.ref('lobbies/' + gameID)
		.child('gameStarted')
		.on('value', (snapshot) => {
			if (snapshot.val() == true) {
				gameStarted = true;
			}
		});

	database
		.ref('lobbies/' + gameID)
		.child('host')
		.on('value', (snapshot) => {
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

	database
		.ref('lobbies/' + gameID)
		.child('messages')
		.on('value', (snapshot) => {
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
				<!-- can change event to on keyup for real-time -->
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
				{#if isHost}
					<ButtonSet>
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
