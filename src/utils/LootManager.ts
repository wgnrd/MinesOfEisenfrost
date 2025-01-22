import { EquipmentItem, LootTable, EnemyLootConfig } from '../types/Equipment';
import { ENEMY_LOOT_CONFIGS, LOOT_TABLES } from './defaultEquippment';
import Player from '../entities/Player';
import { TILE_SIZE } from '../types/globalConstants';

export type Position = { x: number; y: number };
export default class LootManager {
  private lootTable: LootTable;
  private static lootManager: LootManager;
  private enemyConfigs: Record<string, EnemyLootConfig>;

  constructor() {
    this.lootTable = LOOT_TABLES;
    this.enemyConfigs = ENEMY_LOOT_CONFIGS;
  }

  public static getInstance(): LootManager {
    if (!this.lootManager) {
      this.lootManager = new LootManager();
    }

    return this.lootManager
  }


  public rollForLoot(enemyType: string, position: { x: number, y: number }): EquipmentItem | null {
    console.log(`Rolling for loot for enemy type: ${enemyType} at position:`, position);
    const config = this.enemyConfigs[enemyType];
    if (!config) {
      console.log(`No config found for enemy type: ${enemyType}`);
      return null;
    }

    // First, check if we should drop anything
    const dropRoll = Math.random();
    console.log(`Drop roll: ${dropRoll}, required: ${config.dropRate}`);
    if (dropRoll > config.dropRate) {
      return null;
    }

    // Roll for rarity
    const rarityRoll = Math.random();
    let cumulative = 0;

    for (const drop of config.possibleDrops) {
      cumulative += drop.chance;
      if (rarityRoll <= cumulative) {
        // We've hit this rarity, now pick a random item from that pool
        const pool = this.lootTable[drop.rarity];
        const returnedLoot = pool[Math.floor(Math.random() * pool.length)];
        return returnedLoot;
      }
    }

    return null;
  }
  public pickUpLoot(player: Player, scene: Phaser.Scene): void {
    const playerPosition = { x: player.sprite.x, y: player.sprite.y };

    scene.children.each((child) => {
      if (this.isLootAtPosition(child, playerPosition)) {
        const item = child.getData('item');
        if (this.isValidLootItem(item)) {
          child.destroy();
          player.addToInventory(item);
        }
      }
    });
  }

  private isLootAtPosition(child: Phaser.GameObjects.GameObject, position: Position): boolean {
    if (!(child instanceof Phaser.GameObjects.Rectangle)) return false;

    const lootPosition = { x: child.x, y: child.y };
    return Math.abs(lootPosition.x - position.x) <= TILE_SIZE && Math.abs(lootPosition.y - position.y) <= TILE_SIZE;
  }

  private isValidLootItem(item: any): item is EquipmentItem {
    return item && 'name' in item && 'rarity' in item;
  }

}