import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { BlueHurricane } from "CustomAbility/BlueHurricane";
import { CustomAbility, CostType } from "CustomAbility/CustomAbility";
import { ShiningSwordAttack } from "CustomAbility/ShiningSwordAttack";
import { Beam } from "CustomAbility/Beam";
import { BeamPurple } from "CustomAbility/BeamPurple";
import { BeamRed } from "CustomAbility/BeamRed";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class CustomHero {
  public abilities: CustomAbilityManager;

  constructor(
    public readonly unit: unit,
  ) {
    // remove these defaults for actual heroes, i think
    this.abilities = new CustomAbilityManager(
      [
        new ZanzoDash(),
        new BlueHurricane(),
        new ShiningSwordAttack(),
        new Beam(),
        new BeamPurple(),
        new BeamRed(),
      ]
    )
  }

  public useAbility(name: string, input: CustomAbilityInput) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(input)) {
      customAbility.activate(input);
    }
  }

  public canCastAbility(name: string, input: CustomAbilityInput): boolean {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility) {
      return customAbility.canCastAbility(input);
    }
    return false;
  }

  public getAbilityByIndex(index: number): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByIndex(index);
  }
}