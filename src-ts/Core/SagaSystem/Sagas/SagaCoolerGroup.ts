import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";

export class CoolerRevengeSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Cooler\'s Revenge';

  protected cooler: unit | undefined;
  protected isFinalForm: boolean;

  constructor() {
    super();
    this.sagaDelay = 40;
    this.stats = 100;
    this.isFinalForm = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Cooler has come to Earth seeking revenge!");

    this.addHeroListToSaga(["Cooler"], true);
    this.cooler = this.bosses.get("Cooler");

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.cooler && !this.isFinalForm) {
      const coolerHp = GetUnitState(this.cooler, UNIT_STATE_LIFE);
      if (
        coolerHp < GetUnitState(this.cooler, UNIT_STATE_MAX_LIFE) * 0.5 &&
        coolerHp > 0
      ) {
        DestroyEffect(AddSpecialEffectTargetUnitBJ(
          "origin", 
          this.cooler, 
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl")
        );
        BlzSetUnitSkin(this.cooler, FourCC("H043"));
        SetUnitScale(this.cooler, 2.0, 2.0, 2.0);
        SetHeroLevel(this.cooler, GetHeroLevel(this.cooler) + 5, true);
        SetHeroStr(this.cooler, Math.floor(GetHeroStr(this.cooler, true) * 1.5), true);
        SetHeroAgi(this.cooler, Math.floor(GetHeroAgi(this.cooler, true) * 1.5), true);
        this.isFinalForm = true;
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
  }

}

export class CoolerReturnSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The Return of Cooler';

  protected metalCoolers: unit[];
  protected revives: number;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 100;
    this.metalCoolers = [];
    this.revives = 5;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Cooler has fused with the Big Gete Star to become Metal Cooler!");

    this.addHeroListToSaga(["Metal Cooler 1", "Metal Cooler 2", "Metal Cooler 3"], true);
    const mc1 = this.bosses.get("Metal Cooler 1");
    const mc2 = this.bosses.get("Metal Cooler 2");
    const mc3 = this.bosses.get("Metal Cooler 3");

    if (mc1 && mc2 && mc3) {
      this.metalCoolers.push(mc1, mc2, mc3);
      SetUnitAcquireRange(mc1, 99999);
      SetUnitAcquireRange(mc2, 99999);
      SetUnitAcquireRange(mc3, 99999);
    }

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    for (const mc of this.metalCoolers) {
      if (IsUnitAliveBJ(mc)) {
        SetUnitLifePercentBJ(mc, GetUnitLifePercent(mc) + 0.02);
      } else if (this.revives > 0) {
        --this.revives;
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Metal Cooler: But how could this be? The Big Gete Star allowed me to cheat death!");    
        ReviveHero(mc, GetUnitX(mc), GetUnitY(mc), true);
        SetHeroStr(mc, Math.floor(GetHeroStr(mc, true) * 1.1 + 100), true);
        SetHeroInt(mc, Math.floor(GetHeroStr(mc, true) * 1.1 + 100), true);
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
  }

}