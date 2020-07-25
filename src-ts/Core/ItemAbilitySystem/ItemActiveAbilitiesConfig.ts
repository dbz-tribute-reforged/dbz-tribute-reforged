import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { ItemConstants } from "./ItemConstants";

// on item's ability usage, perform actions
export const itemActiveAbilityConfig = new Map<number, () => void> (
  [
    [ItemConstants.ABILITY_TIME_RING, performTimeRingAction],
  ]
);

function performTimeRingAction() {
  const unit = GetTriggerUnit();
  const target = GetSpellTargetUnit();

  const unitX = GetUnitX(unit);
  const unitY = GetUnitY(unit);
  const targetX = GetUnitX(target);
  const targetY = GetUnitY(target);

  const swapLightning = AddLightningEx(
    "MFPB", 
    true, 
    unitX, unitY, BlzGetUnitZ(unit), 
    targetX, targetY, BlzGetUnitZ(target),
  )

  TimerStart(CreateTimer(), 0.5, false, () => {
    DestroyLightning(swapLightning);
    DestroyTimer(GetExpiredTimer());
  });

  SetUnitX(unit, targetX);
  SetUnitY(unit, targetY);
  SetUnitX(target, unitX);
  SetUnitY(target, unitY);

  UnitHelper.healMaxHPPercent(unit, 0.05);
  UnitHelper.healMaxHPPercent(target, 0.05);

  DestroyEffect(AddSpecialEffect(
    "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportCaster.mdl",
    unitX, unitY
  ));
  DestroyEffect(AddSpecialEffect(
    "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportCaster.mdl",
    targetX, targetY
  ));

}