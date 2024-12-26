import Phaser from "phaser";
import { TILE_SIZE } from "../types/globalConstants";
import { move } from "./movements";
import Player from "./Player";

class Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  isDead: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    health: number
  ) {
    this.sprite = scene.physics.add
      .sprite(x, y, texture)
      .setOrigin(0)
      .setScale(TILE_SIZE / 32);
    this.health = health;
  }

  isTileOccupied(x: number, y: number, enemies: Enemy[]): boolean {
    return enemies.some(
      (enemy) => enemy.sprite.x === x && enemy.sprite.y === y
    );
  }

  moveTowards(
    target: Phaser.Physics.Arcade.Sprite,
    map: any[][],
    enemies: Enemy[]
  ) {
    const currentX = Math.floor(this.sprite.x / TILE_SIZE);
    const currentY = Math.floor(this.sprite.y / TILE_SIZE);
    const targetX = Math.floor(target.x / TILE_SIZE);
    const targetY = Math.floor(target.y / TILE_SIZE);

    // Calculate the difference
    let dx = 0;
    let dy = 0;

    // Calculate movement direction
    if (currentX < targetX) dx = 1;
    else if (currentX > targetX) dx = -1;

    if (currentY < targetY) dy = 1;
    else if (currentY > targetY) dy = -1;

    // Try diagonal movement first
    if (dx !== 0 && dy !== 0) {
      if (
        !this.isTileOccupied(
          this.sprite.x + dx * TILE_SIZE,
          this.sprite.y + dy * TILE_SIZE,
          enemies
        ) &&
        move(this.sprite, map, dx, dy)
      ) {
        return;
      }
    }

    // If diagonal fails or wasn't possible, try horizontal
    if (dx !== 0) {
      if (
        !this.isTileOccupied(
          this.sprite.x + dx * TILE_SIZE,
          this.sprite.y,
          enemies
        ) &&
        move(this.sprite, map, dx, 0)
      ) {
        return;
      }
    }

    // If horizontal fails or wasn't possible, try vertical
    if (dy !== 0) {
      if (
        !this.isTileOccupied(
          this.sprite.x,
          this.sprite.y + dy * TILE_SIZE,
          enemies
        )
      ) {
        move(this.sprite, map, 0, dy);
      }
    }
  }

  updateEnemy(player: Player, map: any[][], enemies: Enemy[]) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      player.sprite.x,
      player.sprite.y
    );
    if (distance < TILE_SIZE * 10) {
      const currentX = Math.floor(this.sprite.x / TILE_SIZE);
      const currentY = Math.floor(this.sprite.y / TILE_SIZE);
      const playerX = Math.floor(player.sprite.x / TILE_SIZE);
      const playerY = Math.floor(player.sprite.y / TILE_SIZE);

      const dx = playerX - currentX;
      const dy = playerY - currentY;

      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        this.attack(player);
      } else {
        this.moveTowards(player.sprite, map, enemies);
      }
    }
  }

  takeDamage(damage: number) {
    this.health -= damage;
    console.log(
      `Enemy took ${damage} damage. Remaining health: ${this.health}`
    );
    if (this.health <= 0) {
      console.log("Enemy has been defeated!");
      this.isDead = true;
      this.sprite.destroy();
    }
  }

  attack(player: Player) {
    // TODO: for now, just deal somewhere between 3 and 8 damage
    const damage = Math.floor(Math.random() * 6) + 3;
    player.takeDamage(damage);
    console.log("Enemy attacked player!");
    // TODO: Add attack animation, sound effects, etc.
  }
}

export default Enemy;
