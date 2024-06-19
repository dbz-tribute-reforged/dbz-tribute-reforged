import { Constants, Globals } from "Common/Constants";
import { SagaHelper } from "../SagaHelper";
import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";

export class ZenExhibitionMatchSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBS] Zen Exhibition Match Saga 1';

  constructor() {
    super();
    this.delay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020The gods of destruction are upset at universe 7!|r"
      ],
    );

    this.addHeroListToSaga(
      [
        "Iwan",
        "Giin",
        "Mule",
        "Rumsshi",
        "Quitela",
        "Sidra",
      ], 
      true
    );

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return super.canComplete();
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


export class ZenExhibitionMatchSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBS] Zen Exhibition Match Saga 2';

  constructor() {
    super();
    this.delay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020The gods of destruction have arrived to punish universe 7!|r"
      ],
    );

    this.addHeroListToSaga(
      [
        "Champa",
        "Heles",
        "Belmod",
        "Arak",
        "Liquiir",
      ], 
      true
    );

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 4000);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return super.canComplete();
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
