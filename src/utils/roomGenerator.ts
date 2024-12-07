import Phaser from 'phaser';

class RoomGenerator {
  private TAKEUP_WIDTH = 0.7;
  private TAKEUP_HEIGHT = 0.7;
  private width: any;
  private height: any;
  map: any[][];
  private previousRoomCenter: any = null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = Array.from({ length: height }, () => Array(width).fill(0));
  }

  // Split space recursively
  splitSpace(x, y, w, h, depth = 4) {
    if (depth === 0) {
      return [{ x, y, w, h }];
    }

    // Randomly choose to split horizontally or vertically
    const horizontal = Math.random() < 0.5;

    // Random offset for the split, ensuring it doesn't go too close to the edges
    const offset = Math.floor((horizontal ? w : h) * 0.3); // Maximum 30% offset
    const split = horizontal
      ? Math.floor(w / 2) + Phaser.Math.Between(-offset, offset)
      : Math.floor(h / 2) + Phaser.Math.Between(-offset, offset);

    // Ensure split remains valid (minimum room size of 3x3)
    if (
      (horizontal && (split < 7 || w - split < 7)) ||
      (!horizontal && (split < 7 || h - split < 7))
    ) {
      return [{ x, y, w, h }];
    }

    const first = this.splitSpace(
      x,
      y,
      horizontal ? split : w,
      horizontal ? h : split,
      depth - 1
    );
    const second = this.splitSpace(
      horizontal ? x + split : x,
      horizontal ? y : y + split,
      horizontal ? w - split : w,
      horizontal ? h : h - split,
      depth - 1
    );

    return [...first, ...second];
  }

  generateRooms(depth = 4) {
    const spaces = this.splitSpace(0, 0, this.width, this.height, depth);

    for (const space of spaces) {
      const roomWidth = Phaser.Math.Between(space.w / 2, space.w);
      const roomHeight = Phaser.Math.Between(space.h / 2, space.h);

      // Randomly place the room within the space
      const roomY = Phaser.Math.Between(
        space.y,
        space.y + space.h - roomHeight
      );
      const roomX = Phaser.Math.Between(space.x, space.x + space.w - roomWidth);

      for (let y = 0; y < roomHeight; y++) {
        for (let x = 0; x < roomWidth; x++) {
          this.map[roomY + y][roomX + x] = 1; // Mark tiles as part of a room
        }
      }

      this.createHallways(roomX, roomWidth, roomY, roomHeight);
    }
  }

  private createHallways(
    roomX: number,
    roomWidth: number,
    roomY: number,
    roomHeight: number
  ) {
    const currentRoomCenter = {
      x: roomX + Math.floor(roomWidth / 2),
      y: roomY + Math.floor(roomHeight / 2),
    };

    // Generate a hallway connecting the previous room to the current room
    if (this.previousRoomCenter) {
      // Create a horizontal hallway
      for (
        let x = Math.min(this.previousRoomCenter.x, currentRoomCenter.x);
        x <= Math.max(this.previousRoomCenter.x, currentRoomCenter.x);
        x++
      ) {
        this.map[this.previousRoomCenter.y][x] = 1;
        this.map[this.previousRoomCenter.y + 1][x] = 1;
      }

      // Create a vertical hallway
      for (
        let y = Math.min(this.previousRoomCenter.y, currentRoomCenter.y);
        y <= Math.max(this.previousRoomCenter.y, currentRoomCenter.y);
        y++
      ) {
        this.map[y][currentRoomCenter.x] = 1;
        this.map[y][currentRoomCenter.x + 1] = 1;
      }
    }

    this.previousRoomCenter = currentRoomCenter;
  }
}

export default RoomGenerator;
