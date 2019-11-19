import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";

export class CustomHero {
  public abilities: CustomAbilityManager;

  constructor(
    public readonly unit: unit,
  ) {
    this.abilities = new CustomAbilityManager(
      [
        new ZanzoDash(),
      ]
    )
  }

  public useAbility(name: string, data: CustomAbilityData) {
    let customAbility = this.abilities.getCustomAbility(name);
    if (customAbility && customAbility.canCastAbility(data)) {
      customAbility.activate(data);
    }
  }

  public canCastAbility(name: string, data: CustomAbilityData): boolean {
    let customAbility = this.abilities.getCustomAbility(name);
    if (customAbility) {
      return customAbility.canCastAbility(data);
    }
    return false;
  }

}