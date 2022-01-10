<script>
	import { onMount } from 'svelte';
	export let rows;
	export let columns;

	let ctx;
	let canvas;
	let width = 800;
	let height = 600;
	const TILE_HEIGHT = 20;
	const TILE_WIDTH = 20;
	const SPACE = 2;

	//TODO: Convert to svelte store
	let grid = [];

	onMount(() => {
		ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;

		canvas.addEventListener('click', function (event) {
			let x = event.clientX - (canvas.offsetLeft + canvas.clientLeft);
			let y = event.clientY - (canvas.offsetTop + canvas.clientTop);

			let canvasX = x * (canvas.width / canvas.clientWidth);
			let canvasY = y * (canvas.height / canvas.clientHeight);

			console.log(`x: ${canvasX} y: ${canvasY}`);
			getTile(canvasX, canvasY);
		});

		console.log(canvas);

		createGrid();
		displayGrid();
	});

	const createGrid = () => {
		console.log('rows: ' + rows);
		console.log('columns: ' + columns);
		for (let i = 0; i < rows; i++) {
			let row = [];
			grid.push(row);
			for (let j = 0; j < columns; j++) {
				row.push(
					new Tile(j * (TILE_WIDTH + SPACE), i * (TILE_HEIGHT + SPACE), i, j)
				);
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

	//TODO: Add get tile location
	const getTile = (x, y) => {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				let tile = grid[i][j];
				if (
					tile.row * (TILE_HEIGHT + SPACE) < y &&
					tile.row * (TILE_HEIGHT + SPACE) + TILE_HEIGHT > y &&
					tile.column * (TILE_WIDTH + SPACE) < x &&
					tile.column * (TILE_WIDTH + SPACE) + TILE_WIDTH > x
				)
					console.log(tile);
			}
		}
	};

	/**
	 * Default tile size: 10 x 10
	 *
	 */
	const Tile = function (x, y, row, col) {
		this.x = x;
		this.y = y;
		this.row = row;
		this.column = col;

		this.createTile = () => {
			ctx.fillStyle = 'green';
			ctx.fillRect(this.x, this.y, TILE_HEIGHT, TILE_WIDTH);
		};
	};

	//Onclick event for getting the tile
	// canvas.addEventListener('click', function (event) {
	// 	let x = event.pageX;
	// 	let y = event.pageY;
	// 	console.log(`x: ${x} y: ${y}`);
	// });
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
