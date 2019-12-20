import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class BebiSaga extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Bebi Saga';

  protected bebi: unit | undefined;
  protected bebiGooz: unit | undefined;
  
  constructor() {
    super();
    this.sagaDelay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Bebi has taken over the body of Vegeta and begun terrorizing the Earth!"
    );

    this.addHeroListToSaga(["Super Bebi", "Bebi Golden Oozaru"], true);
    
    this.bebi = this.bosses.get("Super Bebi");
    this.bebiGooz = this.bosses.get("Bebi Golden Oozaru");

    SagaHelper.sagaHideUnit(this.bebiGooz);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.bebi && this.bebiGooz && 
      SagaHelper.checkUnitHp(this.bebi, 0.5, false, false, false) && 
      SagaHelper.isUnitSagaHidden(this.bebiGooz)
    ) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Bebi|r: Bulma, beam me up!"
      );
      SagaHelper.genericTransformAndPing(this.bebiGooz, this.bebi, this);
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
