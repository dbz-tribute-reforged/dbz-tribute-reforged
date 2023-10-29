import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { ItemShopCategory } from "./ItemShopCategory";
import { ItemShopList } from "./ItemShopList";

export class ItemShopManager {
  private static instance: ItemShopManager;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ItemShopManager();
    }
    return this.instance;
  }

  public shop: any;
  public shop2: any;

  constructor() {
    this.initialize();
  }

  
  initialize() {
    this.setupItemList();

    this.shop = TasItemShopAddShop('n01G');
    this.shop.Mode = false;

    // this.shop2 = TasItemShopAddShop('n01P', 'I004', 'I006');
    // this.shop2.Mode = true;
  }

  setupItemList() {
    for (const data of ItemShopList) {
      TasItemShopAdd(data.id, data.category.reduce((a,b) => a + b, 0));
      // set lumber cost
      TasItemData[data.id].Gold = 0;
      TasItemData[data.id].Lumber = Math.round(TournamentData.kothLumberPerRound * data.lumberCost * 0.01);
      TasItemFusionAdd(data.id, ...data.recipe);
    }
  }
};