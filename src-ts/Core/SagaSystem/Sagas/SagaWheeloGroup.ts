import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { UnitHelper } from "Common/UnitHelper";

export class WheeloSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The World\'s Strongest';

  protected wheelo: unit | undefined;
  protected kochin: unit | undefined;

  constructor() {
    super();
    this.delay = 20;
    this.stats = 25;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Dr. Kochin has revived Dr Wheelo!",
      ],
      [
        "|cffffcc00Wheelo|r: I can't fit in a body like this!",
        "|cffffcc00Dr. Kochin|r: Don't worry about it. Sometimes brain surgery is a little more \"art\" than science",
        "|cffffcc00Wheelo|r: You're thinking of baking!",
        "|cffffcc00Dr. Kochin|r: I might be thinking of baking.",
      ],
    );
    this.addHeroListToSaga(["Wheelo", "Kishime", "Misokatsun", "Ebifurya", "Dr. Kochin"], true);
    
    this.kochin = this.bosses.get("Dr. Kochin");
    this.wheelo = this.bosses.get("Wheelo");

    SagaHelper.sagaHideUnit(this.wheelo);

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.kochin && this.wheelo && 
      UnitHelper.isUnitDead(this.kochin) && 
      SagaHelper.isUnitSagaHidden(this.wheelo)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Dr. Wheelo|r: Bring me the body of the strongest man in the world, |cffff4400Master Roshi|r!"
        ],
        [
          "|cffffcc00Wheelo|r: Kochin, why didn't you give me one of the bio-warrior's bodies?",
          "|cffffcc00Dr. Kochin|r: ... I guess you're right ...",
          "|cffffcc00Dr. Kochin|r: See, this is why YOU'RE the brains",
        ],
      );
      SagaHelper.genericTransformAndPing(this.wheelo, this.kochin, this);
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