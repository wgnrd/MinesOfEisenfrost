import Phaser from 'phaser';
import RoomGenerator from '../utils/roomGenerator';
import { spawnPlayer } from '../utils/movements';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  LOG_WIDTH,
  TILE_SIZE,
} from '../types/globalConstants';
import { spawnEnemies } from '../utils/spawner';
import Enemy from '../entities/Enemy';
import Player from '../entities/Player';
import Logger from '../utils/Logger';
import floor from '../assets/floor.png';
import wall from '../assets/wall.png';
import door from '../assets/door.png';
import player from '../assets/player.png';
import lightenemy from '../assets/lightEnemy.png';
import { playerEquipped } from '../utils/defaultEquippment';

export default class GameScene extends Phaser.Scene {
  private logger: Logger;

  constructor() {
    super('GameScene');
    this.logger = Logger.getInstance();
  }

  playerSprite: Phaser.Physics.Arcade.Sprite | undefined;
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  enemies: Enemy[] = [];
  public player: Player | undefined;
  generator = new RoomGenerator(80, 60);
  playerActed = false;
  isInventoryOpen = false;

  preload() {
    // Load room tiles
    this.load.image('floor', floor);
    this.load.image('wall', wall);
    this.load.image('door', door);

    // Load player sprite
    this.load.image('player', player);
    this.load.image('lightenemy', lightenemy);
  }

  create() {
    this.generator.generateRooms(3);
    this.generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'floor')
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        } else if (tile === 2) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'wall')
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        } else if (tile === 3) {
          this.add
            .image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'door')
            .setOrigin(0)
            .setScale(TILE_SIZE / 32);
        }
      });
    });

    let { playerX, playerY } = spawnPlayer(this.generator.map);

    this.playerSprite = this.physics.add
      .sprite(playerX, playerY, 'player')
      .setOrigin(0)
      .setScale(TILE_SIZE / 32);

    this.player = new Player(this.playerSprite);
    const enemyPositions = spawnEnemies(this.generator.map, 20);
    enemyPositions.forEach(({ enemyX, enemyY }) => {
      const enemy = new Enemy(this, enemyX, enemyY, 'lightenemy', 15);
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

    this.input.keyboard?.on('keydown-E', () => {
      if (!this.isInventoryOpen) {
        this.isInventoryOpen = true;
        this.scene.launch('InventoryScene', this.player?.getInventory());
      }
    });

    // Listen for the custom event instead of 'resume'
    this.events.on('inventory-closed', () => {
      this.isInventoryOpen = false;
    });

    // Initialize logger in top-left corner, but not at the very edge
    this.logger.initialize(this, 9999);
    this.logger.log('Game started');

    // Adjust camera follow with proper settings
    if (this.player) {
      this.cameras.main.startFollow(
        this.player.sprite,
        true,
        0.08,
        0.08,
        -LOG_WIDTH / 2
      );
      this.cameras.main.setDeadzone(100, 100); // Optional: adds smoother camera movement
    }
  }

  async update() {
    if (!this.player || !this.keys) {
      return;
    }
    if (this.isInventoryOpen) {
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

  shutdown() {
    this.logger.destroy();
    this.input.keyboard?.off('keydown-E');
    this.events.off('resume');
  }
}
