import { BaseSaga, SagaState, Saga } from "./BaseSaga";
import { Logger } from "Libs/TreeLib/Logger";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";
import { Colorizer } from "Common/Colorizer";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { SagaHeroAI } from "../SagaAISystem/SagaHeroAI";
import { UnitHelper } from "Common/UnitHelper";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: Map<string, unit>;
  public bossesAI: Map<unit, SagaHeroAI>;

  public bossDeathTrigger: trigger;
  public delayTimer: timer;
  public delay: number;

  // deprecated, 
  // stats are given based on lvl of dying saga boss
  public stats: number;

  public spawnSound: sound;
  public completeSound: sound;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = new Map();
    this.bossesAI = new Map();
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

  complete(): void {
    // Logger.LogDebug(this.name + " Completed");
    this.state = SagaState.Completed;
    PlaySoundBJ(this.completeSound);
    this.bosses.clear();
    for (const [boss, bossAI] of this.bossesAI) {
      bossAI.removeAbilities();
    }
    this.bossesAI.clear();
  }

  update(t: number): void {
    // saga boss ai is done on a per unit level
    // independent of each other
    for (const [boss, bossAI] of this.bossesAI) {
      if (
        !UnitHelper.isUnitDead(boss) &&
        !SagaHelper.isUnitSagaHidden(boss)
      ) {
        bossAI.performTickActions();
      }
    }
  }

  getColoredName(): string {
    return "|cffffcc00" + this.name + "|r";
  }

  spawnSagaUnits(): void {
    PlaySoundBJ(this.spawnSound);
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
  }

  addHeroListToSaga(names: string[], mustKill: boolean) {
    for (const name of names) {
      SagaHelper.addHeroToAdvancedSaga(this, name, mustKill);
    }
    for (const [name, sagaUnit] of this.bosses) {
      TriggerRegisterUnitEvent(
        this.bossDeathTrigger,
        sagaUnit, 
        EVENT_UNIT_DEATH,
      )
      if (GetUnitAcquireRange(sagaUnit) < Constants.sagaMinAcquisitionRange) {
        SetUnitAcquireRange(sagaUnit, Constants.sagaMinAcquisitionRange);
      }
    }
  }

  setupBossDeathActions(saga: Saga) {
    TriggerAddAction(
      this.bossDeathTrigger,
      () => {
        SagaHelper.pingDeathMinimap(GetDyingUnit());
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
}
