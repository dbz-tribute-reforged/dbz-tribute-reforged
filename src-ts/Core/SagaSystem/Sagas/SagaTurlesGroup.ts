import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { UnitHelper } from "Common/UnitHelper";

export class TurlesSaga extends AdvancedSaga implements Saga {
  name: string = '[Movie] The Tree of Might';

  protected availableFruits: number;
  protected turles: unit | undefined;

  constructor() {
    super();
    this.delay = 40;
    this.stats = 25;
    this.availableFruits = 2;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Turles and the Crusher Corps have arrived on Earth!",
      ],
      [
        "|cffffcc00Turles|r: All your fruit are belong to us!",
      ],
    );

    this.addHeroListToSaga(["Turles"], true);
    this.turles = this.bosses.get("Turles");

    this.ping()
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.turles && this.availableFruits > 0 && 
      SagaHelper.checkUnitHp(this.turles, 0.10, true, false, true)
    ) {
      --this.availableFruits;
      SetHeroLevel(this.turles, GetHeroLevel(this.turles) + 1, true);
      SetHeroStr(this.turles, Math.floor(GetHeroStr(this.turles, true) * 1.05 + 20), true);
      SetHeroAgi(this.turles, Math.floor(GetHeroAgi(this.turles, true) * 1.1 + 20), true);
      SetHeroInt(this.turles, Math.floor(GetHeroInt(this.turles, true) * 1.1 + 20), true);
      SetUnitState(
        this.turles, 
        UNIT_STATE_LIFE, 
        GetUnitState(this.turles, UNIT_STATE_LIFE) + GetUnitState(this.turles, UNIT_STATE_MAX_LIFE) * 0.15
      );
      DestroyEffect(
        AddSpecialEffectTarget(
          "Abilities\\Spells\\Items\\AIem\\AIemTarget.mdl",
          this.turles, 
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