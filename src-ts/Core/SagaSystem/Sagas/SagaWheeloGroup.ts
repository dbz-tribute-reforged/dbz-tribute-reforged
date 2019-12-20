import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class WheeloSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The World\'s Strongest';

  protected wheelo: unit | undefined;
  protected kochin: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 15;
    this.stats = 25;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Dr. Kochin has revived Dr Wheelo!");

    this.addHeroListToSaga(["Wheelo", "Kishime", "Misokatsun", "Ebifurya", "Dr. Kochin"], true);
    
    this.kochin = this.bosses.get("Dr. Kochin");
    this.wheelo = this.bosses.get("Wheelo");

    SagaHelper.sagaHideUnit(this.wheelo);

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.kochin && this.wheelo && 
      IsUnitDeadBJ(this.kochin) && 
      SagaHelper.isUnitSagaHidden(this.wheelo)
    ) {
      DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Dr. Wheelo: Bring me the world's strongest!");
      SagaHelper.genericTransformAndPing(this.wheelo, this.kochin, this);
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