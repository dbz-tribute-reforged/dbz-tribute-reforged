import { ItemConstants } from "./ItemConstants";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";

// on pickup perform actions
export const itemPassiveAbilityConfig = new Map<number, () => void> (
  [
    [ItemConstants.braveSword[0], performBraveSword],
    [ItemConstants.bioLabResearch[0], performBioLab],
  ]
);

function performBraveSword() {
  const unit = GetTriggerUnit();
  const braveSword = GetManipulatedItem();
  const position = new Vector2D(GetUnitX(unit), GetUnitY(unit));
  const player = GetOwningPlayer(unit);

  TimerStart(CreateTimer(), 1.0, true, () => {
    if (UnitHasItem(unit, braveSword)) {
      position.x = GetUnitX(unit);
      position.y = GetUnitY(unit);
      const damagedGroup = UnitHelper.getNearbyValidUnits(
        position, 
        ItemConstants.BIO_LAB_AOE, 
        () => {
          return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player);
        }
      )

      ForGroup(damagedGroup, () => {
        const target = GetEnumUnit();
        const mana = GetUnitState(target, UNIT_STATE_MANA)
        const newMana = mana - mana * ItemConstants.BRAVE_SWORD_MANA_LOSS;
        if (newMana > 1) {
          SetUnitState(target, UNIT_STATE_MANA, newMana);
        }
      })
      
      DestroyGroup(damagedGroup);
    } else {
      DestroyTimer(GetExpiredTimer());
    }
  });
}

function performBioLab() {
  const unit = GetTriggerUnit();
  const bioLab = GetManipulatedItem();
  const position = new Vector2D(GetUnitX(unit), GetUnitY(unit));
  const player = GetOwningPlayer(unit);

  TimerStart(CreateTimer(), 1.0, true, () => {
    if (UnitHasItem(unit, bioLab)) {
      position.x = GetUnitX(unit);
      position.y = GetUnitY(unit);
      const damagedGroup = UnitHelper.getNearbyValidUnits(
        position, 
        ItemConstants.BIO_LAB_AOE, 
        () => {
          return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player);
        }
      )

      ForGroup(damagedGroup, () => {
        const target = GetEnumUnit();
        const damage = GetUnitState(target, UNIT_STATE_LIFE) * ItemConstants.BIO_LAB_DAMAGE;
        if (damage > 0) {
          UnitDamageTarget(
            unit, 
            target, 
            damage,
            true,
            false,
            ATTACK_TYPE_HERO,
            DAMAGE_TYPE_NORMAL,
            WEAPON_TYPE_WHOKNOWS,
          )
        }
      })
      
      DestroyGroup(damagedGroup);
    } else {
      DestroyTimer(GetExpiredTimer());
    }
  });
}