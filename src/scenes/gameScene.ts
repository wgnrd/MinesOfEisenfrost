import Phaser from "phaser";
import RoomGenerator from "../utils/roomGenerator";
import { move, spawnPlayer } from "../utils/movements";
import { TILE_SIZE } from "../types/globalConstants";
import { spawnEnemies } from "../utils/spawner";
import Enemy from "../utils/Enemy";
import Player from "../utils/Player";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  playerSprite: Phaser.Physics.Arcade.Sprite | undefined;
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  enemies: Enemy[] = [];
  player: Player | undefined;
  generator = new RoomGenerator(80, 60);
  playerActed = false;

  preload() {
    // Load room tiles
    this.load.image("floor", "src/assets/floor.png");
    this.load.image("wall", "src/assets/wall.png");
    this.load.image("door", "src/assets/door.png");

    // Load player sprite
    this.load.image("player", "src/assets/player.png");
    this.load.image("lightenemy", "src/assets/lightEnemy.png");
  }

  create() {
    this.generator.generateRooms(3);
    this.generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, "floor")
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        } else if (tile === 2) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, "wall")
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        } else if (tile === 3) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, "door")
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        }
      });
    });

    let { playerX, playerY } = spawnPlayer(this.generator.map);

    this.playerSprite = this.physics.add
      .sprite(playerX, playerY, "player")
      .setOrigin(0)
      .setScale(TILE_SIZE / 32);

    this.player = new Player(this.playerSprite);
    const enemyPositions = spawnEnemies(this.generator.map, 20);
    enemyPositions.forEach(({ enemyX, enemyY }) => {
      const enemy = new Enemy(this, enemyX, enemyY, "lightenemy", 15);
      this.enemies.push(enemy);
    });

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.K,
      down: Phaser.Input.Keyboard.KeyCodes.J,
      left: Phaser.Input.Keyboard.KeyCodes.H,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      upLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      upRight: Phaser.Input.Keyboard.KeyCodes.U,
      downLeft: Phaser.Input.Keyboard.KeyCodes.B,
      downRight: Phaser.Input.Keyboard.KeyCodes.N,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;

    // Center the camera on the player
    this.cameras.main.startFollow(this.playerSprite);
    this.cameras.main.setZoom(0.6); // Adjust the zoom level as needed
  }

  async update() {
    if (!this.player || !this.keys) {
      return;
    }
    const playerActed = this.player.handlePlayerTurn(
      this.generator.map,
      this.keys,
      this.enemies
    );

    this.cleanUpDeadEnemies();
    // Handle enemy turns if player acted
    if (await playerActed) {
      this.enemies.forEach((enemy) => {
        enemy.updateEnemy(this.player!, this.generator.map, this.enemies);
      });
    }
  }

  private cleanUpDeadEnemies() {
    this.enemies = this.enemies.filter((enemy) => !enemy.isDead);
  }
}
