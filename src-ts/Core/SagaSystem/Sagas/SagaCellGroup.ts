import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class CellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Cell Saga';

  protected imperfectCell: unit | undefined;
  protected semiperfectCell: unit | undefined;
  protected perfectCell: unit | undefined;

  constructor() {
    super();
    this.delay = 45;
    this.spawnSound = gg_snd_DBZSagaTheme;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "A mysterious bio-organism has returned from the future!",
      ],
      [
        "|cffffcc00Imperfect Cell|r: Here's Johnny!",
      ],
    );

    this.addHeroListToSaga(["Imperfect Cell", "Semiperfect Cell", "Perfect Cell 1"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.imperfectCell = this.bosses[0];
    this.semiperfectCell = this.bosses[1];
    this.perfectCell = this.bosses[2];

    SagaHelper.sagaHideUnit(this.semiperfectCell);
    SagaHelper.sagaHideUnit(this.perfectCell);

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.imperfectCell && this.semiperfectCell && 
      SagaHelper.checkUnitHp(this.imperfectCell, 0.5, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.semiperfectCell)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Semiperfect Cell|r: After absorbing Android 17 I'm one step closer to perfection.",
        ],
        [
          "|cffffcc00Semiperfect Cell|r: So this is what having lips feels like? Fun!",
          "|cffffcc00Semiperfect Cell|r: Flppttt. Bllpttt.",
        ],
      );
      SagaHelper.genericTransformAndPing(this.semiperfectCell, this.imperfectCell, this);
    } else if (
      this.semiperfectCell && this.perfectCell && 
      SagaHelper.checkUnitHp(this.semiperfectCell, 0.5, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.perfectCell)
    ) {
      // SagaHelper.showMessagesChanceOfJoke(
      //   [
      //     "|cffffcc00Perfect Cell|r: Witness the power of my perfect form."
      //   ],
      //   [
      //     "|cffffcc00Perfect Cell|r: \"P\" is for \"Priceless\", the look upon your faces.",
      //     "|cffffcc00Perfect Cell|r: \"E\" is for \"Extinction\", all your puny races.",
      //     "|cffffcc00Perfect Cell|r: \"R\" is for \"Revolution\", which will be televised.",
      //     "|cffffcc00Perfect Cell|r: \"F\" is for how \"F-ed\" you are, now allow me to reprise~",
      //     "|cffffcc00Perfect Cell|r: \"E\" is for \"Eccentric\" just listen to my song.",
      //     "|cffffcc00Perfect Cell|r: \"C\" is for \"Completion\", that I've waited for so long!",
      //     "|cffffcc00Perfect Cell|r: \"T\" is for the \"Terror\", upon you I bestow...",
      //     "|cffffcc00Perfect Cell|r: My name is Perfect Cell. And I'd like to say...",
      //     "|cffffcc00Perfect Cell|r: Hello.",
      //   ], Constants.sagaDisplayTextDelay, Constants.sagaDisplayTextDuration, 0.01
      // );
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Perfect Cell|r: Heh... Heh... Heh... Thought you got rid of me?",
          "|cffffcc00Perfect Cell|r: With my new found powers, I'm going to crush you all!",
        ],
        [
          "|cffffcc00Perfect Cell|r: I... am now...",
          "|cffffcc00Yamcha|r: Perfect-er Cell!",
          "|cffffcc00Perfect Cell|r: Okay, Yamcha. Accurate, but tone it down",
        ], Constants.sagaDisplayTextDelay, Constants.sagaDisplayTextDuration, 0.01
      );
      SagaHelper.genericTransformAndPing(this.perfectCell, this.semiperfectCell, this);
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return super.canComplete();
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

export class CellGamesSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Cell Games Saga';

  protected perfectCell: unit | undefined;
  protected superPerfectCell: unit | undefined;
  protected goneSuperPerfect: boolean;

  constructor() {
    super();
    this.delay = 99999;
    this.goneSuperPerfect = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffffcc00Perfect Cell|r: Let the games begin!",
      ],
    );

    this.addHeroListToSaga(["Perfect Cell Games", "Super Perfect Cell"], true);

    this.perfectCell = this.bosses[0];
    this.superPerfectCell = this.bosses[1];

    SagaHelper.sagaHideUnit(this.superPerfectCell);

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.perfectCell && this.superPerfectCell && 
      SagaHelper.checkUnitHp(this.perfectCell, 0.1, false, true, false) &&
      SagaHelper.isUnitSagaHidden(this.superPerfectCell) && 
      !this.goneSuperPerfect
    ) {
      this.goneSuperPerfect = true;
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Perfect Cell|r: Aaaagh... what's going on. My power is slipping...",
          "|cffffcc00Perfect Cell|r: 17..? 18..? No! I was Perfect!",
        ],
      );
      TimerStart(CreateTimer(), 30, false, ()=> {
        if (this.superPerfectCell && this.perfectCell) {
          SagaHelper.showMessagesChanceOfJoke(
            [
              "|cffffcc00Perfect Cell|r: Heh... Heh... Heh... Thought you got rid of me?",
              "|cffffcc00Perfect Cell|r: With my new found powers, I'm going to crush you all!",
            ],
            [
              "|cffffcc00Perfect Cell|r: I... am now...",
              "|cffffcc00Yamcha|r: Perfect-er Cell!",
              "|cffffcc00Perfect Cell|r: Okay, Yamcha. Accurate, but tone it down",
            ], 4,
          );
          SagaHelper.genericTransformAndPing(this.superPerfectCell, this.perfectCell, this);
        }
      });
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    return super.canComplete();
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffffcc00Perfect Cell|r: Enough playing around, you're no match for me.",
        "|cffffcc00Perfect Cell|r: In 10 days time, I will host the Cell Games to determine the fate of this miserable planet.",
        "|cffff2020Cell games saga has been temporarily disabled for pressing ceremonial reasons.",
      ],
    );
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

export class FutureCellSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Future Cell Saga';

  constructor() {
    super();
    this.delay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        
      "Future Cell has begun looking for the Androids.",
      ],
    );

    this.addHeroListToSaga(["Future Imperfect Cell"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 5000);
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
    return super.canComplete();
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