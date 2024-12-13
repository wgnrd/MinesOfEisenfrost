import Phaser from 'phaser';
import RoomGenerator from '../utils/roomGenerator';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }
   TILE_SIZE = 10;

  preload() {
    // Load assets here (e.g., sprites or tilesets)
    // Load room tiles
    this.load.image('floor', 'src/assets/floor.png');
    this.load.image('wall', 'src/assets/wall.png');
    this.load.image('door', 'assets/door.png');

    // Load player sprite
    this.load.image('player', 'assets/player.png');
  }

  create() {
    const generator = new RoomGenerator(80, 60);
    generator.generateRooms(3);

    generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add.image(x * this.TILE_SIZE + 5, y * this.TILE_SIZE + 5, 'floor')
              .setOrigin(0)
              .setScale(this.TILE_SIZE/32);
        } else if (tile === 2) {
          this.add.image(x * this.TILE_SIZE + 5, y * this.TILE_SIZE + 5, 'wall')
              .setOrigin(0)
              .setScale(this.TILE_SIZE/32);
        } else if (tile === 3) {
          this.add.image(x * this.TILE_SIZE + 5, y * this.TILE_SIZE + 5, 'door')
              .setOrigin(0)
              .setScale(this.TILE_SIZE/32);
        }
      });
    });
  }

  update() {
    // Game loop logic here
  }
}
