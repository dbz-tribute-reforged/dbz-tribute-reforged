import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class BabidiSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Babidi Saga';

  protected dabura: unit | undefined;
  protected babidi: unit | undefined;
  protected fatBuu: unit | undefined;

  constructor() {
    super();
    this.delay = 120;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Babidi's minions have come to collect energy for the release of Majin Buu!",
      ],
    );

    this.addHeroListToSaga(["Pui Pui", "Yakon", "Dabura", "Babidi", "Fat Buu"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.dabura = this.bosses.get("Dabura");
    this.babidi = this.bosses.get("Babidi");
    this.fatBuu = this.bosses.get("Fat Buu");

    SagaHelper.sagaHideUnit(this.babidi);
    SagaHelper.sagaHideUnit(this.fatBuu);

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.dabura && this.babidi && this.fatBuu &&
      SagaHelper.checkUnitHp(this.dabura, 0.1, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.babidi)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Babidi|r: Finally, enough energy to release Majin Buu!",
          "|cffffcc00Babidi|r: Paparapapa!",
        ],
      );
      SagaHelper.sagaShowUnitAtUnit(this.fatBuu, this.dabura);
      SagaHelper.genericTransformAndPing(this.babidi, this.dabura, this);
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

export class BuuSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Buu Saga';

  protected superBuu: unit | undefined;
  protected kidBuu: unit | undefined;

  constructor() {
    super();
    this.delay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Evil Buu has absorbed Majin Buu to become Super Buu!",
      ],
    );

    this.addHeroListToSaga(["Super Buu", "Kid Buu"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.superBuu = this.bosses.get("Super Buu");
    this.kidBuu = this.bosses.get("Kid Buu");

    SagaHelper.sagaHideUnit(this.kidBuu);

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.superBuu && this.kidBuu &&
      SagaHelper.checkUnitHp(this.superBuu, 0.1, false, true, false) &&
      SagaHelper.isUnitSagaHidden(this.kidBuu)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "Majin Buu has returned to his original form!"
        ],
      );
      SagaHelper.genericTransformAndPing(this.kidBuu, this.superBuu, this);
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