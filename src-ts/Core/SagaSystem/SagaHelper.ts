import { Players } from "Libs/TreeLib/Structs/Players";
import { Saga } from "./Sagas/BaseSaga";
import { AdvancedSaga } from "./Sagas/AdvancedSaga";
import { sagaUnitsConfig } from "./Sagas/SagaUnitsConfig";

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
    const henchmen = sagaUnitsConfig.get(name);
    if (henchmen) {
      const henchmenUnit = CreateUnit(Players.NEUTRAL_HOSTILE, henchmen.unitId, 5500, 22400, 0);
      SetHeroLevel(henchmenUnit, henchmen.lvl, false);
      SagaHelper.setAllStats(henchmenUnit, henchmen.str, henchmen.agi, henchmen.int);
      if (mustKill) {
        saga.bosses.set(name, henchmenUnit);
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