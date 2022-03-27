import { Vector2D } from "./Vector2D";
import { Constants } from "./Constants";

export module UnitHelper {
  export function isUnitStunned(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_POLYMORPHED) ||
      IsUnitType(unit, UNIT_TYPE_SNARED) ||
      IsUnitType(unit, UNIT_TYPE_SLEEPING) ||
      IsUnitType(unit, UNIT_TYPE_STUNNED)
    );
  }

  export function isUnitDead(unit: unit): boolean {
    return (
      GetUnitTypeId(unit) != 0 &&
      IsUnitType(unit, UNIT_TYPE_DEAD) 
    );
  }

  export function isUnitAlive(unit: unit): boolean {
    return (
      GetUnitTypeId(unit) != 0 &&
      !IsUnitType(unit, UNIT_TYPE_DEAD)
    )
  }

  // leaks Condition object
  // // remember to destroy returned group after you finish using it
  // export function getNearbyValidUnits(target: Vector2D, aoe: number, isBasicValidTarget: () => boolean): group {
  //   const affectedGroup = CreateGroup();
  //   GroupEnumUnitsInRange(
  //     affectedGroup, 
  //     target.x, 
  //     target.y, 
  //     aoe, 
  //     Condition(isBasicValidTarget),
  //   );
  //   return affectedGroup;
  // }

  export function giveUnitFlying(unit: unit) {
    const flyingAbility = FourCC('Arav');
    if (UnitAddAbility(unit, flyingAbility)) {
      UnitRemoveAbility(unit, flyingAbility);
    }
  }
  
  export function countEnemyHeroes(group: group, player: player, includeSummons: boolean): number {
    let numEnemies = 0;
    ForGroup(group, () => {
      const unit = GetEnumUnit();
      if (
        IsUnitType(unit, UNIT_TYPE_HERO) &&
        IsUnitEnemy(unit, player) &&
        !isUnitDead(unit) && 
        isUnitTargetableForPlayer(unit, player) &&
        (
          includeSummons ||
          !IsUnitType(unit, UNIT_TYPE_SUMMONED)
        )
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
      !UnitHelper.isUnitDead(unit)
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
      || GetUnitAbilityLevel(unit, Constants.wishImmortalAbility) > 0
    );
  }

  export function healMaxHPPercent(unit: unit, healPercent: number) {
    SetUnitState(
      unit, 
      UNIT_STATE_LIFE, 
      GetUnitState(unit, UNIT_STATE_LIFE) + 
      GetUnitState(unit, UNIT_STATE_MAX_LIFE) * healPercent
    );
  }

  export function getInventoryIndexOfItemType(unit: unit, itemId: number): number {
    const index = 0;
    for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
      const item = UnitItemInSlot(unit, i);
      if (item != null && GetItemTypeId(item) == itemId) {
        return i;
      }
    }
    return -1;
  }

  export function countInventory(unit: unit): number {
    let sum = 0;
    for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
      const item = UnitItemInSlot(unit, i);
      if (item && item != null) {
        ++sum;
      }
    }
    return sum;
  }
}