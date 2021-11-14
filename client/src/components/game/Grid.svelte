<script>
	import Tile from './Tile.svelte';
	import { onMount } from 'svelte';
	import P5 from 'p5-svelte';

	const sketch = (p5) => {
		let value = 0;

		const drawGrid = () => {
			for (let i = 0; i < 20; i++) {
				for (let j = 0; j < 20; j++) {
					new Tile(20 * i, 20 * j).createTile();
				}
			}
		};

		function Tile(x, y) {
			this.x = x;
			this.y = y;

			this.createTile = () => {
				p5.rect(this.x, this.y, 20, 20);
			};
		}

		p5.setup = () => {
			p5.createCanvas(400, 400);
		};

		p5.draw = () => {
			drawGrid();
		};
	};
</script>

<P5 {sketch} />

<style>
</style>
