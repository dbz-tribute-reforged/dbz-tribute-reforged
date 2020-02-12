import { HeroPassive } from "./HeroPassive";
import { CustomHero } from "CustomHero/CustomHero";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { TextTagHelper } from "Common/TextTagHelper";

export class SuperJanemba implements HeroPassive {
  protected rakshasaClawAbility: number;
  protected devilClawAbility: number;

  constructor() {
    this.rakshasaClawAbility = FourCC("A0NY");
    this.devilClawAbility = FourCC("A0NZ");
  }

  initialize(customHero: CustomHero) {
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
          const rakshasaClawLevel = GetUnitAbilityLevel(customHero.unit, this.rakshasaClawAbility);
          const devilClawLevel = GetUnitAbilityLevel(customHero.unit, this.devilClawAbility);
          if (rakshasaClawLevel + devilClawLevel > 0) {
            const target = GetTriggerUnit();
            const targetPos = new Vector2D(GetUnitX(target), GetUnitY(target));
            let onHitName = AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT;
            let onHitAbility = this.rakshasaClawAbility;
            if (devilClawLevel > 0) {
              onHitName = AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT;
              onHitAbility = this.devilClawAbility;
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
              TextTagHelper.showPlayerColorTextOnUnit(
                onHitName, 
                GetPlayerId(GetOwningPlayer(customHero.unit)), 
                customHero.unit
              );
              
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