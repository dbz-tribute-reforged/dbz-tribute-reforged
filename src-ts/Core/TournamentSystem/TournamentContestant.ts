import { Vector2D } from "Common/Vector2D";
import { TournamentData } from "./TournamentData";
import { UnitHelper } from "Common/UnitHelper";


export class UnitContestant {
  constructor(
    public unit: unit,
    public oldPosition: Vector2D,
  ) {

  }
}

export class TournamentContestant {
  constructor(
    public id: number,
    public isCompeting: boolean = true,
    public isInArena: boolean = false,
    public units: Map<unit, UnitContestant> = new Map(),
    public unitsAlive: number = 0,
    public tournamentFogModifier: fogmodifier = CreateFogModifierRect(
      Player(id), 
      FOG_OF_WAR_VISIBLE, 
      TournamentData.tournamentRect, 
      true, 
      false
    ),
  ) {

  }

  completeTournament() {
    this.units.clear();
    this.stopVision();
  }

  startMatch() {
    this.setupUnitsOfPlayer(this.id);
    this.resetUnitsAlive();
    this.isInArena = true;
  }

  startVision() {
    FogModifierStart(this.tournamentFogModifier);
  }

  stopVision() {
    FogModifierStop(this.tournamentFogModifier);
    DestroyFogModifier(this.tournamentFogModifier);
  }

  setupUnitsOfPlayer(playerId: number) {
    this.units.clear();
    const playerUnits = CreateGroup();
    GroupEnumUnitsOfPlayer(playerUnits, Player(playerId), Filter(() => {
      return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO) && !UnitHelper.isUnitDead(GetFilterUnit());
    }));

    ForGroup(playerUnits, () => {
      const unit = GetEnumUnit();
      this.units.set(
        unit,
        new UnitContestant(unit, 
          new Vector2D(GetUnitX(unit), GetUnitY(unit))
        ),
      );
    })

    DestroyGroup(playerUnits);
  }

  getUnits(): IterableIterator<unit> {
    return this.units.keys();
  }

  resetUnitsAlive() {
    this.unitsAlive = this.units.size;
  }

  returnAllUnits() {
    for (const unitContestant of this.units.values()) {
      SetUnitInvulnerable(unitContestant.unit, false);
      PauseUnit(unitContestant.unit, false);
      if (UnitHelper.isUnitDead(unitContestant.unit)) {
        ReviveHero(unitContestant.unit, unitContestant.oldPosition.x, unitContestant.oldPosition.y, false);
      }
      SetUnitX(unitContestant.unit, unitContestant.oldPosition.x);
      SetUnitY(unitContestant.unit, unitContestant.oldPosition.y);
    }
    this.isInArena = false;
  }
}