import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";
import { UnitHelper } from "Common/UnitHelper";
import { Constants } from "Common/Constants";

export class LordSlugSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Lord Slug';

  protected slug: unit | undefined;
  protected isSlugKyo: boolean;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 40;
    this.isSlugKyo = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Lord Slug has arrived!");

    this.addHeroListToSaga(["Lord Slug"], true);
    this.slug = this.bosses.get("Lord Slug");

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.slug && !this.isSlugKyo &&
      SagaHelper.checkUnitHp(this.slug, 0.6, true, false, true)
    ) {
      this.isSlugKyo = true;
      SetUnitScale(this.slug, 3.0, 3.0, 3.0);
      SetHeroLevel(this.slug, GetHeroLevel(this.slug) + 1, true);
      SetHeroStr(this.slug, Math.floor(GetHeroStr(this.slug, true) * 2), true);
      SetHeroAgi(this.slug, Math.floor(GetHeroAgi(this.slug, true) * 1.5), true);
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.slug, 
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
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.PRE_SLUG);
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.sagaDelay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.sagaDelayTimer, this.sagaDelay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }

}