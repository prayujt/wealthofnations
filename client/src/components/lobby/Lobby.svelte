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
	import LobbyMessages from './LobbyMessages.svelte';
	import LobbyUser from './LobbyUser.svelte';

	export let gameID;
	export let socket;
	export let isHost;
	export let userID;
	export let inLobby;
	export let username;

	let message;
	let messages = {};
	let players = [
		{
			uuid: userID,
			username: username,
		},
	];
	let open;
	let initializingGame = false;
	let gameStarted = false;

	let gameType = 'timed';
	let numCities = 10;
	let interval;

	onMount(() => {
		document.getElementsByTagName('textarea')[0].focus();
		// let element = document.getElementsByClassName('chat-box')[0];
		// 		interval = window.setInterval(() => {
		// 			element.scrollTop = element.scrollHeight;
		// 		}, 100);
	});

	const setUsername = () => {
		if (username == '') {
			alert('Username cannot be empty!');
		} else {
			socket.emit('updateLobbyUsername', userID, username);
		}
	};

	const saveSettings = async () => {
		open = false;

		socket.emit('saveLobbySettings', {
			type: gameType,
			numCities: numCities,
		});
	};

	const sendMessage = () => {
		if (message != '') {
			socket.emit('clientSendLobbyMessage', {
				type: 'lobby',
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
		socket.emit('leaveLobby', userID, username, isHost, async (response) => {
			if (response.status == true) {
				inLobby = false;
			}
		});
	};

	const startGame = () => {
		saveSettings().then(() => {
			initializingGame = true;
			socket.emit('clientSendLobbyMessage', {
				type: 'lobby',
				author: 'System',
				message: 'The game will begin momentarily...',
			});
			socket.emit('startGameInitialization', async (response) => {
				await response;
				if (response.status == true) {
					gameStarted = true;
				}
			});
		});
	};

	socket.on('isNewHost', () => {
		isHost = true;
	});

	socket.on('lobbyPlayerChange', (players_) => {
		players = players_;
	});

	socket.on('lobbyMessageReceived', (message, messageIndex) => {
		messages[messageIndex] = message;
		window.setTimeout(() => {
			let element = document.getElementsByClassName('chat-box')[0];
			element.scrollTop = element.scrollHeight;
		}, 1);
	});

	socket.on('tileReceived', (tileData) => {
		console.log(tileData);
		// process data
	});

	socket.on('gameStarted', () => {
		socket.emit('gameFunctions');
		socket.removeAllListeners('isNewHost');
		socket.removeAllListeners('lobbyPlayerChange');
		socket.removeAllListeners('lobbyMessageReceived');
		socket.removeAllListeners('gameStarted');
		socket.removeAllListeners('gameFunctions');
		gameStarted = true;
	});
</script>

{#if !gameStarted}
	<div class="lobby-container">
		<div class="left-container">
			<h1 class="game-id">Game ID: {gameID}</h1>
			<div class="player-container">
				<div class="username">
					<TextInput
						on:change={setUsername}
						bind:value={username}
						labelText="Username"
						placeholder={username}
					/>
				</div>

				<div class="players">
					<h1 id="player-title">Players</h1>
					{#each Object.entries(players) as [key, value]}
						<ul class="player-inList">{value.username}</ul>
					{/each}
				</div>
			</div>

			<div class="settings">
				<Button kind="danger-tertiary" on:click={leaveLobby}>Leave Lobby</Button
				>
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

		<div class="right-container">
			<div class="chat-box">
				<div class="messages">
					{#if messages != null}
						{#each Object.entries(messages) as [key, value]}
							<LobbyMessages username={value.author} message={value.message} />
						{/each}
					{/if}
				</div>
			</div>
			<div class="chat-input">
				<TextArea
					on:keydown={handleMessage}
					style="resize: none;"
					placeholder="Type a message..."
					bind:value={message}
				/>
				<Button on:click={sendMessage} kind="ghost">Send Message</Button>
			</div>
		</div>
	</div>
{:else}
	<Game {gameID} {socket} {isHost} {userID} {username} />
{/if}

<svelte:window on:beforeunload={leaveLobby} />

<style lang="scss">
	$black: #393b45;
	$grey: #6e7889;
	$white: #fffafa;
	$red: #c5283d;

	.lobby-container {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		height: 100vh;
		width: 100vw;
		background-color: $white;
		border: 1px solid black;

		.left-container {
			display: flex;
			flex-direction: column;
			width: 40%;
			border: 1px solid black;
			margin: 1rem;
			background-color: $white;

			.game-id {
				// border: 1px solid black;
				background-color: $red;
				color: $white;
				margin: 1rem;
			}

			.player-container {
				border: 1px solid black;
				height: 40rem;
				margin: 1rem;
				background-color: $white;

				.username {
					border: 1px solid black;
					margin: 1rem;
					background-color: $white;
				}

				#player-title {
					border: 1px solid black;
					margin: 1rem;
					background-color: $white;
				}

				.player-inList {
					border: 1px solid black;
					margin: 1rem;
					padding: padding;
				}
			}

			.settings {
				display: flex;
				flex-wrap: nowrap;
				border: 1px solid black;
				margin: 1rem;
			}
		}

		.right-container {
			display: flex;
			flex-direction: column;
			width: 60%;
			border: 1px solid black;
			margin: 1rem;

			.chat-box {
				border: 1px solid black;
				display: flex;
				margin: 1rem;
				height: 45rem;
				overflow-wrap: normal;
				overflow-y: scroll;

				.chat-messages {
					border: 1px solid black;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					margin: 1rem;
				}

				.text-messages {
					border: 1px solid black;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					margin: 1rem;
				}
			}
			.chat-input {
				display: flex;
				flex-direction: row;
				border: 1px solid black;
				margin: 1rem;
			}
		}
	}
</style>
