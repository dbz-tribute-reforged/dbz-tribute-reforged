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
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoords.x = GetUnitX(source);
    this.sourceCoords.y = GetUnitY(source);

    if (!this.hasStarted) {
      this.hasStarted = true;
      GroupClear(this.insideUnits);
      GroupEnumUnitsInRange(
        this.insideUnits,
        this.sourceCoords.x,
        this.sourceCoords.y,
        this.aoe,
        Condition(() => {
          return (
            UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer, this.affectAllies)
          )
        })
      );
    }

    if (!this.canWalkOut) {
      ForGroup(this.insideUnits, () => {
        const target = GetEnumUnit();
        const targetCoords = new Vector2D(GetUnitX(target), GetUnitY(target));
        const targetDistance = CoordMath.distance(this.sourceCoords, targetCoords);
        if (
          targetDistance > this.aoe - Constants.beamSpawnOffset * 2 && 
          targetDistance < this.aoe * 2.5
        ) {
          const targetAngle = CoordMath.angleBetweenCoords(this.sourceCoords, targetCoords);
          const newCoords = CoordMath.polarProjectCoords(
            this.sourceCoords, 
            targetAngle, 
            this.aoe - Constants.beamSpawnOffset * 2
          );
          if (IsUnitType(target, UNIT_TYPE_FLYING)) {
            PathingCheck.moveFlyingUnitToCoord(target, newCoords);
          } else {
            PathingCheck.moveGroundUnitToCoord(target, newCoords);
          }
        }
      });
    }

    if (this.repelOutsidersSpeed > 0) {
      const outsideUnits = CreateGroup();
      GroupEnumUnitsInRange(
        outsideUnits,
        this.sourceCoords.x,
        this.sourceCoords.y,
        this.aoe,
        Condition(() => {
          return (
            UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer, this.affectAllies) &&
            !IsUnitInGroup(GetFilterUnit(), this.insideUnits)
          )
        })
      );

      ForGroup(outsideUnits, () => {
        const target = GetEnumUnit();
        const targetCoords = new Vector2D(GetUnitX(target), GetUnitY(target));
        const targetDistance = CoordMath.distance(this.sourceCoords, targetCoords);
        if (targetDistance < this.aoe - Constants.beamSpawnOffset - 20) {
          // it probably came / spawned from within
          GroupAddUnit(this.insideUnits, target);
        } else {
          const targetAngle = CoordMath.angleBetweenCoords(this.sourceCoords, targetCoords);
          const newCoords = CoordMath.polarProjectCoords(
            this.sourceCoords, 
            targetAngle, 
            this.aoe + this.repelOutsidersSpeed
          );
          if (IsUnitType(target, UNIT_TYPE_FLYING)) {
            PathingCheck.moveFlyingUnitToCoord(target, newCoords);
          } else {
            PathingCheck.moveGroundUnitToCoord(target, newCoords);
          }
        }
      });

      DestroyGroup(outsideUnits);
    }

    if (ability.isFinishedUsing(this)) {
      this.hasStarted = false;
      GroupClear(this.insideUnits);
    }
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