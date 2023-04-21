import { CustomHero } from "CustomHero/CustomHero";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { KeyInput } from "Core/KeyInputSystem/KeyInput";

export class CustomPlayer {
  public name: string;
  public player: player;
  public heroes: Map<unit, CustomHero>;
  public units: Map<unit, unit>;
  protected currentlySelectedUnit: unit;
  protected lastSelectedOwnedHero: unit;
  public mouseData: Vector2D;
  public orderPoint: Vector2D;
  public lastCastPoint: Vector2D;
  public targetUnit: unit;
  public lastCastUnit: unit;
  public usingCustomUI: boolean;
  public orderWidget: widget | null;
  public lastOrderId: number;

  public useZanzoDash: boolean;

  public heroPickSpawn: Vector2D;

  public osKeyMap: Map<oskeytype, KeyInput> = new Map();

  constructor(
    public id: number, 
  ) {
    this.player = Player(id);
    this.name = GetPlayerName(this.player);
    this.heroes = new Map();
    this.units = new Map();
    this.currentlySelectedUnit = GetEnumUnit();
    this.lastSelectedOwnedHero = GetEnumUnit();
    this.mouseData = new Vector2D(0, 0);
    this.orderPoint = new Vector2D(0, 0);
    this.lastCastPoint = new Vector2D(0, 0);
    this.targetUnit = GetEnumUnit();
    this.lastCastUnit = GetEnumUnit();
    this.usingCustomUI = false;
    this.orderWidget = null;
    this.lastOrderId = 0;

    this.useZanzoDash = false;

    this.heroPickSpawn = new Vector2D();
  }

  public addHero(hero: unit): this {
    if (
      IsUnitType(hero, UNIT_TYPE_HERO) 
      && 
      IsUnitOwnedByPlayer(hero, this.player)
      &&
      !this.hasHero(hero)
      &&
      !IsUnitIllusion(hero)
    ) {
      this.heroes.set(
        hero,
        new CustomHero(
          hero
        )
      );
      // BJDebugMsg("CustomPlayer added hero " + GetHeroProperName(hero) + " " + GetUnitName(hero) + " num: " + this.heroes.length);
    }
    return this;
  }

  // slow, loops through all heroes and removes that hero
  public removeHero(hero: unit): boolean {
    return this.heroes.delete(hero);
  }

  public hasHero(hero: unit): boolean {
    if (this.heroes.get(hero)) {
      return true;
    }
    return false;
  }

  public addUnit(unit: unit): this {
    if (
      IsUnitOwnedByPlayer(unit, this.player)
      &&
      !this.hasUnit(unit)
    ) {
      this.units.set(unit, unit);
    }
    return this;
  }

  public hasUnit(unit: unit): boolean {
    return this.units.has(unit);
  }

  public getCustomHero(hero: unit): CustomHero | undefined {
    return this.heroes.get(hero);
  }

  public getCurrentlySelectedCustomHero(): CustomHero | undefined {
    return this.heroes.get(this.currentlySelectedUnit);
  }

  public getLastSelectedOwnedCustomHero(): CustomHero | undefined {
    return this.heroes.get(this.lastSelectedOwnedHero);
  }

  get selectedUnit(): unit {
    return this.currentlySelectedUnit;
  }

  set selectedUnit(unit: unit) {
    this.currentlySelectedUnit = unit;
    if (this.getCustomHero(unit) != undefined) {
      this.lastSelectedOwnedHero = unit;;
    }
  }

  get firstCustomHero() : CustomHero | undefined{
    for (const hero of this.heroes.values()) {
      if (
        UnitHelper.isUnitAlive(hero.unit)
        && !IsUnitIllusion(hero.unit)
        && !IsUnitType(hero.unit, UNIT_TYPE_SUMMONED)
      ) {
        return hero;
      }
    }
    return undefined;
  }

  get allHeroes(): IterableIterator<CustomHero> {
    return this.heroes.values();
  }

  get allUnits(): IterableIterator<unit> {
    return this.units.values();
  }

  cleanupRemovedHeroes() {
    const removed = [];
    for (const ch of this.heroes.values()) {
      if (GetUnitTypeId(ch.unit) == 0) {
        ch.cleanup();
        removed.push(ch.unit);
      }
    }
    removed.map((removedUnit: unit) => {
      this.heroes.delete(removedUnit);
    }, this);
  }

  cleanupRemovedUnits () {
    const removed = [];
    for (const v of this.units.values()) {
      if (GetUnitTypeId(v) == 0) {
        removed.push(v);
      }
    }
    removed.map((removedUnit: unit) => {
      this.units.delete(removedUnit);
    }, this);
  }

  setOsKeyInput(oskey: oskeytype, keyInput: KeyInput) {
    this.osKeyMap.set(oskey, keyInput);
  }

  getOsKeyInput(oskey: oskeytype): KeyInput {
    if (!this.osKeyMap.has(oskey)) {
      const ki = new KeyInput(oskey);
      this.osKeyMap.set(oskey, ki);
      return ki;
    }
    return this.osKeyMap.get(oskey);
  }
}