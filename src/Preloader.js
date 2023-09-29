import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles_extruded.png')
        this.load.tilemapTiledJSON('map', 'tiles/dungeon_01.json')

        this.load.atlas('faune', 'character/faune.png', 'character/faune.json')
        this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')
        this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')
        this.load.atlas('stair', 'stairs/stair.png', 'stairs/stair.json')

        this.load.image('ui-heart-empty', 'hearts/ui_heart_empty.png')
        this.load.image('ui-heart-full', 'hearts/ui_heart_full.png')

        this.load.image('sword', 'weapons/weapon_sword.png')
    }

    create() {
        this.scene.start('game')
    }

}