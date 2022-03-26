import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants, Globals } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class RustTyrannoSaga extends AdvancedSaga implements Saga {
  name: string = '[SECRET] CR?';

  protected rustTyranno: unit | undefined;
  protected superRustTyranno: boolean;
  protected ultraRustTyranno: boolean;
  protected statGainCounter: number;
  protected statGainInterval: number;

  constructor() {
    super();
    this.delay = 60;
    this.superRustTyranno = false;
    this.ultraRustTyranno = false;
    this.statGainCounter = 0;
    this.statGainInterval = 1000;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "|cffff2020A mysterious fossil dinosaur has appeared!|r"
      ],
    );

    this.addHeroListToSaga(["Rust Tyranno"], true);

    for (const boss of this.bosses) {
      SetUnitAcquireRange(boss, 4500);
    }

    this.rustTyranno = this.bosses[0];

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.rustTyranno &&
      !this.superRustTyranno && 
      SagaHelper.checkUnitHp(this.rustTyranno, 0.7, true, false, true) && 
      !SagaHelper.isUnitSagaHidden(this.rustTyranno)
    ) { 
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Rust Tyranno|r: ROOOOOOOOAR!!!!!!!!",
        ],
      );
      this.superRustTyranno = true;
      SetUnitScale(this.rustTyranno, 2.75, 2.75, 2.75);
      SetHeroStr(this.rustTyranno, Math.floor(GetHeroStr(this.rustTyranno, true) * 1.2 + 3000), true);
      SetHeroAgi(this.rustTyranno, Math.floor(GetHeroAgi(this.rustTyranno, true) * 1.1 + 1000), true);
      SetHeroInt(this.rustTyranno, Math.floor(GetHeroInt(this.rustTyranno, true) * 1.2 + 2000), true);
      BlzSetUnitArmor(this.rustTyranno, (GetHeroAgi(this.rustTyranno, true) / 1000) + 10);
      SetUnitState(
        this.rustTyranno, 
        UNIT_STATE_LIFE, 
        GetUnitState(this.rustTyranno, UNIT_STATE_LIFE) + 
        GetUnitState(this.rustTyranno, UNIT_STATE_MAX_LIFE) * 0.2
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.rustTyranno, 
          "origin", 
        )
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl",
          this.rustTyranno, 
          "origin", 
        )
      );
    }
    
    if (
      this.rustTyranno &&
      this.superRustTyranno && 
      !this.ultraRustTyranno && 
      SagaHelper.checkUnitHp(this.rustTyranno, 0.4, true, false, true) && 
      !SagaHelper.isUnitSagaHidden(this.rustTyranno)
    ) { 
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Rust Tyranno|r: ROOOOOOOOAR!!!!!!!!",
        ],
      );
      this.ultraRustTyranno = true;
      SetUnitScale(this.rustTyranno, 3.25, 3.25, 3.25);
      SetHeroStr(this.rustTyranno, Math.floor(GetHeroStr(this.rustTyranno, true) * 1.3 + 3000), true);
      SetHeroAgi(this.rustTyranno, Math.floor(GetHeroAgi(this.rustTyranno, true) * 1.2 + 1000), true);
      SetHeroInt(this.rustTyranno, Math.floor(GetHeroInt(this.rustTyranno, true) * 1.2 + 2000), true);
      BlzSetUnitArmor(this.rustTyranno, (GetHeroAgi(this.rustTyranno, true) / 1000) + 15);
      SetUnitState(
        this.rustTyranno, 
        UNIT_STATE_LIFE, 
        GetUnitState(this.rustTyranno, UNIT_STATE_LIFE) + 
        GetUnitState(this.rustTyranno, UNIT_STATE_MAX_LIFE) * 0.2
      );
      UnitAddAbility(this.rustTyranno, FourCC("A0VK"));
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          this.rustTyranno, 
          "origin", 
        )
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl",
          this.rustTyranno, 
          "origin", 
        )
      );
    }

    if (
      this.rustTyranno && 
      this.ultraRustTyranno && 
      UnitHelper.isUnitAlive(this.rustTyranno)
    ) {
      const rustHP = GetUnitState(this.rustTyranno, UNIT_STATE_LIFE);
      const rustMaxHP = GetUnitState(this.rustTyranno, UNIT_STATE_MAX_LIFE);
      
      if (rustHP > 0.05 * rustMaxHP) {
        let newHP = rustHP;
        if (rustHP > 0.75 * rustMaxHP) {
          newHP = rustHP + 0.000005 * rustMaxHP;
        } else if (rustHP > 0.5 * rustMaxHP) {
          newHP = rustHP + 0.00001 * rustMaxHP;
        } else if (rustHP > 0.25 * rustMaxHP) {
          newHP = rustHP + 0.000015 * rustMaxHP;
        } else {
          newHP = rustHP + 0.00002 * rustMaxHP;
        }
        SetUnitState(
          this.rustTyranno,
          UNIT_STATE_LIFE,
          newHP
        );
      }

      ++this.statGainCounter;
      if (this.statGainCounter > this.statGainInterval) {
        this.statGainCounter = 0;
        if (rustHP < 0.5 * rustMaxHP) {
          this.statGainInterval += 500;
        } else {
          this.statGainInterval += 1000;
        }
        SetHeroStr(this.rustTyranno, Math.floor(GetHeroStr(this.rustTyranno, true) * 1.04), true);
        SetHeroAgi(this.rustTyranno, Math.floor(GetHeroAgi(this.rustTyranno, true) * 1.02), true);
        SetHeroInt(this.rustTyranno, Math.floor(GetHeroInt(this.rustTyranno, true) * 1.03), true);
        BlzSetUnitArmor(this.rustTyranno, (GetHeroAgi(this.rustTyranno, true) / 1000) + 10);
      }
    }
  }

  canStart(): boolean {
    return true;
    // return !Globals.isFBSimTest;
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
