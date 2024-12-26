import { GAME_WIDTH, GAME_HEIGHT, LOG_WIDTH } from "../types/globalConstants";

export class Logger {
  private static instance: Logger;
  private messages: string[] = [];
  private maxMessages: number = 20;
  private textObjects: Phaser.GameObjects.Text[] = [];
  private scene: Phaser.Scene | null = null;
  private background!: Phaser.GameObjects.Rectangle;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  initialize(scene: Phaser.Scene) {
    this.scene = scene;

    this.background = scene.add
      .rectangle(
        GAME_WIDTH - LOG_WIDTH, // Position on the right side of the Game Area
        0, // Top of the Game Area
        LOG_WIDTH, // Width of the log area
        GAME_HEIGHT, // Full height
        0x000000, // Black background
        0.7 // Transparency
      )
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Create text objects for each potential message line
    for (let i = 0; i < this.maxMessages; i++) {
      const text = scene.add
        .text(GAME_WIDTH - LOG_WIDTH + 10, GAME_HEIGHT - i * 20, "", {
          fontSize: "18px",
          color: "#ffffff",
        })
        .setScrollFactor(0);

      this.textObjects.push(text);
    }
  }

  log(message: string) {
    if (!this.scene) return;

    this.messages.push(message);
    // Keep only the last maxMessages
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    // Update all text objects
    this.textObjects.forEach((textObj, index) => {
      const messageIndex = this.messages.length - this.maxMessages + index;
      if (messageIndex >= 0) {
        textObj.setText(this.messages[messageIndex]);
      } else {
        textObj.setText("");
      }
    });
  }
}
export default Logger;
