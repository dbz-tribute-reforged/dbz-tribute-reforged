import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { CustomHero } from "./CustomHero";
import { TextTagHelper } from "Common/TextTagHelper";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { SoundHelper } from "Common/SoundHelper";
import { Constants, Globals, OrderIds } from "Common/Constants";

export class CastTimeHelper {
  private static instance: CastTimeHelper;

  protected castTimeTrigger: trigger;

  protected castTimeTimer: timer;
  protected abilityTimer2: timer;
  protected abilityTimer3: timer;

  protected castTimeUnits: Map<number, CustomAbility[]>;
  protected activeAbilities: Map<CustomAbility, CustomAbilityInput>;

  constructor () {
    this.castTimeTrigger = CreateTrigger();
    
    this.castTimeTimer = CreateTimer();
    this.abilityTimer2 = CreateTimer();
    this.abilityTimer3 = CreateTimer();
    
    this.castTimeUnits = new Map();
    this.activeAbilities = new Map();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CastTimeHelper();
    }
    return this.instance;
  }


  public initialize() {
    this.setupAbilityTimers();
    this.setupCastTimeTrigger();
  }

  public setupAbilityTimers() {
    TimerStart(this.abilityTimer3, 0.03, true, () => {
      this.runAbilityTimer(0.03);
    });
  }

  public runAbilityTimer(interval: number) {
    const toBeDeleted: CustomAbility[] = [];

    for (const [abil, input] of this.activeAbilities.entries()) {
      if (abil.waitsForNextClick && !abil.isNextRightClick()) continue;

      if (abil.isCasting()) {
        this.runAbilityCasting(abil, input, interval);
      }
      if (abil.isFinished()) {
        toBeDeleted.push(abil);
      }
    }

    toBeDeleted.forEach((abil: CustomAbility) => {
      this.activeAbilities.delete(abil);
    });
  }

  runAbilityCasting(
    abil: CustomAbility, 
    input: CustomAbilityInput, 
    interval: number,
  ) {
    if (!abil.isFinishedCasting()) {
      abil.setCastTimeCounter(abil.getCastTimeCounter() + interval);
    } 
    
    if (abil.isFinishedCasting) {
      abil.setCastTimeCounter(0);
      if (
        abil.name == AbilityNames.BasicAbility.ZANZO_DASH
        || abil.name == AbilityNames.BasicAbility.ZANZOKEN
      ) {
        SoundHelper.playSoundOnUnit(input.caster.unit, "Audio/Effects/Zanzo.mp3", 1149);
      }
      abil.activate(input);
    }
  }

  runAbilityActivation(ability: CustomAbility, input: CustomAbilityInput, toBeDeleted: CustomAbility[]) {
    if (ability.isFinished()) {
      if (ability.waitsForNextClick) {
        ability.setNextRightClickFlag(false);
      }
      toBeDeleted.push(ability);
    } else {
      ability.activateOnTimer(input);
    }
  }

  public setupCastTimeTrigger() {
    // register all valid players for right click activations
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerUnitEvent(
        this.castTimeTrigger, 
        player, 
        EVENT_PLAYER_UNIT_DESELECTED, 
        null
      );
      TriggerRegisterPlayerUnitEvent(
        this.castTimeTrigger, 
        player, 
        EVENT_PLAYER_UNIT_ISSUED_ORDER, 
        null
      );
      TriggerRegisterPlayerUnitEvent(
        this.castTimeTrigger, 
        player, 
        EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, 
        null
      );
      TriggerRegisterPlayerUnitEvent(
        this.castTimeTrigger, 
        player, 
        EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER, 
        null
      );
    }

    TriggerAddAction(this.castTimeTrigger, () => {
      const unit = GetTriggerUnit();
      const unitId = GetHandleId(unit);
      const player = GetTriggerPlayer();
      if (GetOwningPlayer(unit) != player) return;

      const abils = this.castTimeUnits.get(unitId);
      if (!abils || abils.length == 0) {
        return;
      }

      const orderId = GetIssuedOrderId();
      const isStunned = UnitHelper.isUnitStunned(unit);
      const isCancelled = orderId == 0 || (orderId && orderId == OrderIds.STOP) || isStunned;

      const toBeDeleted = [];
      for (const abil of abils) {
        if (isCancelled) {
          TextTagHelper.showPlayerColorTextOnUnit(
            abil.name + " cancelled", 
            GetPlayerId(player), 
            unit
          );
          abil.setCastTimeCounter(0);
          this.removeCastTimeFromCustomHero(unit, abil);
          this.activeAbilities.delete(abil);
          toBeDeleted.push(abil);
        } else if (abil.waitsForNextClick) {
          const x = GetOrderPointX();
          const y = GetOrderPointY();
          if (x == 0 && y == 0) continue;
          
          abil.setNextRightClickFlag(true);
          if (abil.castTime > 0) {
            abil.setCastTimeCounter(0.01);
          }
          this.removeCastTimeFromCustomHero(unit, abil);
          toBeDeleted.push(abil);
        }
      }
      
      this.castTimeUnits.set(
        unitId,
        abils.filter((value: CustomAbility) => {
          return toBeDeleted.indexOf(value) < 0;
        })
      );

      return;
    });
  }


  // note: requires undeleted activeAbilities link
  removeCastTimeFromCustomHero(unit: unit, ability: CustomAbility) {
    const input = this.activeAbilities.get(ability);
    if (!input) return;
    this.resetCastTime(ability, input);
  }

  resetCastTime(ability: CustomAbility, input: CustomAbilityInput) {
    if (!input.caster) return;
    input.caster.isCastTimeWaiting = false;
    input.caster.isCasting.set(ability, false);
  }

  forceEndActivatedAbility(ability: CustomAbility) {
    ability.endAbility();
    ability.resetCooldown();
    if (ability.isInUse()) {
      ability.activateOnTimer(ability.getLastInput()); // force end
    }
  }

  waitCastTimeThenActivate(
    hero: CustomHero, 
    ability: CustomAbility, 
    input: CustomAbilityInput
  ) {
    if (!ability.isFinished()) {
      // dont cancel some abilities basics
      if (
        ability.name == AbilityNames.BasicAbility.ZANZOKEN
        || ability.name == AbilityNames.BasicAbility.ZANZO_DASH
        || ability.name == AbilityNames.YamchaR.LIGHT_PUNCH
        || ability.name == AbilityNames.YamchaR.MEDIUM_PUNCH
        || ability.name == AbilityNames.YamchaR.HEAVY_PUNCH
      ) {
        return;
      }
      this.forceEndActivatedAbility(ability);
    }

    if (ability.castTime == 0) {
      this.resetCastTime(ability, input);
      ability.activate(input);
    } else {
      const unitId = GetHandleId(hero.unit);
      const arr = this.castTimeUnits.get(unitId);
      if (arr) {
        arr.push(ability);
      } else {
        this.castTimeUnits.set(unitId, [ability]);
      }
      if (!ability.waitsForNextClick) {
        ability.setCastTimeCounter(0.01);
      }
      this.activeAbilities.set(ability, input);
    }
  }
}