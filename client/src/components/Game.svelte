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

<Grid>
	<Row>
		<p>Top part</p>
	</Row>
	<Row>
		<Column class="game" sm={1} md={4} lg={8}>
			<Map />
		</Column>
		<Column sm={1} md={1} lg={1}>
			<p>Sidebar</p>
		</Column>
	</Row>
</Grid>

<style>
</style>
