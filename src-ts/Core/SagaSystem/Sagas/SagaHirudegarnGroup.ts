import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class HirudegarnSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Wrath of the Dragon';

  protected hirudegarn: unit | undefined;
  protected matureHirudegarn: unit | undefined;
  
  constructor() {
    super();
    this.delay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Hoi has unsealed Tapion and reformed the legendary monster Hirudegarn!",
      ],
    );

    this.addHeroListToSaga(["Hirudegarn", "Mature Hirudegarn"], true);
    
    this.hirudegarn = this.bosses.get("Hirudegarn");
    this.matureHirudegarn = this.bosses.get("Mature Hirudegarn");

    SagaHelper.sagaHideUnit(this.matureHirudegarn);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.hirudegarn && this.matureHirudegarn && 
      SagaHelper.checkUnitHp(this.hirudegarn, 0.5, false, false, true) &&
      SagaHelper.isUnitSagaHidden(this.matureHirudegarn)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Hoi|r: Hahahaha, how foolish of you - <gets crushed by Mature Hirudegarn>",
        ],
      );
      SagaHelper.genericTransformAndPing(this.matureHirudegarn, this.hirudegarn, this);
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
