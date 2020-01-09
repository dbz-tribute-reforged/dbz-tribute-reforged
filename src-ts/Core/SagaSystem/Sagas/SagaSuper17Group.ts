import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";

export class Super17Saga extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Super 17 Saga';

  protected super17: unit | undefined;
  protected oldHp: number;

  constructor() {
    super();
    this.oldHp = 0;
    this.sagaDelay = 15;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Dr. Gero and Dr. Myuu have combined forces to create Super Android 17");

    this.addHeroListToSaga(["Super 17"], true);
    this.super17 = this.bosses.get("Super 17");
    if (this.super17) {
      this.oldHp = GetUnitState(this.super17, UNIT_STATE_LIFE);
      SetUnitManaPercentBJ(this.super17, 0);
    }

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, Constants.sagaMaxAcquisitionRange);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.super17
    ) {
      const newHp = GetUnitState(this.super17, UNIT_STATE_LIFE);
      const hpDiff = this.oldHp - newHp;
      let newMp = GetUnitState(this.super17, UNIT_STATE_MANA);
      // had more hp in before
      if (hpDiff > 0) {
        newMp += hpDiff;
        SetUnitState(
          this.super17, 
          UNIT_STATE_MANA, 
          newMp,
        );
      }

      if (newMp > 0.75 * GetUnitState(this.super17, UNIT_STATE_MAX_MANA)) {
        SetUnitState(
          this.super17,
          UNIT_STATE_LIFE,
          newHp + newMp * 0.5
        );
        SetUnitManaPercentBJ(this.super17, 0);
        DestroyEffect(
          AddSpecialEffectTarget(
            "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
            this.super17, 
            "origin", 
          )
        );
        DestroyEffect(
          AddSpecialEffectTarget(
            "Abilities\\Spells\\Items\\AIem\\AIemTarget.mdl",
            this.super17, 
            "origin", 
          )
        );
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
