import { SagaItemAbility } from "./SagaItemAbility";
import { UnitHelper } from "Common/UnitHelper";

export class TimeRing implements SagaItemAbility {
  static readonly abilityId: number = FourCC("A0NU");

  constructor(

  ) {

  }

  performTriggerAction() {
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
}