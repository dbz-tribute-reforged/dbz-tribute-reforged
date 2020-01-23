import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class CoolerRevengeSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Cooler\'s Revenge';

  protected cooler: unit | undefined;
  protected isFinalForm: boolean;

  constructor() {
    super();
    this.delay = 40;
    this.stats = 100;
    this.isFinalForm = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Cooler has come to Earth seeking revenge!"
      ],
    );

    this.addHeroListToSaga(["Cooler"], true);
    this.cooler = this.bosses.get("Cooler");
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.cooler && !this.isFinalForm && 
      SagaHelper.checkUnitHp(this.cooler, 0.5, true, false, true)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Cooler|r: This isn't even my final form!"
        ],
      );
      this.isFinalForm = true;
      BlzSetUnitSkin(this.cooler, FourCC("H043"));
      SetUnitScale(this.cooler, 2.0, 2.0, 2.0);
      SetHeroLevel(this.cooler, GetHeroLevel(this.cooler) + 5, true);
      SetHeroStr(this.cooler, Math.floor(GetHeroStr(this.cooler, true) * 1.2), true);
      SetHeroAgi(this.cooler, Math.floor(GetHeroAgi(this.cooler, true) * 1.2), true);
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.cooler, 
          "origin", 
        )
      );
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

export class CoolerReturnSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The Return of Cooler';

  protected metalCoolers: unit[];
  protected revives: number;

  constructor() {
    super();
    this.delay = 45;
    this.stats = 100;
    this.metalCoolers = [];
    this.revives = 5;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Cooler has fused with the Big Gete Star to become Metal Cooler!",
      ],
    );

    this.addHeroListToSaga(["Metal Cooler 1", "Metal Cooler 2", "Metal Cooler 3"], true);
    const mc1 = this.bosses.get("Metal Cooler 1");
    const mc2 = this.bosses.get("Metal Cooler 2");
    const mc3 = this.bosses.get("Metal Cooler 3");

    if (mc1 && mc2 && mc3) {
      this.metalCoolers.push(mc1, mc2, mc3);
      SetUnitAcquireRange(mc1, 4000);
      SetUnitAcquireRange(mc2, 4000);
      SetUnitAcquireRange(mc3, 4000);
    }

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    for (const mc of this.metalCoolers) {
      if (UnitHelper.isUnitAlive(mc)) {
        SetUnitLifePercentBJ(mc, GetUnitLifePercent(mc) + 0.01);
      } else if (this.revives > 0) {
        --this.revives;
        SagaHelper.showMessagesChanceOfJoke(
          [],
          [
            "|cffffcc00Cooler|r: But how could this be? The Big Gete Star allowed me to cheat death!",
          ], 5, 5
        );
        ReviveHero(mc, GetUnitX(mc), GetUnitY(mc), true);
        SetHeroStr(mc, Math.floor(GetHeroStr(mc, true) * 1.2 + 200), true);
        SetHeroInt(mc, Math.floor(GetHeroStr(mc, true) * 1.2 + 200), true);
      }
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