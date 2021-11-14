<script>
	import Tile from './Tile.svelte';
	import { onMount } from 'svelte';

	let grid = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	let canvas;
	onMount(() => {
		const ctx = canvas.getContext('2d');

		console.log(grid);

		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				ctx.fillStyle = 'green';
				ctx.fillRect(row * 20 + 5, col * 20 + 5, 20, 20);
			}
		}
	});
</script>

<canvas id="canvas" bind:this={canvas} width="500" height="300" />

<style>
	#canvas {
		border: 5px solid black;
	}
</style>
