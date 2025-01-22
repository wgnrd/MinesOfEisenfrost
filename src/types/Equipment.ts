export interface EquipmentItem {
  id: string;
  type: 'weapon' | 'armor' | 'ring' | 'boots';
  name: string;
  damage?: number;
  defense?: number;
  durability: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface EquippedItems {
  weapon: EquipmentItem | null;
  armor: EquipmentItem | null;
  ring: EquipmentItem | null;
  boots: EquipmentItem | null;
}

export interface InventoryData {
  inventory: EquipmentItem[];
  equipped: EquippedItems;
}

export interface LootTable {
  common: EquipmentItem[];
  uncommon: EquipmentItem[];
  rare: EquipmentItem[];
  epic: EquipmentItem[];
}

export interface DropChance {
  rarity: keyof LootTable;
  chance: number;  // 0-1
}

export interface EnemyLootConfig {
  dropRate: number;  // 0-1, chance to drop anything
  possibleDrops: DropChance[];
}