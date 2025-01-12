import Phaser, { Loader } from 'phaser';

import GameScene from './scenes/gameScene';
import GameOverScene from './scenes/GameOverScene';
import { GAME_WIDTH, GAME_HEIGHT } from './types/globalConstants';

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scene: [GameScene, GameOverScene], // Add your GameScene here
  pixelArt: true, // Maintain pixelation
  physics: {
    default: 'arcade',
    arcade: {
      debug: false, // Set to true for debugging
    },
  },
};

new Phaser.Game(config);
