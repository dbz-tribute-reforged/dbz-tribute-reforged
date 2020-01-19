import { Saga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { AdvancedSaga } from "./AdvancedSaga";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames, Creep } from "Core/CreepSystem/CreepUpgradeConfig";
import { Constants } from "Common/Constants";

export class NamekSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Namek Saga: Zarbon and Dodoria';

  protected zarbon: unit | undefined;
  protected zarbon2: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 60;
    this.stats = 50;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Zarbon and Dodoria have arrived looking for the Dragon Balls.",
      ],
    );

    // create unit
    const maxFriezaHenchmen = 3;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 1500;
      let offsetY = Math.random() * 1500;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaOrlen, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Dodoria", "Zarbon", "Zarbon 2"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }
    
    this.zarbon = this.bosses.get("Zarbon");
    this.zarbon2 = this.bosses.get("Zarbon 2");
    SagaHelper.sagaHideUnit(this.zarbon2);
    
    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    // if zarbon dead, replace with stornger zarbon
    if (
      this.zarbon && this.zarbon2 &&
      SagaHelper.checkUnitHp(this.zarbon, 0.5, false, false, true) &&
      SagaHelper.isUnitSagaHidden(this.zarbon2)
      ) {
        SagaHelper.showMessagesChanceOfJoke(
          [
            "|cffffcc00Zarbon|r: Pitiful humans!",
          ],
        );
      SagaHelper.genericTransformAndPing(this.zarbon2, this.zarbon, this);
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
  }
}

export class GinyuSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Ginyu Force Saga';

  constructor() {
    super();
    this.sagaDelay = 20;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffffcc00Recoome|r: Recoome!",
        "|cffffcc00Burter|r: Burter!",
        "|cffffcc00Jeice|r: Jeice!",
        "|cffffcc00Guldo|r: Guldo!",
        "|cffffcc00Ginyu|r: Ginyu!",
        "|cffffcc00Ginyu Force|r: And together we are...",
        "|cffffcc00Ginyu Force|r: The Ginyu Force!",
      ],
      [
        "|cffffcc00Ginyu|r: Men, introductions!",
        "|cffffcc00Ginyu|r: Ginyu!",
        "|cffffcc00Jeice|r: Jeice!",
        "|cffffcc00Burter|r: Burter!",
        "|cffffcc00Guldo|r: Guldo!",
        "|cffffcc00Recoome|r: Recoome!",
        "|cffffcc00Ginyu Force|r: And together we are...",
        "|cffffcc00Ginyu Force|r: Ginyu Tokusentai!",
        "|cffffcc00BGM|r: Tokusentai! Tokusentai! Tokusentai!",
        "|cffffcc00Frieza|r: ...",
      ], 1, 5,
    );
    // create unit
    const maxFriezaHenchmen = 5;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 1500;
      let offsetY = Math.random() * 1500;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaNabana, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Guldo", "Recoome", "Burter", "Jeice", "Ginyu"], true);
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping()
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

export class FriezaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Frieza Saga';

  constructor() {
    super();
    this.sagaDelay = 30;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Frieza has arrived looking for the Dragon Balls."
      ],
      [
        "|cffffcc00Frieza|r: Why aren't the Ginyu's showing up?!",
        "|cffffcc00Frieza|r: Oh they're dead.",
        "|cffffcc00Frieza|r: WHY ARE THEY DEAD?!",
      ], 3, 5,
    );

    // create unit
    const maxFriezaHenchmen = 8;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 2000;
      let offsetY = Math.random() * 2000;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaAppule, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Frieza 1", "Frieza 2", "Frieza 3", "Frieza 4", "Frieza 5"], true);

    for (let i = 2; i <= 5; ++i) {
      const frieza = this.bosses.get("Frieza " + i);
      SagaHelper.sagaHideUnit(frieza);
    }
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }
    
    this.ping()
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    // if frieza dead, replace with strong frieza
    for (let i = 1; i < 5; ++i) {
      const frieza = this.bosses.get("Frieza " + i);
      const nextFrieza = this.bosses.get("Frieza " + (i+1));
      if (
        frieza && 
        nextFrieza &&
        SagaHelper.checkUnitHp(frieza, 0.6, false, false, true) &&
        SagaHelper.isUnitSagaHidden(nextFrieza)
      ) {
        SagaHelper.showMessagesChanceOfJoke(
          [
            "|cffffcc00Frieza|r: This isn't even my final form!",
          ],
          [
            "|cffffcc00Frieza|r: tHiS IsN't eVEn mY FiNaL fOrM!",
          ],
          5, 5,
        );
        SagaHelper.genericTransformAndPing(nextFrieza, frieza, this);
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

export class TrunksSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Trunks Saga';

  constructor() {
    super();
    this.sagaDelay = 45;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "King Cold and Mecha Frieza have come seeking revenge!",
      ],
      [
        "|cffffcc00Future Trunks|r: Is this Super Saiyan enough for ya?",
        "|cffffcc00Frieza|r: No..! No! NO! NO! Kill! Murder! Destroy!",
        "|cffffcc00Frieza|r: EXTERMINATE! EXTERMINATE!",
      ],
    );

    // create unit
    const maxFriezaHenchmen = 8;
    for (let i = 0; i < maxFriezaHenchmen; ++i) {
      let offsetX = Math.random() * 2000;
      let offsetY = Math.random() * 2000;
      const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaPineapple, 18000 + offsetX, 2000 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Mecha Frieza", "King Cold"], true);
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }
    
    this.ping()
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
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020Earth has been invaded by the Frieza force!|r"
      ],
      [
        "|cffffcc00Appule|r: Appule!",
        "|cffffcc00Orlen|r: Orlen!",
        "|cffffcc00Nabana|r: Nabana!",
        "|cffffcc00Robery|r: Robery!",
        "|cffffcc00Pineapple|r: Pineapple!",
        "|cffffcc00Strawberry|r: Strawberry!",
        "|cffffcc00Greyberry|r: Greyberry!",
        "|cffffcc00Appule Rangers|r: And together we are ... the Appule Rangers!",
      ], 1, 5
    );
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.PRE_TRUNKS);
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

// tagoma / frieza force saga

export class GoldenFriezaSaga extends AdvancedSaga implements Saga {
  name: string = '[DB Super] Resurrection \'F\'';

  protected frieza1: unit | undefined;
  protected friezaFinal: unit | undefined;
  protected friezaGolden: unit | undefined;

  constructor() {
    super();
    this.sagaDelay = 60;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "After undergoing intense training Frieza has returned to Earth seeking his revenge!"
      ],
    );

    this.addHeroListToSaga(["Resurrection Frieza 1", "Resurrection Frieza Final", "Resurrection Frieza Golden"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }

    this.frieza1 = this.bosses.get("Resurrection Frieza 1");
    this.friezaFinal = this.bosses.get("Resurrection Frieza Final");
    this.friezaGolden = this.bosses.get("Resurrection Frieza Golden");

    SagaHelper.sagaHideUnit(this.friezaFinal);
    SagaHelper.sagaHideUnit(this.friezaGolden);

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.frieza1 && this.friezaFinal && 
      SagaHelper.checkUnitHp(this.frieza1, 0.8, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.friezaFinal)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Frieza|r: Enough playing around. Time to get serious.",
        ],
      );
      SagaHelper.genericTransformAndPing(this.friezaFinal, this.frieza1, this);
    } else if (
      this.friezaFinal && this.friezaGolden &&
      SagaHelper.checkUnitHp(this.friezaFinal, 0.7, false, false, false) &&
      SagaHelper.isUnitSagaHidden(this.friezaGolden)
    ) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Frieza|r: For the sake of you chimps let's keep the names simple as well, we'll call this form Golden Frieza."
        ],
      );
      SagaHelper.genericTransformAndPing(this.friezaGolden, this.friezaFinal, this);
      const goldenSfx = AddSpecialEffect(
        "Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl", 
        GetUnitX(this.friezaGolden), 
        GetUnitY(this.friezaGolden)
      );
      BlzSetSpecialEffectScale(goldenSfx, 4.0);
      DestroyEffect(goldenSfx);
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
  }
}
