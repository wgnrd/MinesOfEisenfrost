import { EquippedItems } from "../types/Equipment";

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