import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class DeadZoneSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Dead Zone';

  constructor() {
    super();
    this.delay = 30;
    this.stats = 10;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Garlic Jr has taken over the lookout!",
      ],
    );

    this.addHeroListToSaga(["Garlic Jr", "Sansho", "Nicky", "Ginger"], true);
    
    this.ping()
    this.setupBossDeathActions(this);
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

export class GarlicJrSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Garlic Jr Saga';

  constructor() {
    super();
    this.delay = 15;
    this.stats = 50;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Garlic Jr has returned from the Dead Zone!",
      ],
    );
    
    this.addHeroListToSaga(["Garlic Jr 2", "Spice", "Vinegar", "Mustard", "Salt"], true);
    
    this.ping()
    this.setupBossDeathActions(this);
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
    SagaHelper.showMessagesChanceOfJoke(
      [],
      [
        "|cffff2020Team Garlic are blasting off again!|r",
      ],
    );
  }
}