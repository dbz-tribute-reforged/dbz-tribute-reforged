import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class ShadowDragonSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga I';

  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Overuse of the Dragon Balls has brought immensely powerful Shadow Dragons!"
    );

    this.addHeroListToSaga(["Haze Shenron", "Rage Shenron", "Oceanus Shenron", "Naturon Shenron", "Nuova Shenron", "Eis Shenron"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
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

export class ShadowDragonSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga II';

  protected syn: unit | undefined;
  protected omega: unit | undefined;
  
  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Syn Shenron has arrived seeking the other 6 Dragon Balls!"
    );

    this.addHeroListToSaga(["Syn Shenron", "Omeega Shenron"], true);
    
    this.syn = this.bosses.get("Syn Shenron");
    this.omega = this.bosses.get("Omega Shenron");

    if (this.omega) {
      SetUnitInvulnerable(this.omega, true);
      PauseUnit(this.omega, true);
      ShowUnitHide(this.omega);
    }

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.syn && this.omega) {
      const hp = GetUnitState(this.syn, UNIT_STATE_LIFE);
      if (
        (
          IsUnitDeadBJ(this.syn) || 
          hp < GetUnitState(this.syn, UNIT_STATE_MAX_LIFE) * 0.5
        ) && 
        BlzIsUnitInvulnerable(this.omega) &&
        IsUnitPaused(this.omega) && 
        IsUnitHidden(this.omega)
      ) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 15, 
          "|cffffcc00Omega Shenron|r: By absorbing the other Dragon Balls I have become Omega Shenron!"
        );

        SetUnitX(this.omega, GetUnitX(this.syn));
        SetUnitY(this.omega, GetUnitY(this.syn));

        SetUnitInvulnerable(this.omega, false);
        PauseUnit(this.omega, false);
        ShowUnitShow(this.omega);

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
