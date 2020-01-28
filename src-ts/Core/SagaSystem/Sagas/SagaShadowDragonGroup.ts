import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class ShadowDragonSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga I';

  constructor() {
    super();
    this.delay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Overuse of the Dragon Balls has brought forth immensely powerful Shadow Dragons!"
    );

    this.addHeroListToSaga(["Haze Shenron", "Rage Shenron", "Oceanus Shenron", "Naturon Shenron", "Nuova Shenron", "Eis Shenron"], true);

    for (const [name, boss] of this.bosses) {
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

export class ShadowDragonSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga II';

  protected syn: unit | undefined;
  protected omega: unit | undefined;
  
  constructor() {
    super();
    this.delay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Syn Shenron is looking for the other 6 Dragon Balls!"
    );

    this.addHeroListToSaga(["Syn Shenron", "Omega Shenron"], true);
    
    this.syn = this.bosses.get("Syn Shenron");
    this.omega = this.bosses.get("Omega Shenron");

    SagaHelper.sagaHideUnit(this.omega);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.syn && this.omega &&
      SagaHelper.checkUnitHp(this.syn, 0.8, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.omega)
    ) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Omega Shenron|r: By absorbing the other Dragon Balls I have become Omega Shenron!"
      );
      SagaHelper.genericTransformAndPing(this.omega, this.syn, this);
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
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020End of DBGT Sagas for now.",
      ],
    );
  }
}
