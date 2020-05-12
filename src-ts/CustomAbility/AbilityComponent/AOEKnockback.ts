import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { KnockbackData } from "Common/KnockbackData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { Constants } from "Common/Constants";

export class AOEKnockback implements AbilityComponent, Serializable<AOEKnockback> {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT = 1;

  protected sourceCoord: Vector2D;
  protected targetCoord: Vector2D;
  protected newTargetCoord: Vector2D;

  constructor(
    public name: string = "AOEKnockback",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public knockbackData: KnockbackData = new KnockbackData(
      16, 0, 250,
    ),
    public knockbackSource: number = AOEKnockback.SOURCE_UNIT,
    public useLastCastPoint: boolean = false,
    public reflectBeams: boolean = false,
    public affectAllies: boolean = false,
  ) {
    this.sourceCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.newTargetCoord = new Vector2D();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (this.knockbackSource == AOEKnockback.SOURCE_UNIT) {
      this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    } else {
      if (this.useLastCastPoint) {
        this.sourceCoord.setVector(input.castPoint);
      } else {
        this.sourceCoord.setVector(input.targetPoint);
      }
    }
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      this.sourceCoord, 
      this.knockbackData.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer, this.affectAllies);
      }
    );

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      this.targetCoord.setPos(GetUnitX(target), GetUnitY(target));
      const sourceToTargetAngle = CoordMath.angleBetweenCoords(this.sourceCoord, this.targetCoord);
      if (this.reflectBeams && GetUnitTypeId(target) == Constants.dummyBeamUnitId) {
        SetUnitFacing(target, sourceToTargetAngle);
      }
      const knockbackAngle = this.knockbackData.angle + sourceToTargetAngle;
      this.newTargetCoord.polarProjectCoords(this.targetCoord, knockbackAngle, this.knockbackData.speed);
      PathingCheck.moveGroundUnitToCoord(target, this.newTargetCoord);
    });
    DestroyGroup(affectedGroup);
  }

  cleanup() {
    
  }

  clone(): AbilityComponent {
    return new AOEKnockback(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.knockbackData, 
      this.knockbackSource, this.useLastCastPoint,
      this.reflectBeams, this.affectAllies,
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
      knockbackSource: number;
      useLastCastPoint: boolean;
      reflectBeams: boolean;
      affectAllies: boolean; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.knockbackData = new KnockbackData().deserialize(input.knockbackData);
    this.knockbackSource = input.knockbackSource;
    this.useLastCastPoint = input.useLastCastPoint;
    this.reflectBeams = input.reflectBeams;
    this.affectAllies = input.affectAllies;
    return this;
  }
}