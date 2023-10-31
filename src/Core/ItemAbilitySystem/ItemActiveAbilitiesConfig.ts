import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { ItemConstants } from "./ItemConstants";
import { TimerManager } from "Core/Utility/TimerManager";

export function performTimeRingAction() {
  const source = GetTriggerUnit();
  const target = GetSpellTargetUnit();
  doTimeRingSwap(source, target);
}

export function doTimeRingSwap(source: unit, target: unit) {
  if (source != target) {
    const unitX = GetUnitX(source);
    const unitY = GetUnitY(source);
    const targetX = GetUnitX(target);
    const targetY = GetUnitY(target);
  
    const swapLightning = AddLightningEx(
      "MFPB", 
      true, 
      unitX, unitY, BlzGetUnitZ(source), 
      targetX, targetY, BlzGetUnitZ(target),
    );

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.5, false, () => {
      DestroyLightning(swapLightning);
      TimerManager.getInstance().recycle(timer);
    });
    
    if (!IsUnitType(source, UNIT_TYPE_STRUCTURE)) {
      SetUnitX(source, targetX);
      SetUnitY(source, targetY);
    }
    if (!IsUnitType(target, UNIT_TYPE_STRUCTURE)) {
      SetUnitX(target, unitX);
      SetUnitY(target, unitY);
    }
  
    UnitHelper.healMaxHPPercent(source, 0.05);
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
}