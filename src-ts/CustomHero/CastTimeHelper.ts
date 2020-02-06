import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { CustomHero } from "./CustomHero";
import { TextTagHelper } from "Common/TextTagHelper";

export module CastTimeHelper {
  export function addEventRightClick(trigger: trigger, input: CustomAbilityInput) {
    // replace with better user input system / detect more inputs
    TriggerRegisterPlayerUnitEvent(
      trigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit && !UnitHelper.isUnitStunned(input.caster.unit);
      })
    );
    TriggerRegisterPlayerUnitEvent(
      trigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit && 
          !UnitHelper.isUnitStunned(input.caster.unit);
      })
    );
  }

  export function addEventStopCasting(trigger: trigger, input: CustomAbilityInput) {
    TriggerRegisterPlayerUnitEvent(
      trigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_ORDER, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit &&
          (GetUnitCurrentOrder(input.caster.unit) == OrderId("stop") ||
           UnitHelper.isUnitStunned(input.caster.unit));
      })
    );

    // if a stunned unit is damaged
    // TriggerRegisterPlayerUnitEvent(
    //   trigger, 
    //   input.casterPlayer, 
    //   EVENT_PLAYER_UNIT_DAMAGED, 
    //   Condition(() => {
    //     return GetFilterUnit() == input.caster.unit && 
    //       UnitHelper.isUnitStunned(input.caster.unit);
    //   })
    // );

    // if you deslect the casting unit
    TriggerRegisterPlayerUnitEvent(
      trigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_DESELECTED, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit;
      })
    );
  }

  export function cleanupCastTime(
    hero: CustomHero, 
    ability: CustomAbility,
    castTimeTimer: timer, 
    readyTrigger: trigger, 
    stopCastingTrigger: trigger
  ) {
    hero.isCastTimeWaiting = false;
    hero.isCasting.set(ability, false);
    DestroyTimer(castTimeTimer);
    DestroyTrigger(readyTrigger);
    DestroyTrigger(stopCastingTrigger);
  }

  export function startCastTimeTimer(
    castTimeTimer: timer, 
    hero: CustomHero, 
    ability: CustomAbility, 
    input: CustomAbilityInput,
    readyTrigger: trigger,
    stopCastingTrigger: trigger,
  ) {
    let castTimeCounter = 0;
    SetUnitAnimation(input.caster.unit, ability.animation);
    const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    const angle = CoordMath.angleBetweenCoords(casterCoord, input.targetPoint);

    TimerStart(castTimeTimer, ability.updateRate, true, () => {
      if (castTimeCounter == 0) {
        SetUnitFacingTimed(input.caster.unit, angle, ability.updateRate);
      }
      castTimeCounter += ability.updateRate;
      if (castTimeCounter > ability.castTime) {
        // then if ready
        // actually activate the ability
        ability.activate(input);
        cleanupCastTime(hero, ability, castTimeTimer, readyTrigger, stopCastingTrigger);
      }
    });
  }

  export function waitCastTimeThenActivate(
    hero: CustomHero, 
    ability: CustomAbility, 
    input: CustomAbilityInput
  ) {
    const readyTrigger = CreateTrigger();
    const castTimeTimer = CreateTimer();
    const stopCastingTrigger = CreateTrigger();
    
    addEventStopCasting(stopCastingTrigger, input);
    TriggerAddAction(stopCastingTrigger, ()=> {
      // DisplayTimedTextToPlayer(input.casterPlayer, 0, 0, 2, "Casting " + ability.name + " cancelled.");
      TextTagHelper.showPlayerColorTextOnUnit(
        ability.name + " cancelled", 
        GetPlayerId(GetOwningPlayer(hero.unit)), 
        hero.unit
      );
      cleanupCastTime(hero, ability, castTimeTimer, readyTrigger, stopCastingTrigger);
    })
    
    if (ability.waitsForNextClick) {
      // TODO: make this into UI instead of just print to screen
      // DisplayTimedTextToPlayer(input.casterPlayer, 0, 0, 2, "Casting " + ability.name + " on next right click.");
      addEventRightClick(readyTrigger, input);
      TriggerAddAction(readyTrigger, () => {
        startCastTimeTimer(castTimeTimer, hero, ability, input, readyTrigger, stopCastingTrigger);
      });
    } else {
      // DisplayTimedTextToPlayer(input.casterPlayer, 0, 0, 2, "Casting " + ability.name + " instantly.");
      ability.activate(input);
      cleanupCastTime(hero, ability, castTimeTimer, readyTrigger, stopCastingTrigger);
    }

  }
}