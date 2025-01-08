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
