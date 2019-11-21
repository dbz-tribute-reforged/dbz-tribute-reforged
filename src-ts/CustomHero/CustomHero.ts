import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";
import { BlueHurricane } from "CustomAbility/BlueHurricane";
import { CustomAbility, CostType } from "CustomAbility/CustomAbility";
import { ShiningSwordAttack } from "CustomAbility/ShiningSwordAttack";
import { Beam } from "CustomAbility/Beam";
import { BeamPurple } from "CustomAbility/BeamPurple";
import { BeamRed } from "CustomAbility/BeamRed";

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