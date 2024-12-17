import Phaser from 'phaser';
import { TILE_SIZE } from '../types/globalConstants';
import { move } from './movements'

class Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, health: number) {
    this.sprite = scene.physics.add.sprite(x, y, texture).setOrigin(0).setScale(TILE_SIZE / 32);
    this.health = health;
  }

  isTileOccupied(x: number, y: number, enemies: Enemy[]): boolean {
    return enemies.some(enemy => enemy.sprite.x === x && enemy.sprite.y === y);
  }

  moveTowards(target: Phaser.Physics.Arcade.Sprite, map: any[][], enemies: Enemy[]) {
    const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y);
    if (distance < (TILE_SIZE * 10) && (distance > TILE_SIZE * 1.5)) {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);
      const dx = Math.round(Math.cos(angle));
      const dy = Math.round(Math.sin(angle));
      const newX = this.sprite.x + dx * TILE_SIZE;
      const newY = this.sprite.y + dy * TILE_SIZE;

      if (!this.isTileOccupied(newX, newY, enemies)) {
        move(this.sprite, map, dx, dy);
      }
    }
  }
}

export default Enemy;