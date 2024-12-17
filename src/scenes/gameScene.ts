import Phaser from 'phaser'
import RoomGenerator from '../utils/roomGenerator'
import { move, movePlayer, spawnPlayer } from '../utils/movements'
import { TILE_SIZE } from '../types/globalConstants'
import { spawnEnemies } from '../utils/spawner'
import Enemy from '../utils/Enemy'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  player: Phaser.Physics.Arcade.Sprite | undefined
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  enemies: Enemy[] = []
  generator = new RoomGenerator(80, 60)
  playerMoved = false

  preload() {
    // Load room tiles
    this.load.image('floor', 'src/assets/floor.png')
    this.load.image('wall', 'src/assets/wall.png')
    this.load.image('door', 'src/assets/door.png')

    // Load player sprite
    this.load.image('player', 'src/assets/player.png')
    this.load.image('lightenemy', 'src/assets/lightEnemy.png')
  }

  create() {
    this.generator.generateRooms(3)

    this.generator.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'floor')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32)
        } else if (tile === 2) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'wall')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32)
        } else if (tile === 3) {
          this.add.image(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 'door')
              .setOrigin(0)
              .setScale(TILE_SIZE / 32)
        }
      })
    })

    let { playerX, playerY } = spawnPlayer(this.generator.map)

    this.player = this.physics.add.sprite(playerX, playerY, 'player')
                      .setOrigin(0)
                      .setScale(TILE_SIZE / 32)

    const enemyPositions = spawnEnemies(this.generator.map, 20)
    enemyPositions.forEach(({ enemyX, enemyY }) => {
      const enemy = new Enemy(this, enemyX, enemyY, 'lightenemy', 100);
      this.enemies.push(enemy);
    })

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.K,
      down: Phaser.Input.Keyboard.KeyCodes.J,
      left: Phaser.Input.Keyboard.KeyCodes.H,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      upLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      upRight: Phaser.Input.Keyboard.KeyCodes.U,
      downLeft: Phaser.Input.Keyboard.KeyCodes.B,
      downRight: Phaser.Input.Keyboard.KeyCodes.N
    }) as Phaser.Types.Input.Keyboard.CursorKeys

    // Center the camera on the player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(0.6); // Adjust the zoom level as needed
  }

  update() {
    if (!this.player || !this.keys) {
      return
    }

    this.playerMoved = movePlayer(this.generator.map, this.player, this.keys, this.enemies.map(enemy => enemy.sprite))

    if (this.playerMoved) {
      this.enemies.forEach(enemy => {
        enemy.moveTowards(this.player!, this.generator.map, this.enemies);
      });
    }
  }

}
