<script>
	import Phaser from "phaser";

	// const preload = () => {
	// 	game.load.tilemapTiledJSON('map', 'assets/example_map.json')
	// };

	// const create = () => {
	// 	const map = game.make.tilemap({ key: 'map' })
	// };

	// const update = () => {};
	class Map extends Phaser.Scene {
		constructor() {
			super("Map");
		}

		preload() {
			this.load.tilemapTiledJSON("Map", "assets/example_map.json");
		}

		create() {
			var map = this.make.tilemap({ key: "Map" });
		}

		update() {}
	}

	const config = {
		type: Phaser.AUTO, // Which renderer to use
		width: 1200, // Canvas width in pixels
		height: 900, // Canvas height in pixels
		parent: "game-container", // ID of the DOM element to add the canvas to
		scene: [Map],
		// scene: {
		// 	preload: preload,
		// 	create: create,
		// 	update: update,
		// },
	};

	const game = new Phaser.Game(config);
</script>

<div id="game-container" />
