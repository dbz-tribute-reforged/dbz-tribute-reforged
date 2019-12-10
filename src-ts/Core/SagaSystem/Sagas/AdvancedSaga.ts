import { BaseSaga, SagaState, Saga } from "./BaseSaga";
import { Logger } from "Libs/TreeLib/Logger";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: Map<string, unit>;

  public sagaRewardTrigger: trigger;
  public sagaDelayTimer: timer;
  public sagaDelay: number;

  public stats: number;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
    this.stats = 0;
  }

  start(): void {
    Logger.LogDebug(this.name + " Saga Started");
    this.state = SagaState.InProgress;
  }

  complete(): void {
    Logger.LogDebug(this.name + " Saga Completed");
    this.state = SagaState.Completed;
  }

  addHeroListToSaga(names: string[], mustKill: boolean) {
    for (const name of names) {
      SagaHelper.addHeroToAdvancedSaga(this, name, mustKill);
    }
  }

  addEventRewardStats(boss: unit) {
    TriggerRegisterUnitEvent(
      this.sagaRewardTrigger,
      boss, 
      EVENT_UNIT_DEATH,
    )
  }

  addActionRewardStats(saga: Saga) {
    // TriggerRegisterPlayerUnitEvent(
    //   this.sagaRewardTrigger,
    //   Players.NEUTRAL_HOSTILE,
    //   EVENT_PLAYER_UNIT_DEATH,
    //   Condition(() => {
    //     return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO) && saga.canComplete();
    //   }),
    // );
    for (const [name, sagaUnit] of this.bosses) {
      this.addEventRewardStats(sagaUnit);
    }

    TriggerAddAction(
      this.sagaRewardTrigger,
      () => {
        const deadUnit = GetDyingUnit();
        if (IsUnitType(deadUnit, UNIT_TYPE_HERO)) {
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15, 
            GetPlayerName(GetOwningPlayer(GetKillingUnit())) + " just killed " + 
            GetHeroProperName(deadUnit)
          );
        }

        if (saga.canComplete()) {
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15, 
            this.name + " completed by ..." + 
            GetPlayerName(GetOwningPlayer(GetKillingUnit())) + " " + 
            "(" + this.stats + ") bonus stats (not implemented)"
          );
          DestroyTrigger(GetTriggeringTrigger());
        }
      },
    )
  }
}
