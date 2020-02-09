import { CustomHero } from "CustomHero/CustomHero";
import { Vector2D } from "Common/Vector2D";

export class CustomPlayer {
  protected heroes: Map<unit, CustomHero>;
  protected currentlySelectedUnit: unit;
  protected lastSelectedOwnedHero: unit;
  public mouseData: Vector2D;
  public orderPoint: Vector2D;
  public lastCastPoint: Vector2D;
  public targetUnit: unit;
  public lastCastUnit: unit;
  public usingCustomUI: boolean;

  constructor(
    public id: number, 
    public name: string,
  ) {
    this.heroes = new Map();
    this.currentlySelectedUnit = GetEnumUnit();
    this.lastSelectedOwnedHero = GetEnumUnit();
    this.mouseData = new Vector2D(0, 0);
    this.orderPoint = new Vector2D(0, 0);
    this.lastCastPoint = new Vector2D(0, 0);
    this.targetUnit = GetEnumUnit();
    this.lastCastUnit = GetEnumUnit();
    this.usingCustomUI = false;
  }

  public addHero(hero: unit): this {
    if (
      IsUnitType(hero, UNIT_TYPE_HERO) 
      && 
      IsUnitOwnedByPlayer(hero, Player(this.id))
      &&
      !this.hasHero(hero)
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

  get allHeroes(): IterableIterator<CustomHero> {
    return this.heroes.values();
  }

  cleanupRemovedHeroes() {
    const removed = [];
    for (const [unit, customHero] of this.heroes) {
      if (GetUnitTypeId(unit) == 0) {
        customHero.cleanup();
        removed.push(unit);
      }
    }
    removed.map((removedUnit: unit) => {
      this.heroes.delete(removedUnit);
    }, this);

  }
}