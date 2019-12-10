import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { Trigger } from "w3ts";

export class RaditzSaga extends BaseSaga implements Saga {
  name: string = 'Raditz Saga';

  // custom stuff
  bosses: Map<string, unit>;
  sagaRewardTrigger: trigger;
  sagaDelayTimer: timer;
  sagaDelay: number;

  constructor() {
    super();

    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
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

  spawnSagaUnits(): void {
    const boss1 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('U01D'), 8765, 1400, 0);
    SetHeroLevel(boss1, 5, false);
    SagaHelper.setAllStats(boss1, 50, 50, 75);
    this.bosses.set("Raditz", boss1);
  }

  start(): void {

    this.spawnSagaUnits();
    super.start();
    // doesnt work yet but placeholder
    SagaHelper.addStatRewardOnCompletAction(this, this.sagaRewardTrigger, 20);

  }

  complete(): void {
    super.complete();
  }

  update(t: number): void {
  }
}

export class VegetaSaga extends BaseSaga implements Saga {
  name: string = 'Vegeta Saga';

  // custom stuff
  bosses: Map<string, unit>;
  sagaRewardTrigger: trigger;
  sagaDelayTimer: timer;
  sagaDelay: number;

  constructor() {
    super();

    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
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
  
  spawnSagaUnits(): void {

    // create unit
    const maxSaibamen = 6;
    for (let i = 0; i < maxSaibamen; ++i) {
      const saibaman = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n01Z'), -3300, -5500, 0);
      // SagaHelper.setAllStats(saibaman, 50, 50, 50);
      // this.bosses.set("Saibaman" + i, saibaman);
    }

    const boss1 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('U019'), -3300, -5500, 0);
    SetHeroLevel(boss1, 10, false);
    SagaHelper.setAllStats(boss1, 100, 100, 150);
    this.bosses.set("Nappa", boss1);

    const boss2 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('E003'), -3300, -5500, 0);
    SetHeroLevel(boss2, 20, false);
    SagaHelper.setAllStats(boss2, 250, 250, 400);
    this.bosses.set("Vegeta", boss2);

  }

  start(): void {
    super.start();
    this.sagaDelay = 10;
    TimerStart(this.sagaDelayTimer, this.sagaDelay, false, () => {
      this.spawnSagaUnits();
      // doesnt work yet but placeholder
      SagaHelper.addStatRewardOnCompletAction(this, this.sagaRewardTrigger, 80);
      DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Nappa and Vegeta have arrived in West City.");
      DestroyTimer(GetExpiredTimer());
    });
  }

  complete(): void {
    super.complete();
  }

  update(t: number): void {
  }
}