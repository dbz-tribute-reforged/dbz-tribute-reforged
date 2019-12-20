import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class BrolyDBZMovieSaga1 extends AdvancedSaga implements Saga {
  name: string = '[Movie] Broly - The Legendary Super Saiyan';

  protected broly: unit | undefined;
  protected isLSS: boolean;
  protected auraLSS: effect;

  constructor() {
    super();
    this.sagaDelay = 30;
    this.isLSS = false;
    this.auraLSS = GetLastCreatedEffectBJ();
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Broly has begun rampaging relentlessly!");

    this.addHeroListToSaga(["Broly DBZ 1"], true);

    this.broly = this.bosses.get("Broly DBZ 1");

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.broly &&
      !this.isLSS && 
      SagaHelper.checkUnitHp(this.broly, 0.75, true, false, true)  
    ) { 
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Broly|r: Kakarot!"
      );
      this.isLSS = true;
      SetUnitScale(this.broly, 2.0, 2.0, 2.0);
      SetHeroLevel(this.broly, GetHeroLevel(this.broly) + 13, true);
      SetHeroStr(this.broly, Math.floor(GetHeroStr(this.broly, true) * 2 + 500), true);
      SetHeroAgi(this.broly, Math.floor(GetHeroAgi(this.broly, true) + 100), true);
      this.auraLSS = AddSpecialEffectTarget(
        "AuraDarkGreen.mdl",
        this.broly,
        "origin", 
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.broly, 
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
    DestroyEffect(this.auraLSS);
  }
}

export class BrolyDBZMovieSaga2 extends AdvancedSaga implements Saga {
  name: string = '[Movie] Broly -  Second Coming';

  protected broly: unit | undefined;
  protected isLSS: boolean;
  protected auraLSS: effect;

  constructor() {
    super();
    this.sagaDelay = 60;
    this.isLSS = false;
    this.auraLSS = GetLastCreatedEffectBJ();
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Broly has unthawed from the ice and returned for vengeance!");

    this.addHeroListToSaga(["Broly DBZ 2"], true);
    
    this.broly = this.bosses.get("Broly DBZ 2");

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.broly &&
      !this.isLSS && 
      SagaHelper.checkUnitHp(this.broly, 0.75, true, false, true)  
    ) { 
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "|cffffcc00Broly|r: Kakarot!?"
      );
      this.isLSS = true;
      SetUnitScale(this.broly, 2.0, 2.0, 2.0);
      SetHeroLevel(this.broly, GetHeroLevel(this.broly) + 15, true);
      SetHeroStr(this.broly, Math.floor(GetHeroStr(this.broly, true) * 2 + 500), true);
      SetHeroAgi(this.broly, Math.floor(GetHeroAgi(this.broly, true) + 100), true);
      this.auraLSS = AddSpecialEffectTarget(
        "AuraDarkGreen.mdl",
        this.broly,
        "origin", 
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.broly, 
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
    DestroyEffect(this.auraLSS);
  }
}

export class BioBrolySaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Bio-Broly';

  constructor() {
    super();
    this.sagaDelay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Bio Broly has begun rampaging through the Bio Research Facility!");

    this.addHeroListToSaga(["Broly Bio"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
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