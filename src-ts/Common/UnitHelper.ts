import { Vector2D } from "./Vector2D";

export module UnitHelper {
  export function isUnitStunned(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_POLYMORPHED) 
      ||
      IsUnitType(unit, UNIT_TYPE_SNARED)
      ||
      IsUnitType(unit, UNIT_TYPE_SLEEPING)
      ||
      IsUnitType(unit, UNIT_TYPE_STUNNED)
    );
  }

  // remember to destroy returned group after you finish using it
  export function getNearbyValidUnits(target: Vector2D, aoe: number, isBasicValidTarget: () => boolean): group {
    const affectedGroup = CreateGroup();
    GroupEnumUnitsInRange(
      affectedGroup, 
      target.x, 
      target.y, 
      aoe, 
      Condition(isBasicValidTarget),
    );
    return affectedGroup;
  }
}