<script>
	import Phaser from 'phaser';
	import { onMount } from 'svelte';

	var mainCamera;

	class Map extends Phaser.Scene {
		constructor() {
			super('Map');
		}

		preload() {
			this.load.image('base_tiles', 'assets/fantasyhextiles_v3.png');
			this.load.image('base_tiles2', 'assets/fantasyhextiles_randr_4_v1.png');

			this.load.tilemapTiledJSON(
				'fantasy_tileset',
				'assets/wealthofnations_map.json'
			);
			mainCamera = this.cameras.main;
		}

		create() {
			// mainCamera = this.cameras.add(0, 0, 3200, 1600);
			const map = this.make.tilemap({ key: 'fantasy_tileset' });
			const tileset1 = map.addTilesetImage('fantasyhextiles_v3', 'base_tiles');
			const tileset2 = map.addTilesetImage(
				'fantasyhextiles_randr_4_v1',
				'base_tiles2'
			);

			map.createLayer('Tile Layer 1', tileset1);
			map.createLayer('Roads', tileset2);

			this.cursors = this.input.keyboard.createCursorKeys();

			this.input.on('pointermove', function (p) {
				if (!p.isDown) return;

				mainCamera.scrollX -= (p.x - p.prevPosition.x) / mainCamera.zoom;
				mainCamera.scrollY -= (p.y - p.prevPosition.y) / mainCamera.zoom;
			});
		}

		update() {
			if (this.cursors.left.isDown) {
				mainCamera.scrollX -= 10;
			} else if (this.cursors.right.isDown) {
				mainCamera.scrollX += 10;
			} else if (this.cursors.up.isDown) {
				mainCamera.scrollY -= 10;
			} else if (this.cursors.down.isDown) {
				mainCamera.scrollY += 10;
			}
		}
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
