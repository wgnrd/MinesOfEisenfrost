import Phaser from 'phaser';
import RoomGenerator from '../utils/roomGenerator';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Load assets here (e.g., sprites or tilesets)
  }

  create() {
    // TODO - make the room generator get the width and height from the scene
    const generator = new RoomGenerator(80, 60);
    generator.generateRooms(3);
    const TILE_SIZE = 10;
    generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add.rectangle(
            x * TILE_SIZE + 10,
            y * TILE_SIZE + 10,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
            0xdeadbeef
          );
        }
      });
    });
  }

  update() {
    // Game loop logic here
  }
}
