import Phaser from 'phaser';

import GameScene from './scenes/gameScene';

const config = {
  type: Phaser.AUTO,
  // TODO - Change the width and height based on the screen
  width: 800,
  height: 600,
  scene: [GameScene], // Add your GameScene here
  pixelArt: true, // Maintain pixelation
  physics: {
    default: 'arcade',
    arcade: {
      debug: false, // Set to true for debugging
    },
  },
};

new Phaser.Game(config);
