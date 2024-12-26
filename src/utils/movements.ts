import { TILE_SIZE } from '../types/globalConstants'
import Phaser from 'phaser'

export const spawnPlayer = (map: any): { playerX: number, playerY: number } => {
  // Find the first room tile to place the player
  let playerX = 0
  let playerY = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        playerX = x * TILE_SIZE + 5
        playerY = y * TILE_SIZE + 5
        break
      }
    }
    if (playerX && playerY) {
      break
    }
  }
  return { playerX, playerY }
}

export const movePlayer = (
    map: any[][],
    sprite: Phaser.Physics.Arcade.Sprite,
    keys: Phaser.Types.Input.Keyboard.CursorKeys,
    enemies: Phaser.Physics.Arcade.Sprite[]
): boolean => {
  // @ts-ignore
  const { up, left, upRight, right, downRight, downLeft, down, upLeft } = keys

  let moved = false

  if (Phaser.Input.Keyboard.JustDown(left)) {
    moved = move(sprite, map, -1, 0, enemies)
  } else if (Phaser.Input.Keyboard.JustDown(right)) {
    moved = move(sprite, map, 1, 0, enemies)
  }

  if (Phaser.Input.Keyboard.JustDown(up)) {
    moved = move(sprite, map, 0, -1, enemies)
  } else if (Phaser.Input.Keyboard.JustDown(down)) {
    moved = move(sprite, map, 0, 1, enemies)
  }

  if (Phaser.Input.Keyboard.JustDown(upLeft)) {
    moved = move(sprite, map, -1, -1, enemies)
  } else if (Phaser.Input.Keyboard.JustDown(upRight)) {
    moved = move(sprite, map, 1, -1, enemies)
  } else if (Phaser.Input.Keyboard.JustDown(downLeft)) {
    moved = move(sprite, map, -1, 1, enemies)
  } else if (Phaser.Input.Keyboard.JustDown(downRight)) {
    moved = move(sprite, map, 1, 1, enemies)
  }

  return moved
}

export const move = (
    sprite: Phaser.Physics.Arcade.Sprite,
    map: any,
    dx: number,
    dy: number,
    obstacles: Phaser.Physics.Arcade.Sprite[] = []
): boolean => {
  const newX = sprite.x + dx * TILE_SIZE
  const newY = sprite.y + dy * TILE_SIZE
  const tileX = Math.floor(newX / TILE_SIZE)
  const tileY = Math.floor(newY / TILE_SIZE)

  if (map[tileY] && map[tileY][tileX] === 1) {
    // check for obstacles
    for (const obstacle of obstacles) {
      if (Phaser.Math.Distance.Between(newX, newY, obstacle.x, obstacle.y) < TILE_SIZE) {
        return false
      }
    }
    sprite.x = newX
    sprite.y = newY
    return true
  }
  return false
}
