import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { Trigger } from "w3ts";

export class RaditzSaga extends BaseSaga implements Saga {
  name: string = 'Raditz Saga';

  // custom stuff
  bosses: Map<string, unit>;
  sagaRewardTrigger: trigger;

  constructor() {
    super();

    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
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

    const boss1 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('U01D'), 8765, 1400, 0);
    SagaHelper.setAllStats(boss1, 100, 50, 100);
    this.bosses.set("Raditz", boss1);

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

  constructor() {
    super();

    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
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

    // create unit
    const maxSaibamen = 6;
    for (let i = 0; i < maxSaibamen; ++i) {
      const saibaman = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('n01Z'), -3300, -5500, 0);
      // SagaHelper.setAllStats(saibaman, 50, 50, 50);
      // this.bosses.set("Saibaman" + i, saibaman);
    }

    const boss1 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('U019'), -3300, -5500, 0);
    SagaHelper.setAllStats(boss1, 200, 100, 150);
    this.bosses.set("Nappa", boss1);

    const boss2 = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC('E003'), -3300, -5500, 0);
    SagaHelper.setAllStats(boss2, 400, 250, 600);
    this.bosses.set("Vegeta", boss2);

    // doesnt work yet but placeholder
    SagaHelper.addStatRewardOnCompletAction(this, this.sagaRewardTrigger, 80);


  }

  complete(): void {
    super.complete();
  }

  update(t: number): void {
  }
}