import { Hooks } from "Libs/TreeLib/Hooks";

export class ItemCleanupManager {
  static instance: ItemCleanupManager;

  protected itemCleanupTimer: timer;
  protected itemCleanupInterval: number;
  protected itemsToClean: item[];

  constructor (
  ) {
    this.itemCleanupTimer = CreateTimer();
    this.itemCleanupInterval = 15;
    this.itemsToClean = [];
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ItemCleanupManager();
      Hooks.set("ItemCleanupManager", this.instance);
    }
    return this.instance;
  }

  initialize() {
    TimerStart(this.itemCleanupTimer, this.itemCleanupInterval, true, () => {
      if (this.itemsToClean.length > 0) {
        while (this.itemsToClean.length > 0) {
          const removedItem = this.itemsToClean.pop();
          if (removedItem) {
            SetItemLifeBJ(removedItem, 1.00);
            RemoveItem(removedItem);
          }
        }
      }

      EnumItemsInRectBJ(GetPlayableMapRect(), () => {
        const deadItem = GetEnumItem();
        if (GetItemLifeBJ(deadItem) <= 0) {
          this.itemsToClean.push(deadItem);
        } 
      });
    }); 
  }
}