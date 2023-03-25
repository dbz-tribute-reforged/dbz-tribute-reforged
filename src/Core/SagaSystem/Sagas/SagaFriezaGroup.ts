import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { AdvancedSaga } from "./AdvancedSaga";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames, Creep } from "Core/CreepSystem/CreepUpgradeConfig";
import { Constants } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { SoundHelper } from "Common/SoundHelper";
import { UnitHelper } from "Common/UnitHelper";

export class NamekSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Namek Saga: Zarbon and Dodoria';

  protected zarbon: unit | undefined;
  protected zarbon2: unit | undefined;

  constructor() {
    super();
    this.delay = 60;
    this.stats = 50;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Zarbon and Dodoria are looking for the Dragon Balls.",
      ],
    );

    // create unit
    // const maxFriezaHenchmen = 3;
    // for (let i = 0; i < maxFriezaHenchmen; ++i) {
    //   let offsetX = Math.random() * 1500;
    //   let offsetY = Math.random() * 1500;
    //   const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaOrlen, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    // }

    this.addHeroListToSaga(["Dodoria", "Zarbon", "Zarbon 2"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }
    
    this.zarbon = this.bosses[1];
    this.zarbon2 = this.bosses[2];
    SagaHelper.sagaHideUnit(this.zarbon2);
    
    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    // if zarbon dead, replace with stornger zarbon
    if (
      this.zarbon && this.zarbon2 &&
      SagaHelper.checkUnitHp(this.zarbon, 0.75, false, false, true) &&
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

export class GinyuSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Ginyu Force Saga';

  constructor() {
    super();
    this.delay = 20;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffffcc00Ginyu|r: Ginyu!",
        "|cffffcc00Jeice|r: Jeice!",
        "|cffffcc00Burter|r: Burter!",
        "|cffffcc00Guldo|r: Guldo!",
        "|cffffcc00Recoome|r: Recoome!",
        "|cffffcc00Ginyu Force|r: And together we are...",
        "|cffffcc00Ginyu Force|r: Ginyu Tokusentai!",
      ],
      [], 1, 5,
    );
    // create unit
    // const maxFriezaHenchmen = 5;
    // for (let i = 0; i < maxFriezaHenchmen; ++i) {
    //   let offsetX = Math.random() * 1500;
    //   let offsetY = Math.random() * 1500;
    //   const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaNabana, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    // }

    this.addHeroListToSaga(["Ginyu", "Guldo", "Recoome", "Burter", "Jeice"], true);

    
    const rng = Math.random();
    if (rng < 0.02 && this.bosses.length > 0) {
      SoundHelper.playSoundOnUnit(this.bosses[0], "Audio/Voice/GinyuTokusentai.mp3", 17319);
    }

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 5000);
    }

    this.ping()
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

export class FriezaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Frieza Saga';

  constructor() {
    super();
    this.delay = 30;
    this.stats = 100;
    this.spawnSound = gg_snd_DBZSagaTheme;
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
    // const maxFriezaHenchmen = 8;
    // for (let i = 0; i < maxFriezaHenchmen; ++i) {
    //   let offsetX = Math.random() * 2000;
    //   let offsetY = Math.random() * 2000;
    //   const sagaCreep = CreateUnit(Players.NEUTRAL_HOSTILE, Creep.FriezaAppule, 8100 + offsetX, 900 + offsetY, Math.random() * 360);
    // }

    this.addHeroListToSaga(["Frieza 1", "Frieza 2", "Frieza 3", "Frieza 4", "Frieza 5"], true);

    for (let i = 1; i < this.bosses.length; ++i) {
      const frieza = this.bosses[i];
      SagaHelper.sagaHideUnit(frieza);
    }
    
    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 5000);
    }
    
    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    // if frieza dead, replace with strong frieza
    for (let i = 0; i < this.bosses.length - 1; ++i) {
      const frieza = this.bosses[i];
      const nextFrieza = this.bosses[i+1];
      const isNextForm = i == this.bosses.length - 2 ?
        SagaHelper.checkUnitHp(frieza, 0.1, false, true, false) :
        SagaHelper.checkUnitHp(frieza, 0.75, false, false, true)
      ;
      if (
        frieza && 
        nextFrieza &&
        isNextForm && 
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
        if (i == this.bosses.length) {
          SetUnitLifePercentBJ(nextFrieza, 66);
        }
      }
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

export class TrunksSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Trunks Saga';

  constructor() {
    super();
    this.delay = 45;
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
      let offsetX = Math.random() * 1200;
      let offsetY = Math.random() * 1200;
      const sagaCreep = CreateUnit(Player(PLAYER_NEUTRAL_AGGRESSIVE), Creep.FriezaPineapple, 23500 + offsetX, 5000 + offsetY, Math.random() * 360);
    }

    this.addHeroListToSaga(["Mecha Frieza", "King Cold"], true);
    
    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }
    
    this.ping()
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

// tagoma / frieza force saga

export class GoldenFriezaSaga extends AdvancedSaga implements Saga {
  name: string = '[DB Super] Resurrection \'F\'';

  protected frieza1: unit | undefined;
  protected friezaFinal: unit | undefined;
  protected friezaGolden: unit | undefined;

  constructor() {
    super();
    this.delay = 45;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "After undergoing intense training Frieza has returned to Earth seeking his revenge!"
      ],
    );

    this.addHeroListToSaga(["Resurrection Frieza 1", "Resurrection Frieza Final", "Resurrection Frieza Golden"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }

    this.frieza1 = this.bosses[0];
    this.friezaFinal = this.bosses[1];
    this.friezaGolden = this.bosses[2];

    SagaHelper.sagaHideUnit(this.friezaFinal);
    SagaHelper.sagaHideUnit(this.friezaGolden);

    this.ping();
    this.setupBossDeathActions(this);
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
