import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class BojackSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Bojack - Unbound';

  constructor() {
    super();
    this.delay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Bojack's crew have arrived for the Interstellar Martial Arts Tournament!",
      ],
    );

    this.addHeroListToSaga(["Bojack", "Bido", "Gokua", "Pujin", "Zangya"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 4000);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return super.canComplete();
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }
}
