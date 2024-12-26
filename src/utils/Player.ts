import Phaser from "phaser";
import { TILE_SIZE } from "../types/globalConstants";
import Enemy from "./Enemy";
import { move } from "./movements";

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public health: number = 100;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  takeDamage(amount: number) {
    this.health -= amount;
    console.log(`Player took ${amount} damage. Health: ${this.health}`);
    // TODO: Add visual feedback, death check, etc.
  }

  async attack(enemy: Enemy) {
    // Store original position
    const startX = this.sprite.x;
    const startY = this.sprite.y;

    // Calculate direction to enemy
    const dx = enemy.sprite.x - startX;
    const dy = enemy.sprite.y - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction and calculate lunge position
    const normalizedDx = (dx / distance) * (TILE_SIZE / 2);
    const normalizedDy = (dy / distance) * (TILE_SIZE / 2);

    // Perform the lunge animation
    await new Promise<void>((resolve) => {
      this.sprite.scene.tweens.add({
        targets: this.sprite,
        x: startX + normalizedDx,
        y: startY + normalizedDy,
        duration: 100,
        yoyo: true,
        ease: "Power1",
        onComplete: () => {
          // Deal damage after animation
          const damage = Math.floor(Math.random() * 6) + 3;
          enemy.takeDamage(damage);
          resolve();
        },
      });
    });
  }

  handlePlayerTurn = async (
    map: any[][],
    keys: Phaser.Types.Input.Keyboard.CursorKeys,
    enemies: Enemy[]
  ): Promise<boolean> => {
    // @ts-ignore
    const { up, left, upRight, right, downRight, downLeft, down, upLeft } =
      keys;

    let dx = 0;
    let dy = 0;

    // Determine movement direction
    if (Phaser.Input.Keyboard.JustDown(left)) {
      console.log("player moved left");
      dx = -1;
    } else if (Phaser.Input.Keyboard.JustDown(right)) {
      console.log("player moved right");
      dx = 1;
    }

    if (Phaser.Input.Keyboard.JustDown(up)) {
      console.log("player moved up");
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(down)) {
      console.log("player moved down");
      dy = 1;
    }

    // Handle diagonal movements
    if (Phaser.Input.Keyboard.JustDown(upLeft)) {
      console.log("player moved up left");
      dx = -1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(upRight)) {
      console.log("player moved up right");
      dx = 1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(downLeft)) {
      console.log("player moved down left");
      dx = -1;
      dy = 1;
    } else if (Phaser.Input.Keyboard.JustDown(downRight)) {
      console.log("player moved down right");
      dx = 1;
      dy = 1;
    }

    if (dx === 0 && dy === 0) {
      return false;
    }

    const targetX = this.sprite.x + dx * TILE_SIZE;
    const targetY = this.sprite.y + dy * TILE_SIZE;

    // Check for enemy at target position
    const targetEnemy = enemies.find(
      (enemy) => enemy.sprite.x === targetX && enemy.sprite.y === targetY
    );

    if (targetEnemy) {
      await this.attack(targetEnemy);
      return true;
    }

    // If no enemy, try to move
    return move(
      this.sprite,
      map,
      dx,
      dy,
      enemies.map((enemy) => enemy.sprite)
    );
  };
}

export default Player;
