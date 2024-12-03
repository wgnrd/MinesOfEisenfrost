import Phaser from 'phaser';

import GameScene from './scenes/gameScene';

const config = {
  type: Phaser.AUTO,
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
