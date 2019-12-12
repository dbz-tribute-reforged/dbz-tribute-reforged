import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";

export class LordSlugSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Lord Slug';

  protected isSlugKyo: boolean;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 40;
    this.isSlugKyo = false;
  }

  spawnSagaUnits(): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Lord Slug has arrived!");

    this.addHeroListToSaga(["Lord Slug"], true);
    
    SagaHelper.pingMinimap(this.bosses);
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    const slug = this.bosses.get("Lord Slug");
    if (slug && !this.isSlugKyo) {
      const slugHp = GetUnitState(slug, UNIT_STATE_LIFE);
      if (
        slugHp < GetUnitState(slug, UNIT_STATE_MAX_LIFE) * 0.5 &&
        slugHp > 0
      ) {
        DestroyEffect(AddSpecialEffectTargetUnitBJ(
          "origin", 
          slug, 
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl")
        );
        SetUnitScale(slug, 2.5, 2.5, 2.5);
        SetHeroLevel(slug, GetHeroLevel(slug) + 1, true);
        SetHeroStr(slug, GetHeroStr(slug, true) * 2, true);
        SetHeroAgi(slug, GetHeroAgi(slug, true) * 1.5, true);
        this.isSlugKyo = true;
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
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.POST_SLUG);
  }

}