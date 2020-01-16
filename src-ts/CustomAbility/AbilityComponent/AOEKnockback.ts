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
    public startTick: number = 0,
    public endTick: number = -1,
    public knockbackData: KnockbackData = new KnockbackData(
      16, 0, 250,
    ),
    public affectAllies: boolean = false,
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      sourceCoord, 
      this.knockbackData.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer, this.affectAllies);
      }
    );

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      const targetCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
      const knockbackAngle = this.knockbackData.angle + CoordMath.angleBetweenCoords(sourceCoord, targetCoord);
      const newTargetCoord = CoordMath.polarProjectCoords(targetCoord, knockbackAngle, this.knockbackData.speed);
      PathingCheck.moveGroundUnitToCoord(target, newTargetCoord);
    });
    DestroyGroup(affectedGroup);
  }

  clone(): AbilityComponent {
    return new AOEKnockback(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.knockbackData, this.affectAllies,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      knockbackData: {
        speed: number; 
        angle: number; 
        aoe: number;
      };
      affectAllies: boolean; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.knockbackData = new KnockbackData().deserialize(input.knockbackData);
    this.affectAllies = input.affectAllies;
    return this;
  }
}