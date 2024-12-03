import Phaser from 'phaser'

class RoomGenerator {

  private TAKEUP_WIDTH = 0.7
  private TAKEUP_HEIGHT = 0.7
  private width: any
  private height: any
  map: any[][]

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.map = Array.from({ length: height }, () => Array(width).fill(0))
  }

  // Split space recursively
  splitSpace(x, y, w, h, depth = 4) {
    if (depth === 0) {
      return [{ x, y, w, h }]
    }

    // Randomly choose to split horizontally or vertically
    const horizontal = Math.random() < 0.5

    // Random offset for the split, ensuring it doesn't go too close to the edges
    const offset = Math.floor((horizontal ? w : h) * 0.3) // Maximum 30% offset
    const split = horizontal
                  ? Math.floor(w / 2) + Phaser.Math.Between(-offset, offset)
                  : Math.floor(h / 2) + Phaser.Math.Between(-offset, offset)

    // Ensure split remains valid (minimum room size of 3x3)
    if ((horizontal && (split < 5 || w - split < 5)) || (!horizontal && (split < 5 || h - split < 5))) {
      return [{ x, y, w, h }]
    }

    const first = this.splitSpace(x, y, horizontal ? split : w, horizontal ? h : split, depth - 1)
    const second = this.splitSpace(
        horizontal ? x + split : x,
        horizontal ? y : y + split,
        horizontal ? w - split : w,
        horizontal ? h : h - split,
        depth - 1
    )

    return [...first, ...second]
  }

  generateRooms(depth = 4) {
    const spaces = this.splitSpace(0, 0, this.width, this.height, depth)
    for (const space of spaces) {
      const roomWidth = Math.floor(space.w * this.TAKEUP_WIDTH)
      const roomHeight = Math.floor(space.h * this.TAKEUP_HEIGHT)
      const roomX = space.x + Math.floor((space.w - roomWidth) / 2)
      const roomY = space.y + Math.floor((space.h - roomHeight) / 2)

      for (let y = 0; y < roomHeight; y++) {
        for (let x = 0; x < roomWidth; x++) {
          this.map[roomY + y][roomX + x] = 1 // Mark tiles as part of a room
        }
      }
    }
  }
}

export default RoomGenerator;
