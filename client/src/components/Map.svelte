<script>
	import Phaser from 'phaser';
	import { onMount } from 'svelte';

	var mainCamera;
	var w;
	var a;
	var s;
	var d;

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

			w = this.input.keyboard.addKey('W');
			a = this.input.keyboard.addKey('A');
			s = this.input.keyboard.addKey('S');
			d = this.input.keyboard.addKey('D');
		}

		create() {
			const map = this.make.tilemap({ key: 'fantasy_tileset' });
			const tileset1 = map.addTilesetImage('fantasyhextiles_v3', 'base_tiles');
			const tileset2 = map.addTilesetImage(
				'fantasyhextiles_randr_4_v1',
				'base_tiles2'
			);

			map.createLayer('Tile Layer 1', tileset1);
			map.createLayer('Roads', tileset2);

			this.cursors = this.input.keyboard.createCursorKeys();

			this.input.on('pointermove', (pointer) => {
				if (!pointer.isDown) return;

				mainCamera.scrollX -=
					(pointer.x - pointer.prevPosition.x) / mainCamera.zoom;
				mainCamera.scrollY -=
					(pointer.y - pointer.prevPosition.y) / mainCamera.zoom;
			});

			this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
				// mainCamera.pan(pointer.worldX, pointer.worldY);

				if (deltaY > 0) {
					mainCamera.zoom -= 0.1;
				}

				if (deltaY < 0) {
					mainCamera.zoom += 0.1;
				}

				mainCamera.setZoom(Phaser.Math.Clamp(mainCamera.zoom, 0.2, 5));
			});
		}

		update() {
			if (this.cursors.left.isDown) {
				mainCamera.scrollX -= 10;
			} else if (this.cursors.right.isDown) {
				mainCamera.scrollX += 10;
			}
			if (this.cursors.up.isDown) {
				mainCamera.scrollY -= 10;
			} else if (this.cursors.down.isDown) {
				mainCamera.scrollY += 10;
			}
			if (a.isDown) {
				mainCamera.scrollX -= 10;
			} else if (d.isDown) {
				mainCamera.scrollX += 10;
			}
			if (w.isDown) {
				mainCamera.scrollY -= 10;
			} else if (s.isDown) {
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
