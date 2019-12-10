import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { Trigger } from "w3ts";
import { AdvancedSaga } from "./AdvancedSaga";

export class RaditzSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Raditz';

  constructor() {
    super();
    this.sagaDelay = 60;
    this.stats = 15;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Raditz has arrived looking for Goku.");

    this.addHeroListToSaga(["Raditz"], true);
    
    SagaHelper.pingMinimap(this.bosses);
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


export class VegetaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Nappa and Vegeta';

  protected isNappaOoz: boolean;
  protected isVegetaOoz: boolean;

  constructor() {
    super();
    this.sagaDelay = 15;
    this.stats = 30;
    this.isNappaOoz = false;
    this.isVegetaOoz = false;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Nappa and Vegeta have arrived in West City.");

    const maxSaibamen = 5;
    for (let i = 0; i < maxSaibamen; ++i) {
      const saibaman = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n01Z'), -3300, -5500, 0);
    }

    this.addHeroListToSaga(["Nappa", "Vegeta"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    const vegeta = this.bosses.get("Vegeta");
    if (vegeta && !this.isVegetaOoz) {
      if (GetUnitState(vegeta, UNIT_STATE_LIFE) < GetUnitState(vegeta, UNIT_STATE_MAX_LIFE) * 0.5) {
        BlzSetUnitSkin(vegeta, FourCC("H004"));
        SetHeroStr(vegeta, GetHeroStr(vegeta, true) * 2, true);
        SetHeroAgi(vegeta, GetHeroAgi(vegeta, true) * 1.5, true);
        this.isVegetaOoz = true;
      }
    }
    const nappa = this.bosses.get("Nappa");
    if (nappa && !this.isNappaOoz) {
      if (GetUnitState(nappa, UNIT_STATE_LIFE) < GetUnitState(nappa, UNIT_STATE_MAX_LIFE) * 0.25) {
        BlzSetUnitSkin(nappa, FourCC("H004"));
        SetHeroStr(nappa, GetHeroStr(nappa, true) * 2, true);
        SetHeroAgi(nappa, GetHeroAgi(nappa, true) * 1.5, true);
        this.isNappaOoz = true;
      }
    }
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
    // gg_trg_Saiyan_Saga_Creep_Upgrade();
  }
}