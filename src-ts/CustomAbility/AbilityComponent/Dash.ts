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
  static readonly DIRECTION_LAST_CAST_UNIT_TARGET = 3;

  static readonly AGI_TO_BONUS_SPEED_PERCENT = 0.0025;

  static readonly MIN_DISTANCE_FROM_PREVIOUS = 10;

  protected previousCoord: Vector2D;

  constructor(
    public name: string = "Dash",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public targetDirection: number = Dash.DIRECTION_TARGET_POINT,
    public isFlying: boolean = false,
    public checkPreviousCoord: boolean = false,
    public useLastCastPoint: boolean = false,
    public angleOffset: number = 0,
    public distance: number = 25,
  ) {
    this.previousCoord = new Vector2D();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const currentCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    if (
      !this.checkPreviousCoord ||
      CoordMath.distance(this.previousCoord, currentCoord) > Dash.MIN_DISTANCE_FROM_PREVIOUS
    ) {
      let direction: number = 0;
      let dashTargetPoint = input.targetPoint;
      if (this.useLastCastPoint) {
        dashTargetPoint = input.castPoint;
      }
      
      if (this.targetDirection == Dash.DIRECTION_TARGET_POINT) {
        direction = CoordMath.angleBetweenCoords(currentCoord, dashTargetPoint);
        SetUnitFacing(source, direction);

      } else if (this.targetDirection == Dash.DIRECTION_SOURCE_FORWARD) {
        direction = GetUnitFacing(source);

      } else if (this.targetDirection == Dash.DIRECTION_UNIT_TARGET) {
        if (input.targetUnit) {
          dashTargetPoint = new Vector2D(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
        }
        direction = CoordMath.angleBetweenCoords(currentCoord, dashTargetPoint);
      } else if (this.targetDirection == Dash.DIRECTION_LAST_CAST_UNIT_TARGET) {
        if (input.castUnit){
          dashTargetPoint = new Vector2D(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
        }
        direction = CoordMath.angleBetweenCoords(currentCoord, dashTargetPoint);
      }

      direction += this.angleOffset;

      let distanceToMove = this.distance;
      if (IsUnitType(source, UNIT_TYPE_HERO) && this.angleOffset != 180) {
        distanceToMove = distanceToMove * 
          Math.min(
            3.0,
            (
              1 + GetHeroAgi(source, true) * Dash.AGI_TO_BONUS_SPEED_PERCENT * 0.01
            )
          );
      }

      const distanceToTarget = CoordMath.distance(currentCoord, dashTargetPoint);

      let targetCoord;
      if (distanceToTarget > distanceToMove) {
        targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, distanceToMove);
      } else {
        targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, distanceToTarget);
      }

      if (this.isFlying) {
        PathingCheck.moveFlyingUnitToCoord(source, targetCoord);
      } else {
        PathingCheck.moveGroundUnitToCoord(source, targetCoord);
      }
      this.previousCoord.x = targetCoord.x;
      this.previousCoord.y = targetCoord.y;
    }
  }
  
  cleanup() {

  }

  clone(): AbilityComponent {
    return new Dash(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.targetDirection, this.isFlying, this.checkPreviousCoord,
      this.useLastCastPoint, 
      this.angleOffset, this.distance,
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
      checkPreviousCoord: boolean;
      useLastCastPoint: boolean;
      angleOffset: number;
      distance: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.targetDirection = input.targetDirection;
    this.isFlying = input.isFlying;
    this.checkPreviousCoord = input.checkPreviousCoord;
    this.useLastCastPoint = input.useLastCastPoint;
    this.angleOffset = input.angleOffset;
    this.distance = input.distance;
    return this;
  }
}