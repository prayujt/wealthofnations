<script>
	import Map from './Map.svelte';
	import Canvas from './Canvas.svelte';
	import { Grid, Row, Column, Loading } from 'carbon-components-svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

	export let gameID;
	export let socket;
	export let isHost;
	export let userID;
	export let username;

	let rowsPromise,
		columnsPromise = new Promise((resolve, reject) => {});

	onMount(() => {
		socket.emit('getMapSize', async (rows, columns) => {
			rowsPromise = await rows;
			columnsPromise = await columns;
		});
	});

	socket.on('tileChange', async (tile) => {
		console.log(tile);
	});

	// Example of getting tile data at (0,0)
	/** socket.emit('getTileData', 0, 0, async (response) => {
		await response;
		console.log(response);
	}); **/
</script>

<div class="container">
	<div class="header">
		<p>Header</p>
	</div>
	<div class="game">
		{#await rowsPromise}
			<Loading small />
		{:then rows}
			{#await columnsPromise}
				<Loading small />
			{:then columns}
				<Canvas {rows} {columns} />
			{/await}
		{:catch error}
			<p>Error</p>
		{/await}
		<!-- <Grid /> -->
		<!-- <Map /> -->
	</div>
	<div class="panel">
		<p>Sidebar</p>
	</div>
</div>

<svelte:window on:beforeunload={() => {}} />

<style>
	* {
		padding: 0;
		margin: 0;
	}

	.container {
		display: grid;
		height: 100vh;
		width: 100vw;
		grid-template-columns: 1.5fr 0.5fr 1fr;
		grid-template-rows: 0.5fr 1.5fr 1fr;
		gap: 10px 10px;
		grid-auto-flow: row;
		grid-template-areas:
			'Header Header Header'
			'Map Panel Panel'
			'Map Panel Panel';
	}

	.header {
		grid-area: Header;
	}

	.game {
		grid-area: Map;
	}

	.panel {
		grid-area: Panel;
	}
</style>
