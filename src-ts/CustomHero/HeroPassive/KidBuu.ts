import { HeroPassive } from "./HeroPassive";
import { CustomHero } from "CustomHero/CustomHero";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { Vector2D } from "Common/Vector2D";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { TextTagHelper } from "Common/TextTagHelper";

export class KidBuu implements HeroPassive {
  static readonly RAKSHASA_CLAW_ABILITY: number = FourCC("A0NY");
  static readonly DEVIL_CLAW_ABILITY: number = FourCC("A0NZ");

  constructor() {
  }

  initialize(customHero: CustomHero) {
    if (GetUnitAbilityLevel(customHero.unit, KidBuu.DEVIL_CLAW_ABILITY) > 0) {
      const heroId = GetUnitTypeId(customHero.unit);
      const onHitTrigger = CreateTrigger();
      TriggerRegisterAnyUnitEventBJ(
        onHitTrigger,
        EVENT_PLAYER_UNIT_ATTACKED,
      )
      TriggerAddCondition(
        onHitTrigger,
        Condition(() => {
          if (
            GetUnitTypeId(GetAttacker()) == heroId
          ) {
            const rakshasaClawLevel = GetUnitAbilityLevel(customHero.unit, KidBuu.RAKSHASA_CLAW_ABILITY);
            const devilClawLevel = GetUnitAbilityLevel(customHero.unit, KidBuu.DEVIL_CLAW_ABILITY);
            if (rakshasaClawLevel + devilClawLevel > 0) {
              const target = GetTriggerUnit();
              const targetPos = new Vector2D(GetUnitX(target), GetUnitY(target));
              let onHitName = AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT;
              let onHitAbility = KidBuu.RAKSHASA_CLAW_ABILITY;
              if (devilClawLevel > 0) {
                onHitName = AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT;
                onHitAbility = KidBuu.DEVIL_CLAW_ABILITY;
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
}