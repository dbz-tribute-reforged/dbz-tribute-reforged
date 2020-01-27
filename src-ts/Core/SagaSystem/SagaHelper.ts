import { Players } from "Libs/TreeLib/Structs/Players";
import { Saga } from "./Sagas/BaseSaga";
import { AdvancedSaga } from "./Sagas/AdvancedSaga";
import { sagaUnitsConfig } from "./SagaUnitsConfig";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { SagaHeroAI } from "./SagaAISystem/SagaHeroAI";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { SagaAbility } from "./SagaAbility";

export module SagaHelper {
  export function areAllBossesDead(bosses: Map<string, unit>): boolean {
    for (const [name, boss] of bosses) {
      if (UnitAlive(boss)) {
        return false;
      }
    }
    return true;
  }

  export function addHeroToAdvancedSaga(saga: AdvancedSaga, name: string, mustKill: boolean) {
    const sagaUnitConfig = sagaUnitsConfig.get(name);
    if (sagaUnitConfig) {
      let x = sagaUnitConfig.spawnPos.x;
      let y = sagaUnitConfig.spawnPos.y;
      if (
        sagaUnitConfig.spawnPos.x > GetRectMaxX(GetPlayableMapRect()) || 
        sagaUnitConfig.spawnPos.x < GetRectMinX(GetPlayableMapRect()) || 
        sagaUnitConfig.spawnPos.y > GetRectMaxY(GetPlayableMapRect()) || 
        sagaUnitConfig.spawnPos.y < GetRectMinY(GetPlayableMapRect()) 
      ) {
        x = 0;
        y = 0;
      }
      const sagaUnit = CreateUnit(
        Players.NEUTRAL_HOSTILE, 
        sagaUnitConfig.unitId, 
        x, 
        y, 
        0
      );
      SetHeroLevel(sagaUnit, sagaUnitConfig.lvl, false);
      // -> gui automatic stats setting
      // SagaHelper.setAllStats(sagaUnit, sagaUnitConfig.str, sagaUnitConfig.agi, sagaUnitConfig.int);
      if (mustKill) {
        saga.bosses.set(name, sagaUnit);
      }
      if (GetUnitAbilityLevel(sagaUnit, Constants.evilFightingSkills) == 0) {
        UnitAddAbility(sagaUnit, Constants.evilFightingSkills);
      }
      /*
      saga.bossesAI.set(
        sagaUnit,
        new SagaHeroAI(
          sagaUnit
        ).addWeakBeams(
          sagaUnitConfig.weakBeams
        ).addStrongBeams(
          sagaUnitConfig.strongBeams
        )
      )
      */
      saga.bossesAI.set(
        sagaUnit,
        new SagaHeroAI(
          sagaUnit
        ).addAbilities(
          sagaUnitConfig.abilities
        )
      );
    }
  }

  export function setAllStats(hero: unit, str: number, agi: number, int: number) {
    SetHeroStr(hero, str, true);
    SetHeroAgi(hero, agi, true);
    SetHeroInt(hero, int, true);
  }

  export function pingMinimap(bosses: Map<string, unit>) {
    for (const [name, boss] of bosses) {
      if (UnitHelper.isUnitAlive(boss) && !IsUnitHidden(boss)) {
        PingMinimapForForceEx(
          bj_FORCE_ALL_PLAYERS, 
          GetUnitX(boss), 
          GetUnitY(boss), 
          5, bj_MINIMAPPINGSTYLE_FLASHY, 
          100, 75, 0
        );
      }
    }
  }

  export function pingDeathMinimap(dyingUnit: unit) {
    PingMinimapForForceEx(
      bj_FORCE_ALL_PLAYERS, 
      GetUnitX(dyingUnit), 
      GetUnitY(dyingUnit), 
      4, bj_MINIMAPPINGSTYLE_ATTACK, 
      100, 0, 0
    );
  }

  export function checkUnitHp(
    unit: unit, 
    threshold: number,
    mustBeAlive: boolean,
    mustBeDead: boolean,
    mustNotBeStunned: boolean,
  ) {
    const currentHp = GetUnitState(unit, UNIT_STATE_LIFE);
    const maxHp = GetUnitState(unit, UNIT_STATE_MAX_LIFE);
    const isDead = UnitHelper.isUnitDead(unit);
    return (
      (
        currentHp < maxHp * threshold
      ) && 
      (
        (!mustBeAlive || !isDead) &&
        (!mustBeDead || isDead)
      ) &&
      (
        !mustNotBeStunned || !UnitHelper.isUnitStunned(unit)
      )
    );
  }

  export function sagaHideUnit(
    unit: unit | undefined
  ) {
    if (unit) {
      SetUnitInvulnerable(unit, true);
      PauseUnit(unit, true);
      ShowUnitHide(unit);
    }
  }

  export function sagaShowUnitAtUnit(
    hiddenUnit: unit,
    targetUnit: unit,
  ) {
    SetUnitX(hiddenUnit, GetUnitX(targetUnit));
    SetUnitY(hiddenUnit, GetUnitY(targetUnit));
    sagaShowUnit(hiddenUnit);
  }

  export function sagaShowUnit(
    unit: unit | undefined
  ) {
    if (unit) {
      // SetUnitInvulnerable(unit, false);
      PauseUnit(unit, false);
      ShowUnitShow(unit);
    }
  }

  export function genericTransformAndPing(
    newUnit: unit,
    oldUnit: unit,
    sagaToPing: Saga,
  ) {
    sagaShowUnitAtUnit(newUnit, oldUnit);
    if (!IsUnitType(oldUnit, UNIT_TYPE_DEAD)) {
      KillUnit(oldUnit);
    }
    sagaToPing.ping();
  }
  
  export function isUnitSagaHidden(
    unit: unit
  ) {
    return (
      BlzIsUnitInvulnerable(unit) &&
      IsUnitPaused(unit) && 
      IsUnitHidden(unit)
    )
  }

  export function showMessagesChanceOfJoke(
    messages: string[],
    joke: string[] = [],
    delay: number = Constants.sagaDisplayTextDelay,
    duration: number = Constants.sagaDisplayTextDuration,
    jokeProbability: number = Constants.jokeProbability,
  ) {
    const rng = Math.random();
    if (rng > jokeProbability || joke.length == 0) {
      showMessages(messages, delay, duration);
    } else {
      showMessages(joke, delay, duration);
    }
  }

  export function showMessages(
    messages: string[],
    delay: number = Constants.sagaDisplayTextDelay,
    duration: number = Constants.sagaDisplayTextDuration,
  ) {
    let counter = 0;
    if (counter < messages.length) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, duration, 
        messages[counter]
      );
      ++counter;
    }
    TimerStart(CreateTimer(), delay, true, ()=> {
      if (counter < messages.length) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, duration, 
          messages[counter]
        );
        ++counter;
      } else {
        DestroyTimer(GetExpiredTimer());
      }
    })
  }
}