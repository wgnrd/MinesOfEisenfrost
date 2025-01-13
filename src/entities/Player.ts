import Phaser from "phaser";
import { GAME_WIDTH, TILE_SIZE } from "../types/globalConstants";
import Enemy from "./Enemy";
import { move } from "../utils/movements";
import Logger from "../utils/Logger";
import { EquipmentItem, EquippedItems } from "../types/Equipment";
import { playerEquipped } from "../utils/defaultEquippment";

export class Player {
  private healthBar: Phaser.GameObjects.Rectangle;
  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private healthBarText: Phaser.GameObjects.Text;
  public sprite: Phaser.Physics.Arcade.Sprite;
  public health: number = 100;
  public maxHealth: number = 100;
  private logger: Logger;
  private turnCount: number = 0;
  private readonly PADDING = 10;
  private readonly HEALTH_BAR_HEIGHT = 20;

  private equipped: EquippedItems = playerEquipped;
  private inventory: EquipmentItem[] = [];

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
    this.logger = Logger.getInstance();

    this.setupHealthBar();
  }

  private setupHealthBar() {
    const scene = this.sprite.scene;

    this.healthBarBackground = scene.add.rectangle(
      this.PADDING,
      this.PADDING,
      GAME_WIDTH - this.PADDING * 2,
      this.HEALTH_BAR_HEIGHT,
      0x888888
    );
    this.healthBarBackground.setOrigin(0, 0);
    this.healthBarBackground.setScrollFactor(0);

    this.healthBar = scene.add.rectangle(
      this.PADDING + 1,
      this.PADDING + 1,
      (GAME_WIDTH - this.PADDING * 2 - 2) * (this.health / this.maxHealth),
      this.HEALTH_BAR_HEIGHT - 2,
      0xff4444
    );
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setScrollFactor(0);
    this.healthBarText = scene.add.text(
      this.PADDING + 5,
      this.PADDING,
      this.health.toString(),
      {
        color: "#ffffff",
        fontSize: "20px",
      }
    );
    this.healthBarText.setOrigin(0, 0);
    this.healthBarText.setScrollFactor(0);
    this.updateHealthBar();
  }

  private updateHealthBar() {

    const targetWidth = (GAME_WIDTH - this.PADDING * 2 - 2)
      * (this.health / this.maxHealth)

    // Create a smooth tween animation for the health bar
    this.sprite.scene.tweens.add({
      targets: this.healthBar,
      width: targetWidth,
      duration: 100, // Animation duration in milliseconds
      ease: "Power1", // Easing function - you can try different ones like 'Cubic', 'Quad', etc.
    });
    this.healthBarText.setText(`${this.health}/${this.maxHealth}`);
  }

  takeDamage(amount: number) {
    const armorDefense = this.equipped.armor?.defense || 0;
    const bootsDefense = this.equipped.boots?.defense || 0;
    const ringDefense = this.equipped.ring?.defense || 0;
    const totalDefense = armorDefense + bootsDefense + ringDefense;
    const totalDamage = Math.max(0, amount - totalDefense);

    this.health -= totalDamage;

    if (this.health <= 0) {
      this.health = 0; // Ensure health doesn't go below 0
      this.logger.log("Player has been defeated!");

      // Stop all current scene activity
      const currentScene = this.sprite.scene;
      currentScene.physics.pause();

      // Fade out effect
      currentScene.cameras.main.fade(300, 0, 0, 0);

      // Switch to game over scene after fade
      currentScene.cameras.main.once("camerafadeoutcomplete", () => {
        this.sprite.destroy();
        currentScene.scene.start("GameOver");
      });
    } else {
      this.logger.log(`Player took ${totalDamage} damage.`);
    }
    this.updateHealthBar();
  }

  async attack(enemy: Enemy) {
    // Store original position
    const startX = this.sprite.x;
    const startY = this.sprite.y;

    // Calculate direction to enemy
    const dx = enemy.sprite.x - startX;
    const dy = enemy.sprite.y - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction and calculate lunge position
    const normalizedDx = (dx / distance) * (TILE_SIZE / 2);
    const normalizedDy = (dy / distance) * (TILE_SIZE / 2);

    // Perform the lunge animation
    await new Promise<void>((resolve) => {
      this.sprite.scene.tweens.add({
        targets: this.sprite,
        x: startX + normalizedDx,
        y: startY + normalizedDy,
        duration: 100,
        yoyo: true,
        ease: "Power1",
        onComplete: () => {
          // Deal damage after animation
          const damage = Math.floor(Math.random() * 6) + 3;
          this.logger.log(`Player dealt ${damage} damage to enemy.`);
          enemy.takeDamage(damage);
          resolve();
        },
      });
    });
  }

  handlePlayerTurn = async (
    map: any[][],
    keys: Phaser.Types.Input.Keyboard.CursorKeys,
    enemies: Enemy[]
  ): Promise<boolean> => {
    // @ts-ignore
    const { up, left, upRight, right, downRight, downLeft, down, upLeft } =
      keys;

    let logMessage = "";
    let dx = 0;
    let dy = 0;

    // Determine movement direction
    if (Phaser.Input.Keyboard.JustDown(left)) {
      logMessage = "Player moved left";
      dx = -1;
    } else if (Phaser.Input.Keyboard.JustDown(right)) {
      logMessage = "Player moved right";
      dx = 1;
    }

    if (Phaser.Input.Keyboard.JustDown(up)) {
      logMessage = "Player moved up";
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(down)) {
      logMessage = "Player moved down";
      dy = 1;
    }

    // Handle diagonal movements
    if (Phaser.Input.Keyboard.JustDown(upLeft)) {
      logMessage = "Player moved up left";
      dx = -1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(upRight)) {
      logMessage = "Player moved up right";
      dx = 1;
      dy = -1;
    } else if (Phaser.Input.Keyboard.JustDown(downLeft)) {
      logMessage = "Player moved down left";
      dx = -1;
      dy = 1;
    } else if (Phaser.Input.Keyboard.JustDown(downRight)) {
      logMessage = "Player moved down right";
      dx = 1;
      dy = 1;
    }

    if (dx === 0 && dy === 0) {
      return false;
    }

    this.turnCount++;
    if (this.turnCount % 50 === 0 && this.health < this.maxHealth) {
      this.heal(this.maxHealth * 0.1);
    }
    const targetX = this.sprite.x + dx * TILE_SIZE;
    const targetY = this.sprite.y + dy * TILE_SIZE;

    // Check for enemy at target position
    const targetEnemy = enemies.find(
      (enemy) => enemy.sprite.x === targetX && enemy.sprite.y === targetY
    );

    if (targetEnemy) {
      await this.attack(targetEnemy);
      return true;
    }

    // If no enemy, try to move
    this.logger.log(logMessage);
    return move(
      this.sprite,
      map,
      dx,
      dy,
      enemies.map((enemy) => enemy.sprite)
    );
  };

  heal(amount: number) {
    if (this.health + amount > this.maxHealth) {
      this.health = this.maxHealth;
    } else {
      this.health += amount;
    }
    this.logger.log(`Player healed for ${amount} health.`);
    this.updateHealthBar();
  }

  getInventory() {
    return {
      inventory: this.inventory,
      equipped: this.equipped
    }
  }

  setInventory(data: { inventory: EquipmentItem[], equipped: EquippedItems }) {
    this.inventory = data.inventory;
    this.equipped = data.equipped;
  }
}

export default Player;
