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
    player: Phaser.Physics.Arcade.Sprite,
    keys: Phaser.Types.Input.Keyboard.CursorKeys
) => {
  // @ts-ignore
  const { up, left, upRight, right, downRight, downLeft, down, upLeft } = keys

  if (Phaser.Input.Keyboard.JustDown(left)) {
    move(player, map, -1, 0)
  } else if (Phaser.Input.Keyboard.JustDown(right)) {
    move(player, map, 1, 0)
  }

  if (Phaser.Input.Keyboard.JustDown(up)) {
    move(player, map, 0, -1)
  } else if (Phaser.Input.Keyboard.JustDown(down)) {
    move(player, map, 0, 1)
  }

  if (Phaser.Input.Keyboard.JustDown(upLeft)) {
    move(player, map, -1, -1)
  } else if (Phaser.Input.Keyboard.JustDown(upRight)) {
    move(player, map, 1, -1)
  } else if (Phaser.Input.Keyboard.JustDown(downLeft)) {
    move(player, map, -1, 1)
  } else if (Phaser.Input.Keyboard.JustDown(downRight)) {
    move(player, map, 1, 1)
  }
}

const move = (
    player: Phaser.Physics.Arcade.Sprite,
    map: any,
    dx: number,
    dy: number
) => {
  const newX = player.x + dx * TILE_SIZE
  const newY = player.y + dy * TILE_SIZE
  const tileX = Math.floor(newX / TILE_SIZE)
  const tileY = Math.floor(newY / TILE_SIZE)

  if (map[tileY] && map[tileY][tileX] === 1) {
    player.x = newX
    player.y = newY
  }
}
