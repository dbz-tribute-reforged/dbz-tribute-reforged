import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class JanembaSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Fusion Reborn';

  protected janemba: unit | undefined;
  protected superJanemba: unit | undefined;
  
  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "The soul cleansing machine in hell has malfunctioned. The stray souls have manifested into the evil demon Janemba"
    );

    this.addHeroListToSaga(["Janemba", "Super Janemba"], true);
    
    this.janemba = this.bosses.get("Janemba");
    this.superJanemba = this.bosses.get("Super Janemba");

    SagaHelper.sagaHideUnit(this.superJanemba);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (
      this.janemba && this.superJanemba &&
      SagaHelper.checkUnitHp(this.janemba, 0.1, false, true, false) && 
      SagaHelper.isUnitSagaHidden(this.superJanemba)
    ) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Janemba|r: JANEMBA! JANEMBA! JANEMBA!"
      );
      SagaHelper.genericTransformAndPing(this.superJanemba, this.janemba, this);
      DestroyEffect(
        AddSpecialEffectTarget(
          "AuraBunkai.mdl",
          this.superJanemba, 
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
