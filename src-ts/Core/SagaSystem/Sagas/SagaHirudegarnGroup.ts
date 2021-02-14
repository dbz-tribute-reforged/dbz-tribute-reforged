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
    
    this.hirudegarn = this.bosses[0];
    this.matureHirudegarn = this.bosses[1];

    SagaHelper.sagaHideUnit(this.matureHirudegarn);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 5000);
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
