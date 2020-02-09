import { ItemAbility } from "../ItemAbility";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class BraveSword implements ItemAbility {
  performTriggerAction() {
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
}