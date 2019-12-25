import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class AndroidsSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Androids Saga I: 19/20';

  protected android20: unit | undefined;
  protected isRunningAway: boolean;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 100;
    this.isRunningAway = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 19 and Android 20 have begun terrorizing West City!");

    this.addHeroListToSaga(["Android 19", "Android 20"], true);
    this.android20 = this.bosses.get("Android 20");

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.android20 && !this.isRunningAway && 
      SagaHelper.checkUnitHp(this.android20, 0.6, true, false, true)
    ) {
      this.isRunningAway = true;
      DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "|cffffcc00Gero|r: No. 17 and No. 18 will be coming to kill you all!");    
      IssuePointOrder(this.android20, "move", 14000, 7500);
      SetUnitMoveSpeed(this.android20, 522);
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

export class AndroidsSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Androids Saga II: 16/17/18';

  constructor() {
    super();
    this.sagaDelay = 15;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 16, 17, and 18 have been released from Dr. Gero's lab!");

    this.addHeroListToSaga(["Android 16", "Android 17", "Android 18"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.addActionRewardStats(this);
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

export class Super13Saga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Super Android 13!';

  protected android13: unit | undefined;
  protected android14: unit | undefined;
  protected android15: unit | undefined;
  protected super13: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 40;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 13, 14, and 15 have begun terrorizing West City!");

    this.addHeroListToSaga(["Android 13", "Android 14", "Android 15", "Super Android 13"], true);

    this.android13 = this.bosses.get("Android 13");
    this.android14 = this.bosses.get("Android 14");
    this.android15 = this.bosses.get("Android 15");
    this.super13 = this.bosses.get("Super Android 13");

    SagaHelper.sagaHideUnit(this.super13);
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.android13 && this.android14 && this.android15 && this.super13 && 
      SagaHelper.isUnitSagaHidden(this.super13) &&
      (
        SagaHelper.checkUnitHp(this.android13, 0.25, false, false, true) ||
        (IsUnitDeadBJ(this.android14) && IsUnitDeadBJ(this.android15))
      )
    ) {
      DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Super Android 13 has arrived!");
      KillUnit(this.android14);
      KillUnit(this.android15);
      SagaHelper.genericTransformAndPing(this.super13, this.android13, this);
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

export class FutureAndroidsSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Future Androids Saga';

  constructor() {
    super();
    this.sagaDelay = 75;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Future Androids 17 and 18 have begun terrorizing the future.");

    this.addHeroListToSaga(["Future Android 17", "Future Android 18"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 1800);
    }

    this.ping();
    this.addActionRewardStats(this);
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