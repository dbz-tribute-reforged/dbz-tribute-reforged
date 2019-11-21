import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";
import { BlueHurricane } from "CustomAbility/BlueHurricane";
import { CustomAbility } from "CustomAbility/CustomAbility";

export class CustomHero {
  public abilities: CustomAbilityManager;

  constructor(
    public readonly unit: unit,
  ) {
    this.abilities = new CustomAbilityManager(
      [
        new ZanzoDash(),
        new BlueHurricane(),
      ]
    )
  }

  public useAbility(name: string, data: CustomAbilityData) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(data)) {
      customAbility.activate(data);
    }
  }

  public canCastAbility(name: string, data: CustomAbilityData): boolean {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility) {
      return customAbility.canCastAbility(data);
    }
    return false;
  }

  public getAbilityByIndex(index: number): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByIndex(index);
  }
}