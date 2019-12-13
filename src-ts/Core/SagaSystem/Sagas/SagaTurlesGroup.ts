import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

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
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Turles and the Crusher Corps have arrived on Earth!");

    this.addHeroListToSaga(["Turles"], true);
    this.turles = this.bosses.get("Turles");

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.turles && this.availableFruits > 0) {
      const turlesHp = GetUnitState(this.turles, UNIT_STATE_LIFE);
      if (
        turlesHp < GetUnitState(this.turles, UNIT_STATE_MAX_LIFE) * 0.2 &&
        turlesHp > 0
      ) {
        DestroyEffect(AddSpecialEffectTargetUnitBJ(
          "origin", 
          this.turles, 
          "Abilities\\Spells\\Items\\AIem\\AIemTarget.mdl")
        );
        SetHeroLevel(this.turles, GetHeroLevel(this.turles) + 1, true);
        SetHeroStr(this.turles, GetHeroStr(this.turles, true) + 100, true);
        SetHeroAgi(this.turles, GetHeroAgi(this.turles, true) + 25, true);
        SetUnitState(this.turles, UNIT_STATE_LIFE, turlesHp + GetUnitState(this.turles, UNIT_STATE_MAX_LIFE) * 0.5);
        --this.availableFruits;
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