import { CustomHero } from "CustomHero/CustomHero";
import { Vector2D } from "Common/Vector2D";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Hooks } from "Libs/TreeLib/Hooks";
import { Id, Constants, Buffs, OrderIds, DebuffAbilities } from "Common/Constants";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CoordMath } from "Common/CoordMath";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";

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

  
  export const HIRUDEGARN_MANA_BURN_PERCENT = 0.015;
  export const HIRUDEGARN_MANA_HEAL_PERCENT = 0.015;

  export const SUPER_17_STYLE = FourCC("A01U");
  export const SUPER_17_MANA_BURN_PERCENT = 0.001;
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
    setupSPData(customHero);
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
      case Id.lucario:
        lucarioPassive(customHero);
        break;
      case Id.hirudegarn:
        hirudegarnPassive(customHero);
        break;
      case Id.super17:
        super17Passive(customHero);
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
  } else if (GetUnitAbilityLevel(customHero.unit, Id.vacuumWave) > 0) {
    lucarioPassive(customHero);
  }
}

export function superJanembaPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
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
          GetUnitAbilityLevel(customHero.unit, Buffs.COSMIC_ILLUSION) > 0
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
  customHero.addPassiveTrigger(onHitTrigger);

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
  customHero.addPassiveTrigger(onHitTrigger);

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

  // const getsugaBase = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_JUJISHO);
  // const bankaiFinal = customHero.getAbility(AbilityNames.Ichigo.BANKAI_FINAL);
  // const mugetsuAbsorb = customHero.getAbility(AbilityNames.Ichigo.MUGETSU_SLASH);
  const getsuga1 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_ON_HIT_1);
  const getsuga2 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_ON_HIT_2);
  const getsuga3 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_ON_HIT_3);
  const getsuga4 = customHero.getAbility(AbilityNames.Ichigo.GETSUGA_ON_HIT_4);

  // const dash1 = customHero.getAbility(AbilityNames.Ichigo.DASH_BANKAI_FINAL_1);
  // const dash2 = customHero.getAbility(AbilityNames.Ichigo.DASH_BANKAI_FINAL_2);

  if (
    // !bankaiFinal || 
    // !getsugaBase ||
    !getsuga1 || !getsuga2 
    || !getsuga3 || !getsuga4 // || 
    // !mugetsuAbsorb ||
    // !dash1 || !dash2
  ) return;
  // const getsugas: CustomAbility[] = [getsuga1, getsuga2];
  // const getsugas: CustomAbility[] = [getsuga1, getsuga2, getsuga3, getsuga4];

  // const casterPos: Vector2D = new Vector2D(0, 0);
  const targetPos: Vector2D = new Vector2D(0, 0);

  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
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
        // const doBankaiFinal: boolean = (bankaiFinal.isInUse());
        const target = GetTriggerUnit();
        const doGetsuga1: boolean = (
          BlzGetUnitAbilityCooldownRemaining(attacker, Id.getsugaTensho) > 0
        );
        const doGetsuga2: boolean = (
          BlzGetUnitAbilityCooldownRemaining(attacker, Id.getsugaKuroi) > 0
        );
        const doGetsuga3: boolean = (
          BlzGetUnitAbilityCooldownRemaining(attacker, Id.getsugaJujisho) > 0
        );
        const doGetsuga4: boolean = (
          BlzGetUnitAbilityCooldownRemaining(attacker, Id.getsugaGran) > 0
        );
        targetPos.setPos(GetUnitX(target), GetUnitY(target));
        
        if (
          !getsuga4.isInUse() &&
          (doGetsuga4)
        ) {
          customHero.useAbility(
            getsuga4.getName(),
            new CustomAbilityInput(
              customHero, 
              GetOwningPlayer(customHero.unit),
              GetUnitAbilityLevel(attacker, Id.getsugaJujisho),
              targetPos,
              targetPos,
              targetPos,
              target,
              target,
            )
          );
        } else if (
          !getsuga3.isInUse() &&
          (doGetsuga3)
          // (doGetsuga4 || doGetsuga3)
        ) {
          customHero.useAbility(
            getsuga3.getName(),
            new CustomAbilityInput(
              customHero, 
              GetOwningPlayer(customHero.unit),
              GetUnitAbilityLevel(attacker, Id.getsugaJujisho),
              targetPos,
              targetPos,
              targetPos,
              target,
              target,
            )
          );
        } else if (
          !getsuga2.isInUse() &&
          // (doGetsuga4 || doGetsuga3 || doGetsuga2)
          (doGetsuga2)
        ) {
          customHero.useAbility(
            getsuga2.getName(),
            new CustomAbilityInput(
              customHero, 
              GetOwningPlayer(customHero.unit),
              GetUnitAbilityLevel(attacker, Id.getsugaTensho),
              targetPos,
              targetPos,
              targetPos,
              target,
              target,
            )
          );
        }
        else if (
          !getsuga1.isInUse() && 
          // (doGetsuga4 || doGetsuga3 || doGetsuga2 || doGetsuga1)
          (doGetsuga1)
        ) {
          customHero.useAbility(
            getsuga1.getName(),
            new CustomAbilityInput(
              customHero, 
              GetOwningPlayer(customHero.unit),
              GetUnitAbilityLevel(attacker, Id.getsugaTensho),
              targetPos,
              targetPos,
              targetPos,
              target,
              target,
            )
          );
        }
      }
      
      return false;
    })
  );

  // const onHitTrigger = CreateTrigger();
  // customHero.addPassiveTrigger(onHitTrigger);
  // TriggerRegisterAnyUnitEventBJ(
  //   onHitTrigger,
  //   EVENT_PLAYER_UNIT_ATTACKED,
  // );
  // TriggerAddCondition(
  //   onHitTrigger,
  //   Condition(() => {
  //     const attacker = GetAttacker();
  //     if (
  //       GetUnitTypeId(attacker) == heroId && 
  //       GetOwningPlayer(attacker) == player
  //     ) {
  //       const doBankaiFinal: boolean = (bankaiFinal.isInUse());
  //       const doGetsugaSpam: boolean = false;
        
  //       if (doBankaiFinal || doGetsugaSpam) {

  //         const target = GetTriggerUnit();
  //         targetPos.setPos(GetUnitX(target), GetUnitY(target));

  //         if (doBankaiFinal) {
  //           casterPos.setPos(GetUnitX(attacker), GetUnitY(attacker));
  //           if (CoordMath.distance(casterPos, targetPos) <= 550) {
              
  //             if (!dash1.isInUse()) {
  //               customHero.useAbility(
  //                 AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
  //                 new CustomAbilityInput(
  //                   customHero, 
  //                   GetOwningPlayer(customHero.unit),
  //                   10,
  //                   targetPos,
  //                   targetPos,
  //                   targetPos,
  //                   target,
  //                   target,
  //                 )
  //               );
  //             } else if (!dash2.isInUse()) {
  //               customHero.useAbility(
  //                 AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
  //                 new CustomAbilityInput(
  //                   customHero, 
  //                   GetOwningPlayer(customHero.unit),
  //                   10,
  //                   targetPos,
  //                   targetPos,
  //                   targetPos,
  //                   target,
  //                   target,
  //                 )
  //               );
  //             }
  //           }
  //         }
          
  //         if (doGetsugaSpam) {
  //           for (const getsuga of getsugas) {
  //             if (!getsuga.isInUse()) {
  //               customHero.useAbility(
  //                 getsuga.getName(),
  //                 new CustomAbilityInput(
  //                   customHero, 
  //                   GetOwningPlayer(customHero.unit),
  //                   10,
  //                   targetPos,
  //                   targetPos,
  //                   targetPos,
  //                   target,
  //                   target,
  //                 )
  //               );
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     return false;
  //   })
  // );

  // const onOrderTrigger = CreateTrigger();
  // customHero.addPassiveTrigger(onOrderTrigger);
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
  customHero.addPassiveTrigger(onHitTrigger);

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
          GetUnitAbilityLevel(attacker, Buffs.DRAGOON_TRANSFORMATION) == 0 && 
          !madnessOnHit.isInUse()
        );
        const doParagonOnHit = GetUnitAbilityLevel(customHero.unit, Buffs.PARAGON_OF_FLAME) > 0;
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


export function lucarioPassive(customHero: CustomHero) {
  const player = GetOwningPlayer(customHero.unit);
  const heroId = GetUnitTypeId(customHero.unit);
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);

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
        
        // force
        if (UnitHelper.isUnitTargetableForPlayer(target, player)) {
          const castDummy = CreateUnit(
            player, 
            Constants.dummyCasterId, 
            targetPos.x, targetPos.y, 
            0
          );
          UnitAddAbility(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF);
          
          let bonusDamageMult = 1;
          if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_1) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_1);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 2);
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_2) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_2);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 3);
            bonusDamageMult *= 2;
          }
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_3) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_3);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 4);
            bonusDamageMult *= 3;
          }
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_4) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_4);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 5);
            bonusDamageMult *= 4;
          }
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_5) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_5);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 6);
            bonusDamageMult *= 5;
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_6) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_6);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 7);
            bonusDamageMult *= 6;
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_7) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_7);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 8);
            bonusDamageMult *= 7;
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_8) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_8);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 9);
            bonusDamageMult *= 8;
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_9) > 0) {
            UnitRemoveAbility(target, Buffs.LUCARIO_FORCE_9);
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 10);
            bonusDamageMult *= 9;
          } 
          else if (GetUnitAbilityLevel(target, Buffs.LUCARIO_FORCE_10) > 0) {
            SetUnitAbilityLevel(castDummy, DebuffAbilities.LUCARIO_FORCE_DEBUFF, 10);
            bonusDamageMult *= 10;
          } 
          else {
            bonusDamageMult *= 0;
          }
          
          IssueTargetOrderById(castDummy, OrderIds.INNER_FIRE, target);
          RemoveUnit(castDummy);
          
          if (bonusDamageMult > 0) {
            // 0.0005 * 20000 * 20 = 200 max hp dmg per stack
            // 0.01 * 20000 = 200 int dmg per stack
            const bonusDamage = AOEDamage.getIntDamageMult(attacker) * bonusDamageMult * (
              0.0005 * GetUnitState(target, UNIT_STATE_MAX_LIFE)
              + 0.01 * GetHeroInt(attacker, true)
            );
            if (bonusDamage > 0) {
              UnitDamageTarget(
                attacker, 
                target, 
                bonusDamage, 
                true,
                false,
                ATTACK_TYPE_HERO, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WHOKNOWS
              );
            }
          }
        }
        
        // extreme speed
        if (
          GetHandleId(attacker) == GetHandleId(customHero.unit) && 
          GetUnitAbilityLevel(customHero.unit, Buffs.EXTREME_SPEED) > 0
        ) {
          const input = new CustomAbilityInput(
            customHero, 
            GetOwningPlayer(customHero.unit),
            GetUnitAbilityLevel(customHero.unit, Id.extremeSpeed),
            targetPos,
            targetPos,
            targetPos,
            target,
            target,
          );

          if (customHero.canCastAbility(AbilityNames.Lucario.EXTREME_SPEED_ON_HIT, input)) {
            TextTagHelper.showPlayerColorTextOnUnit(
              AbilityNames.Lucario.EXTREME_SPEED_ON_HIT, 
              GetPlayerId(GetOwningPlayer(customHero.unit)), 
              customHero.unit
            );
            customHero.useAbility(
              AbilityNames.Lucario.EXTREME_SPEED_ON_HIT,
              input
            );

            UnitRemoveAbility(customHero.unit, Buffs.EXTREME_SPEED);
          }
        }
      }
      return false;
    })
  );
}

export function hirudegarnPassive(customHero: CustomHero) {
  let spellAmpBonus = 0;
  const spellDamageTimer = CreateTimer();
  customHero.addTimer(spellDamageTimer);

  TimerStart(spellDamageTimer, 1.0, true, () => {
    const formLevel = GetUnitAbilityLevel(customHero.unit, Id.hirudegarnPassive);
    let maxSpellAmpBonus = 0.4;
    if (formLevel == 3) {
      maxSpellAmpBonus = 1.0;
    }
    // BJDebugMsg("CURR: " + customHero.spellPower + " BONUS: " + spellAmpBonus);

    customHero.removeSpellPower(spellAmpBonus);
    const currentMana = GetUnitState(customHero.unit, UNIT_STATE_MANA);
    const maxMana = GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA);

    spellAmpBonus = Math.max(
      0, 
      maxSpellAmpBonus * currentMana / Math.max(1, maxMana)
    );
    customHero.addSpellPower(spellAmpBonus);
  });

  // on hit 
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);

  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      const attacked = GetTriggerUnit();
      const attackerPlayer = GetOwningPlayer(attacker);
      if (
        GetUnitTypeId(attacker) == GetUnitTypeId(customHero.unit) && 
        attackerPlayer == GetOwningPlayer(customHero.unit) &&
        IsUnitType(attacked, UNIT_TYPE_HERO) &&
        UnitHelper.isUnitTargetableForPlayer(attacked, attackerPlayer)
      ) {
        let manaLoss = 25;
        const attackedMana = GetUnitState(attacked, UNIT_STATE_MANA);
        manaLoss += attackedMana * HeroPassiveData.HIRUDEGARN_MANA_BURN_PERCENT;
        
        SetUnitState(
          attacked, 
          UNIT_STATE_MANA, 
          Math.max(0, attackedMana - manaLoss)
        );

        let manaGain = 25;
        const attackerMana = GetUnitState(attacker, UNIT_STATE_MANA);
        const attackerMaxMana = GetUnitState(attacker, UNIT_STATE_MAX_MANA);
        manaGain += attackerMana * HeroPassiveData.HIRUDEGARN_MANA_HEAL_PERCENT;
        
        SetUnitState(
          attacker,
          UNIT_STATE_MANA,
          Math.min(attackerMaxMana, attackerMana + manaLoss + manaGain)
        );

        const manaDrainSfx = AddSpecialEffect(
          "Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl",
          GetUnitX(attacker),
          GetUnitY(attacker),
        );
        BlzSetSpecialEffectScale(manaDrainSfx, 4.0);
        DestroyEffect(manaDrainSfx);
      }

      return false;
    })
  );
}

export function super17Passive(customHero: CustomHero) {
  // on hit 
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);

  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      const attacked = GetTriggerUnit();
      const attackerPlayer = GetOwningPlayer(attacker);
      if (
        GetUnitTypeId(attacker) == GetUnitTypeId(customHero.unit) && 
        attackerPlayer == GetOwningPlayer(customHero.unit) &&
        IsUnitType(attacked, UNIT_TYPE_HERO) &&
        UnitHelper.isUnitTargetableForPlayer(attacked, attackerPlayer) &&
        GetUnitAbilityLevel(attacker, HeroPassiveData.SUPER_17_STYLE) > 0
      ) {
        const attackedMana = GetUnitState(attacked, UNIT_STATE_MANA);
        let manaBurn = 25 + attackedMana * (
          GetUnitAbilityLevel(attacker, HeroPassiveData.SUPER_17_STYLE) * 
          HeroPassiveData.SUPER_17_MANA_BURN_PERCENT
        );

        if (attackedMana < manaBurn) {
          manaBurn = attackedMana;
        }
        
        // mana loss
        SetUnitState(
          attacked, 
          UNIT_STATE_MANA, 
          Math.max(0, attackedMana - manaBurn)
        );
        
        // mana burn
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

        const attackerMana = GetUnitState(attacker, UNIT_STATE_MANA);
        const attackerMaxMana = GetUnitState(attacker, UNIT_STATE_MAX_MANA);
        // mana restore
        SetUnitState(
          attacker,
          UNIT_STATE_MANA,
          Math.min(attackerMaxMana, attackerMana + manaBurn)
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


export function setupSPData(customHero: CustomHero) {
  const spTimer = CreateTimer();
  customHero.addTimer(spTimer);

  TimerStart(spTimer, 0.03, true, () => {
    // regen: 1 stam per 6 second base
    // +1% per 1k AGI
    let currentSP = customHero.getCurrentSP();
    let maxSP = customHero.getMaxSP();

    let agiBonus = Math.min(
      1.5,
      (1 + 0.00001 * GetHeroAgi(customHero.unit, true))
    )
    let incSp = 0.05 * agiBonus;
    if (GetUnitAbilityLevel(customHero.unit, Id.itemHealingBuff) > 0) {
      incSp *= 2;
    }
    // if (currentSP < 0.2 * maxSP) {
    //   incSp *= 0.5;
    // }
    const spRatio = Math.max(0, currentSP/maxSP);
    incSp *= (0.6+spRatio);    
    customHero.setCurrentSP(customHero.getCurrentSP() + incSp);
  });

  const maxSpUpdateTimer = CreateTimer();
  customHero.addTimer(maxSpUpdateTimer);
  TimerStart(maxSpUpdateTimer, 5.0, true, () => {
    let maxStamina = Constants.BASE_STAMINA + Math.min(
      25,
      0.0005 * GetHeroAgi(customHero.unit, true)
    );
    if (IsUnitType(customHero.unit, UNIT_TYPE_SUMMONED)) {
      maxStamina *= 0.55;
    }
    customHero.setMaxSP(maxStamina);
  });
}