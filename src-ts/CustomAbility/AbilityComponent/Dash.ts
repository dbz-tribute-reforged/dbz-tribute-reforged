import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class Dash implements AbilityComponent, Serializable<Dash> {
  static readonly DIRECTION_TARGET_POINT = 0;
  static readonly DIRECTION_SOURCE_FORWARD = 1;
  static readonly DIRECTION_UNIT_TARGET = 2;


  constructor(
    public name: string = "Dash",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public targetDirection: number = Dash.DIRECTION_TARGET_POINT,
    public isFlying: boolean = false,
    public useLastCastPoint: boolean = false,
    public distance: number = 25,
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const currentCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    let direction: number = 0;
    let dashTargetPoint = input.targetPoint;
    if (this.useLastCastPoint) {
      dashTargetPoint = input.castPoint;
    }
    
    if (this.targetDirection == Dash.DIRECTION_TARGET_POINT) {
      direction = CoordMath.angleBetweenCoords(currentCoord, dashTargetPoint);

    } else if (this.targetDirection == Dash.DIRECTION_SOURCE_FORWARD) {
      direction = GetUnitFacing(source);

    } else if (this.targetDirection == Dash.DIRECTION_UNIT_TARGET) {
      if (input.targetUnit) {
        const targetUnitCoord = new Vector2D(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
        direction = CoordMath.angleBetweenCoords(currentCoord, targetUnitCoord);
      } else {
        // if no unit just fallback to target point
        direction = CoordMath.angleBetweenCoords(currentCoord, dashTargetPoint);
      }
    }

    const targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, this.distance);
    if (this.isFlying) {
      PathingCheck.moveFlyingUnitToCoord(source, targetCoord);
    } else {
      PathingCheck.moveGroundUnitToCoord(source, targetCoord);
    }
  }
  

  clone(): AbilityComponent {
    return new Dash(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.targetDirection, this.isFlying, this.useLastCastPoint, 
      this.distance,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      targetDirection: number;
      isFlying: boolean;
      useLastCastPoint: boolean;
      distance: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.targetDirection = input.targetDirection;
    this.isFlying = input.isFlying;
    this.useLastCastPoint = input.useLastCastPoint;
    this.distance = input.distance;
    return this;
  }
}