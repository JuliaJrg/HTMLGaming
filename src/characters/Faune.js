import Phaser from 'phaser';
import Chest from '../items/Chest';

import { sceneEvents } from '../events/EventsCenter';

let HealthState;

(function (HealthState) {
	HealthState[HealthState["IDLE"] = 0] = "IDLE";
	HealthState[HealthState["DAMAGE"] = 1] = "DAMAGE";
	HealthState[HealthState["DEAD"] = 2] = "DEAD";
})(HealthState || (HealthState = {}));

class Faune extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.healthState = HealthState.IDLE;
		this.damageTime = 0;

		this._health = 3;
		this._coins = 0;

		this.swords = undefined;
		this.activeChest = undefined;

		this.anims.play('faune-idle-down');
	}

	get health() {
		return this._health;
	}

	setSwords(swords) {
		this.swords = swords;
	}

	setChest(chest) {
		this.activeChest = chest;
	}

	handleDamage(dir) {
		if (this._health <= 0) {
			return;
		}

		if (this.healthState === HealthState.DAMAGE) {
			return;
		}

		--this._health;

		if (this._health <= 0) {

			this.healthState = HealthState.DEAD;
			this.anims.play('faune-faint');
			this.setVelocity(0, 0);

		} else {

			this.setVelocity(dir.x, dir.y);
			this.setTint(0xff0000);
			this.healthState = HealthState.DAMAGE;
			this.damageTime = 0;

		}
	}
    
    
	throwSword() {

		if (!this.swords) {
			return;
		}

		const sword = this.swords.get(this.x, this.y, 'sword');
		if (!sword) {
			return;
		}

		const parts = this.anims.currentAnim.key.split('-');
		const direction = parts[2];
		const vec = new Phaser.Math.Vector2(0, 0);

		switch (direction) {
			case 'up':
				vec.y = -1;
                break;

			case 'down':
				vec.y = 1;
				break;

			case 'side':
				if (this.scaleX < 0) {
					vec.x = -1;
				} else {
					vec.x = 1;
				}
				break;
		}

		const angle = vec.angle();

		sword.setActive(true);
		sword.setVisible(true);

		sword.setRotation(angle);

		sword.x += vec.x * 16;
		sword.y += vec.y * 16;

		sword.setVelocity(vec.x * 300, vec.y * 300);
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt);

		switch (this.healthState) {
			case HealthState.IDLE:
				break;

			case HealthState.DAMAGE:
				this.damageTime += dt;
				if (this.damageTime >= 250) {
					this.healthState = HealthState.IDLE;
					this.setTint(0xffffff);
					this.damageTime = 0;
				}
				break;
		}
	}

	update(cursors) {
		if (
			this.healthState === HealthState.DAMAGE ||
			this.healthState === HealthState.DEAD
		) {
			return;
		}

		if (!cursors) {
			return;
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
			if (this.activeChest) {
				const coins = this.activeChest.open();
				this._coins += coins;

				sceneEvents.emit('player-coins-changed', this._coins);
			} else {
				this.throwSword();
			}
			return;
		}


		const speed = 100;
		const leftDown = cursors.left?.isDown;
		const rightDown = cursors.right?.isDown;
		const upDown = cursors.up?.isDown;
		const downDown = cursors.down?.isDown;

		if (leftDown) {
			this.anims.play('faune-run-side', true);
			this.setVelocity(-speed, 0);
			this.scaleX = -1;
			this.body.offset.x = 24;
		} else if (rightDown) {
			this.anims.play('faune-run-side', true);
			this.setVelocity(speed, 0);
			this.scaleX = 1;
			this.body.offset.x = 8;
		} else if (upDown) {
			this.anims.play('faune-run-up', true);
			this.setVelocity(0, -speed);
		} else if (downDown) {
			this.anims.play('faune-run-down', true);
			this.setVelocity(0, speed);
		} else {
			const parts = this.anims.currentAnim.key.split('-');
			parts[1] = 'idle';
			this.anims.play(parts.join('-'));
			this.setVelocity(0, 0);
		}

		if (leftDown || rightDown || upDown || downDown) {
			this.activeChest = undefined;
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (x, y, texture, frame) {
	var sprite = new Faune(this.scene, x, y, texture, frame);
	this.displayList.add(sprite);
	this.updateList.add(sprite);
	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
	sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);
	return sprite;
});
