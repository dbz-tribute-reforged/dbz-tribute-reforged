import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";

export class BebiSaga extends AdvancedSaga implements Saga {
  name: string = '[DBGT] Bebi Saga';

  protected bebi: unit | undefined;
  protected bebiGooz: unit | undefined;
  
  constructor() {
    super();
    this.sagaDelay = 30;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Bebi has taken over the body of Vegeta and begun terrorizing the Earth!"
    );

    this.addHeroListToSaga(["Super Bebi", "Bebi Golden Oozaru"], true);
    
    this.bebi = this.bosses.get("Super Bebi");
    this.bebiGooz = this.bosses.get("Bebi Golden Oozaru");

    if (this.bebiGooz) {
      SetUnitInvulnerable(this.bebiGooz, true);
      PauseUnit(this.bebiGooz, true);
      ShowUnitHide(this.bebiGooz);
    }

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 99999);
    }

    this.ping();
    this.addActionRewardStats(this);
  }

  update(t: number): void {
    if (this.bebi && this.bebiGooz) {
      const hp = GetUnitState(this.bebi, UNIT_STATE_LIFE);
      if (
        (
          IsUnitDeadBJ(this.bebi) || 
          hp < GetUnitState(this.bebi, UNIT_STATE_MAX_LIFE) * 0.5
        ) && 
        BlzIsUnitInvulnerable(this.bebiGooz) &&
        IsUnitPaused(this.bebiGooz) && 
        IsUnitHidden(this.bebiGooz)
      ) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 15, 
          "|cffffcc00Bebi|r: Bulma, beam me up!"
        );

        SetUnitX(this.bebiGooz, GetUnitX(this.bebi));
        SetUnitY(this.bebiGooz, GetUnitY(this.bebi));

        SetUnitInvulnerable(this.bebiGooz, false);
        PauseUnit(this.bebiGooz, false);
        ShowUnitShow(this.bebiGooz);

        this.ping();
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
