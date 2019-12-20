import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { Trigger } from "w3ts";
import { AdvancedSaga } from "./AdvancedSaga";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";
import { UnitHelper } from "Common/UnitHelper";

export class RaditzSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Saiyan Saga I: Raditz';

  constructor() {
    super();
    this.sagaDelay = 60;
    this.stats = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Raditz has arrived looking for Goku.");

    this.addHeroListToSaga(["Raditz"], true);
    
    this.ping()
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


export class VegetaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Saiyan Saga II: Nappa and Vegeta';

  
  protected vegeta: unit | undefined;
  protected nappa: unit | undefined;
  protected isNappaOoz: boolean;
  protected isVegetaOoz: boolean;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 30;
    this.isNappaOoz = false;
    this.isVegetaOoz = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.POST_SAIYANS);
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Nappa and Vegeta have arrived in West City.");

    const maxSaibamen = 5;
    for (let i = 0; i < maxSaibamen; ++i) {
      const saibaman = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n01Z'), -3300, -5500, 0);
    }

    this.addHeroListToSaga(["Nappa", "Vegeta"], true);

    this.vegeta = this.bosses.get("Vegeta");
    this.nappa = this.bosses.get("Nappa");
    
    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.vegeta && !this.isVegetaOoz &&
      SagaHelper.checkUnitHp(this.vegeta, 0.4, true, false, true)
    ) {
      this.isVegetaOoz = true;
      this.fakeOoz(this.vegeta);
    }
    
    if (
      this.nappa && !this.isNappaOoz &&
      SagaHelper.checkUnitHp(this.nappa, 0.2, true, false, true)
    ) {
      this.isNappaOoz = true;
      this.fakeOoz(this.nappa);
    }
  }

  fakeOoz(unit: unit) {
    BlzSetUnitSkin(unit, FourCC("H004"));
    SetHeroStr(unit, Math.floor(GetHeroStr(unit, true) * 2), true);
    SetHeroAgi(unit, Math.floor(GetHeroAgi(unit, true) * 1.5), true);
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
        unit, 
        "origin", 
      )
    );
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