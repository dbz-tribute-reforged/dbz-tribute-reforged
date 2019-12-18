import { BaseSaga, SagaState, Saga } from "./BaseSaga";
import { Logger } from "Libs/TreeLib/Logger";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";
import { Colorizer } from "Common/Colorizer";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: Map<string, unit>;

  public sagaRewardTrigger: trigger;
  public sagaDelayTimer: timer;
  public sagaDelay: number;

  public stats: number;

  public spawnSound: sound;
  public completeSound: sound;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
    this.stats = 0;
    this.spawnSound = gg_snd_QuestNew;
    this.completeSound = gg_snd_QuestCompleted;
  }

  start(): void {
    // Logger.LogDebug(this.name + " Started");
    this.state = SagaState.InProgress;
  }

  complete(): void {
    // Logger.LogDebug(this.name + " Completed");
    this.state = SagaState.Completed;
    PlaySoundBJ(this.completeSound);
  }

  getColoredName(): string {
    return "|cffffcc00" + this.name + "|r";
  }

  spawnSagaUnits(): void {
    PlaySoundBJ(this.spawnSound);
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
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
        if (saga.canComplete()) {
          DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15, 
            "Completed by " + 
            Colorizer.getColoredPlayerName(GetOwningPlayer(GetKillingUnit()))
          );
          DestroyTrigger(GetTriggeringTrigger());
        }
      },
    )
  }

  ping() {
    SagaHelper.pingMinimap(this.bosses);
  }
}
