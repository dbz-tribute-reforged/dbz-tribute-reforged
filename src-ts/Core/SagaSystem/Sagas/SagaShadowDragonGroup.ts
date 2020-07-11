import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class ShadowDragonSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga I';

  constructor() {
    super();
    this.delay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Overuse of the Dragon Balls has brought forth immensely powerful Shadow Dragons!"
    );

    this.addHeroListToSaga(["Haze Shenron", "Rage Shenron", "Oceanus Shenron", "Naturon Shenron", "Nuova Shenron", "Eis Shenron"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
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

export class ShadowDragonSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Shadow Dragon Saga II';

  protected syn: unit | undefined;
  protected omega: unit | undefined;
  protected superOmega: boolean;

  constructor() {
    super();
    this.delay = 20;
    this.superOmega = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Syn Shenron is looking for the other 6 Dragon Balls!"
    );

    this.addHeroListToSaga(["Syn Shenron", "Omega Shenron"], true);
    
    this.syn = this.bosses.get("Syn Shenron");
    this.omega = this.bosses.get("Omega Shenron");

    SagaHelper.sagaHideUnit(this.omega);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.syn && this.omega &&
      SagaHelper.checkUnitHp(this.syn, 0.8, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.omega)
    ) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Omega Shenron|r: By absorbing the other Dragon Balls I have become Omega Shenron!"
      );
      SagaHelper.genericTransformAndPing(this.omega, this.syn, this);
    }
    if (
      this.omega &&
      !this.superOmega && 
      SagaHelper.checkUnitHp(this.omega, 0.5, true, false, true) && 
      !SagaHelper.isUnitSagaHidden(this.omega)
    ) { 
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Omega Shenron|r: The comfort you've always felt at being called the strongest fighter in the galaxy will come to an end today",
        ],
      );
      this.superOmega = true;
      SetUnitScale(this.omega, 1.9, 1.9, 1.9);
      SetHeroLevel(this.omega, GetHeroLevel(this.omega) + 10, true);
      SetHeroStr(this.omega, Math.floor(GetHeroStr(this.omega, true) * 1.4 + 4000), true);
      SetHeroAgi(this.omega, Math.floor(GetHeroAgi(this.omega, true) * 1.2 + 2000), true);
      SetHeroInt(this.omega, Math.floor(GetHeroInt(this.omega, true) * 1.3 + 3000), true);
      SetUnitState(
        this.omega, 
        UNIT_STATE_LIFE, 
        GetUnitState(this.omega, UNIT_STATE_LIFE) + GetUnitState(this.omega, UNIT_STATE_MAX_LIFE) * 0.3
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.omega, 
          "origin", 
        )
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl",
          this.omega, 
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
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020End of DBGT Sagas for now.",
      ],
    );
  }
}
