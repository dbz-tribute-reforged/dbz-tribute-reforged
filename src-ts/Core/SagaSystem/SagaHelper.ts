import { Players } from "Libs/TreeLib/Structs/Players";
import { Saga } from "./Sagas/BaseSaga";
import { AdvancedSaga } from "./Sagas/AdvancedSaga";
import { sagaUnitsConfig } from "./Sagas/SagaUnitsConfig";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

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
      // TODO: change to relative str/agi/int
      SagaHelper.setAllStats(sagaUnit, sagaUnitConfig.str, sagaUnitConfig.agi, sagaUnitConfig.int);
      if (mustKill) {
        saga.bosses.set(name, sagaUnit);
      }
      if (GetUnitAbilityLevel(sagaUnit, Constants.evilFightingSkills) == 0) {
        UnitAddAbility(sagaUnit, Constants.evilFightingSkills);
      }
    }
  }

  export function setAllStats(hero: unit, str: number, agi: number, int: number) {
    SetHeroStr(hero, str, true);
    SetHeroAgi(hero, agi, true);
    SetHeroInt(hero, int, true);
  }

  export function pingMinimap(bosses: Map<string, unit>) {
    for (const [name, boss] of bosses) {
      if (IsUnitAliveBJ(boss) && !IsUnitHidden(boss)) {
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
    const isDead = IsUnitType(unit, UNIT_TYPE_DEAD);
    return (
      (
        currentHp < maxHp * threshold || isDead
      ) && 
      (
        (mustBeAlive && !isDead) ||
        (mustBeDead && isDead)
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
      SetUnitInvulnerable(unit, false);
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
}