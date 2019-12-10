import { Saga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { AdvancedSaga } from "./AdvancedSaga";

export class NamekSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Namek';

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 50;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Zarbon and Dodoria have arrived looking for the Dragon Balls.");

    // create unit
    const maxFriezaHenchmen = 10;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 1500;
      let offsetY = Math.random() * 1500;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n028'), 8765 + offsetX, 1400 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Dodoria", "Zarbon", "Zarbon 2"], true);

    
    const zarbon2 = this.bosses.get("Zarbon 2");
    if (zarbon2) {
      SetUnitInvulnerable(zarbon2, true);
      PauseUnit(zarbon2, true);
      ShowUnitHide(zarbon2);
    }
    
    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    // if zarbon dead, replace with stornger zarbon
    const zarbon = this.bosses.get("Zarbon");
    const zarbon2 = this.bosses.get("Zarbon 2");
    if (zarbon && zarbon2) {
      if (
        BlzIsUnitInvulnerable(zarbon2) &&
        (
          IsUnitDeadBJ(zarbon) || 
          GetUnitState(zarbon, UNIT_STATE_LIFE) < GetUnitState(zarbon, UNIT_STATE_MAX_LIFE) * 0.5
        )
      ) {
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Zarbon: Pitiful humans!");

        SetUnitX(zarbon2, GetUnitX(zarbon));
        SetUnitY(zarbon2, GetUnitY(zarbon));
        SetUnitInvulnerable(zarbon2, false);
        PauseUnit(zarbon2, false);
        ShowUnitShow(zarbon2);

        SagaHelper.pingMinimap(this.bosses);

        KillUnit(zarbon);
      }
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (super.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(super.bosses);
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

export class GinyuSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Ginyu Force';

  constructor() {
    super();
    this.sagaDelay = 20;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "The Ginyu Force have arrived looking for the Dragon Balls.");

    // create unit
    const maxFriezaHenchmen = 5;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 1500;
      let offsetY = Math.random() * 1500;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n02r'), 8765 + offsetX, 1400 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Guldo", "Recoome", "Burter", "Jeice", "Ginyu"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (super.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(super.bosses);
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

export class FriezaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Frieza';

  constructor() {
    super();
    this.sagaDelay = 20;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Frieza has arrived looking for the Dragon Balls.");

    // create unit
    const maxFriezaHenchmen = 10;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 1500;
      let offsetY = Math.random() * 1500;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n02r'), 8765 + offsetX, 1400 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Frieza 1", "Frieza 2", "Frieza 3", "Frieza 4", "Frieza 5"], true);

    for (let i = 2; i < 5; ++i) {
      const frieza = this.bosses.get("Frieza " + i);
      if (frieza) {
        SetUnitInvulnerable(frieza, true);
        PauseUnit(frieza, true);
        ShowUnitHide(frieza);
      }
    }
    
    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    // if frieza dead, replace with strong frieza
    for (let i = 1; i < 4; ++i) {
      const frieza = this.bosses.get("Frieza " + i);
      const nextFrieza = this.bosses.get("Frieza " + (i+1));
      if (frieza && nextFrieza) {
        if (
          BlzIsUnitInvulnerable(nextFrieza) &&
          (
            IsUnitDeadBJ(frieza) || 
            GetUnitState(frieza, UNIT_STATE_LIFE) < GetUnitState(frieza, UNIT_STATE_MAX_LIFE) * 0.6
          )
        ) {
          DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Frieza: This isn't even my final form!");

          SetUnitX(nextFrieza, GetUnitX(frieza));
          SetUnitY(nextFrieza, GetUnitY(frieza));
          SetUnitInvulnerable(nextFrieza, false);
          PauseUnit(nextFrieza, false);
          ShowUnitShow(nextFrieza);

          KillUnit(frieza);
        }
      }
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (super.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(super.bosses);
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