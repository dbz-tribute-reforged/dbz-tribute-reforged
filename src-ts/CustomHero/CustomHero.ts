import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { BlueHurricane } from "CustomAbility/BlueHurricane";
import { CustomAbility, CostType } from "CustomAbility/CustomAbility";
import { ShiningSwordAttack } from "CustomAbility/ShiningSwordAttack";
import { Beam } from "CustomAbility/Beam";
import { BeamPurple } from "CustomAbility/BeamPurple";
import { BeamRed } from "CustomAbility/BeamRed";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { CastTimeHelper } from "./CastTimeHelper";

export class CustomHero {
  public abilities: CustomAbilityManager;

  public isCasting: boolean;

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
    );
    this.isCasting = false;
  }

  public useAbility(name: string, input: CustomAbilityInput) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(input)) {
      if (!this.isCasting || customAbility.canMultiCast) {
          this.isCasting = true;
          CastTimeHelper.waitCastTimeThenActivate(this, customAbility, input);
      }
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