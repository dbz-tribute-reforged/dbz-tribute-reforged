import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { Constants } from "Common/Constants";

export class Barrier implements AbilityComponent, Serializable<Barrier> {

  protected hasStarted: boolean;
  protected sourceCoords: Vector2D;
  protected insideUnits: group;
  protected outsideUnits: group;
  protected innerAOE: number;
  protected outerAOE: number;

  protected targetCoords: Vector2D;
  protected newCoords: Vector2D;

  constructor(
    public name: string = "Barrier",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public aoe: number = 300,
    public repelOutsidersSpeed: number = 0,
    public affectAllies: boolean = false,
    public canWalkOut: boolean = false,
  ) {
    this.hasStarted = false;
    this.sourceCoords = new Vector2D();
    this.insideUnits = CreateGroup();
    this.outsideUnits = CreateGroup();
    this.innerAOE = 0;
    this.outerAOE = 0;
    this.targetCoords = new Vector2D();
    this.newCoords = new Vector2D();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoords.setPos(GetUnitX(source), GetUnitY(source));

    if (!this.hasStarted) {
      this.hasStarted = true;
      GroupClear(this.insideUnits);
      this.innerAOE = this.aoe - Constants.beamSpawnOffset;
      this.outerAOE = this.aoe + Constants.beamSpawnOffset + this.repelOutsidersSpeed;
      GroupEnumUnitsInRange(
        this.insideUnits,
        this.sourceCoords.x,
        this.sourceCoords.y,
        this.innerAOE,
        null
      );
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
      this.reset();
    }
  }

  reset() {
    this.hasStarted = false;
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
    return this;
  }
}