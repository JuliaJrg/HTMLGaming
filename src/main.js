import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'
import GameUi from './GameUi'

export default new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	scene: [Preloader, Game, GameUi],
	scale: {
		zoom: 2
	}
})
