export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {}

  create() {
    // Wait a frame to ensure scene is ready
    this.time.delayedCall(0, () => {
      const { width, height } = this.scale;

      // Add "Game Over" text
      this.add
        .text(width / 2, height / 2 - 50, "Game Over", {
          fontSize: "64px",
          color: "#ff0000",
          fontFamily: "Arial", // Specify a web-safe font
        })
        .setOrigin(0.5);

      // Add restart button
      const restartButton = this.add
        .text(width / 2, height / 2 + 50, "Click to Restart", {
          fontSize: "32px",
          color: "#ffffff",
          fontFamily: "Arial", // Specify a web-safe font
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => restartButton.setStyle({ color: "#ff0000" }))
        .on("pointerout", () => restartButton.setStyle({ color: "#ffffff" }))
        .on("pointerdown", () => {
          window.location.reload();
        });
    });
  }
}
