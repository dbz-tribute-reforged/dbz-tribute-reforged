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
    TimerStart(this.abilityTimer2, 0.02, true, () => {
      this.runAbilityTimer(0.02);
    });

    TimerStart(this.abilityTimer3, 0.03, true, () => {
      this.runAbilityTimer(0.03);
    });
  }

  public runAbilityTimer(interval: number) {
    const toBeDeleted: CustomAbility[] = [];

    for (const [abil, input] of this.activeAbilities.entries()) {
      if (abil.updateRate != interval) continue;
      if (abil.waitsForNextClick && !abil.isNextRightClick()) continue;

      if (abil.isCasting()) {
        this.runAbilityCasting(abil, input, interval);
      } else {
        this.runAbilityActivation(abil, input, toBeDeleted);
      }
    }

    toBeDeleted.forEach((abil: CustomAbility) => {
      this.activeAbilities.delete(abil);
    });
  }

  runAbilityCasting(abil: CustomAbility, input: CustomAbilityInput, interval: number) {
    if (!abil.isFinishedCasting()) {
      abil.setCastTimeCounter(abil.getCastTimeCounter() + interval);
    } else {
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

  runAbilityActivation(abil: CustomAbility, input: CustomAbilityInput, toBeDeleted: CustomAbility[]) {
    abil.activateOnTimer(input);
    
    if (abil.isFinished()) {
      print(abil.name, " finished");
      if (abil.waitsForNextClick) {
        abil.setNextRightClickFlag(false);
      }
      toBeDeleted.push(abil);
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

    TriggerAddCondition(this.castTimeTrigger, Condition(() => {
      const unit = GetTriggerUnit();
      const unitId = GetHandleId(unit);
      const player = GetTriggerPlayer();
      if (GetOwningPlayer(unit) != player) return false;

      const abils = this.castTimeUnits.get(unitId);
      if (!abils || abils.length == 0) return false;

      const orderId = GetIssuedOrderId();
      const isStunned = UnitHelper.isUnitStunned(unit);
      const isCancelled = !orderId || (orderId && orderId == OrderIds.STOP) || isStunned;

      const toBeDeleted = [];
      for (const abil of abils) {
        print("cast time : ", abil.name);
        if (isCancelled) {
          TextTagHelper.showPlayerColorTextOnUnit(
            abil.name + " cancelled", 
            GetPlayerId(player), 
            unit
          );
          abil.setCastTimeCounter(0);
          this.activeAbilities.delete(abil);
          this.removeCastTimeFromCustomHero(unit, abil);
          toBeDeleted.push(abil);
        } else if (abil.waitsForNextClick) {
          abil.setNextRightClickFlag(true);
          if (abil.castTime > 0) {
            abil.setCastTimeCounter(0.01);
          } else {
            const input = this.activeAbilities.get(abil);
            if (input) abil.activate(input);
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

      return false;
    }));
  }

  removeCastTimeFromCustomHero(unit: unit, ability: CustomAbility) {
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    if (playerId < 0 || playerId > Globals.customPlayers.length) return;

    const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
    if (!customHero) return;

    customHero.isCastTimeWaiting = false;
    customHero.isCasting.set(ability, false);
  }


  waitCastTimeThenActivate(
    hero: CustomHero, 
    ability: CustomAbility, 
    input: CustomAbilityInput
  ) {
    const activeAbil = this.activeAbilities.get(ability);
    if (activeAbil) {
      ability.endAbility();
      ability.resetCooldown();
    } else {
      this.activeAbilities.set(ability, input);
    }

    if (ability.castTime == 0) {
      print("insta start cast ", ability.name)
      ability.activate(input);
      this.removeCastTimeFromCustomHero(hero.unit, ability);
    } else {
      print("delay start cast ", ability.name);
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
    }
  }
}