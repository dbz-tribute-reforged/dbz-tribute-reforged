import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Beam } from "./Beam";

export module CustomAbilityHelper {
  export function canCast(customAbility: CustomAbility, data: CustomAbilityData): boolean {
    if (customAbility.currentCd > 0) return false;
    if (customAbility.currentTick > 0) return false;
    if (!data || !data.caster || !data.casterPlayer || !data.mouseData) return false;
    if (isUnitStunned(data.caster.unit)) {
      return false;
    }
    if (
      (customAbility.costType == CostType.HP && GetUnitState(data.caster.unit, UNIT_STATE_LIFE) < customAbility.costAmount)
      ||
      (customAbility.costType == CostType.MP && GetUnitState(data.caster.unit, UNIT_STATE_MANA) < customAbility.costAmount)
    ) {
      return false;
    }
    return true;
  }

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

  export function takeCosts(customAbility: CustomAbility, data: CustomAbilityData) {
    customAbility.currentCd = customAbility.maxCd;
    if (data) {
      if (customAbility.costType == CostType.HP) {
        SetUnitState(
          data.caster.unit, 
          UNIT_STATE_LIFE,
          GetUnitState(data.caster.unit, UNIT_STATE_LIFE) - customAbility.costAmount
        );
      } else if (customAbility.costType == CostType.MP) {
        SetUnitState(
          data.caster.unit, 
          UNIT_STATE_MANA,
          GetUnitState(data.caster.unit, UNIT_STATE_MANA) - customAbility.costAmount
        );
      } else {
        // stamina
      }
    }
  }

  export function updateCD(customAbility: CustomAbility) {
    if (customAbility.currentCd <= 0 && customAbility.currentTick >= customAbility.duration) {
      customAbility.currentCd = 0;
      customAbility.currentTick = 0;
      customAbility.delayTicks = 0;
      PauseTimer(customAbility.abilityTimer);
    } else {
      customAbility.currentCd -= customAbility.updateRate;
    }
  }

  export function calculateBeamMaxHp(beam: Beam, damage: number): number {
    return Math.max(150, Math.floor(damage * beam.beamHpMult) * 50);
  }
  
  export function basicIsValidTarget(unit: unit, data: CustomAbilityData): boolean {
    return (
      IsUnitEnemy(unit, data.casterPlayer) == true
      &&
      !BlzIsUnitInvulnerable(unit)
    );
  }

}