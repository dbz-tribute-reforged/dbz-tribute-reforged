import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class FlyingForwardDash implements AbilityComponent, Serializable<FlyingForwardDash> {

  constructor(
    public name: string = "FlyingForwardDash",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public distance: number = 40.0,
  ) {

  }
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const currentCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    const direction = GetUnitFacing(source);
    const targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, this.distance);
    PathingCheck.moveFlyingUnitToCoord(source, targetCoord);
  }

  clone(): AbilityComponent {
    return new FlyingForwardDash(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.distance,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      distance: number; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.distance = input.distance;
    return this;
  }
}