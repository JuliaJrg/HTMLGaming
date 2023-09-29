const { Events } = Phaser;

const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

const randomDirection = (exclude) => {
    let newDirection = Phaser.Math.Between(0, 3);
    while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3);
    }
    return newDirection;
};

class Lizard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.anims.play('lizard-idle');

        scene.physics.world.on('tilecollide', this.handleTileCollision, this);

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.direction = randomDirection(this.direction);
            },
            loop: true
        });
    }

    destroy(fromScene) {
        this.moveEvent.destroy();
        super.destroy(fromScene);
    }

    handleTileCollision(go, tile) {
        if (go !== this) {
            return;
        }
        this.direction = randomDirection(this.direction);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        const speed = 50;
        switch (this.direction) {
            case Direction.UP:
                this.setVelocity(0, -speed);
                break;
            case Direction.DOWN:
                this.setVelocity(0, speed);
                break;
            case Direction.LEFT:
                this.setVelocity(-speed, 0);
                break;
            case Direction.RIGHT:
                this.setVelocity(speed, 0);
                break;
        }
    }
}

export default Lizard;
