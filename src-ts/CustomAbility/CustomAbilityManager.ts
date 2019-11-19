import { CustomAbility } from "./CustomAbility";

export class CustomAbilityManager {
  protected abilities: Map<String, CustomAbility>;

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

  getCustomAbility(name: string): CustomAbility | undefined {
    return this.abilities.get(name);
  }
}