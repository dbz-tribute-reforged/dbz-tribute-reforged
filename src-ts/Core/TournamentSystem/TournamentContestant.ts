import { Vector2D } from "Common/Vector2D";
import { TournamentData } from "./TournamentData";
import { UnitHelper } from "Common/UnitHelper";
import { Globals } from "Common/Constants";


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
    GroupEnumUnitsOfPlayer(playerUnits, Player(playerId), null);

    ForGroup(playerUnits, () => {
      const unit = GetEnumUnit();
      if (
        IsUnitType(unit, UNIT_TYPE_HERO) && 
        !UnitHelper.isUnitDead(unit) && 
        !BlzIsUnitInvulnerable(unit) &&
        !IsUnitType(unit, UNIT_TYPE_SUMMONED)
      ) {
        this.units.set(
          unit,
          new UnitContestant(unit, 
            new Vector2D(GetUnitX(unit), GetUnitY(unit))
          ),
        );
        UnitResetCooldown(unit);
        
        // reset stamina
        const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
        if (customHero) {
          customHero.setCurrentSP(customHero.getMaxSP());
        }
      }
    })

    DestroyGroup(playerUnits);
  }

  // this leaks, as keys creates a non-dereference-able array or something
  // but isnt called very often, so should be fine
  getUnits(): IterableIterator<unit> {
    return this.units.keys();
  }

  resetUnitsAlive() {
    this.unitsAlive = this.units.size;
  }

  returnAllUnits() {
    for (const unitContestant of this.units.values()) {
      if (UnitHelper.isUnitDead(unitContestant.unit)) {
        ReviveHero(unitContestant.unit, unitContestant.oldPosition.x, unitContestant.oldPosition.y, false);
      }
      SetUnitInvulnerable(unitContestant.unit, false);
      PauseUnit(unitContestant.unit, false);
      SetUnitX(unitContestant.unit, unitContestant.oldPosition.x);
      SetUnitY(unitContestant.unit, unitContestant.oldPosition.y);
    }
    this.isInArena = false;
  }
}