import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { Constants, Globals } from "Common/Constants";

export class Barrier implements AbilityComponent, Serializable<Barrier> {

  static addUnitBarrierBlock(unit: unit) {
    const count = Globals.barrierBlockUnits.get(unit);
    if (!count) {
      Globals.barrierBlockUnits.set(unit, 1);
    } else {
      Globals.barrierBlockUnits.set(unit, count+1);
    }
  }

  static removeUnitBarrierBlock(unit: unit) {
    const count = Globals.barrierBlockUnits.get(unit);
    if (!count || count == 1) {
      Globals.barrierBlockUnits.delete(unit);
    } else {
      Globals.barrierBlockUnits.set(unit, count-1);
    }
  }


  public isStarted: boolean = false;
  public isFinished: boolean = true;

  protected sourceCoords: Vector2D;
  protected insideUnits: group;
  protected outsideUnits: group;
  protected innerAOE: number;
  protected outerAOE: number;

  protected targetCoords: Vector2D;
  protected newCoords: Vector2D;

  protected casterUnit: unit;

  constructor(
    public name: string = "Barrier",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public aoe: number = 300,
    public repelOutsidersSpeed: number = 0,
    public affectAllies: boolean = false,
    public canWalkOut: boolean = false,
    public canZanzoOut: boolean = false,
  ) {
    this.sourceCoords = new Vector2D();
    this.insideUnits = CreateGroup();
    this.outsideUnits = CreateGroup();
    this.innerAOE = 0;
    this.outerAOE = 0;
    this.targetCoords = new Vector2D();
    this.newCoords = new Vector2D();
    this.casterUnit = null;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoords.setPos(GetUnitX(source), GetUnitY(source));

    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
      this.casterUnit = input.caster.unit;
      this.reset();
      this.innerAOE = this.aoe - Constants.beamSpawnOffset;
      this.outerAOE = this.aoe + Constants.beamSpawnOffset + this.repelOutsidersSpeed;
      GroupEnumUnitsInRange(
        this.insideUnits,
        this.sourceCoords.x,
        this.sourceCoords.y,
        this.innerAOE,
        null
      );
      this.modifyBarrierBlock(this.insideUnits, true);
    }

    if (!this.canWalkOut) {
      ForGroup(this.insideUnits, () => {
        const target = GetEnumUnit();
        if (UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer, this.affectAllies)) {
          this.targetCoords.setPos(GetUnitX(target), GetUnitY(target));
          const targetDistance = CoordMath.distance(this.sourceCoords, this.targetCoords);
          if (
            targetDistance > this.innerAOE && 
            targetDistance < this.aoe * 2.5
          ) {
            const targetAngle = CoordMath.angleBetweenCoords(this.sourceCoords, this.targetCoords);
            this.newCoords.polarProjectCoords(
              this.sourceCoords, 
              targetAngle, 
              this.innerAOE
            );
            if (IsUnitType(target, UNIT_TYPE_FLYING)) {
              PathingCheck.moveFlyingUnitToCoord(target, this.newCoords);
            } else {
              PathingCheck.moveGroundUnitToCoord(target, this.newCoords);
            }
          }
        }
      });
    }

    if (this.repelOutsidersSpeed > 0) {
      GroupEnumUnitsInRange(
        this.outsideUnits,
        this.sourceCoords.x,
        this.sourceCoords.y,
        this.outerAOE,
        null
      );

      ForGroup(this.outsideUnits, () => {
        const target = GetEnumUnit();
        if (
          UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer, this.affectAllies) &&
          !IsUnitInGroup(target, this.insideUnits)
        ) {
          this.targetCoords.setPos(GetUnitX(target), GetUnitY(target));
          const targetDistance = CoordMath.distance(this.sourceCoords, this.targetCoords);
          if (targetDistance <= this.innerAOE) {
            // it probably came / spawned from within
            GroupAddUnit(this.insideUnits, target);
            Barrier.addUnitBarrierBlock(target);
          } else {
            const targetAngle = CoordMath.angleBetweenCoords(this.sourceCoords, this.targetCoords);
            this.newCoords.polarProjectCoords(
              this.sourceCoords, 
              targetAngle, 
              this.outerAOE
            );
            if (IsUnitType(target, UNIT_TYPE_FLYING)) {
              PathingCheck.moveFlyingUnitToCoord(target, this.newCoords);
            } else {
              PathingCheck.moveGroundUnitToCoord(target, this.newCoords);
            }
          }
        }
      });

      GroupClear(this.outsideUnits);
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      this.reset();
    }
  }

  modifyBarrierBlock(unitGroup: group, isAdd: boolean) {
    ForGroup(unitGroup, () => {
      const target = GetEnumUnit();
      if (
        !this.canZanzoOut 
        && IsUnitType(target, UNIT_TYPE_HERO) 
        // && target != this.casterUnit
      ) {
        if (isAdd) {
          Barrier.addUnitBarrierBlock(target);
        } else {
          Barrier.removeUnitBarrierBlock(target);
        }
      }
    });
  }

  reset() {
    this.modifyBarrierBlock(this.insideUnits, false);
    GroupClear(this.insideUnits);
    GroupClear(this.outsideUnits);
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.insideUnits);
    DestroyGroup(this.outsideUnits);
  }
  
  

  clone(): AbilityComponent {
    return new Barrier(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.aoe, 
      this.repelOutsidersSpeed,
      this.affectAllies,
      this.canWalkOut,
      this.canZanzoOut,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      aoe: number
      repelOutsidersSpeed: number;
      affectAllies: boolean;
      canWalkOut: boolean;
      canZanzoOut: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.aoe = input.aoe;
    this.repelOutsidersSpeed = input.repelOutsidersSpeed;
    this.affectAllies = input.affectAllies;
    this.canWalkOut = input.canWalkOut;
    this.canZanzoOut = input.canZanzoOut;
    return this;
  }
}