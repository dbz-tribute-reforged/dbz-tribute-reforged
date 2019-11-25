import { CustomAbility } from "CustomAbility/CustomAbility";

export class CustomHeroAbilityManager {
  protected abilities: Map<string, CustomAbility>;

  constructor(
    abilities?: CustomAbility[]
  ) {
    this.abilities = new Map();
    if (abilities) {
      for (const ability of abilities) {
        this.abilities.set(ability.name, ability);
      }
    }
  }

  public getCustomAbilityByName(name: string): CustomAbility | undefined {
    return this.abilities.get(name);
  }

  public getCustomAbilityByIndex(index: number): CustomAbility | undefined {
    let abilityName = "";
    if (index < this.abilities.size) {
      let i = 0;
      for (let [name, ability] of this.abilities) {
        if (i == index) {
          abilityName = name;
          break;
        }
        ++i;
      }
    }
    return this.abilities.get(abilityName);
  }

  public add(name: string, ability: CustomAbility): this {
    this.abilities.set(name, ability);
    return this;
  }
}