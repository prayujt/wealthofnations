<script>
	import { onMount } from 'svelte';

	let ctx;
	let canvas;
	let width = 800;
	let height = 600;

	//TODO: Convert to svelte store
	let grid;

	onMount(() => {
		ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		//drawTile(ctx);
		new Tile(0, 0).createTile();
	});

	// const draw = function () {
	// 	ctx.fillStyle = "green";
	//     ctx.fillRect(0,0,15,15);
	// };

	const Tile = function (x, y) {
		this.x = x;
		this.y = y;

		this.createTile = () => {
			ctx.fillStyle = 'green';
			ctx.fillRect(this.x, this.y, 15, 15);
		};
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
