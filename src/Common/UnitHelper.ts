import { Vector2D } from "./Vector2D";
import { Buffs, Constants, Id } from "./Constants";

export module UnitHelper {
  export function isUnitStunned(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_POLYMORPHED) ||
      IsUnitType(unit, UNIT_TYPE_SNARED) ||
      IsUnitType(unit, UNIT_TYPE_SLEEPING) ||
      IsUnitType(unit, UNIT_TYPE_STUNNED) ||
      IsUnitPaused(unit) || 
      UnitHasBuffBJ(unit, Buffs.STUNNED)
    );
  }

  export function isUnitRooted(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_SNARED)
    )
  }

  export function isUnitHardStunned(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_POLYMORPHED) ||
      IsUnitType(unit, UNIT_TYPE_SLEEPING) ||
      IsUnitType(unit, UNIT_TYPE_STUNNED) ||
      UnitHasBuffBJ(unit, Buffs.STUNNED)
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
      && !isUnitInvul(unit)
      && !UnitHelper.isUnitDead(unit)
    );
  }

  export function isUnitMoveable(unit: unit) {
    return (
      !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
      && !isUnitInvul(unit)
      && !UnitHelper.isUnitDead(unit)
    );
  }

  export function isUnitTournamentViable(unit: unit): boolean {
    return (
      UnitHelper.isUnitRealHero(unit)
      && GetUnitTypeId(unit) != Id.metalCoolerClone
    );
  }

  export function isUnitRealHero(unit: unit): boolean {
    return (
      IsUnitType(unit, UNIT_TYPE_HERO) 
      && !IsUnitType(unit, UNIT_TYPE_SUMMONED)
      && !IsUnitIllusion(unit)
      && GetUnitTypeId(unit) != 0
    );
  }

  export function isImmortal(unit: unit): boolean {
    return (
      UnitHasBuffBJ(unit, Constants.buffImmortal)
      || GetUnitAbilityLevel(unit, Constants.wishImmortalAbility) > 0
    );
  }

  export function isUnitInvul(unit: unit) {
    return (
      BlzIsUnitInvulnerable(unit)
      || GetUnitAbilityLevel(unit, Buffs.BANISHED) > 0
    );
  } 

  export function isUnitHakaiDamageable(unit: unit, caster: player): boolean {
    return (
      isUnitTargetableForPlayer(unit, caster) 
      && !isImmortal(unit)
      && !isUnitInvul(unit)
    );
  }

  export function isUnitHakaiInstantDestroyable(unit: unit, caster: player) {
    return (
      isUnitHakaiDamageable(unit, caster)
      && !IsUnitType(unit, UNIT_TYPE_HERO)
      && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
    )
  }

  export function dealHakaiDamage(caster: unit, target: unit) {
    SetUnitState(target, UNIT_STATE_LIFE, 1);
    UnitDamageTarget(
      caster, target, 1000, 
      false, false, 
      ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
      WEAPON_TYPE_WHOKNOWS
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

  export function abilitySwap(
    player: player,
    unit: unit,
    srcAbilityId: number,
    destAbilityId: number,
    linkCooldowns: boolean = false,
    cdOffsets: number = 0, // default: cds are not linked
    enableDest: boolean = true,
    disableSrc: boolean = true,
    addAbility: boolean = true,
    makePermanent: boolean = true,
    equalizeLevels: boolean = true,
  ) {
    if (enableDest) {
      SetPlayerAbilityAvailable(player, destAbilityId, true);
    }
    if (disableSrc) {
      SetPlayerAbilityAvailable(player, srcAbilityId, false);
    }
    if (addAbility) {
      UnitAddAbility(unit, destAbilityId);
    }
    if (makePermanent) {
      UnitMakeAbilityPermanent(unit, true, destAbilityId);
    }
    if (equalizeLevels) {
      const srcAbilityLevel = GetUnitAbilityLevel(unit, srcAbilityId);
      const destAbilityLevel = GetUnitAbilityLevel(unit, destAbilityId);
      if (destAbilityLevel > srcAbilityLevel) {
        SetUnitAbilityLevel(unit, srcAbilityId, destAbilityLevel);
      } else if (srcAbilityLevel > destAbilityLevel) {
        SetUnitAbilityLevel(unit, destAbilityId, srcAbilityLevel);
      }
    }
    if (linkCooldowns) {
      BlzStartUnitAbilityCooldown(unit, destAbilityId, 
        cdOffsets + 
        Math.max(
          BlzGetUnitAbilityCooldownRemaining(unit, srcAbilityId),
          BlzGetUnitAbilityCooldownRemaining(unit, destAbilityId)
        )
      );
    }
  }

  export function payHPPercentCost(
    unit: unit, 
    costPct: number, 
    unitStatePct: unitstate
  ) {
    SetUnitState(
      unit, 
      UNIT_STATE_LIFE, 
      Math.max(
        1, 
        GetUnitState(unit, UNIT_STATE_LIFE) 
        - costPct * GetUnitState(unit, unitStatePct)
      )
    );
  }

  export function payMPPercentCost(
    unit: unit, 
    costPct: number, 
    unitStatePct: unitstate
  ) {
    SetUnitState(
      unit, 
      UNIT_STATE_MANA, 
      Math.max(
        1, 
        GetUnitState(unit, UNIT_STATE_MANA) 
        - costPct * GetUnitState(unit, unitStatePct)
      )
    );
  }
}