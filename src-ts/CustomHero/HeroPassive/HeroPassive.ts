import { CustomHero } from "CustomHero/CustomHero";
import { Vector2D } from "Common/Vector2D";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Hooks } from "Libs/TreeLib/Hooks";
import { Id } from "Common/Constants";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CoordMath } from "Common/CoordMath";
import { TextTagHelper } from "Common/TextTagHelper";

export module HeroPassiveData {
  export const SUPER_JANEMBA = FourCC("H062");
  export const RAKSHASA_CLAW_ABILITY = FourCC("A0NY");
  export const DEVIL_CLAW_ABILITY = FourCC("A0NZ");

  export const KID_BUU = FourCC("O00C");

  export const TAPION = FourCC("E014");
  export const BRAVE_SLASH = FourCC("A0I9");
  export const TAPION_STYLE = FourCC("A0ID");
  export const HEROS_SONG = FourCC("B01H");
  export const TAPION_MANA_BURN_PERCENT = 0.003;

  export const DYSPO = FourCC("H09H");
  export const JUSTICE_KICK_ABILITY = FourCC("A0QZ");
}

export interface HeroPassive {
  initialize(customHero: CustomHero): void;
}

export class HeroPassiveManager {
  private static instance: HeroPassiveManager;

  // protected heroPassiveConfig: Map<number, Function> = new Map([
  //   [FourCC("H062"), superJanembaPassive],
  //   [FourCC("O00C"), kidBuuPassive],
  // ]);

  constructor() {
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new HeroPassiveManager();
      Hooks.set("HeroPassiveManager", this.instance);
    }
    return this.instance;
  }

  initialize() {

  }

  public setupHero(customHero: CustomHero) {
    const unitId = GetUnitTypeId(customHero.unit);
    switch (unitId) {
      case HeroPassiveData.KID_BUU:
        kidBuuPassive(customHero);
        break;
      case HeroPassiveData.SUPER_JANEMBA:
        superJanembaPassive(customHero);
        break;
      case HeroPassiveData.TAPION:
        tapionPassive(customHero);
        break;
      case HeroPassiveData.DYSPO:
        dyspoPassive(customHero);
        break;
      case Id.ichigo:
        ichigoPassive(customHero);
        break;
      case Id.dartFeld:
        dartFeldPassive(customHero);
        break;
      default:
        break;
    }
  }

}

export function kidBuuPassive(customHero: CustomHero) {
  if (GetUnitAbilityLevel(customHero.unit, HeroPassiveData.DEVIL_CLAW_ABILITY) > 0) {
    superJanembaPassive(customHero);
  } else if (GetUnitAbilityLevel(customHero.unit, HeroPassiveData.BRAVE_SLASH) > 0) {
    tapionPassive(customHero);
  }
}

export function superJanembaPassive(customHero: CustomHero) {
  const cosmicIllusionBuff = FourCC("B025");
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);
  const onHitTrigger = CreateTrigger();
  const targetPos = new Vector2D();
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
        GetOwningPlayer(attacker) == player
      ) {
        const target = GetTriggerUnit();
        targetPos.setUnit(target);
        const rakshasaClawLevel = GetUnitAbilityLevel(customHero.unit, HeroPassiveData.RAKSHASA_CLAW_ABILITY);
        const devilClawLevel = GetUnitAbilityLevel(customHero.unit, HeroPassiveData.DEVIL_CLAW_ABILITY);
        if (rakshasaClawLevel + devilClawLevel > 0) {
          let onHitName = AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT;
          let onHitAbility = HeroPassiveData.RAKSHASA_CLAW_ABILITY;
          if (devilClawLevel > 0) {
            onHitName = AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT;
            onHitAbility = HeroPassiveData.DEVIL_CLAW_ABILITY;
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
        
        if (
          GetHandleId(attacker) == GetHandleId(customHero.unit) && 
          GetUnitAbilityLevel(customHero.unit, cosmicIllusionBuff) > 0
        ) {
          const input = new CustomAbilityInput(
            customHero, 
            GetOwningPlayer(customHero.unit),
            GetUnitAbilityLevel(customHero.unit, Id.cosmicIllusion),
            targetPos,
            targetPos,
            targetPos,
            target,
            target,
          );

          if (customHero.canCastAbility(AbilityNames.SuperJanemba.COSMIC_SLASH, input)) {
            TextTagHelper.showPlayerColorTextOnUnit(
              AbilityNames.SuperJanemba.COSMIC_SLASH, 
              GetPlayerId(GetOwningPlayer(customHero.unit)), 
              customHero.unit
            );
            customHero.useAbility(
              AbilityNames.SuperJanemba.COSMIC_SLASH,
              input
            );
          }
        }

      }
      return false;
    })
  );
}

export function tapionPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);
  const onHitTrigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  
  // possibly laggy...
  // TODO: make global damage registering system instead
  // TriggerRegisterAnyUnitEventBJ(
  //   onHitTrigger,
  //   EVENT_PLAYER_UNIT_DAMAGED
  // );

  // TriggerRegisterUnitEvent(
  //   onHitTrigger,
  //   customHero.unit,
  //   EVENT_UNIT_DAMAGING
  // );

  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      const attacked = GetAttackedUnitBJ();
      // const attacker = GetEventDamageSource();
      // const attacked = BlzGetEventDamageTarget();
      if (
        GetUnitTypeId(attacker) == heroId &&
        GetOwningPlayer(attacker) == player && 
        IsUnitType(attacked, UNIT_TYPE_HERO) &&
        GetUnitAbilityLevel(attacked, HeroPassiveData.HEROS_SONG) > 0
      ) {
        const attackedMana = GetUnitState(attacked, UNIT_STATE_MANA);
        const attackedMaxMana = GetUnitState(attacked, UNIT_STATE_MAX_MANA);
        let manaBurn = 25; 
        
        if (heroId == HeroPassiveData.TAPION) {
          manaBurn += attackedMana * 
            (
              GetUnitAbilityLevel(attacker, HeroPassiveData.TAPION_STYLE) * 
              HeroPassiveData.TAPION_MANA_BURN_PERCENT
            );
        } else {
          manaBurn += attackedMana * 15 * HeroPassiveData.TAPION_MANA_BURN_PERCENT;
        }

        if ((attackedMana / Math.max(1, attackedMaxMana)) < 0.5) {
          manaBurn *= 1.5;
        }

        if (attackedMana < manaBurn) {
          manaBurn = attackedMana;
        }

        SetUnitState(
          attacked, 
          UNIT_STATE_MANA, 
          Math.max(0, attackedMana - manaBurn)
        );
        
        UnitDamageTarget(
          attacker, 
          attacked, 
          manaBurn, 
          true, 
          false, 
          ATTACK_TYPE_HERO, 
          DAMAGE_TYPE_NORMAL, 
          WEAPON_TYPE_WHOKNOWS
        );

        const manaBurnSfx = AddSpecialEffect(
          "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl",
          GetUnitX(attacked),
          GetUnitY(attacked),
        );
        BlzSetSpecialEffectScale(manaBurnSfx, 2.0);
        DestroyEffect(manaBurnSfx);
      }
      return false;
    })
  );
}


export function dyspoPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const targetPos = new Vector2D();
  const heroId = GetUnitTypeId(customHero.unit);
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
        GetOwningPlayer(attacker) == player
      ) {
        const justiceKickLevel = GetUnitAbilityLevel(customHero.unit, HeroPassiveData.JUSTICE_KICK_ABILITY);
        // const devilClawLevel = GetUnitAbilityLevel(customHero.unit, HeroPassiveData.DEVIL_CLAW_ABILITY);
        if (justiceKickLevel > 0) {
          const target = GetTriggerUnit();
          targetPos.setUnit(target);
          let onHitName = AbilityNames.Dyspo.JUSTICE_KICK_ON_HIT;
          let onHitAbility = HeroPassiveData.JUSTICE_KICK_ABILITY;
          // if (devilClawLevel > 0) {
          //   onHitName = AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT;
          //   onHitAbility = HeroPassiveData.DEVIL_CLAW_ABILITY;
          // }
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
            SetUnitAnimation(customHero.unit, "spell slam");
            TimerStart(CreateTimer(), 0.5, false, () => {
              ResetUnitAnimation(customHero.unit);
            });
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


export function ichigoPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);

  const bankaiFinal = customHero.getAbility(AbilityNames.Ichigo.BANKAI_FINAL);
  const mugetsuAbsorb = customHero.getAbility(AbilityNames.Ichigo.MUGETSU_SLASH);
  const getsuga1 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_1);
  const getsuga2 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_2);
  const getsuga3 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_3);
  const getsuga4 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_4);

  const dash1 = customHero.getAbility(AbilityNames.Ichigo.DASH_BANKAI_FINAL_1);
  const dash2 = customHero.getAbility(AbilityNames.Ichigo.DASH_BANKAI_FINAL_2);

  if (
    !bankaiFinal || 
    !getsuga1 || !getsuga2 || !getsuga3 || !getsuga4 || 
    !mugetsuAbsorb ||
    !dash1 || !dash2
  ) return;
  const getsugas: CustomAbility[] = [getsuga1, getsuga2, getsuga3, getsuga4];

  const casterPos: Vector2D = new Vector2D(0, 0);
  const targetPos: Vector2D = new Vector2D(0, 0);

  const onHitTrigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      if (
        GetUnitTypeId(attacker) == heroId && 
        GetOwningPlayer(attacker) == player
      ) {
        const doBankaiFinal: boolean = (bankaiFinal.isInUse());
        const doGetsugaSpam: boolean = false;
        
        if (doBankaiFinal || doGetsugaSpam) {

          const target = GetTriggerUnit();
          targetPos.setPos(GetUnitX(target), GetUnitY(target));

          if (doBankaiFinal) {
            casterPos.setPos(GetUnitX(attacker), GetUnitY(attacker));
            if (CoordMath.distance(casterPos, targetPos) <= 550) {
              
              if (!dash1.isInUse()) {
                customHero.useAbility(
                  AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
                  new CustomAbilityInput(
                    customHero, 
                    GetOwningPlayer(customHero.unit),
                    10,
                    targetPos,
                    targetPos,
                    targetPos,
                    target,
                    target,
                  )
                );
              } else if (!dash2.isInUse()) {
                customHero.useAbility(
                  AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
                  new CustomAbilityInput(
                    customHero, 
                    GetOwningPlayer(customHero.unit),
                    10,
                    targetPos,
                    targetPos,
                    targetPos,
                    target,
                    target,
                  )
                );
              }
            }
          }
          
          if (doGetsugaSpam) {
            for (const getsuga of getsugas) {
              if (!getsuga.isInUse()) {
                customHero.useAbility(
                  getsuga.getName(),
                  new CustomAbilityInput(
                    customHero, 
                    GetOwningPlayer(customHero.unit),
                    10,
                    targetPos,
                    targetPos,
                    targetPos,
                    target,
                    target,
                  )
                );
                break;
              }
            }
          }
        }
      }
      return false;
    })
  );

  // const onOrderTrigger = CreateTrigger();
  // TriggerRegisterAnyUnitEventBJ(
  //   onOrderTrigger,
  //   EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER,
  // );
  // TriggerAddCondition(
  //   onOrderTrigger,
  //   Condition(() => {
  //     const caster = GetOrderedUnit();
  //     if (
  //       GetUnitTypeId(caster) == heroId && 
  //       bankaiFinal.isInUse() && 
  //       OrderId("attack") == GetIssuedOrderId()
  //     ) {
  //       casterPos.setPos(GetUnitX(caster), GetUnitY(caster));

  //       const target = GetOrderTargetUnit();
  //       targetPos.setPos(GetUnitX(target), GetUnitY(target));
        
  //       if (CoordMath.distance(casterPos, targetPos) <= 500) {
  //         customHero.useAbility(
  //           AbilityNames.Ichigo.DASH_BANKAI_FINAL,
  //           new CustomAbilityInput(
  //             customHero, 
  //             GetOwningPlayer(customHero.unit),
  //             10,
  //             targetPos,
  //             targetPos,
  //             targetPos,
  //             target,
  //             target,
  //           )
  //         );
  //       }
  //     }
  //     return false;
  //   })
  // );
}

export function dartFeldPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);
  const paragaonOfFlameBuff = FourCC("B048");
  const dragoonTransformationBuff = FourCC("B049");

  const madnessHero = customHero.getAbility(AbilityNames.DartFeld.MADNESS_HERO);
  const madnessOnHit = customHero.getAbility(AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT);
  // const paragonOfFlame = customHero.getAbility(AbilityNames.DartFeld.PARAGON_OF_FLAME);
  const paragonOnHit = customHero.getAbility(AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT);

  // const dash1 = customHero.getAbility(AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1);
  // const dash2 = customHero.getAbility(AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2);

  if (
    !madnessHero || !madnessOnHit
    ||
    // !paragonOfFlame || 
    !paragonOnHit
    // ||
    // !dash1 || !dash2
  ) return;

  const casterPos: Vector2D = new Vector2D(0, 0);
  const targetPos: Vector2D = new Vector2D(0, 0);

  const onHitTrigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );

  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      if (
        GetUnitTypeId(attacker) == heroId && 
        GetOwningPlayer(attacker) == player
      ) {
        const doMadness = (
          madnessHero.isInUse() && 
          GetUnitAbilityLevel(attacker, dragoonTransformationBuff) == 0 && 
          !madnessOnHit.isInUse()
        );
        const doParagonOnHit = GetUnitAbilityLevel(customHero.unit, paragaonOfFlameBuff) > 0;
        // const doParagonDash = paragonOfFlame.isInUse() && doParagonOnHit;
        
        // if (doMadness || doParagonDash || doParagonOnHit) {
        if (doMadness || doParagonOnHit) {
          const target = GetTriggerUnit();
          targetPos.setPos(GetUnitX(target), GetUnitY(target));
          casterPos.setPos(GetUnitX(attacker), GetUnitY(attacker));

          if (doParagonOnHit) {
            customHero.useAbility(
              AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT,
              new CustomAbilityInput(
                customHero, 
                GetOwningPlayer(customHero.unit),
                GetUnitAbilityLevel(customHero.unit, Id.paragonOfFlame),
                targetPos,
                targetPos,
                targetPos,
                target,
                target,
              )
            );
          }

          // if (doParagonDash) {
          //   if (CoordMath.distance(casterPos, targetPos) <= 550) {
                
          //     if (!dash1.isInUse()) {
          //       customHero.useAbility(
          //         AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1,
          //         new CustomAbilityInput(
          //           customHero, 
          //           GetOwningPlayer(customHero.unit),
          //           10,
          //           targetPos,
          //           targetPos,
          //           targetPos,
          //           target,
          //           target,
          //         )
          //       );
          //     } else if (!dash2.isInUse()) {
          //       customHero.useAbility(
          //         AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2,
          //         new CustomAbilityInput(
          //           customHero, 
          //           GetOwningPlayer(customHero.unit),
          //           10,
          //           targetPos,
          //           targetPos,
          //           targetPos,
          //           target,
          //           target,
          //         )
          //       );
          //     }
          //   }
          // }

          if (doMadness) {
            customHero.useAbility(
              AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT,
              new CustomAbilityInput(
                customHero, 
                GetOwningPlayer(customHero.unit),
                1,
                targetPos,
                targetPos,
                targetPos,
                target,
                target,
              )
            );
          }
        }
      }
      return false;
    })
  );

}