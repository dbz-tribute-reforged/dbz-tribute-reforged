import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class ImperfectCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Imperfect Cell Saga';

  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Imperfect Cell has arrived from the future.");

    this.addHeroListToSaga(["Imperfect Cell"], true);

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

export class SemiperfectCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Semiperfect Cell Saga';

  constructor() {
    super();
    this.sagaDelay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Imperfect Cell slipped away and absorbed Android 17 becoming Semiperfect Cell."
    );

    this.addHeroListToSaga(["Semiperfect Cell"], true);

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

export class PerfectCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Perfect Cell Saga';

  constructor() {
    super();
    this.sagaDelay = 5;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Semiperfect Cell somehow survived and absorbed Android 18 becoming Perfect Cell!"
    );

    this.addHeroListToSaga(["Perfect Cell 1"], true);

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
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "|cffffcc00Perfect Cell|r: Enough playing around, you're no match for me."
    );
  }
}

export class CellGamesSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Cell Games Saga I: Perfect Cell';

  constructor() {
    super();
    this.sagaDelay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Let the games begin!"
    );

    this.addHeroListToSaga(["Perfect Cell Games"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3500);
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
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "|cffffcc00Perfect Cell|r: In 10 days time, I will host the Cell Games to determine the fate of this miserable planet."
    );
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
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "|cffffcc00Perfect Cell|r: Aaaagh... what's going on. My power is slipping..."
    );
  }
}


export class SuperPerfectCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Cell Games Saga II: Super Perfect Cell';

  constructor() {
    super();
    this.sagaDelay = 10;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "|cffffcc00Perfect Cell|r: Heh... Heh... Heh... Thought you got rid of me?"
    );
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "|cffffcc00Perfect Cell|r: With my new found powers, I'm going to crush you all!"
    );

    this.addHeroListToSaga(["Super Perfect Cell"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3500);
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

export class FutureCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Future Cell Saga';

  constructor() {
    super();
    this.sagaDelay = 90;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Future Cell has begun looking for the Androids.");

    this.addHeroListToSaga(["Future Imperfect Cell"], true);

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