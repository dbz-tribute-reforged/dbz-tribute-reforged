import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";

export class DeadZoneSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Dead Zone';

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 10;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Garlic Jr has taken over the lookout!");

    this.addHeroListToSaga(["Garlic Jr", "Sansho", "Nicky", "Ginger"], true);
    
    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
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

export class GarlicJrSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Garlic Jr Saga';

  constructor() {
    super();
    this.sagaDelay = 15;
    this.stats = 50;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Garlic Jr has returned from the Dead Zone!");
    
    this.addHeroListToSaga(["Garlic Jr 2", "Spice", "Vinegar", "Mustard", "Salt"], true);
    
    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
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