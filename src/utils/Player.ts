import Phaser from "phaser";
import { TILE_SIZE } from "../types/globalConstants";
import Enemy from "./Enemy";
import { move } from "./movements";
import Logger from "./Logger";

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public health: number = 100;
  public maxHealth: number = 100;
  private logger: Logger;
  private turnCount: number = 0;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
    this.logger = Logger.getInstance();
  }

  takeDamage(amount: number) {
    this.health -= amount;
    this.logger.log(`Player took ${amount} damage. Health: ${this.health}`);
    if (this.health <= 0) {
      this.logger.log("Player has been defeated!");
      this.sprite.destroy();
      // TODO: Add game over screen
      this.sprite.scene.scene.start("GameOver");
    }
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

    let logMessage = "";
    let dx = 0;
    let dy = 0;

    // Determine movement direction
    if (Phaser.Input.Keyboard.JustDown(left)) {
      logMessage = "Player moved left";
      dx = -1;
    } else if (Phaser.Input.Keyboard.JustDown(right)) {
      logMessage = "Player moved right";
      dx = 1;
    }

    if (Phaser.Input.Keyboard.JustDown(up)) {
      logMessage = "Player moved up";
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(down)) {
      logMessage = "Player moved down";
      dy = 1;
    }

    // Handle diagonal movements
    if (Phaser.Input.Keyboard.JustDown(upLeft)) {
      logMessage = "Player moved up left";
      dx = -1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(upRight)) {
      logMessage = "Player moved up right";
      dx = 1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(downLeft)) {
      logMessage = "Player moved down left";
      dx = -1;
      dy = 1;
    } else if (Phaser.Input.Keyboard.JustDown(downRight)) {
      logMessage = "Player moved down right";
      dx = 1;
      dy = 1;
    }

    if (dx === 0 && dy === 0) {
      return false;
    }

    this.turnCount++;
    if (this.turnCount % 20 === 0 && this.health < this.maxHealth) {
      this.heal(this.maxHealth * 0.1);
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
    this.logger.log(logMessage);
    return move(
      this.sprite,
      map,
      dx,
      dy,
      enemies.map((enemy) => enemy.sprite)
    );
  };

  heal(amount: number) {
    if (this.health + amount > this.maxHealth) {
      this.health = this.maxHealth;
    } else {
      this.health += amount;
    }
    this.logger.log(`Player healed. Health: ${this.health}`);
  }
}

export default Player;
