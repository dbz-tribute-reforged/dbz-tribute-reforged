import { CustomHero } from "CustomHero/CustomHero";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";
import { Vector2D } from "Common/Vector2D";

export class CustomPlayer {
  protected heroes: CustomHero[];
  public currentlySelectedUnit: unit;
  public mouseData: Vector2D;

  constructor(
    public id: number, 
    public name: string,

  ) {
    this.heroes = [];
    this.currentlySelectedUnit = GetEnumUnit();
    this.mouseData = new Vector2D(0, 0);
  }

  public addHero(hero: unit): this {
    if (
      IsUnitType(hero, UNIT_TYPE_HERO) 
      && 
      IsUnitOwnedByPlayer(hero, Player(this.id))
      &&
      !this.hasHero(hero)
    ) {
      this.heroes.push(
        new CustomHero(
          hero
        )
      );
      BJDebugMsg("CustomPlayer added hero " + GetHeroProperName(hero) + " " + GetUnitName(hero) + " num: " + this.heroes.length);
    }
    return this;
  }

  public hasHero(hero: unit): boolean {
    if (this.heroes.some(e => e.unit == hero)) {
      return true;
    }
    return false;
  }

  public getCustomHero(hero: unit): CustomHero | undefined {
    return this.heroes.find(e => e.unit == hero);
  }

  public getCurrentlySelectedCustomHero(): CustomHero | undefined {
    return this.heroes.find(e => e.unit == this.currentlySelectedUnit);
  }
}