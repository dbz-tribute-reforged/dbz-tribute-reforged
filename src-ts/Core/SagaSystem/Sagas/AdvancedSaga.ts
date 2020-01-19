import { BaseSaga, SagaState, Saga } from "./BaseSaga";
import { Logger } from "Libs/TreeLib/Logger";
import { SagaHelper } from "../SagaHelper";
import { Players } from "Libs/TreeLib/Structs/Players";
import { Colorizer } from "Common/Colorizer";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class AdvancedSaga {
  public name: string = '';
  public state: SagaState;
  
  public bosses: Map<string, unit>;

  public sagaRewardTrigger: trigger;
  public sagaDelayTimer: timer;
  public sagaDelay: number;

  // deprecated, 
  // stats are given based on lvl of dying saga boss
  public stats: number;

  public spawnSound: sound;
  public completeSound: sound;

  public useCustomAggroClosest: boolean;
  public aggroCounter: number;

  constructor() {
    this.state = SagaState.NotStarted;
    this.name = '';
    this.bosses = new Map();
    this.sagaRewardTrigger = CreateTrigger();
    this.sagaDelayTimer = CreateTimer();
    this.sagaDelay = 0;
    this.stats = 0;
    this.spawnSound = gg_snd_QuestNew;
    this.completeSound = gg_snd_QuestCompleted;
    this.useCustomAggroClosest = true;
    this.aggroCounter = 0;
  }

  start(): void {
    // Logger.LogDebug(this.name + " Started");
    this.state = SagaState.InProgress;
    this.aggroCounter = 0;
  }

  complete(): void {
    // Logger.LogDebug(this.name + " Completed");
    this.state = SagaState.Completed;
    PlaySoundBJ(this.completeSound);
  }

  update(t: number): void {
    if (this.useCustomAggroClosest) {
      ++this.aggroCounter;
      if (this.aggroCounter > Constants.sagaAggroInterval) {
        this.aggroCounter = 0;
        this.updateSagaAggro();
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
  }

  addEventRewardStats(boss: unit) {
    TriggerRegisterUnitEvent(
      this.sagaRewardTrigger,
      boss, 
      EVENT_UNIT_DEATH,
    )
  }

  addActionRewardStats(saga: Saga) {
    // TriggerRegisterPlayerUnitEvent(
    //   this.sagaRewardTrigger,
    //   Players.NEUTRAL_HOSTILE,
    //   EVENT_PLAYER_UNIT_DEATH,
    //   Condition(() => {
    //     return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO) && saga.canComplete();
    //   }),
    // );
    for (const [name, sagaUnit] of this.bosses) {
      this.addEventRewardStats(sagaUnit);
    }

    TriggerAddAction(
      this.sagaRewardTrigger,
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

  updateSagaAggro() {
    for (const [name, boss] of this.bosses) {
      if (
        !IsUnitType(boss, UNIT_TYPE_DEAD) &&
        !SagaHelper.isUnitSagaHidden(boss)
      ) {
        // find closest enemy hero
        // and go attack them
        const enemyGroup = CreateGroup();
        const bossPlayer = GetOwningPlayer(boss);
        const acquireRange = GetUnitAcquireRange(boss);
        const bossPos = new Vector2D(GetUnitX(boss), GetUnitY(boss));

        GroupEnumUnitsInRange(
          enemyGroup,
          bossPos.x,
          bossPos.y,
          acquireRange,
          Condition(() => {
            const testUnit = GetFilterUnit();
            const x = GetUnitX(testUnit);
            const y = GetUnitY(testUnit);
            return (
              IsUnitEnemy(testUnit, bossPlayer) &&
              IsUnitType(testUnit, UNIT_TYPE_HERO) && 
              !IsUnitType(testUnit, UNIT_TYPE_DEAD) &&
              !BlzIsUnitInvulnerable(testUnit) && 
              !IsUnitHidden(testUnit) && 
              !(
                x > Constants.heavenHellBottomLeft.x &&
                y > Constants.heavenHellBottomLeft.y &&
                x < Constants.heavenHellTopRight.x &&
                y < Constants.heavenHellTopRight.y
              )
            )
          })
        );

        let closestUnit = boss;
        let closestDistance = acquireRange;
        ForGroup(enemyGroup, () => {
          const enemyUnit = GetEnumUnit();
          const enemyPos = new Vector2D(GetUnitX(enemyUnit), GetUnitY(enemyUnit));
          const enemyDistance = CoordMath.distance(enemyPos, bossPos);
          if (enemyDistance < closestDistance) {
            closestUnit = enemyUnit;
            closestDistance = enemyDistance;
          }
        });
        
        if (IsUnitEnemy(closestUnit, bossPlayer)) {
          for (const [orderBossName, orderBoss] of this.bosses) {
            // IssueTargetOrder(orderBoss, "attack", closestUnit);
            IssueTargetOrder(orderBoss, "smart", closestUnit);
          }
        }

        DestroyGroup(enemyGroup);
        break;
      }
    }
  }
}
