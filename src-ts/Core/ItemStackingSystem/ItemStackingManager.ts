import { Hooks } from "Libs/TreeLib/Hooks";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { Constants } from "Common/Constants";
import { ItemStackingConstants } from "./ItemStackingConstants";

export class ItemStackingManager {
  static instance: ItemStackingManager;

  protected stackableItemTypes: Map<number, () => void>;
  protected itemPickupTrigger: trigger;
  protected numDelayedPickupTimer: number;

  constructor (
  ) {
    this.stackableItemTypes = new Map();
    this.itemPickupTrigger = CreateTrigger();
    this.numDelayedPickupTimer = 0;
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
    // if pick up dragon ball then
    // do nothing if no dragon balls
    // add a charge if have any dballs
    TriggerRegisterAnyUnitEventBJ(
      this.itemPickupTrigger,
      EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER
    );
    // conditions faster than actions hrm?
    TriggerAddCondition(
      this.itemPickupTrigger,
      Condition(() => {
        // note: no auto stack unless in range
        const pickupUnit = GetTriggerUnit();
        const pickupItem = GetOrderTargetItem();
        this.stackItemForUnit(pickupUnit, pickupItem);
        return false;
      })
    )
  }

  // stacks charges from pickupitem to helditem
  // then removes pickupitem
  stackItemForUnit(pickupUnit: unit, pickupItem: item) {
    // check if item is pickup stackable
    const callback = this.stackableItemTypes.get(GetItemTypeId(pickupItem));
    if (callback != undefined) {
      const pickupItemId = GetItemTypeId(pickupItem);
      const heldItemIndex = GetInventoryIndexOfItemTypeBJ(pickupUnit, pickupItemId);
      const heldItem = UnitItemInSlotBJ(pickupUnit, heldItemIndex);
      BJDebugMsg("held index: " + heldItemIndex + " pickup item: " + GetItemName(pickupItem) + " charges: " + GetItemCharges(heldItem));
      if (
        // manipulating item type is already carried
        heldItemIndex > 0 &&
        // item being manipulated comes from external source
        pickupItem != GetItemOfTypeFromUnitBJ(pickupUnit, GetItemTypeId(pickupItem)) &&
        GetItemCharges(heldItem) > 0
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
    callback: () => void = () => {},
  ) {
    return this.stackableItemTypes.set(itemType, callback);
  }

  unitNearItem(pickupUnit: unit, pickupItem: item) {
    const unitPos = new Vector2D(GetUnitX(pickupUnit), GetUnitY(pickupUnit));
    const itemPos = new Vector2D(GetItemX(pickupItem), GetItemY(pickupItem));
    return (
      CoordMath.distance(unitPos, itemPos) < ItemStackingConstants.itemPickupRange
    );
  }

  stackItem(
    heldItem: item, 
    pickupItem: item, 
    callback: () => void = () => {},
  ) {
    SetItemCharges(heldItem, GetItemCharges(heldItem) + GetItemCharges(pickupItem));
    RemoveItem(pickupItem);
    callback();
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
    callback: () => void = () => {},
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
            this.stackItem(heldItem, pickupItem, callback);
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
            this.stackItem(heldItem, pickupItem, callback);
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