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
      "The soul cleansing machine in hell has broken down, with stray souls manifesting into the evil demon Janemba"
    );

    this.addHeroListToSaga(["Janemba", "Super Janemba"], true);
    
    this.janemba = this.bosses.get("Janemba");
    this.superJanemba = this.bosses.get("Super Janemba");

    if (this.superJanemba) {
      SetUnitInvulnerable(this.superJanemba, true);
      PauseUnit(this.superJanemba, true);
      ShowUnitHide(this.superJanemba);
    }

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.janemba && this.superJanemba) {
      if (
        IsUnitDeadBJ(this.janemba) && 
        BlzIsUnitInvulnerable(this.superJanemba) &&
        IsUnitPaused(this.superJanemba) && 
        IsUnitHidden(this.superJanemba)
      ) {
        DestroyEffect(AddSpecialEffectTargetUnitBJ(
          "origin", 
          this.janemba, 
          "AuraBunkai.mdl")
        );
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 15, 
          "|cffffcc00Janemba|r: JANEMBA! JANEMBA! JANEMBA!"
        );

        SetUnitX(this.superJanemba, GetUnitX(this.janemba));
        SetUnitY(this.superJanemba, GetUnitY(this.janemba));

        SetUnitInvulnerable(this.superJanemba, false);
        PauseUnit(this.superJanemba, false);
        ShowUnitShow(this.superJanemba);

        this.ping();
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
