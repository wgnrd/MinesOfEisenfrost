import { EquipmentItem, EquippedItems, InventoryData } from '../types/Equipment';
import GameScene from './GameScene';

export default class InventoryScene extends Phaser.Scene {
  private inventory: EquipmentItem[] = [];
  private equipped: EquippedItems = {
    weapon: null,
    armor: null,
    ring: null,
    boots: null
  };
  private keyboardControlsSet = false;
  private selectedIndex: number = 0;
  private isEquipmentSelected: boolean = false;
  private selectedEquipSlot: number = 0;
  private readonly equipmentSlots: Array<keyof EquippedItems> = ['weapon', 'armor', 'ring', 'boots'];

  private highlights: {
    inventory?: Phaser.GameObjects.Rectangle;
    equipment?: Phaser.GameObjects.Rectangle;
  } = {};

  private windowDimensions = {
    width: 600,
    height: 400
  };

  constructor() {
    super({ key: 'InventoryScene' });
  }

  init(data: InventoryData): void {
    const gameScene = this.scene.get('GameScene') as GameScene;
    if (gameScene.player) {
      const playerData = gameScene.player.getInventory();
      this.inventory = playerData.inventory;
      this.equipped = playerData.equipped;
    } else {
      this.inventory = data.inventory || [];
      this.equipped = data.equipped || this.equipped;
    }
  }

  create(): void {
    const { width, height } = this.cameras.main;
    const x = (width - this.windowDimensions.width) / 2;
    const y = (height - this.windowDimensions.height) / 2;

    // Create semi-transparent background
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0, 0);

    // Create main window
    this.add.rectangle(x, y, this.windowDimensions.width, this.windowDimensions.height, 0x222222)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x444444);

    // Create title
    this.add.text(x + 20, y + 20, 'Inventory', {
      fontSize: '24px',
      color: '#ffffff'
    });

    this.createEquippedSection(x + 20, y + 60);
    this.createInventoryGrid(x + 300, y + 60);
    this.setupKeyboardControls();

    // Create highlights
    this.highlights.inventory = this.add.rectangle(0, 0, 50, 50, 0xffffff, 0.3)
      .setVisible(false);
    this.highlights.equipment = this.add.rectangle(0, 0, 68, 68, 0xffffff, 0.3)
      .setVisible(false);
    this.updateHighlight();
  }

  private createEquippedSection(x: number, y: number): void {
    const slotSize = 64;
    const spacing = 10;

    this.equipmentSlots.forEach((slot, index) => {
      const yPos = y + (index * (slotSize + spacing));

      // Create slot background
      this.add.rectangle(x, yPos, slotSize, slotSize, 0x333333)
        .setOrigin(0, 0)
        .setStrokeStyle(1, 0x666666);

      // Add slot label
      this.add.text(x + slotSize + 10, yPos + 20,
        slot.charAt(0).toUpperCase() + slot.slice(1), {
        fontSize: '16px',
        color: '#999999'
      });

      // Show equipped item if exists
      const equippedItem = this.equipped[slot];
      if (equippedItem) {
        this.createItemSprite(
          x + slotSize / 2,
          yPos + slotSize / 2,
          equippedItem
        );
      }
    });
  }

  private createInventoryGrid(x: number, y: number): void {
    const itemSize = 48;
    const padding = 5;
    const cols = 5;
    const rows = 6;

    // Grid background
    this.add.rectangle(x, y,
      (itemSize + padding) * cols + padding,
      (itemSize + padding) * rows + padding,
      0x333333)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x666666);

    // Place items
    this.inventory.forEach((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const itemX = x + padding + col * (itemSize + padding) + itemSize / 2;
      const itemY = y + padding + row * (itemSize + padding) + itemSize / 2;

      this.createItemSprite(itemX, itemY, item);
    });
  }

  private createItemSprite(x: number, y: number, item: EquipmentItem): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(x, y, 40, 40, this.getItemColor(item.type));
  }

  private getItemColor(type: EquipmentItem['type']): number {
    const colors: Record<EquipmentItem['type'], number> = {
      weapon: 0xff0000,
      armor: 0x00ff00,
      ring: 0x0000ff,
      boots: 0xffff00
    };
    return colors[type];
  }

  private setupKeyboardControls(): void {
    if (this.keyboardControlsSet) {
      return;
    }
    this.keyboardControlsSet = true;

    this.input.keyboard?.on('keydown-E', () => this.closeInventory());
    this.input.keyboard?.on('keydown-TAB', () => {
      this.isEquipmentSelected = !this.isEquipmentSelected;
      this.updateHighlight();
    });

    this.input.keyboard?.on('keydown-SPACE', () => this.handleItemAction());
    this.input.keyboard?.on('keydown-ENTER', () => this.handleItemAction());

    this.input.keyboard?.on('keydown-K', () => {
      if (this.isEquipmentSelected) {
        this.selectedEquipSlot = (this.selectedEquipSlot - 1 + this.equipmentSlots.length) % this.equipmentSlots.length;
      } else {
        this.selectedIndex = Math.max(0, this.selectedIndex - 5);
      }
      this.updateHighlight();
    });

    this.input.keyboard?.on('keydown-J', () => {
      if (this.isEquipmentSelected) {
        this.selectedEquipSlot = (this.selectedEquipSlot + 1) % this.equipmentSlots.length;
      } else {
        this.selectedIndex = Math.min(this.inventory.length - 1, this.selectedIndex + 5);
      }
      this.updateHighlight();
    });

    this.input.keyboard?.on('keydown-L', () => {
      if (!this.isEquipmentSelected) {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateHighlight();
      }
    });

    this.input.keyboard?.on('keydown-Je', () => {
      if (!this.isEquipmentSelected) {
        this.selectedIndex = Math.min(this.inventory.length - 1, this.selectedIndex + 1);
        this.updateHighlight();
      }
    });
  }

  private updateHighlight(): void {
    const { width, height } = this.cameras.main;
    const windowX = (width - this.windowDimensions.width) / 2;
    const windowY = (height - this.windowDimensions.height) / 2;

    if (this.isEquipmentSelected) {
      // Always show equipment highlight when in equipment mode
      const slotSize = 64;
      const spacing = 10;
      const y = windowY + 93 + this.selectedEquipSlot * (slotSize + spacing);

      this.highlights.equipment?.setPosition(
        windowX + 51,
        y
      ).setVisible(true);
      this.highlights.inventory?.setVisible(false);
    } else {
      // For inventory grid
      const cols = 5;
      const itemSize = 48;
      const padding = 5;

      // Ensure selectedIndex is within bounds
      this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, this.inventory.length - 1));
      const row = Math.floor(this.selectedIndex / cols);
      const col = this.selectedIndex % cols;

      const x = windowX + 324 + padding + col * (itemSize + padding);
      const y = windowY + 84 + padding + row * (itemSize + padding);

      this.highlights.inventory?.setPosition(x, y).setVisible(true);
      this.highlights.equipment?.setVisible(false);
    }
  }

  private handleItemAction(): void {
    if (this.isEquipmentSelected) {
      // Unequip item
      const slot = this.equipmentSlots[this.selectedEquipSlot];
      if (this.equipped[slot]) {
        this.inventory.push(this.equipped[slot]!);
        this.equipped[slot] = null;
        this.refreshUI();
      }
    } else {
      // Equip item
      const item = this.inventory[this.selectedIndex];
      if (item) {
        const slot = item.type;
        // Check if slot is already occupied, move to inventory
        if (this.equipped[slot]) {
          this.inventory.push(this.equipped[slot]!);
        }
        // Equip item
        this.equipped[slot] = item;
        this.inventory.splice(this.selectedIndex, 1);

        this.refreshUI();
      }
    }
  }

  private refreshUI(): void {
    this.children.removeAll();
    this.create();
  }

  private closeInventory(): void {
    const gameScene = this.scene.get('GameScene') as GameScene;
    if (!gameScene.player) {
      console.error('Player not found in GameScene');
      return;
    }

    gameScene.player.setInventory({
      equipped: this.equipped,
      inventory: this.inventory
    });

    gameScene.events.emit('inventory-closed');
    this.scene.stop();
    this.keyboardControlsSet = false;
  }
}