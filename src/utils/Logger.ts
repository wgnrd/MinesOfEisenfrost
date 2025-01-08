import { GAME_WIDTH, GAME_HEIGHT, LOG_WIDTH } from "../types/globalConstants";

export default class Logger {
  private static instance: Logger | null = null;
  private logText: Phaser.GameObjects.Text | null = null;
  private messages: string[] = [];
  private maxMessages: number = 200;
  private background: Phaser.GameObjects.Rectangle | null = null;
  private maxHeight: number = 0;
  private readonly PADDING = 10;
  private readonly WIDTH = 300;

  private constructor() {} // Private constructor

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  initialize(scene: Phaser.Scene, depth: number = 9999) {
    const gameWidth = scene.cameras.main.width;
    const gameHeight = scene.cameras.main.height;
    const xPosition = gameWidth - this.WIDTH;
    const yPosition = gameHeight * 0.5;

    this.createRectangle(scene, xPosition, yPosition, gameHeight, depth);

    this.logText = scene.add.text(xPosition + this.PADDING, yPosition, "", {
      fontSize: "17px",
      color: "#ffffff",
      wordWrap: { width: this.WIDTH - this.PADDING * 2 },
    });
    this.logText.setScrollFactor(0);
    this.logText.setDepth(depth + 1);
    this.maxHeight = gameHeight * 0.5 - this.PADDING * 2;
  }

  private createRectangle(
    scene: Phaser.Scene,
    xPosition: number,
    yPosition: number,
    gameHeight: number,
    depth: number
  ) {
    this.background = scene.add.rectangle(
      xPosition,
      yPosition,
      this.WIDTH,
      gameHeight - yPosition,
      0x000000,
      0.8
    );
    this.background.setOrigin(0);
    this.background.setScrollFactor(0);
    this.background.setDepth(depth);
    this.background.setStrokeStyle(2, 0xffffff);
  }

  log(message: string) {
    if (!this.logText) return;

    this.messages.push(message);

    if (this.messages.length > this.maxMessages) {
      this.messages.shift(); // Remove oldest message
    }

    // Join messages with newlines and set text
    this.logText.setText(this.messages.join("\n"));
    this.updateText();
  }

  private updateText() {
    if (!this.logText || !this.background) return;

    // Set the text
    this.logText.setText(this.messages.join("\n"));

    // Calculate the visible area bounds
    const visibleHeight = this.background.height - this.PADDING * 2;

    // If text height exceeds the visible area, remove oldest messages until it fits
    while (this.logText.height > visibleHeight && this.messages.length > 0) {
      this.messages.shift(); // Remove oldest message
      this.logText.setText(this.messages.join("\n"));
    }

    // Position text at the top of the visible area
    this.logText.setY(this.background.y + this.PADDING);
  }

  clear() {
    this.messages = [];
    if (this.logText) {
      this.logText.setText("");
      this.logText.setY(this.PADDING * 2); // Reset position
    }
  }

  destroy() {
    if (this.background) {
      this.background.destroy();
      this.background = null;
    }
    if (this.logText) {
      this.logText.destroy();
      this.logText = null;
    }
  }
}
