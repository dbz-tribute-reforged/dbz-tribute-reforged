import { ItemAbility } from "../ItemAbility";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class BioLab implements ItemAbility {
  performTriggerAction() {
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
              DAMAGE_TYPE_UNKNOWN,
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
}