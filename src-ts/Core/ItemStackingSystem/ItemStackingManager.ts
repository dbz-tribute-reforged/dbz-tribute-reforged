import { Hooks } from "Libs/TreeLib/Hooks";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { ItemStackingConstants } from "./ItemStackingConstants";
import { UnitHelper } from "Common/UnitHelper";

export class ItemStackingManager {
  static instance: ItemStackingManager;

  protected stackableItemTypes: Map<number, number>;
  protected itemTargetPickupTrigger: trigger;
  protected numDelayedPickupTimer: number;
  protected itemAcquireTrigger: trigger;

  constructor (
  ) {
    this.stackableItemTypes = new Map();
    this.itemTargetPickupTrigger = CreateTrigger();
    this.numDelayedPickupTimer = 0;
    this.itemAcquireTrigger = CreateTrigger();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ItemStackingManager();
      Hooks.set("ItemStackingManager", this.instance);
    }
    return this.instance;
  }

  initialize() {

    // if unit targets picking up an item
    // but inventory is full
    TriggerRegisterAnyUnitEventBJ(
      this.itemTargetPickupTrigger,
      EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER
    );
    // conditions faster than actions hrm?
    TriggerAddCondition(
      this.itemTargetPickupTrigger,
      Condition(() => {
        // note: no auto stack unless in range
        const pickupUnit = GetTriggerUnit();
        const pickupItem = GetOrderTargetItem();
        this.pickupStackedItemForUnit(pickupUnit, pickupItem);
        return false;
      })
    )

    // unit acquires item normally
    TriggerRegisterAnyUnitEventBJ(
      this.itemAcquireTrigger,
      EVENT_PLAYER_UNIT_PICKUP_ITEM,
    );
    TriggerAddCondition(
      this.itemAcquireTrigger, 
      Condition(() => {
        const pickupItem = GetManipulatedItem();
        const maxStacks = this.stackableItemTypes.get(GetItemTypeId(pickupItem));
        if (maxStacks) {
          const pickupUnit = GetManipulatingUnit();
          let heldItem = UnitItemInSlot(pickupUnit, 0);
          for (let i = 1; i < 6; ++i) {
            if (
              GetItemTypeId(heldItem) == GetItemTypeId(pickupItem) &&
              heldItem != pickupItem
            ) {
              break;
            } else {
              heldItem = UnitItemInSlot(pickupUnit, i);
            }
          }
          if (
            GetItemTypeId(heldItem) == GetItemTypeId(pickupItem) &&
            heldItem != pickupItem &&
            GetItemCharges(heldItem) > 0 && GetItemCharges(pickupItem) > 0
          ) {
            this.stackItem(heldItem, pickupItem, maxStacks);
          }
        }
        
        return false;
      })
    )
  }

  // stacks charges from pickupitem to helditem
  // then removes pickupitem
  pickupStackedItemForUnit(pickupUnit: unit, pickupItem: item) {
    // check if item is pickup stackable
    const callback = this.stackableItemTypes.get(GetItemTypeId(pickupItem));
    if (callback != undefined) {
      const pickupItemId = GetItemTypeId(pickupItem);
      const heldItemIndex = UnitHelper.getInventoryIndexOfItemType(pickupUnit, pickupItemId);
      const heldItem = UnitItemInSlot(pickupUnit, heldItemIndex);
      // BJDebugMsg("held index: " + heldItemIndex + " pickup item: " + GetItemName(pickupItem) + " charges: " + GetItemCharges(heldItem));
      if (
        // manipulating item type is already carried
        heldItemIndex >= 0 &&
        // item being manipulated comes from external source
        pickupItem != GetItemOfTypeFromUnitBJ(pickupUnit, GetItemTypeId(pickupItem)) &&
        GetItemCharges(heldItem) > 0 && GetItemCharges(pickupItem) > 0
      ) {
        if (this.unitNearItem(pickupUnit, pickupItem)) {
          this.stackItem(heldItem, pickupItem, callback);
        } else {
          // too far away to stack
          // hrm..
          // poll? until the unit gets there
          this.setupDelayedPickup(pickupUnit, heldItem, pickupItem, callback);
        }
      }
    }
  }

  public addStackableItemType(
    itemType: number, 
    maxStacks: number,
  ) {
    return this.stackableItemTypes.set(itemType, maxStacks);
  }

  unitNearItem(pickupUnit: unit, pickupItem: item): boolean {
    // const unitPos = new Vector2D(GetUnitX(pickupUnit), GetUnitY(pickupUnit));
    // const itemPos = new Vector2D(GetItemX(pickupItem), GetItemY(pickupItem));
    const unitLoc = Location(GetUnitX(pickupUnit), GetUnitY(pickupUnit));
    const itemLoc = Location(GetItemX(pickupItem), GetItemY(pickupItem));

    const result: boolean = DistanceBetweenPoints(unitLoc, itemLoc) < ItemStackingConstants.itemPickupRange;

    RemoveLocation(unitLoc);
    RemoveLocation(itemLoc);
    return result;
  }

  stackItem(
    heldItem: item, 
    pickupItem: item, 
    maxStacks: number,
  ) {
    const heldCharges = GetItemCharges(heldItem);
    const pickupCharges = GetItemCharges(pickupItem)
    if (heldCharges >= maxStacks || pickupCharges >= maxStacks) return;

    if (heldCharges + pickupCharges < maxStacks) {
      SetItemCharges(heldItem, heldCharges + pickupCharges);
      RemoveItem(pickupItem);
    } else {
      SetItemCharges(heldItem, maxStacks);
      SetItemCharges(pickupItem, heldCharges + pickupCharges - maxStacks);
    }
  }

  cleanupDelayedPickup(
    delayedPickupTimer: timer,
    acquiredItemTrigger: trigger,
    cancelDelayedPickup: trigger,
  ) {
    DestroyTimer(delayedPickupTimer);
    DestroyTrigger(acquiredItemTrigger);
    DestroyTrigger(cancelDelayedPickup);
  }

  setupDelayedPickup(
    pickupUnit: unit, 
    heldItem: item, 
    pickupItem: item,
    maxStacks: number,
  ) {
    if (this.numDelayedPickupTimer < ItemStackingConstants.maxPickupTimers) {
      ++this.numDelayedPickupTimer;
      let timerLife = 0;
      const delayedPickupTimer = CreateTimer();
      
      const acquiredItemTrigger = CreateTrigger();

      // if unit does anything else
      // they aren't picking item up, hence destroy timer
      const cancelDelayedPickup = CreateTrigger();

      TimerStart(delayedPickupTimer, ItemStackingConstants.delayedPickupCheckInterval, true, () => {
        if (timerLife > ItemStackingConstants.delayedPickupCheckDuration) {
          --this.numDelayedPickupTimer;
          this.cleanupDelayedPickup(
            delayedPickupTimer,
            acquiredItemTrigger,
            cancelDelayedPickup,
          );
        } else {
          if (this.unitNearItem(pickupUnit, pickupItem)) {
            this.stackItem(heldItem, pickupItem, maxStacks);
            this.cleanupDelayedPickup(
              delayedPickupTimer,
              acquiredItemTrigger,
              cancelDelayedPickup,
            );
          }
        }
      });

      TriggerRegisterUnitEvent(
        acquiredItemTrigger,
        pickupUnit,
        EVENT_UNIT_PICKUP_ITEM
      );
      TriggerAddCondition(
        acquiredItemTrigger,
        Condition(() => {
          if (GetManipulatedItem() == pickupItem) {
            this.stackItem(heldItem, pickupItem, maxStacks);
            this.cleanupDelayedPickup(
              delayedPickupTimer,
              acquiredItemTrigger,
              cancelDelayedPickup,
            );
          }
          return false;
        })
      )

      TriggerRegisterUnitEvent(
        cancelDelayedPickup,
        pickupUnit,
        EVENT_UNIT_ISSUED_ORDER
      );
      TriggerRegisterUnitEvent(
        cancelDelayedPickup,
        pickupUnit,
        EVENT_UNIT_ISSUED_TARGET_ORDER
      );
      TriggerRegisterUnitEvent(
        cancelDelayedPickup,
        pickupUnit,
        EVENT_UNIT_ISSUED_POINT_ORDER
      );

      TriggerAddCondition(cancelDelayedPickup, Condition(() => {
        if (this.unitNearItem(pickupUnit, pickupItem)) {
          this.stackItem(heldItem, pickupItem, maxStacks);
        }
        this.cleanupDelayedPickup(
          delayedPickupTimer,
          acquiredItemTrigger,
          cancelDelayedPickup,
        );
        return false;
      }));
    }
  }
}