import { Saga, SagaState, BaseSaga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";

export class TestSaga extends BaseSaga implements Saga {
  name: string = 'Test Saga';

  // custom stuff
  badGuy: unit | null;

  constructor() {
    super();

    this.badGuy = null;
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.badGuy !== null) {
      return !UnitAlive(this.badGuy);
    }
    return false;
  }

  start(): void {
    super.start();

    // create unit
    this.badGuy = CreateUnitAtLoc(Players.NEUTRAL_HOSTILE, FourCC('Hblm'), Location(7600, -2600), 0);
  }

  complete(): void {
    super.complete();
  }

  update(t: number): void {
  }
}

export class TestSagaTwo extends BaseSaga implements Saga {
  name: string = 'Test Saga: Chapter 2';

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return false;
  }

  start(): void {
    super.start();
  }

  complete(): void {
    super.complete();
  }

  update(t: number): void {
  }
}