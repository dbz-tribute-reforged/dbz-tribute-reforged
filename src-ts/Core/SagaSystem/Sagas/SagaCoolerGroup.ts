import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class CoolerRevengeSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Cooler\'s Revenge';

  protected cooler: unit | undefined;
  protected isFinalForm: boolean;

  constructor() {
    super();
    this.delay = 45;
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
    this.cooler = this.bosses[0];
    
    for (const boss of this.bosses) {
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
      SetHeroStr(this.cooler, Math.floor(GetHeroStr(this.cooler, true) * 1.2 + 50), true);
      SetHeroAgi(this.cooler, Math.floor(GetHeroAgi(this.cooler, true) * 1.2 + 50), true);
      SetHeroInt(this.cooler, Math.floor(GetHeroInt(this.cooler, true) * 1.2 + 50), true);
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

export class CoolerReturnSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The Return of Cooler';

  protected metalCoolers: unit[];
  protected revives: number;

  constructor() {
    super();
    this.delay = 30;
    this.stats = 100;
    this.metalCoolers = [];
    this.revives = 3;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020The Big Geti Star has fused with Cooler and invaded New Namek!|r"
      ],
    );
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.GETI_STAR);

    this.addHeroListToSaga(["Metal Cooler 1", "Metal Cooler 2", "Metal Cooler 3"], true);

    const mc1 = this.bosses[0];
    const mc2 = this.bosses[1];
    const mc3 = this.bosses[2];

    if (mc1 && mc2 && mc3) {
      this.metalCoolers.push(mc1, mc2, mc3);
      UnitAddItemById(mc1, ItemConstants.SagaDrops.GETI_STAR_FRAGMENT);
      UnitAddItemById(mc2, ItemConstants.SagaDrops.GETI_STAR_FRAGMENT);
      UnitAddItemById(mc3, ItemConstants.SagaDrops.GETI_STAR_FRAGMENT);
      SetUnitAcquireRange(mc1, 4000);
      SetUnitAcquireRange(mc2, 4000);
      SetUnitAcquireRange(mc3, 4000);
    }

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    for (const mc of this.metalCoolers) {
      if (
        this.revives > 0 && 
        SagaHelper.checkUnitHp(mc, 0.4, false, false, false)
      ) {
        --this.revives;
        SagaHelper.showMessagesChanceOfJoke(
          [],
          [
            "|cffffcc00Cooler|r: But how could this be? The Big Gete Star allowed me to cheat death!",
          ], 5, 5
        );
        if (UnitHelper.isUnitDead(mc)) {
          ReviveHero(mc, GetUnitX(mc), GetUnitY(mc), false);
        }
        DestroyEffect(
          AddSpecialEffectTarget("Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl", mc, "origin")
        );
        SetUnitState(mc, UNIT_STATE_LIFE, GetUnitState(mc, UNIT_STATE_MAX_LIFE));
        SetHeroStr(mc, Math.floor(Math.floor(GetHeroStr(mc, true) * 1.2) + 200), true);
        SetHeroAgi(mc, Math.floor(Math.floor(GetHeroAgi(mc, true) * 1.2) + 150), true);
        SetHeroInt(mc, Math.floor(Math.floor(GetHeroInt(mc, true) * 1.2) + 200), true);
      } 
      else if (UnitHelper.isUnitAlive(mc) && GetUnitLifePercent(mc) > 0.05) {
        SetUnitLifePercentBJ(mc, GetUnitLifePercent(mc) + 0.006);
      }
    }
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