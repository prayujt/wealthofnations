<script>
	import Tile from './Tile.svelte';
	import { onMount } from 'svelte';
	import P5 from 'p5-svelte';

	const sketch = (p5) => {
		let squares = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
		const drawGrid = (grid) => {
			for (let i = 0; i < grid.length; i++) {
				for (let j = 0; j < grid[i].length; j++) {
					p5.rect(20 * i, 20 * j, 20, 20);
				}
			}
		};

		p5.setup = () => {
			p5.createCanvas(400, 400);
		};

		p5.draw = () => {
			drawGrid(squares);
		};
	};
</script>

<P5 {sketch} />

<style>
</style>
