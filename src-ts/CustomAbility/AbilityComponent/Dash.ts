import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { UnitHelper } from "Common/UnitHelper";

export class Dash implements AbilityComponent, Serializable<Dash> {
  static readonly DIRECTION_TARGET_POINT = 0;
  static readonly DIRECTION_SOURCE_FORWARD = 1;
  static readonly DIRECTION_UNIT_TARGET = 2;
  static readonly DIRECTION_LAST_CAST_UNIT_TARGET = 3;
  static readonly DIRECTION_CASTER_POINT = 4;

  static readonly AGI_TO_BONUS_SPEED_PERCENT = 0.00125 * 0.01;
  static readonly MINIMUM_STR_AGI_RATIO = 0.8;
  static readonly MAXIMUM_AGI_DISTANCE_MULTIPLIER = 3.0;

  static readonly MIN_DISTANCE_FROM_PREVIOUS = 10;

  static readonly DASH_TYPE_GROUND = 0;
  static readonly DASH_TYPE_FLYING = 1;
  static readonly DASH_TYPE_ZANZO = 2;

  static readonly ZANZO_DYNAMIC_CD = 2;
  static readonly ZANZO_STATIC_CD = 1;

  protected previousCoord: Vector2D;
  protected currentCoord: Vector2D;
  protected dashTargetPoint: Vector2D;
  protected targetCoord: Vector2D;
  protected distanceTravelled: number;

  constructor(
    public name: string = "Dash",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public targetDirection: number = Dash.DIRECTION_TARGET_POINT,
    public dashType: number = Dash.DASH_TYPE_GROUND,
    public checkPreviousCoord: boolean = false,
    public useLastCastPoint: boolean = false,
    public angleOffset: number = 0,
    public distance: number = 25,
  ) {
    this.previousCoord = new Vector2D();
    this.currentCoord = new Vector2D();
    this.dashTargetPoint = new Vector2D();
    this.targetCoord = new Vector2D();
    this.distanceTravelled = 0;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {

    this.currentCoord.setPos(GetUnitX(source), GetUnitY(source));
    if (
      !this.checkPreviousCoord ||
      CoordMath.distance(this.previousCoord, this.currentCoord) > Dash.MIN_DISTANCE_FROM_PREVIOUS
    ) {
      let direction: number = 0;
      if (this.useLastCastPoint) {
        this.dashTargetPoint.setVector(input.castPoint);
      } else {
        this.dashTargetPoint.setVector(input.targetPoint);
      }
      
      if (this.targetDirection == Dash.DIRECTION_TARGET_POINT) {
        direction = CoordMath.angleBetweenCoords(this.currentCoord, this.dashTargetPoint);
        SetUnitFacing(source, direction);

      } else if (this.targetDirection == Dash.DIRECTION_SOURCE_FORWARD) {
        direction = GetUnitFacing(source);

      } else if (this.targetDirection == Dash.DIRECTION_UNIT_TARGET) {
        if (input.targetUnit) {
          if (UnitHelper.isUnitAlive(input.targetUnit)) {
            this.dashTargetPoint.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
          } else {
            this.dashTargetPoint.setVector(this.currentCoord);
          }
        }
        direction = CoordMath.angleBetweenCoords(this.currentCoord, this.dashTargetPoint);
      } else if (this.targetDirection == Dash.DIRECTION_LAST_CAST_UNIT_TARGET) {
        if (input.castUnit) {
          this.dashTargetPoint.setPos(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
        }
        direction = CoordMath.angleBetweenCoords(this.currentCoord, this.dashTargetPoint);
      } else if (this.targetDirection == Dash.DIRECTION_CASTER_POINT) {
        this.dashTargetPoint.setPos(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
        direction = CoordMath.angleBetweenCoords(this.currentCoord, this.dashTargetPoint);
      }

      direction += this.angleOffset;

      let distanceToMove = this.distance;
      if (IsUnitType(source, UNIT_TYPE_HERO) && this.angleOffset != 180) {
        const sourceAgi = GetHeroAgi(source, true);
        const bonusAgiSpeed = 1 + sourceAgi * Dash.AGI_TO_BONUS_SPEED_PERCENT;
        const bonusAgiToStrRatioSpeed = Math.max(
          Dash.MINIMUM_STR_AGI_RATIO,
          -0.05 + Math.min(
            bonusAgiSpeed,
            sourceAgi / Math.max(1, GetHeroStr(source, true))
          )
        );
        
        distanceToMove = distanceToMove * 
          Math.min(
            Dash.MAXIMUM_AGI_DISTANCE_MULTIPLIER, 
            bonusAgiSpeed * bonusAgiToStrRatioSpeed
          );
      }

      const distanceToTarget = CoordMath.distance(this.currentCoord, this.dashTargetPoint);

      if (distanceToTarget > distanceToMove) {
        this.targetCoord.polarProjectCoords(this.currentCoord, direction, distanceToMove);
      } else {
        this.targetCoord.polarProjectCoords(this.currentCoord, direction, distanceToTarget);
      }

      if (this.dashType == Dash.DASH_TYPE_ZANZO) {
        PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(source, this.targetCoord);
      } else if (this.dashType == Dash.DASH_TYPE_GROUND) {
        PathingCheck.moveGroundUnitToCoord(source, this.targetCoord);
      } else {
        PathingCheck.moveFlyingUnitToCoord(source, this.targetCoord);
      }
      // target coord = destination
      this.targetCoord.setPos(GetUnitX(source), GetUnitY(source));
      // distance = start to destination
      this.distanceTravelled += CoordMath.distance(this.currentCoord, this.targetCoord);
      this.previousCoord.setVector(this.targetCoord);
    }

    if (ability.isFinishedUsing(this)) {
      if (this.dashType == Dash.DASH_TYPE_ZANZO) {
          // change cooldown based on distance travelled of zanzo dash
          const duration = ability.getDuration();
          const distanceRatio = Math.min(1.1, this.distanceTravelled / (this.distance * duration));
          const newCd = distanceRatio * Dash.ZANZO_DYNAMIC_CD + Dash.ZANZO_STATIC_CD;
          ability.setCd(newCd);

          // readjust unit loc based on closest non-cliff area..
          PathingCheck.unstuckGroundUnitFromCliff(source, this.targetCoord);
      }
      this.distanceTravelled = 0;
    }
  }
  
  cleanup() {

  }

  clone(): AbilityComponent {
    return new Dash(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.targetDirection, this.dashType, this.checkPreviousCoord,
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
      dashType: number;
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
    this.dashType = input.dashType;
    this.checkPreviousCoord = input.checkPreviousCoord;
    this.useLastCastPoint = input.useLastCastPoint;
    this.angleOffset = input.angleOffset;
    this.distance = input.distance;
    return this;
  }
}