<script>
	import Phaser from "phaser";

	class Map extends Phaser.Scene {
		constructor() {
			super("Map");
		}

		preload() {
			this.load.image("base_tiles", "assets/RPG_Nature_Tileset.png");
			this.load.tilemapTiledJSON("tileset_nature", "assets/embedded_map.json");
		}

		create() {
			// this.add.image(0, 0, 'base_tiles')
			const map = this.make.tilemap({ key: "tileset_nature" });

			const tileset = map.addTilesetImage("RPG Nature Tileset", "base_tiles");

			map.createLayer("Tile Layer 1", tileset);

			map.createLayer("Tile Layer 2", tileset);
		}

		update() {}
	}

	const config = {
		type: Phaser.AUTO, // Which renderer to use
		width: 400, // Canvas width in pixels
		height: 400, // Canvas height in pixels
		// scale: {
		// 	mode: Phaser.Scale.FIT,
		// 	autoCenter: Phaser.Scale.CENTER_BOTH,
		// },
		// autoRound: false,
		parent: "game-container", // ID of the DOM element to add the canvas to
		scene: [Map],
	};

	const game = new Phaser.Game(config);
</script>

<div id="game-container" />

<style>
	#game-container {
		margin: 0;
		padding: 0;
	}
</style>
