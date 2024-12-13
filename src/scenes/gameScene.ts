import Phaser from 'phaser';
import RoomGenerator from '../utils/roomGenerator';
import { movePlayer, spawnPlayer } from '../utils/movements'
import { TILE_SIZE } from '../types/globalConstants'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  player: Phaser.Physics.Arcade.Sprite | undefined;
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  generator = new RoomGenerator(80, 60);

  preload() {
    // Load room tiles
    this.load.image('floor', 'src/assets/floor.png');
    this.load.image('wall', 'src/assets/wall.png');
    this.load.image('door', 'src/assets/door.png');

    // Load player sprite
    this.load.image('player', 'src/assets/player.png');
  }

  create() {
    this.generator.generateRooms(3);

    this.generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'floor')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32);
        } else if (tile === 2) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'wall')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32);
        } else if (tile === 3) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'door')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32);
        }
      });
    });

    let { playerX, playerY } = spawnPlayer(this.generator.map);

    this.player = this.physics.add.sprite(playerX, playerY, 'player')
                      .setOrigin(0)
                      .setScale(TILE_SIZE / 32);

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.K,
      down: Phaser.Input.Keyboard.KeyCodes.J,
      left: Phaser.Input.Keyboard.KeyCodes.H,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      upLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      upRight: Phaser.Input.Keyboard.KeyCodes.U,
      downLeft: Phaser.Input.Keyboard.KeyCodes.B,
      downRight: Phaser.Input.Keyboard.KeyCodes.N
    }) as Phaser.Types.Input.Keyboard.CursorKeys;
  }


  update() {
    if (!this.player || !this.keys) return;

    movePlayer(this.generator.map, this.player, this.keys)
  }

}
