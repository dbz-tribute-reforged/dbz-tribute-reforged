import { BaseSaga, SagaState } from "./BaseSaga";
import { Logger } from "Libs/TreeLib/Logger";
import { SagaHelper } from "../SagaHelper";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: Map<string, unit>;

  public sagaRewardTrigger: trigger;
  public sagaDelayTimer: timer;
  public sagaDelay: number;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
  }

  start(): void {
    Logger.LogDebug(this.name + " Saga Started");
    this.state = SagaState.InProgress;
  }

  complete(): void {
    Logger.LogDebug(this.name + " Saga Completed");
    this.state = SagaState.Completed;
  }

  startTimerDelay(callback: () => void): void {
    if (this.sagaDelay <= 0) {
      callback();
    } else {
      TimerStart(this.sagaDelayTimer, this.sagaDelay, false, ()=> {
        callback();
      });
    }
  }

  addHeroListToSaga(names: string[], mustKill: boolean) {
    for (const name in names) {
      SagaHelper.addHeroToAdvancedSaga(this, name, mustKill);
    }
  }
}
