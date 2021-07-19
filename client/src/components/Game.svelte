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
			var map = this.make.tilemap({ key: "tileset_nature" });

			//const tileset = map.addTilesetImage;
		}

		update() {}
	}

	const config = {
		type: Phaser.AUTO, // Which renderer to use
		width: 1800, // Canvas width in pixels
		height: 800, // Canvas height in pixels
		parent: "game-container", // ID of the DOM element to add the canvas to
		scene: [Map],
	};

	const game = new Phaser.Game(config);
</script>

<div id="game-container" />
