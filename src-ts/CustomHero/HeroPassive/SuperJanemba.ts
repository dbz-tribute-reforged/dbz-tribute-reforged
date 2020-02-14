import { HeroPassive } from "./HeroPassive";
import { CustomHero } from "CustomHero/CustomHero";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { TextTagHelper } from "Common/TextTagHelper";

export class SuperJanemba implements HeroPassive {
  static readonly RAKSHASA_CLAW_ABILITY: number = FourCC("A0NY");
  static readonly DEVIL_CLAW_ABILITY: number = FourCC("A0NZ");

  constructor() {
  }

  initialize(customHero: CustomHero) {
    const heroId = GetUnitTypeId(customHero.unit);
    const janembaPlayer = GetOwningPlayer(customHero.unit);
    const onHitTrigger = CreateTrigger();
    TriggerRegisterAnyUnitEventBJ(
      onHitTrigger,
      EVENT_PLAYER_UNIT_ATTACKED,
    )
    TriggerAddCondition(
      onHitTrigger,
      Condition(() => {
        const attacker = GetAttacker();
        if (
          GetUnitTypeId(attacker) == heroId && 
          GetOwningPlayer(attacker) == janembaPlayer
        ) {
          const rakshasaClawLevel = GetUnitAbilityLevel(customHero.unit, SuperJanemba.RAKSHASA_CLAW_ABILITY);
          const devilClawLevel = GetUnitAbilityLevel(customHero.unit, SuperJanemba.DEVIL_CLAW_ABILITY);
          if (rakshasaClawLevel + devilClawLevel > 0) {
            const target = GetTriggerUnit();
            const targetPos = new Vector2D(GetUnitX(target), GetUnitY(target));
            let onHitName = AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT;
            let onHitAbility = SuperJanemba.RAKSHASA_CLAW_ABILITY;
            if (devilClawLevel > 0) {
              onHitName = AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT;
              onHitAbility = SuperJanemba.DEVIL_CLAW_ABILITY;
            }
            const input = new CustomAbilityInput(
              customHero, 
              GetOwningPlayer(customHero.unit),
              GetUnitAbilityLevel(customHero.unit, onHitAbility),
              targetPos,
              targetPos,
              targetPos,
              target,
              target,
            );
            
            if (customHero.canCastAbility(onHitName, input)) {
              // TextTagHelper.showPlayerColorTextOnUnit(
              //   onHitName, 
              //   GetPlayerId(GetOwningPlayer(customHero.unit)), 
              //   customHero.unit
              // );
              
              customHero.useAbility(
                onHitName,
                input
              )
            }
          }
        }
        return false;
      })
    );
  }
}