import { Vector2D } from "Common/Vector2D";
import { TournamentData } from "./TournamentData";
import { UnitHelper } from "Common/UnitHelper";
import { Globals } from "Common/Constants";


export class UnitContestant {
  
  public item1: item;
  public item2: item;
  public item3: item;
  public item4: item;
  public item5: item;
  public item6: item;

  constructor(
    public unit: unit,
    public oldPosition: Vector2D,
    public oldHpPercent: number,
    public oldMpPercent: number,
  ) {
    
    let i = 0;
    this.item1 = UnitItemInSlot(unit, i++);
    this.item2 = UnitItemInSlot(unit, i++);
    this.item3 = UnitItemInSlot(unit, i++);
    this.item4 = UnitItemInSlot(unit, i++);
    this.item5 = UnitItemInSlot(unit, i++);
    this.item6 = UnitItemInSlot(unit, i++);
  }

  getItem(index: number): item {
    switch (index) {
      case 0:
        return this.item1;
      case 1:
        return this.item2;
      case 2:
        return this.item3;
      case 3:
        return this.item4;
      case 4:
        return this.item5;
      case 5:
        return this.item6;
    }
    return this.item1;
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

    ForGroup(udg_StatMultPlayerUnits[playerId], () => {
      const unit = GetEnumUnit();
      if (UnitHelper.isUnitTournamentViable(unit) && UnitHelper.isUnitAlive(unit)) {
        this.units.set(
          unit,
          new UnitContestant(unit, 
            new Vector2D(GetUnitX(unit), GetUnitY(unit)),
            GetUnitLifePercent(unit),
            GetUnitManaPercent(unit)
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
  }

  // this leaks, as keys creates a non-dereference-able array or something
  // but isnt called very often, so should be fine
  getUnits(): IterableIterator<unit> {
    return this.units.keys();
  }

  hasUnit(unit: unit): boolean {
    return this.units.has(unit);
  }

  resetUnitsAlive() {
    this.unitsAlive = this.units.size;
  }


  returnItemsDoDrop(unitContestant: UnitContestant, index: number) {
    const it = UnitItemInSlot(unitContestant.unit, index);
    if (
      it != null
      && it != unitContestant.getItem(index)
      && BlzGetItemBooleanField(it, ITEM_BF_CAN_BE_DROPPED)
    ) {
      SetItemPosition(
        it, 
        TournamentData.budokaiArenaMidPoint.x, 
        TournamentData.budokaiArenaMidPoint.y
      );
    }
  }

  returnItemsDoAdd(unitContestant: UnitContestant, index: number) {
    const it = UnitItemInSlot(unitContestant.unit, index);
    const swapIt = unitContestant.getItem(index);
    if (
      it == null 
      && swapIt != null
      && it != swapIt
    ) {
      UnitAddItem(unitContestant.unit, swapIt);
    }
  }

  returnItems(unitContestant: UnitContestant) {
    // drop what is not yours
    for (let i = 0; i < 6; ++i) {
      this.returnItemsDoDrop(unitContestant, i);
    }
    // force add what is yours
    for (let i = 0; i < 6; ++i) {
      this.returnItemsDoAdd(unitContestant, i);
    }
  }


  returnAllUnits() {
    for (const unitContestant of this.units.values()) {
      if (UnitHelper.isUnitDead(unitContestant.unit)) {
        ReviveHero(unitContestant.unit, unitContestant.oldPosition.x, unitContestant.oldPosition.y, false);
      }
      this.returnItems(unitContestant);
      SetUnitLifePercentBJ(unitContestant.unit, unitContestant.oldHpPercent);
      SetUnitManaPercentBJ(unitContestant.unit, unitContestant.oldMpPercent);
      SetUnitInvulnerable(unitContestant.unit, false);
      PauseUnit(unitContestant.unit, false);
      SetUnitX(unitContestant.unit, unitContestant.oldPosition.x);
      SetUnitY(unitContestant.unit, unitContestant.oldPosition.y);
    }
    this.isInArena = false;
  }
}