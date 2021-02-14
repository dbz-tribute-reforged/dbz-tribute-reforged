import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class JanembaSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Fusion Reborn';

  protected janemba: unit | undefined;
  protected superJanemba: unit | undefined;
  
  constructor() {
    super();
    this.delay = 90;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "The soul cleansing machine in hell has malfunctioned.",
        "The stray souls have manifested into the evil demon Janemba",
      ],
    );

    this.addHeroListToSaga(["Janemba", "Super Janemba"], true);
    
    this.janemba = this.bosses[0];
    this.superJanemba = this.bosses[1];

    if (this.superJanemba) {
      UnitAddItemById(this.superJanemba, ItemConstants.SagaDrops.DIMENSION_SWORD);
    }

    SagaHelper.sagaHideUnit(this.superJanemba);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 9000);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.janemba && this.superJanemba &&
      SagaHelper.checkUnitHp(this.janemba, 0.1, false, true, false) && 
      SagaHelper.isUnitSagaHidden(this.superJanemba)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Janemba|r: JANEMBA! JANEMBA! JANEMBA!"
        ],
      );
      SagaHelper.genericTransformAndPing(this.superJanemba, this.janemba, this);
      DestroyEffect(
        AddSpecialEffectTarget(
          "AuraBunkai.mdl",
          this.superJanemba, 
          "origin", 
        )
      );
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
