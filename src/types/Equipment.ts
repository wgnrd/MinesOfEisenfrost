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