import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { UnitHelper } from "Common/UnitHelper";

export class TurlesSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The Tree of Might';

  protected availableFruits: number;
  protected turles: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 45;
    this.stats = 25;
    this.availableFruits = 2;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Turles and the Crusher Corps have arrived on Earth!");

    this.addHeroListToSaga(["Turles"], true);
    this.turles = this.bosses.get("Turles");

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (
      this.turles && this.availableFruits > 0 && 
      SagaHelper.checkUnitHp(this.turles, 0.15, true, false, true)
    ) {
      --this.availableFruits;
      SetHeroLevel(this.turles, GetHeroLevel(this.turles) + 1, true);
      SetHeroStr(this.turles, Math.floor(GetHeroStr(this.turles, true) * 1.1 + 50), true);
      SetHeroAgi(this.turles, Math.floor(GetHeroAgi(this.turles, true) * 1.05 + 25), true);
      SetUnitState(
        this.turles, 
        UNIT_STATE_LIFE, 
        GetUnitState(this.turles, UNIT_STATE_LIFE) + GetUnitState(this.turles, UNIT_STATE_MAX_LIFE) * 0.5
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Items\\AIem\\AIemTarget.mdl",
          this.turles, 
          "origin", 
        )
      );
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