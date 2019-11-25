import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class GroundTargetDash implements AbilityComponent, Serializable<GroundTargetDash> {

  constructor(
    public name: string = "GroundTargetDash",
    public repeatInterval: number = 1,
    public distance: number = 40.0,
  ) {

  }
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const currentCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    const direction = CoordMath.angleBetweenCoords(currentCoord, input.targetPoint);
    const targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, this.distance);
    PathingCheck.moveGroundUnitToCoord(source, targetCoord);
  }

  clone(): AbilityComponent {
    return new GroundTargetDash(
      this.name, this.repeatInterval, this.distance,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      distance: number; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.distance = input.distance;
    return this;
  }
}