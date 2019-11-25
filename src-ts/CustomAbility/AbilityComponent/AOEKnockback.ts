import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { KnockbackData } from "Common/KnockbackData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class AOEKnockback implements AbilityComponent, Serializable<AOEKnockback> {

  constructor(
    public name: string = "AOEKnockback",
    public repeatInterval: number = 1,
    public knockbackData: KnockbackData = new KnockbackData(
      16, 0, 250,
    )
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (this.knockbackData.aoe > 0) {
      const sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
      const affectedGroup = UnitHelper.getNearbyValidUnits(
        sourceCoord, 
        this.knockbackData.aoe,
        () => {
          return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer);
        }
      );

      ForGroup(affectedGroup, () => {
        const target = GetEnumUnit();
        const targetCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
        const knockbackAngle = this.knockbackData.angle + CoordMath.angleBetweenCoords(sourceCoord, targetCoord);
        const newTargetCoord = CoordMath.polarProjectCoords(targetCoord, knockbackAngle, this.knockbackData.speed);
        PathingCheck.moveGroundUnitToCoord(target, newTargetCoord);
      });
    }
  }

  clone(): AbilityComponent {
    return new AOEKnockback(
      this.name, this.repeatInterval, this.knockbackData,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      knockbackData: {
        speed: number; 
        angle: number; 
        aoe: number;
      }; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.knockbackData = new KnockbackData().deserialize(input.knockbackData);
    return this;
  }
}