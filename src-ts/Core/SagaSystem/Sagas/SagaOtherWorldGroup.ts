import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class OtherWorldTournamentSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Other World Tournament';

  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Olibu and Pikkon have arrived for the Other World Tournament!"
      ],
    );

    this.addHeroListToSaga(["Olibu", "Pikkon"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 1700);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.sagaDelay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.sagaDelayTimer, this.sagaDelay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }
}
