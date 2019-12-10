import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { Trigger } from "w3ts";
import { AdvancedSaga } from "./AdvancedSaga";

export class RaditzSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Raditz';

  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Raditz has arrived looking for Goku.");

    this.addHeroListToSaga(["Raditz"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    SagaHelper.addActionRewardStats(this, this.sagaRewardTrigger, 15);
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


export class VegetaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Vegeta';

  constructor() {
    super();
    this.sagaDelay = 15;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Nappa and Vegeta have arrived in West City.");

    const maxSaibamen = 5;
    for (let i = 0; i < maxSaibamen; ++i) {
      const saibaman = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n01Z'), -3300, -5500, 0);
    }

    this.addHeroListToSaga(["Nappa", "Raditz"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    SagaHelper.addActionRewardStats(this, this.sagaRewardTrigger, 30);
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
    // gg_trg_Saiyan_Saga_Creep_Upgrade();
  }
}