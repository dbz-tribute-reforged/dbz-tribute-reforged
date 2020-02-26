import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class BebiSaga extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Bebi Saga';

  protected bebi: unit | undefined;
  protected bebiGooz: unit | undefined;
  
  constructor() {
    super();
    this.delay = 120;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Bebi has taken over the body of Vegeta and begun terrorizing the Earth!"
      ],
    );

    this.addHeroListToSaga(["Super Bebi", "Bebi Golden Oozaru"], true);
    
    this.bebi = this.bosses.get("Super Bebi");
    this.bebiGooz = this.bosses.get("Bebi Golden Oozaru");

    SagaHelper.sagaHideUnit(this.bebiGooz);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3500);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.bebi && this.bebiGooz && 
      SagaHelper.checkUnitHp(this.bebi, 0.5, false, false, false) && 
      SagaHelper.isUnitSagaHidden(this.bebiGooz)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Bebi|r: Bulma, beam me up!",
        ],
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
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }
}
