import { Vector2D } from "Common/Vector2D";


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
  ) {

  }

  setupUnitsOfPlayer(playerId: number) {
    this.units.clear();
    const playerUnits = CreateGroup();
    // TODO: don't lead dead units join
    GroupEnumUnitsOfPlayer(playerUnits, Player(playerId), Filter(() => {
      return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO) && IsUnitAliveBJ(GetFilterUnit());
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
      SetUnitX(unitContestant.unit, unitContestant.oldPosition.x);
      SetUnitY(unitContestant.unit, unitContestant.oldPosition.y);
    }
  }
}