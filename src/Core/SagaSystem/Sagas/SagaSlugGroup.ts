import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames, Creep } from "Core/CreepSystem/CreepUpgradeConfig";
import { Constants } from "Common/Constants";

export class LordSlugSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Lord Slug';

  protected slug: unit | undefined;
  protected isSlugKyo: boolean;

  constructor() {
    super();
    this.delay = 45;
    this.stats = 40;
    this.isSlugKyo = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.PRE_SLUG);
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Lord Slug has arrived!"
      ],
      [
        "|cffffcc00Lord Slug|r: I see trees of brown. And skies of black.",
        "|cffffcc00Lord Slug|r: And I think to myself... what a wonderful world."
      ],
    );
    
    // create unit
    for (let i = 0; i < 5; ++i) {
      let offsetX = Math.random() * 1000;
      let offsetY = Math.random() * 1000;
      const sagaCreep = CreateUnit(Player(PLAYER_NEUTRAL_AGGRESSIVE), Creep.SlugGuard, 8700 + offsetX, -5200 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Lord Slug"], true);
    this.slug = this.bosses[0];

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.slug && !this.isSlugKyo &&
      SagaHelper.checkUnitHp(this.slug, 0.6, true, false, true)
    ) {
      this.isSlugKyo = true;
      SetUnitScale(this.slug, 3.0, 3.0, 3.0);
      SetHeroLevel(this.slug, GetHeroLevel(this.slug) + 10, true);
      SetHeroStr(this.slug, Math.floor(GetHeroStr(this.slug, true) * 1.2), true);
      SetHeroAgi(this.slug, Math.floor(GetHeroAgi(this.slug, true) * 1.2), true);
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