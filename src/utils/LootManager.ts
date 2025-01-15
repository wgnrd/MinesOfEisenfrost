import { EnemyLootConfig } from 'src/types/Equipment';
import { LootTable } from 'src/types/Equipment';
import { EquipmentItem } from 'src/types/Equipment';
import { ENEMY_LOOT_CONFIGS, LOOT_TABLES } from './defaultEquippment';

export default class LootManager {
  private lootTable: LootTable;
  private enemyConfigs: Record<string, EnemyLootConfig>;

  constructor() {
    this.lootTable = LOOT_TABLES;
    this.enemyConfigs = ENEMY_LOOT_CONFIGS;
  }

  public rollForLoot(enemyType: string): EquipmentItem | null {
    const config = this.enemyConfigs[enemyType];
    if (!config) return null;

    // First, check if we should drop anything
    if (Math.random() > config.dropRate) return null;

    // Roll for rarity
    const roll = Math.random();
    let cumulative = 0;

    for (const drop of config.possibleDrops) {
      cumulative += drop.chance;
      if (roll <= cumulative) {
        // We've hit this rarity, now pick a random item from that pool
        const pool = this.lootTable[drop.rarity];
        console.log(`Dropping ${drop.rarity} item`);
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }

    return null;
  }

  public addToInventory(item: EquipmentItem, scene: Phaser.Scene): void {
    // Emit an event that the main scene can listen to
    scene.events.emit('loot-collected', item);
  }
}