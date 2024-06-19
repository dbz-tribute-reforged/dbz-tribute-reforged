import { Constants, Globals, Id } from "Common/Constants";
import { Logger } from "Common/Logger";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { FusionUnit } from "./FusionUnit";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { TimerManager } from "Core/Utility/TimerManager";

export class FusionManager { 
  public static MAX_FUSE_DISTANCE = 600;
  public static MAX_FUSE_DELAY = 0.5;

  public static instance: FusionManager;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new FusionManager();
    }
    return this.instance;
  }

  public delay: number;

  public fusionInitTrigger: trigger;
  public unit1: unit = null;
  public unit2: unit = null;

  public fusionUnits: Map<unit, FusionUnit> = new Map<unit, FusionUnit>();

  constructor() {
    this.delay = 0;

    this.fusionInitTrigger = CreateTrigger();

    this.initialize();
  }

  initialize() {
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerUnitEvent(
        this.fusionInitTrigger, player, EVENT_PLAYER_UNIT_USE_ITEM, null
      );
    }

    TriggerAddCondition(this.fusionInitTrigger, Condition(() => {
      const item = GetManipulatedItem();
      const itemId = GetItemTypeId(item);
      if (itemId != ItemConstants.potaraEarrings) return false;

      const unit = GetTriggerUnit();
      const unitId = GetHandleId(unit);
      const unitTypeId = GetUnitTypeId(unit);
      const player = GetOwningPlayer(unit);
      
      if (
        !UnitHelper.isUnitRealHero(unit)
        || unit == this.unit1
      ) return false;

      if (GetUnitAbilityLevel(unit, Id.flagPotaraFusion) > 0) {
        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffff2222Error: Already fused.|r"
        );
        return;
      }

      if (UnitHasItemOfTypeBJ(unit, ItemConstants.ginyuBodyChange)) {
        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffff2222Error: Cannot fuse with body change|r"
        );
        return;
      }

      if (
        unitTypeId == Id.goten
        || unitTypeId == Id.kidTrunks
        || unitTypeId == Id.android13
        || unitTypeId == Id.android14
        || unitTypeId == Id.android15
        || unitTypeId == Id.superBuu
        || unitTypeId == Id.cellUnformed
        || unitTypeId == Id.cellFirst
        || unitTypeId == Id.cellSemi
        || unitTypeId == Id.fourthCooler
      ) {
        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffff2222Error: " + GetHeroProperName(unit) + " cannot fuse|r"
        );
        return false;
      }

      const transformTime = LoadReal(udg_StatMultHashtable, unitId, 9);
      if (transformTime > 0) {
        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffff2222Error: Cannot fuse while transformed|r"
        );
        return;
      }

      this.registerFusion(unit);

      if (this.unit2 == null && this.delay == 0) {
        const timer = TimerManager.getInstance().get();
        TimerStart(timer, 0.03, true, ()=> {
          this.delay += 0.03;
          if (this.delay > FusionManager.MAX_FUSE_DELAY) {
            this.failFuse(this.unit1);
            this.failFuse(this.unit2);
            this.unit1 = null;
            this.unit2 = null;
            this.delay = 0;
            TimerManager.getInstance().recycle(timer);
            return;
          }
        });
      }

      if (this.unit2 != null) {
        this.fuseUnits(this.unit1, this.unit2);
        this.unit1 = null;
        this.unit2 = null;
      }

      return false;
    }));

    // select 2 units for fusion
    // graft the second to the first
    // enforce positioning rules onto both (somehow)
  }

  registerFusion(unit: unit) {
    if (
      this.unit1 == null 
      || !IsUnitAlly(unit, GetOwningPlayer(this.unit1))
      // || GetOwningPlayer(this.unit1) == GetOwningPlayer(unit)
    ) {
      this.unit1 = unit;
    } else {
      this.unit2 = unit;
    }  
  }

  failFuse(unit: unit) {
    if (unit == null) return;
    Globals.tmpVector.setUnit(unit);
    UnitHelper.payHPPercentCost(unit, 0.15, UNIT_STATE_MAX_LIFE);
    UnitHelper.payMPPercentCost(unit, 0.15, UNIT_STATE_MAX_MANA);
    DestroyEffect(AddSpecialEffect(
      "Abilities/Spells/Orc/FeralSpirit/feralspirittarget.mdl", 
      Globals.tmpVector.x, Globals.tmpVector.y
    ));
    DisplayTimedTextToPlayer(
      GetOwningPlayer(unit), 0, 0, 5, "|cffff2222Fusion failed!"
    );
  }

  fuseUnits(unit1: unit, unit2: unit) {
    if (unit1 == null) {
      Logger.LogDebug("invalid unit1", unit1);
      return;
    }
    if (unit2 == null) {
      Logger.LogDebug("invalid unit2", unit2);
      return;
    }

    Globals.tmpVector.setUnit(unit1);
    Globals.tmpVector2.setUnit(unit2);

    const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    if (dist > FusionManager.MAX_FUSE_DISTANCE) {
      this.failFuse(unit1);
      this.failFuse(unit2);
      return;
    }

    Logger.LogDebug("Delay = ", this.delay);

    const sfx = AddSpecialEffect(
      "Abilities/Spells/Human/ReviveHuman/ReviveHuman.mdl", 
      Globals.tmpVector.x, Globals.tmpVector.y
    );
    BlzSetSpecialEffectScale(sfx, 5.0);
    DestroyEffect(sfx);

    const fusionUnit = new FusionUnit(this.unit1, this.unit2);
    this.fusionUnits.set(this.unit1, fusionUnit);
    this.fusionUnits.set(this.unit2, fusionUnit);
  }
}