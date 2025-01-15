import { EnemyLootConfig, EquippedItems, LootTable } from "../types/Equipment";

export const playerEquipped: EquippedItems = {
  weapon: {
    id: 'rusty_sword',
    type: 'weapon',
    name: 'Rusty Sword',
    damage: 2,
    durability: 20,
    rarity: 'common'
  },
  armor: {
    id: 'tattered_clothes',
    type: 'armor',
    name: 'Tattered Clothes',
    defense: 3,
    durability: 15,
    rarity: 'common'
  },
  ring: null,
  boots: {
    id: 'leather_boots',
    type: 'boots',
    name: 'Leather Boots',
    defense: 1,
    durability: 25,
    rarity: 'common'
  }
};

export // loot-tables.ts
  const LOOT_TABLES: LootTable = {
    common: [
      {
        id: 'rusty_sword',
        type: 'weapon',
        name: 'Rusty Sword',
        damage: 3,
        durability: 20,
        rarity: 'common'
      },
      {
        id: 'leather_armor',
        type: 'armor',
        name: 'Leather Armor',
        defense: 2,
        durability: 25,
        rarity: 'common'
      },
      // Add more common items...
    ],
    uncommon: [
      {
        id: 'steel_sword',
        type: 'weapon',
        name: 'Steel Sword',
        damage: 5,
        durability: 30,
        rarity: 'uncommon'
      },
      {
        id: 'chain_mail',
        type: 'armor',
        name: 'Chain Mail',
        defense: 4,
        durability: 35,
        rarity: 'uncommon'
      },
      // Add more uncommon items...
    ],
    rare: [
      {
        id: 'flame_sword',
        type: 'weapon',
        name: 'Flame Sword',
        damage: 8,
        durability: 40,
        rarity: 'rare'
      },
      // Add more rare items...
    ],
    epic: [
      {
        id: 'dragon_slayer',
        type: 'weapon',
        name: 'Dragon Slayer',
        damage: 12,
        durability: 50,
        rarity: 'epic'
      },
      // Add more epic items...
    ]
  };

// enemy-loot-configs.ts
export const ENEMY_LOOT_CONFIGS: Record<string, EnemyLootConfig> = {
  lightenemy: {
    dropRate: 1.0,  // Always drops something
    possibleDrops: [
      { rarity: 'rare', chance: 0.7 },
      { rarity: 'epic', chance: 0.3 }
    ]
  }
};