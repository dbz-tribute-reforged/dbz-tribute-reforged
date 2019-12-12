import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

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
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 19 and Android 20 have begun terrorizing West City!");

    this.addHeroListToSaga(["Android 19", "Android 20"], true);
    this.android20 = this.bosses.get("Android 20");

    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.android20 && !this.isRunningAway) {
      const android20Hp = GetUnitState(this.android20, UNIT_STATE_LIFE);
      if (
        android20Hp < GetUnitState(this.android20, UNIT_STATE_MAX_LIFE) * 0.2 &&
        android20Hp > 0
      ) {
        IssuePointOrder(this.android20, "move", 14000, 7500);
        SetUnitMoveSpeed(this.android20, 460);
        this.isRunningAway = true;
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

export class AndroidsSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Androids Saga II: 16/17/18';

  constructor() {
    super();
    this.sagaDelay = 15;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 16, 17, and 18 have been released from Dr. Gero's lab!");

    this.addHeroListToSaga(["Android 16", "Android 17", "Android 18"], true);

    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
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
    this.sagaDelay = 30;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Android 13, 14, and 15 have begun terrorizing West City!");

    this.addHeroListToSaga(["Android 13", "Android 14", "Android 15", "Super Android 13"], true);

    this.android13 = this.bosses.get("Android 13");
    this.android14 = this.bosses.get("Android 14");
    this.android15 = this.bosses.get("Android 15");
    this.super13 = this.bosses.get("Super Android 13");

    if (this.super13) {
      SetUnitInvulnerable(this.super13, true);
      PauseUnit(this.super13, true);
      ShowUnitHide(this.super13);
    }

    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.android13 && this.android14 && this.android15 && this.super13) {
      if (
        GetUnitLifePercent(this.android13) < 25 ||
        (IsUnitDeadBJ(this.android14) && IsUnitDeadBJ(this.android15)) 
      ) {
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Super Android 13 has arrived!");

        KillUnit(this.android14);
        KillUnit(this.android15);
                
        SetUnitX(this.super13, GetUnitX(this.android13));
        SetUnitY(this.super13, GetUnitY(this.android13));
        SetUnitInvulnerable(this.super13, false);
        PauseUnit(this.super13, false);
        ShowUnitShow(this.super13);

        SagaHelper.pingMinimap(this.bosses);

        KillUnit(this.android13);
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