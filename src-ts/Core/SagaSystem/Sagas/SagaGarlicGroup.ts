import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";

export class DeadZoneSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Dead Zone';

  constructor() {
    super();
    this.sagaDelay = 15;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Garlic Jr has arrived on the lookout! (Korin's, kami not implemented)");

    this.addHeroListToSaga(["Garlic Jr", "Sansho", "Nicky", "Ginger"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    SagaHelper.addActionRewardStats(this, this.sagaRewardTrigger, 10);
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
    this.startTimerDelay(this.spawnSagaUnits);
  }

  complete(): void {
    super.complete();
  }
}

export class GarlicJrSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Garlic Jr';

  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Garlic Jr has returned to the lookout! (Korin's, kami not implemented)");
    
    this.addHeroListToSaga(["Garlic Jr 2", "Spice", "Vinegar", "Mustard", "Salt"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    SagaHelper.addActionRewardStats(this, this.sagaRewardTrigger, 10);
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
    this.startTimerDelay(this.spawnSagaUnits);
  }

  complete(): void {
    super.complete();
  }
}