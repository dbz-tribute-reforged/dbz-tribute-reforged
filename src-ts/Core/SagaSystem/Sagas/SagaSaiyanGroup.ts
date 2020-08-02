import { Saga } from "./BaseSaga";
import { Players } from "Libs/TreeLib/Structs/Players";
import { SagaHelper } from "../SagaHelper";
import { AdvancedSaga } from "./AdvancedSaga";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";
import { Constants } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";

export class RaditzSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Saiyan Saga I: Raditz';

  protected raditz: unit | undefined;

  constructor() {
    super();
    this.delay = 60;
    this.stats = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Raditz has arrived looking for Goku.",
      ],
      [
        "|cffffcc00Farmer|r: Oh god no, my Marijuana patch!",
        "|cffffcc00Farmer|r: Ah-ah-I mean er... my carrot patch",
        "|cffffcc00Farmer|r: I better do what any sensible American would do in this situation",
        "|cffffcc00Farmer with Shotgun|r: GET MAH GUN",
        "|cffffcc00Farmer with Shotgun|r: Holy crap, it's Sonic the Hedgehog",
      ], 3,
    );

    this.addHeroListToSaga(["Raditz"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 4000);
    }
    
    this.raditz = this.bosses.get("Raditz");
    
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


export class VegetaSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Saiyan Saga II: Nappa and Vegeta';

  
  protected vegeta: unit | undefined;
  protected nappa: unit | undefined;
  protected isNappaOoz: boolean;
  protected isVegetaOoz: boolean;

  constructor() {
    super();
    this.delay = 45;
    this.stats = 30;
    this.isNappaOoz = false;
    this.isVegetaOoz = false;
    this.spawnSound = gg_snd_DBZSagaTheme;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.POST_SAIYANS);
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Nappa and Vegeta have arrived looking for the Dragon Balls.",
      ],
      [
        "|cffffcc00Nappa|r: Are we there yet?",
        "|cffffcc00Vegeta|r: No.",
        "|cffffcc00Nappa|r: Are we there yet?",
        "|cffffcc00Vegeta|r: No.",
        "|cffffcc00Nappa|r: Are we there yet?",
        "|cffffcc00Vegeta|r: No.",
        "|cffffcc00Nappa|r: Are we there yet?",
        "|cffffcc00Vegeta|r: No.",
        "|cffffcc00Nappa|r: Are we there yet?",
        "|cffffcc00Vegeta|r: Yes!",
      ], 0.5, 5,
    );
    
    this.addHeroListToSaga(["Nappa", "Vegeta"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.vegeta = this.bosses.get("Vegeta");
    this.nappa = this.bosses.get("Nappa");
    
    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.vegeta && !this.isVegetaOoz &&
      SagaHelper.checkUnitHp(this.vegeta, 0.4, true, false, true)
    ) {
      this.isVegetaOoz = true;
      this.fakeOoz(this.vegeta);
    }
    
    if (
      this.nappa && !this.isNappaOoz &&
      SagaHelper.checkUnitHp(this.nappa, 0.2, true, false, true)
    ) {
      this.isNappaOoz = true;
      this.fakeOoz(this.nappa);
    }
  }

  fakeOoz(unit: unit) {
    BlzSetUnitSkin(unit, FourCC("H090"));
    SetHeroStr(unit, Math.floor(GetHeroStr(unit, true) * 1.2 + 50), true);
    SetHeroAgi(unit, Math.floor(GetHeroAgi(unit, true) * 1.2 + 50), true);
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
        unit, 
        "origin", 
      )
    );
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