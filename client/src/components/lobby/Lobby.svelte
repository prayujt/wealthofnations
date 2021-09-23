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

	onMount(() => {
		document.getElementsByTagName('textarea')[0].focus();
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
				gameID: gameID,
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
		socket.emit('leavingLobby', userID, username, isHost, async (response) => {
			if (response.status == true) {
				inLobby = false;
			}
		});
	};

	const startGame = () => {
		saveSettings().then(() => {
			initializingGame = true;
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
		console.log('player changed');
		players = players_;
	});

	socket.on('lobbyMessageReceived', (messages_) => {
		console.log('message changed');
		messages = messages_;
	});

	socket.on('gameStarted', () => {
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
					<h1>Players</h1>
					{#each Object.entries(players) as [key, value]}
						<li>{value.username}</li>
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
				<div class="text-messages">
					{#if messages != null}
						{#each Object.entries(messages) as [key, value]}
							<p>{value.author}: {value.message}</p>
						{/each}
					{/if}
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
	</div>
{:else}
	<Game />
{/if}

<svelte:window on:beforeunload={leaveLobby} />

<style lang="scss">
	.lobby-container {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		min-height: 100vh;
		width: 100vw;

		border: 1px solid black;

		.left-container {
			display: flex;
			flex-direction: column;
			width: 40%;
			border: 1px solid black;
			margin: 1rem;

			.game-id {
				border: 1px solid black;
				margin: 1rem;
			}

			.player-container {
				border: 1px solid black;
				margin: 1rem;

				.username {
					border: 1px solid black;
					margin: 1rem;
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
				margin: 1rem;

				.chat-messages {
					border: 1px solid black;
					margin: 1rem;
				}

				.chat-input {
					border: 1px solid black;
					margin: 1rem;
				}
			}
		}
	}

	// .lobby-container {
	// 	border: 2px solid black;

	// 	height: 100vh;
	// 	width: 100vw;
	// 	display: grid;
	// 	grid-template-columns: repeat(4, 1fr);
	// 	grid-template-rows: repeat(10, 1fr);
	// 	grid-column-gap: 0px;
	// 	grid-row-gap: 0px;
	// }

	// .left-container {
	// 	border: 2px solid black;

	// 	grid-area: 1 / 1 / 10 / 3;
	// }

	// .right-container {
	// 	border: 2px solid black;

	// 	grid-area: 1 / 3 / 10 / 5;
	// 	display: flex;
	// 	position: relative;
	// }

	// .bottom-container {
	// 	border: 2px solid black;

	// 	grid-area: 10 / 1 / 11 / 5;
	// 	display: flex;
	// }

	// .game-id {
	// 	border: 2px solid black;
	// }

	// #chat {
	// 	border: 2px solid black;

	// 	flex: 70%;
	// }

	// #username {
	// 	border: 2px solid black;

	// 	flex: 30%;
	// }
</style>
