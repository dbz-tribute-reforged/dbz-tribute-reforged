import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";

export module CustomAbilityHelper {
  export function canCast(customAbility: CustomAbility, data: CustomAbilityData): boolean {
    if (customAbility.currentCd > 0) return false;
    if (customAbility.currentTick > 0) return false;
    if (!data || !data.caster || !data.casterPlayer || !data.mouseData) return false;
    if (
      IsUnitType(data.caster.unit, UNIT_TYPE_POLYMORPHED) 
      ||
      IsUnitType(data.caster.unit, UNIT_TYPE_SNARED)
      ||
      IsUnitType(data.caster.unit, UNIT_TYPE_SLEEPING)
      ||
      IsUnitType(data.caster.unit, UNIT_TYPE_STUNNED)
    ) {
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
    if (customAbility.currentCd <= 0) {
      customAbility.currentCd = 0;
      customAbility.currentTick = 0;
      PauseTimer(customAbility.abilityTimer);
    } else {
      customAbility.currentCd -= customAbility.updateRate;
    }
  }
}