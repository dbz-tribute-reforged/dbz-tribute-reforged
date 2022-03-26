import { BaseSaga, SagaState, Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Colorizer } from "Common/Colorizer";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { SagaHeroAI } from "../SagaAISystem/SagaHeroAI";
import { UnitHelper } from "Common/UnitHelper";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: unit[];
  public bossesAI: Map<unit, SagaHeroAI>;
  public bossDrops: Map<unit, number[]>;

  public bossDeathTrigger: trigger;
  public delayTimer: timer;
  public delay: number;

  // deprecated, 
  // stats are now given based on lvl of dying saga boss
  public stats: number;

  public spawnSound: sound;
  public completeSound: sound;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = [];
    this.bossesAI = new Map();
    this.bossDrops = new Map();
    this.bossDeathTrigger = CreateTrigger();
    this.delayTimer = CreateTimer();
    this.delay = 0;
    this.stats = 0;
    this.spawnSound = gg_snd_QuestNew;
    this.completeSound = gg_snd_QuestCompleted;
  }

  start(): void {
    // Logger.LogDebug(this.name + " Started");
    this.state = SagaState.InProgress;
  }

  canComplete(): boolean {
    if (this.bosses.length > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  complete(): void {
    // Logger.LogDebug(this.name + " Completed");
    this.state = SagaState.Completed;
    PlaySoundBJ(this.completeSound);
    this.bosses.splice(0, this.bosses.length);
    for (const [boss, bossAI] of this.bossesAI) {
      bossAI.cleanup();
    }
    this.bossesAI.clear();
    this.bossDrops.clear();
  }

  update(t: number): void {
    // saga boss ai is done on a per unit level
    // independent of each other
    for (const boss of this.bosses) {
      if (
        !UnitHelper.isUnitDead(boss) &&
        !SagaHelper.isUnitSagaHidden(boss)
      ) {
        const bossAI = this.bossesAI.get(boss);
        if (bossAI) {
          bossAI.performTickActions();
        }
      }
    }
    // for (const [boss, bossAI] of this.bossesAI) {
    //   if (
    //     !UnitHelper.isUnitDead(boss) &&
    //     !SagaHelper.isUnitSagaHidden(boss)
    //   ) {
    //     bossAI.performTickActions();
    //   }
    // }
  }

  getColoredName(): string {
    return "|cffffcc00" + this.name + "|r";
  }

  spawnSagaUnits(): void {
    PlaySoundBJ(this.spawnSound);
    // this.playSoundSagaTheme();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
  }

  // private playSoundSagaTheme() {
  //   udg_TempSound = CreateSound("Audio/Music/DBZSagaTheme", false, false, false, 0, 0, "DefaultEAXON")
  //   SetSoundDuration(udg_TempSound, 7653)
  //   SetSoundChannel(udg_TempSound, 0)
  //   SetSoundVolume(udg_TempSound, 64)
  //   SetSoundPitch(udg_TempSound, 1.0)
  //   PlaySoundBJ(udg_TempSound)
  //   KillSoundWhenDone(udg_TempSound)
  // }

  addHeroListToSaga(names: string[], mustKill: boolean) {
    for (const name of names) {
      SagaHelper.addHeroToAdvancedSaga(this, name, mustKill);
    }
    for (const boss of this.bosses) {
      TriggerRegisterUnitEvent(
        this.bossDeathTrigger,
        boss, 
        EVENT_UNIT_DEATH,
      )
      if (GetUnitAcquireRange(boss) < Constants.sagaMinAcquisitionRange) {
        SetUnitAcquireRange(boss, Constants.sagaMinAcquisitionRange);
      }
    }
  }

  setupBossDeathActions(saga: Saga) {
    TriggerAddAction(
      this.bossDeathTrigger,
      () => {
        const deadUnit = GetDyingUnit();
        SagaHelper.pingDeathMinimap(deadUnit);
        
        const itemDrops = this.bossDrops.get(deadUnit);
        if (itemDrops) {
          const x = GetUnitX(deadUnit);
          const y = GetUnitY(deadUnit);

          for (let i = 0; i < 6; ++i) {
            const item = UnitItemInSlot(deadUnit, i);
            
            if (item) {
              SetItemPosition(item, x, y);
            }
          }
        }

        if (saga.canComplete()) {
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15, 
            this.getColoredName() + " completed by " + 
            Colorizer.getColoredPlayerName(GetOwningPlayer(GetKillingUnit()))
          );
          DestroyTrigger(GetTriggeringTrigger());
        }
      },
    )
  }

  ping() {
    SagaHelper.pingMinimap(this.bosses);
  }

  getDelay(): number
  {
    return this.delay;
  }
}
