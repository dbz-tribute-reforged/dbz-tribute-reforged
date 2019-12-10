import { Players } from "Libs/TreeLib/Structs/Players";
import { Saga } from "./Sagas/BaseSaga";

export module SagaHelper {
  export function areAllBossesDead(bosses: Map<string, unit>): boolean {
    for (const [name, boss] of bosses) {
      if (UnitAlive(boss)) {
        return false;
      }
    }
    return true;
  }

  export function setAllStats(hero: unit, str: number, agi: number, int: number) {
    SetHeroStr(hero, str, true);
    SetHeroAgi(hero, agi, true);
    SetHeroInt(hero, int, true);
  }

  export function addStatRewardOnCompletAction(saga: Saga, sagaRewardTrigger: trigger, stats: number) {

    TriggerRegisterPlayerUnitEvent(
      sagaRewardTrigger,
      Players.NEUTRAL_HOSTILE,
      EVENT_PLAYER_UNIT_DEATH,
      Condition(() => {
        return saga.canComplete();
      }),
    );

    TriggerAddAction(
      sagaRewardTrigger,
      () => {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 15, 
          saga.name + " completed by ..." + " + 0 bonus stats"
        );
        DestroyTrigger(GetTriggeringTrigger());
      },
    )
  }
}