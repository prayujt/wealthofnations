<script>
	import Phaser from 'phaser';
	import { onMount } from 'svelte';

	class Map extends Phaser.Scene {
		constructor() {
			super('Map');
		}

		preload() {
			this.load.image('base_tiles', 'assets/RPG_Nature_Tileset.png');
			this.load.tilemapTiledJSON('tileset_nature', 'assets/embedded_map.json');
		}

		create() {
			const map = this.make.tilemap({ key: 'tileset_nature' });
			const tileset = map.addTilesetImage('RPG Nature Tileset', 'base_tiles');

			map.createLayer('Tile Layer 1', tileset);
			map.createLayer('Tile Layer 2', tileset);
		}

		update() {}
	}

	const config = {
		type: Phaser.AUTO,
		width: 400,
		height: 400,
		// scale: {
		// 	mode: Phaser.Scale.FIT,
		// 	autoCenter: Phaser.Scale.CENTER_BOTH,
		// },
		// autoRound: false,
		// parent: 'game-container',
		scene: [Map],
	};

	const game = new Phaser.Game(config);

	onMount(async () => {
		let promise = new Promise((r) => setTimeout(() => r('resolved'), 1));
		await promise;
		let parent = document.getElementsByTagName('canvas')[0].parentElement;
		game.scale.resize(
			parent.getBoundingClientRect().width,
			parent.getBoundingClientRect().height
		);
	});
</script>
