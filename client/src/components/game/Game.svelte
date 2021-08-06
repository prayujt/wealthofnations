<script>
	import Map from './Map.svelte';
	import { Grid, Row, Column } from 'carbon-components-svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

	onMount(() => {
		document
			.getElementsByClassName('game')[0]
			.appendChild(document.getElementsByTagName('canvas')[0]);
	});
</script>

<div class="container">
	<div class="header">
		<p>Header</p>
	</div>
	<div class="game">
		<Map />
	</div>
	<div class="panel">
		<p>Sidebar</p>
	</div>
</div>

<svelte:window on:beforeunload={() => {}} />

<!--
<Grid>
	<Row>
		<p>Top part</p>
	</Row>
	<Row>
		<Column class="game" sm={1} md={8} lg={5}>
			<Map />
		</Column>
		<Column sm={1} md={1} lg={5}>
			<p>Sidebar</p>
		</Column>
	</Row>
</Grid>
-->
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
