import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class FTSuperSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DB Super] Future Trunks Saga I: Goku Black\'s Incursion';

  constructor() {
    super();
    this.delay = 90;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Goku Black has arrived from the alternate future!",
      ],
    );

    this.addHeroListToSaga(["Goku Black 1"], true);

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

export class FTSuperSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DB Super] Future Trunks Saga II: The Zero Mortal Plan';

  protected gokuBlack: unit | undefined;
  protected isRose: boolean;
  protected auraRose: effect;

  constructor() {
    super();
    this.isRose = false;
    this.auraRose = GetLastCreatedEffectBJ();
    this.delay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Goku Black and Zamasu team up to execute the Zero Mortal Plan.",
      ],
    );

    this.addHeroListToSaga(["Goku Black 2", "Zamasu"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }

    this.gokuBlack = this.bosses[0];

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.gokuBlack && !this.isRose && 
      SagaHelper.checkUnitHp(this.gokuBlack, 0.6, false, false, true)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Goku Black|r: I call this Super Saiyan Rose.",
        ],
      );
      this.isRose = true;
      SetUnitScale(this.gokuBlack, 2.0, 2.0, 2.0);
      SetUnitLifePercentBJ(this.gokuBlack, 100);
      SetHeroLevel(this.gokuBlack, GetHeroLevel(this.gokuBlack) + 10, true);
      SetHeroStr(this.gokuBlack, Math.floor(GetHeroStr(this.gokuBlack, true) + 2500), true);
      SetHeroAgi(this.gokuBlack, Math.floor(GetHeroAgi(this.gokuBlack, true) + 200), true);
      SetHeroInt(this.gokuBlack, Math.floor(GetHeroInt(this.gokuBlack, true) + 2500), true);
      this.auraRose = AddSpecialEffectTarget(
        "AuraPink.mdl",
        this.gokuBlack,
        "origin", 
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.gokuBlack, 
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
    // SagaHelper.showMessagesChanceOfJoke(
    //   [
    //     "|cffff2020End of DB Super Sagas for now.",
    //   ],
    // );
  }
}
