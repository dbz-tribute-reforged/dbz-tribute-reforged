import { Vector2D } from "./Vector2D";
import { Constants } from "./Constants";

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

  export function giveUnitFlying(unit: unit) {
    const flyingAbility = FourCC('Arav');
    if (UnitAddAbility(unit, flyingAbility)) {
      UnitRemoveAbility(unit, flyingAbility);
    }
  }
  
  export function countEnemyHeroes(group: group, player: player): number {
    let numEnemies = 0;
    ForGroup(group, () => {
      const unit = GetEnumUnit();
      if (
        IsUnitType(unit, UNIT_TYPE_HERO) &&
        IsUnitEnemy(unit, player) &&
        !IsUnitType(unit, UNIT_TYPE_DEAD)
      ) {
        ++numEnemies;
      }
    });
    return numEnemies;
  }
  
  export function isUnitTargetableForPlayer(
    unit: unit, 
    caster: player, 
    affectAllies: boolean = false
  ): boolean {
    return (
      (IsUnitEnemy(unit, caster) || affectAllies)
      &&
      !BlzIsUnitInvulnerable(unit)
      &&
      !IsUnitDeadBJ(unit)
    );
  }

  export function isUnitTournamentViable(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_HERO) &&
      !IsUnitType(unit, UNIT_TYPE_SUMMONED)
    );
  }

  export function isImmortal(unit: unit): boolean {
    return (
      UnitHasBuffBJ(unit, Constants.buffImmortal)
    );
  }
}