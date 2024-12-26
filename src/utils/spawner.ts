import { TILE_SIZE } from '../types/globalConstants'

export const spawnEnemies = (map: any, count: number): { enemyX: number, enemyY: number }[] => {
  const enemies = [];
  const roomTiles = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        roomTiles.push({ x, y });
      }
    }
  }

  for (let i = 0; i < count; i++) {
    if (roomTiles.length > 0) {
      const randomTile = roomTiles[Math.floor(Math.random() * roomTiles.length)];
      const enemyX = randomTile.x * TILE_SIZE + 5;
      const enemyY = randomTile.y * TILE_SIZE + 5;
      enemies.push({ enemyX, enemyY });
    }
  }

  return enemies;
};