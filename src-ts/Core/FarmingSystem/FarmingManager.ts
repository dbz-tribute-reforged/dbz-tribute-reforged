import { Hooks } from "Libs/TreeLib/Hooks";
import { FarmProductData, FarmingComponent } from "./FarmingComponent";
import { FarmingComponentsList } from "./FarmingComponents";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { Id, Globals, Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class FarmingManager {
  static instance: FarmingManager;
  static readonly HARVESTER_AOE_BOX: number = 700;
  static readonly HARVESTER_PRNG_REQ: number = 40;
  static readonly HARVESTER_PRNG_SREQ: number = 80;
  static readonly HARVESTER_PRNG_ADD: number = 10;
  static readonly HARVESTER_REQ_RESEARCH_MULT: number = 2;

  protected numCrops: number;

  protected farmingComponentMap: Map<number, FarmingComponent>;
  protected cropAbilityMap: Map<number, number>;
  protected plantedCropsMap: Map<number, FarmingComponent>;
  protected plantTrigger: trigger;
  protected updateCropsTimer: timer;

  protected harvesterBuildTrigger: trigger;
  protected harvesterTimer: timer;
  protected harvesterUnitGroup: group;
  protected harvesterRect: rect;
  protected harvesterItemArray: item[];

  constructor (
  ) {
    this.numCrops = 0;
    this.farmingComponentMap = new Map<number, FarmingComponent>();
    this.cropAbilityMap = new Map<number, number>();
    this.plantedCropsMap = new Map<number, FarmingComponent>();
    this.plantTrigger = CreateTrigger();
    this.updateCropsTimer = CreateTimer();
    
    this.harvesterBuildTrigger = CreateTrigger();
    this.harvesterTimer = CreateTimer();
    this.harvesterUnitGroup = GetLastCreatedGroup();
    this.harvesterRect = Rect(0, 0, FarmingManager.HARVESTER_AOE_BOX, FarmingManager.HARVESTER_AOE_BOX);
    this.harvesterItemArray = [];

    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new FarmingManager();
      Hooks.set("FarmingManager", this.instance);
    }
    return this.instance;
  }

  initialize() {
    this.setupFarmingComponentMap();
    this.setupPlantTrigger();
    this.setupUpdateCrops();
    this.setupHarvester();
    BJDebugMsg("FARMING INIT");
  }

  setupFarmingComponentMap() {
    ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Farming.WHEAT, 99);
    ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Farming.CORN, 99);
    ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Farming.RICE, 99);
    ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Farming.RICE_SNOW, 99);
    for (const fcData of FarmingComponentsList) {
      this.farmingComponentMap.set(fcData.abilityId, new FarmingComponent().deserialize(fcData));
    }
    this.farmingComponentMap.forEach((fc: FarmingComponent) => {
      fc.producedItems.forEach((product: FarmProductData) => {
        this.cropAbilityMap.set(product.itemId, fc.abilityId);
      });
    });
  }

  setupPlantTrigger() {
    TriggerRegisterAnyUnitEventBJ(this.plantTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);

    TriggerAddCondition(this.plantTrigger, Condition(() => {
      const spellId = GetSpellAbilityId();
      const x = GetUnitX(GetTriggerUnit());
      const y = GetUnitY(GetTriggerUnit());
      this.plantCropFromSpell(spellId, x, y);
      
      return false;
    }));
  }

  plantCropFromSpell(spellId: number, x: number, y: number) {
    const fc = this.farmingComponentMap.get(spellId);
    if (fc) {
      const fcCopy = fc.clone();
      fcCopy.init(x, y);
      this.plantedCropsMap.set(this.numCrops, fcCopy);
      this.numCrops += 1;
    }
  }

  plantCropFromItem(itemId: number, x: number, y: number) {
    const spellId = this.cropAbilityMap.get(itemId);
    if (spellId) {
      this.plantCropFromSpell(spellId, x, y)
    }
  }

setupUpdateCrops() {
    TimerStart(this.updateCropsTimer, Constants.FARMING_TICK_INTERVAL, true, () => {
      this.updateCropsEffect();
    });
  }

  updateCropsEffect() {
    if (this.plantedCropsMap.size == 0) {
      this.numCrops = 0;
      return;
    }

    const toBeRemoved: number[] = [];
    this.plantedCropsMap.forEach((fc: FarmingComponent, key: number) => {
      fc.performTickAction();
      if (fc.isFinished()) {
        toBeRemoved.push(key);
      }
    });

    toBeRemoved.forEach((key: number) => {
      this.plantedCropsMap.delete(key);
    });
  }

  







  setupHarvester() {
    TriggerRegisterAnyUnitEventBJ(this.harvesterBuildTrigger, EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);

    TriggerAddCondition(this.harvesterBuildTrigger, Condition(() => {
      const unit = GetTriggerUnit();
      if (GetUnitTypeId(unit) == Id.farmerHarvester) {
        GroupAddUnit(this.harvesterUnitGroup, unit);
      }
      return false;
    }));

    TimerStart(this.harvesterTimer, 0.5, true, () => {
      this.harvesterCollect();
    });
  }

  harvesterCollect() {
    ForGroup(this.harvesterUnitGroup, () => {
      const unit = GetEnumUnit();

      if (UnitHelper.isUnitDead(unit)) {
        GroupRemoveUnit(this.harvesterUnitGroup, unit);
        return;
      }

      // aoe pickup crops, and replant them (%)
      const unitX = GetUnitX(unit);
      const unitY = GetUnitY(unit);
      MoveRectTo(this.harvesterRect, unitX, unitY);
      
      this.harvesterItemArray.splice(0, this.harvesterItemArray.length);
      EnumItemsInRect(this.harvesterRect, null, () => {
        const item = GetEnumItem();
        if (
          IsItemVisible(item) 
          && GetItemCharges(item) == 1
        ) {
          this.harvesterItemArray.push(item);
        }
      });
      
      const isAdvanced = GetUnitTypeId(unit) == Id.farmerAdvancedHarvester;
      const reqBonus = FarmingManager.HARVESTER_REQ_RESEARCH_MULT * (GetUnitAbilityLevel(unit, Id.farmerToggleHarvestEngine) - 1);
      let req = isAdvanced ? FarmingManager.HARVESTER_PRNG_SREQ : FarmingManager.HARVESTER_PRNG_REQ;
      req += reqBonus;

      let prng = Math.random() * 100;
      let prngOffset = 0;
      for (const item of this.harvesterItemArray) {
        const itemId = GetItemTypeId(item);
        const spellId = this.cropAbilityMap.get(itemId);
        if (spellId) {
          UnitAddItem(unit, item);
          // stop harvester from dropping the item
          // and then re-planting it...
          if (!IsItemInvulnerable(item)) {
            SetItemInvulnerable(item, true);
          }

          if (prng < req) {
            const itemX = GetItemX(item);
            const itemY = GetItemY(item);
            this.plantCropFromSpell(spellId, itemX, itemY);
            prngOffset = 0;
            prng = Math.random() * 100;
            // BJDebugMsg("Hit " + prng);
          } else {
            // BJDebugMsg("Miss " + prng);
            prngOffset += FarmingManager.HARVESTER_PRNG_ADD;
            prng += Math.random() * 100 - prngOffset;
          }
        }
      }

      // if friendly warehouse is in range unload all items into the warehouse
      if (
        GetUnitAbilityLevel(unit, Id.farmerEnableWarehousing) == 0
        || GetUnitAbilityLevel(unit, Id.farmerDisableWarehousing) > 0
      ) {
        const player = GetOwningPlayer(unit);
        let isDumped = false;
        GroupEnumUnitsInRect(Globals.tmpUnitGroup, this.harvesterRect, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          if (isDumped) return;
  
          const warehouse = GetEnumUnit();
          if (
            (
              GetUnitTypeId(warehouse) == Id.farmerWarehouse
              || GetUnitTypeId(warehouse) == Id.farmerSuperWarehouse
            )
            && GetOwningPlayer(warehouse) == player
            && UnitHelper.isUnitAlive(warehouse)
          ) {
            isDumped = true;
            for (let i = 0; i < 6; ++i) {
              const transfer = UnitItemInSlot(unit, i);
              UnitAddItem(warehouse, transfer);
            }
          }
        });
      }

    });
  }
}