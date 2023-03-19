import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { KnockbackData } from "Common/KnockbackData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { Constants, Globals } from "Common/Constants";

export class AOEKnockback implements AbilityComponent, Serializable<AOEKnockback> {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT = 1;

  protected sourceCoord: Vector2D;
  protected targetCoord: Vector2D;
  protected newTargetCoord: Vector2D;

  protected affectedGroup: group;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

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
    public isPersistent: boolean = false,
  ) {
    this.sourceCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.newTargetCoord = new Vector2D();
    this.affectedGroup = CreateGroup();
  }

  doKnockback(input: CustomAbilityInput, target: unit) {
    if (UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer, this.affectAllies)) {
      this.targetCoord.setUnit(target);
      const sourceToTargetAngle = CoordMath.angleBetweenCoords(this.sourceCoord, this.targetCoord);
      if (this.reflectBeams && GetUnitTypeId(target) == Constants.dummyBeamUnitId) {
        SetUnitFacing(target, sourceToTargetAngle);
      }
      const knockbackAngle = this.knockbackData.angle + sourceToTargetAngle;
      this.newTargetCoord.polarProjectCoords(this.targetCoord, knockbackAngle, this.knockbackData.speed);
      PathingCheck.moveGroundUnitToCoord(target, this.newTargetCoord);
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
    }
    

    if (this.knockbackSource == AOEKnockback.SOURCE_UNIT) {
      this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    } else {
      if (this.useLastCastPoint) {
        this.sourceCoord.setVector(input.castPoint);
      } else {
        this.sourceCoord.setVector(input.targetPoint);
      }
    }
    
    if (!this.isPersistent) {
      GroupEnumUnitsInRange(
        this.affectedGroup, 
        this.sourceCoord.x, 
        this.sourceCoord.y, 
        this.knockbackData.aoe,
        null
      );
    } else {
      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        this.sourceCoord.x, 
        this.sourceCoord.y, 
        this.knockbackData.aoe,
        null
      );
      GroupAddGroup(Globals.tmpUnitGroup, this.affectedGroup);
    }

    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      this.doKnockback(input, target);
    });
    
    if (!this.isPersistent) {
      GroupClear(this.affectedGroup);
    } else {    
      GroupClear(Globals.tmpUnitGroup);
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      GroupClear(this.affectedGroup);
    }
  }

  cleanup() {
    DestroyGroup(this.affectedGroup);
  }

  clone(): AbilityComponent {
    return new AOEKnockback(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.knockbackData, 
      this.knockbackSource, this.useLastCastPoint,
      this.reflectBeams, this.affectAllies,
      this.isPersistent,
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
      isPersistent: boolean;
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
    this.isPersistent = input.isPersistent;
    return this;
  }
}