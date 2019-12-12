import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class WheeloSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The World\'s Strongest';

  protected wheelo: unit | undefined;
  protected kochin: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 10;
    this.stats = 25;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Dr. Kochin has revived Dr Wheelo!");

    this.addHeroListToSaga(["Wheelo", "Kishime", "Misokatsun", "Ebifurya", "Dr. Kochin"], true);
    
    this.kochin = this.bosses.get("Dr. Kochin");
    this.wheelo = this.bosses.get("Wheelo");
    if (this.kochin && this.wheelo) {
      SetUnitInvulnerable(this.wheelo, true);
      PauseUnit(this.wheelo, true);
      ShowUnitHide(this.wheelo);
    }

    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.kochin && this.wheelo) {
      if (
        IsUnitDeadBJ(this.kochin) && 
        IsUnitHidden(this.wheelo)
      ) {
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Dr. Wheelo: Bring me the world's strongest!");

        SetUnitInvulnerable(this.wheelo, false);
        PauseUnit(this.wheelo, false);
        ShowUnitShow(this.wheelo);

        SagaHelper.pingMinimap(this.bosses);
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