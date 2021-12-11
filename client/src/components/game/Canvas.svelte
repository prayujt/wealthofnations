<script>
	import { onMount } from 'svelte';

	let ctx;
	let canvas;
	let width = 800;
	let height = 600;

	//TODO: Convert to svelte store
	let grid = [];

	onMount(() => {
		ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		//drawTile(ctx);
		createGrid();
		displayGrid();
	});

	const createGrid = () => {
		let spacing = 1;
		for (let i = 0; i < 20; i++) {
			let row = [];
			grid.push(row);
			for (let j = 0; j < 20; j++) {
				row.push(new Tile(i * 22, j * 22));
			}
		}
	};

	const displayGrid = () => {
		grid.forEach((row) => {
			row.forEach((tile) => {
				tile.createTile();
			});
		});
	};

	/**
	 * Default tile size: 10 x 10
	 *
	 */
	const Tile = function (x, y) {
		this.x = x;
		this.y = y;

		this.createTile = () => {
			ctx.fillStyle = 'green';
			ctx.fillRect(this.x, this.y, 20, 20);
		};

		//TODO: Add get tile location
	};
</script>

<canvas id="canvas" bind:this={canvas} {width} {height} />

<style>
	canvas {
		box-sizing: border-box;
		border: 1px solid black;
		width: 70vw;
		height: 90vh;
		margin: 0;
		margin-left: 2em;
		margin-top: 2em;
		padding: 0;
	}
</style>
