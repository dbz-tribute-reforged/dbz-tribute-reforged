import { Saga } from "./Sagas/BaseSaga";
import { AdvancedSaga } from "./Sagas/AdvancedSaga";
import { sagaUnitsConfig } from "./SagaUnitsConfig";
import { Capsules, Constants, Globals, Id } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { SagaHeroAI } from "./SagaAISystem/SagaHeroAI";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { SagaAbility } from "./SagaAbility";
import { Players } from "w3ts/globals";
import { TimerManager } from "Core/Utility/TimerManager";
import { SagaUnit } from "./SagaUnit";

export module SagaHelper {
  export let NUM_PLAYERS: number = 0;
  export let SAGA_AVG_STATS: number = 100;

  export function areAllBossesDead(bosses: unit[]): boolean {
    for (const boss of bosses) {
      if (UnitHelper.isUnitAlive(boss)) {
        return false;
      }
    }
    return true;
  }

  export function calculateSagaMinMult(level: number, numPlayers: number) {
    let mult: number = 0.1;

    if (level >= 10) {
      mult = 0.5 + 0.11 * numPlayers + level * 0.01;

      if (level >= 30) {
        mult += 0.1;
      }
      if (level >= 50) {
        mult += 0.2;
      }
      if (level >= 100) {
        mult += 0.2;
      }
      if (level >= 150) {
        mult += 0.2;
      }
  
      if (numPlayers >= 6) {
        mult += 0.4;
      }
      if (numPlayers >= 8) {
        mult += 0.3;
      }
      if (numPlayers >= 10) {
        mult += 0.3;
      }
  
      if (Globals.isNightmare) {
        mult += 1.0;
      }
    } else {
      mult = 0.01 * numPlayers + level * 0.07;
    }

    return Math.max(0.1, mult);
  }

  export function calculateSagaAvgStats() {
    SagaHelper.NUM_PLAYERS = 0;
    let numUnits = 0;
    let sumStats = 0;

    for (const player of Constants.activePlayers) {
      const playerId = GetPlayerId(player);
      const size = BlzGroupGetSize(udg_StatMultPlayerUnits[playerId]);
      if (size <= 0) continue;
      ++SagaHelper.NUM_PLAYERS;

      for (let i = 0; i < size; ++i) {
        const unit = BlzGroupUnitAt(udg_StatMultPlayerUnits[playerId], i);
        const unitId = GetHandleId(unit);
        const unitTypeId = GetUnitTypeId(unit);
        let baseStr = LoadReal(udg_StatMultHashtable, unitId, 0);
        let baseAgi = LoadReal(udg_StatMultHashtable, unitId, 1);
        let baseInt = LoadReal(udg_StatMultHashtable, unitId, 2);

        if (
          unitTypeId == Id.android14 
          || unitTypeId == Id.android15
        ) {
          baseStr *= 3;
          baseAgi *= 3;
          baseInt *= 3;
        }

        if (
          unitTypeId == Id.goten 
          || unitTypeId == Id.kidTrunks
        ) {
          baseStr *= 2;
          baseAgi *= 2;
          baseInt *= 2;
        }

        sumStats += baseStr + baseAgi + baseInt;
        ++numUnits;
      }
    }

    SagaHelper.NUM_PLAYERS = Math.max(2, Math.min(8, SagaHelper.NUM_PLAYERS));
    SagaHelper.SAGA_AVG_STATS = Math.max(120, (sumStats * 0.33) / numUnits);
  }

  // must calculate saga avg stats beforehand
  export function getSagaStats(unit: unit) {
    const mult = calculateSagaMinMult(GetHeroLevel(unit), SagaHelper.NUM_PLAYERS);
    const stats = mult * SagaHelper.SAGA_AVG_STATS;
    return stats;
  }

  export function setSagaStats(unit: unit) {
    const stats = Math.floor(getSagaStats(unit));
    SetHeroStr(unit, stats, true);
    SetHeroAgi(unit, stats, true);
    SetHeroInt(unit, stats, true);
  }

  export function setupSagaUnit(unit: unit) {
    SagaHelper.setSagaStats(unit);
    SetUnitMoveSpeed(unit, Math.min(400, 350 + 0.5 * GetHeroLevel(unit)));
    
    udg_StatMultUnit = unit;
    TriggerExecute(gg_trg_Base_Armor_Set);

    BlzSetUnitArmor(unit, BlzGetUnitArmor(unit) + SagaHelper.NUM_PLAYERS);
  }

  export function addHeroToAdvancedSaga(saga: AdvancedSaga, name: string, mustKill: boolean) {
    const sagaUnitConfig = sagaUnitsConfig.get(name);
    if (!sagaUnitConfig) return;

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
      Player(PLAYER_NEUTRAL_AGGRESSIVE), 
      sagaUnitConfig.unitId, 
      x, 
      y, 
      0
    );
    SetHeroLevel(sagaUnit, sagaUnitConfig.lvl, false);

    if (mustKill) {
      saga.bosses.push(sagaUnit);
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
    // saga.bossesAI.push(
    //   new SagaHeroAI(
    //     sagaUnit
    //   ).addAbilities(
    //     sagaUnitConfig.abilities
    //   )
    // )

    if (sagaUnitConfig.itemDrops.length > 0) {
      saga.bossDrops.set(sagaUnit, sagaUnitConfig.itemDrops);
      for (const itemId of sagaUnitConfig.itemDrops) {
        UnitAddItemById(sagaUnit, itemId);
      }
    }
    
    SagaHelper.checkSagaCapsule(sagaUnitConfig.unitId);
    SagaHelper.setupSagaUnit(sagaUnit);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 1, false, () => {
      SagaHelper.setupSagaAIWrapper(saga, sagaUnit, sagaUnitConfig);
      TimerManager.getInstance().recycle(timer);
    });
  }

  export function setupSagaAIWrapper(saga: AdvancedSaga, sagaUnit: unit, sagaUnitConfig: SagaUnit) {
    saga.bossesAI.set(
      sagaUnit,
      new SagaHeroAI(
        sagaUnit
      ).addAbilities(
        sagaUnitConfig.abilities
      )
    );
  }

  export function pingMinimap(bosses: unit[]) {
    for (const boss of bosses) {
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
    const isDead = !UnitHelper.isUnitAlive(unit);
    return (
      (
        (
          currentHp < maxHp * threshold
        ) ||
        (
          !mustBeAlive && isDead
        )
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
      SagaHelper.calculateSagaAvgStats();
      
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
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, delay, true, ()=> {
      if (counter < messages.length) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, duration, 
          messages[counter]
        );
        ++counter;
      } else {
        TimerManager.getInstance().recycle(timer);
      }
    })
  }

  export function unlockSagaCapsule(abilId: number) {
    for (const player of Constants.activePlayers) {
      SetPlayerAbilityAvailable(player, abilId, true);
    }
  }

  export function checkSagaCapsule(unitTypeId: number) {
    switch (unitTypeId) {
      // case Id.raditz:
      //   unlockSagaCapsule(Capsules.saibamenSeeds)
      //   break;
      case Id.drWheelo:
        unlockSagaCapsule(Capsules.wheeloResearch)
        break;
      case Id.turlesSaga:
        unlockSagaCapsule(Capsules.treeOfMightSapling)
        break;
      case Id.saltSaga:
        unlockSagaCapsule(Capsules.deadZone)
        break;
      case Id.ginyu:
        unlockSagaCapsule(Capsules.scouter2)
        break;
      case Id.metalCooler:
        unlockSagaCapsule(Capsules.getiStarFragment)
        break;
      case Id.zamasu:
        unlockSagaCapsule(Capsules.timeRing)
      case Id.superBuu:
        unlockSagaCapsule(Capsules.potaraEarring)
        break;
      case Id.janemba:
        unlockSagaCapsule(Capsules.dimensionSword)
        break;
      case Id.hirudegarn:
        unlockSagaCapsule(Capsules.braveSword)
        break;
    }
  }
}