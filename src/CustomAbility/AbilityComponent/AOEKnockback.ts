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

  static readonly TARGET_AOE = 0;
  static readonly TARGET_TARGET_UNIT = 0;

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
    public knockbackTarget: number = AOEKnockback.TARGET_AOE,
    public useLastCastPoint: boolean = false,
    public reflectBeams: boolean = false,
    public affectAllies: boolean = false,
    public onlyHeroes: boolean = false,
    public isPersistent: boolean = false,
    public isFixedAngle: boolean = false,
  ) {
    this.sourceCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.newTargetCoord = new Vector2D();
    this.affectedGroup = CreateGroup();
  }

  doKnockback(input: CustomAbilityInput, target: unit) {
    if (this.onlyHeroes && !IsUnitType(target, UNIT_TYPE_HERO)) return;

    if (
      UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer, this.affectAllies)
      && !IsUnitType(target, UNIT_TYPE_STRUCTURE)
    ) {
      this.targetCoord.setUnit(target);
      const sourceToTargetAngle = CoordMath.angleBetweenCoords(this.sourceCoord, this.targetCoord);
      if (this.reflectBeams && GetUnitTypeId(target) == Constants.dummyBeamUnitId) {
        // SetUnitFacing(target, sourceToTargetAngle);
        BlzSetUnitFacingEx(target, sourceToTargetAngle);
      }
      const knockbackAngle = this.knockbackData.angle + sourceToTargetAngle;
      this.newTargetCoord.polarProjectCoords(this.targetCoord, knockbackAngle, this.knockbackData.speed);
      PathingCheck.moveGroundUnitToCoord(target, this.newTargetCoord);
    }
  }

  getSourceCoord(input: CustomAbilityInput, source: unit) {
    if (this.knockbackSource == AOEKnockback.SOURCE_UNIT) {
      this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    } else {
      if (this.useLastCastPoint) {
        this.sourceCoord.setVector(input.castPoint);
      } else {
        this.sourceCoord.setVector(input.targetPoint);
      }
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
      if (
        this.knockbackTarget == AOEKnockback.TARGET_TARGET_UNIT 
        && input.targetUnit
      ) {
        GroupAddUnit(this.affectedGroup, input.targetUnit);
      }
      if (this.isFixedAngle) {
        this.getSourceCoord(input, source);
      }
    }
    

    if (!this.isFixedAngle) {
      this.getSourceCoord(input, source);
    }
    
    if (this.knockbackTarget == AOEKnockback.TARGET_AOE) {
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
      this.knockbackSource, 
      this.knockbackTarget,
      this.useLastCastPoint,
      this.reflectBeams, this.affectAllies,
      this.onlyHeroes,
      this.isPersistent,
      this.isFixedAngle,
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
      knockbackTarget: number;
      useLastCastPoint: boolean;
      reflectBeams: boolean;
      affectAllies: boolean; 
      onlyHeroes: boolean;
      isPersistent: boolean;
      isFixedAngle: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.knockbackData = new KnockbackData().deserialize(input.knockbackData);
    this.knockbackSource = input.knockbackSource;
    this.knockbackTarget = input.knockbackTarget;
    this.useLastCastPoint = input.useLastCastPoint;
    this.reflectBeams = input.reflectBeams;
    this.affectAllies = input.affectAllies;
    this.onlyHeroes = input.onlyHeroes;
    this.isPersistent = input.isPersistent;
    this.isFixedAngle = input.isFixedAngle;
    return this;
  }
}