import { CustomHero } from "CustomHero/CustomHero";
import { Vector2D } from "Common/Vector2D";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Id, Constants, Buffs, OrderIds, DebuffAbilities, Globals, BASE_DMG } from "Common/Constants";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CoordMath } from "Common/CoordMath";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { PathingCheck } from "Common/PathingCheck";
import { SoundHelper } from "Common/SoundHelper";
import { TimerManager } from "Core/Utility/TimerManager";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { SimpleSpellSystem } from "Core/SimpleSpellSystem/SimpleSpellSystem";

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
    }
    return this.instance;
  }

  initialize() {

  }

  public setupHero(customHero: CustomHero) {
    setupRegenTimer(customHero);
    const unitTypeId = GetUnitTypeId(customHero.unit);
    switch (unitTypeId) {
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
      case Id.shotoTodoroki:
        shotoTodorokiPassive(customHero);
        break;
      case Id.sonic:
        sonicPassive(customHero);
        break;
      case Id.guts:
        gutsPassive(customHero);
        break;
      case Id.jaco:
        jacoPassive(customHero);
        break;
      case Id.pecorine:
        pecoPassive(customHero);
        break;
      case Id.linkTwilight:
        linkPassive(customHero);
        break;
      case Id.ainzOoalGown:
        ainzPassive(customHero);
        break;
      case Id.demiurge:
        demiurgePassive(customHero);
        break;
      case Id.vegetaMajin:
        vegetaMajinPassive(customHero);
        break;
      case Id.minato:
        minatoPassive(customHero);
        break;
      case Id.mightGuy:
        mightGuyPassive(customHero);
        break;
      case Id.genos:
        genosPassive(customHero);
        break;
      case Id.tatsumaki:
        tatsumakiPassive(customHero);
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
  } else if (GetUnitAbilityLevel(customHero.unit, Id.genosOvercharge) > 0) {
    genosPassive(customHero);
  } else if (GetUnitAbilityLevel(customHero.unit, Id.tatsumakiVector) > 0) {
    tatsumakiPassive(customHero);
  }
}

export function superJanembaPassive(customHero: CustomHero) {
  const heroId = GetUnitTypeId(customHero.unit);
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
  const targetPos = new Vector2D();
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit)
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
            onHitAbility,
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
            Id.cosmicIllusion,
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
  // const player = GetOwningPlayer(customHero.unit);
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit) && 
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
  // const player = GetOwningPlayer(customHero.unit);
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit)
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
            Id.justiceKick,
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
  // const player = GetOwningPlayer(customHero.unit);
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit)
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
              Id.getsugaGran,
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
              Id.getsugaJujisho,
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
              Id.getsugaKuroi,
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
              Id.getsugaTensho,
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
  // const player = GetOwningPlayer(customHero.unit);
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit)
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
                Id.paragonOfFlame,
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
                Id.madnessHero,
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
  // const player = GetOwningPlayer(customHero.unit);
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
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit)
      ) {
        const target = GetTriggerUnit();
        targetPos.setUnit(target);

        const player = GetOwningPlayer(customHero.unit);
        
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

            // 0.0004 * 10000 * 10 = 40 max hp dmg per stack
            // 0.004 * 10000 = 40 int dmg per stack
            const bonusDamage = AOEDamage.getIntDamageMult(attacker) * bonusDamageMult * (
              0.0004 * GetUnitState(target, UNIT_STATE_MAX_LIFE)
              + 0.004 * GetHeroInt(attacker, true)
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
            Id.extremeSpeed,
            customHero, 
            player,
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
              GetPlayerId(player), 
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
        const attackedMaxMana = GetUnitState(attacked, UNIT_STATE_MAX_MANA);
        manaLoss += attackedMaxMana * HeroPassiveData.HIRUDEGARN_MANA_BURN_PERCENT;
        
        SetUnitState(
          attacked, 
          UNIT_STATE_MANA, 
          Math.max(0, attackedMana - manaLoss)
        );

        let manaGain = 25;
        const attackerMana = GetUnitState(attacker, UNIT_STATE_MANA);
        const attackerMaxMana = GetUnitState(attacker, UNIT_STATE_MAX_MANA);
        manaGain += attackerMaxMana * HeroPassiveData.HIRUDEGARN_MANA_HEAL_PERCENT;
        
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

export function getHeatString(
  heat: number, 
  heatSpeed: number,
  isHeatingUp: boolean, 
  isCoolingDown: boolean
): string {
  // return R2S(heat);
  // let result = "|cffff2222";
  // let i = 0;
  // for (; i < heat * 0.1 - 1; ++i) {
  //   result += "I";
  // }

  // if (i < 10 && heat != 0) {
  //   let mod = heat;
  //   while (mod > 10) {
  //     mod -= 10;
  //   }

  //   if (mod <= 5) {
  //     result += ".";
  //   } else {
  //     result += ":";
  //   }
  //   ++i;
  // }

  // if (i < 10) {
  //   result += "|cff00ffff";
  //   for (; i < 10; ++i) {
  //     result += "I";
  //   }
  // } else if (isCoolingDown) {
  //   result += "|cff00ffff";
  // }
  let result = "      ";
  if (heat <= 50) {
    result += "|cff00ffff" + I2S(Math.round(heat));
  } else {
    result += "|cffff2222" + I2S(Math.round(heat));
  }
  
  if (heatSpeed < 0) {
    result += "|cff00ffff";
  } else if (heatSpeed > 0) {
    result += "|cffff2222";
  } else {
    result += "|cffffcc00";
  }
  if (isHeatingUp) {
    result += "^";
  } else if (isCoolingDown) {
    result += "v";
  } else {
    result += "-";
  }

  return result + "|r";
}

export function shotoTodorokiPassive(customHero: CustomHero) {
  const unitHandle = GetHandleId(customHero.unit);
  if (unitHandle == 0) return;

  // globals hashtable
  // 0: heat
  // 1: heat state (1 = cooling down, 2 = heating up)

  const heatHeatingUp = 8;
  const heatCoolingDown = -8;
  const heatGlacier = -15;
  const heatWallOfFlames = 25;
  const heatIcePath = -10;
  const heatFlashfreezeHeatwave = 35;
  const heatHeavenPiercingIceWall = -25;
  const heatFlashfireFist = 25;
  const heatLossPerTick = 0.02;
  const heatHPPenaltyInitial = 4;
  const heatHPPenaltyPerSecond = 2;
  const heatHPPenaltyTickInterval = 33;

  // update stuff
  const timer = CreateTimer();
  customHero.addTimer(timer);

  const textTag = CreateTextTag();
  let heat = 50;
  let heatSpeed = 0;
  let isHeatingUp = false;
  let isCoolingDown = false;
  let penaltyTick = 0;
  let ultMode = 0;

  let player = GetOwningPlayer(customHero.unit);
  let playerForce: force | undefined = CreateForce();
  ForceAddPlayer(playerForce, GetOwningPlayer(customHero.unit));
  SetTextTagPermanent(textTag, true);
  SetTextTagVisibility(textTag, true);
  ShowTextTagForceBJ(false, textTag, bj_FORCE_ALL_PLAYERS);
  ShowTextTagForceBJ(true, textTag, playerForce);

  let coldSfx: effect | undefined;
  let hotSfx: effect | undefined;
  let hotSfx2: effect | undefined;
  let hotSfx3: effect | undefined;

  TimerStart(timer, 0.03, true, () => {
    if (GetUnitTypeId(customHero.unit) == 0) {
      if (playerForce) {
        DestroyForce(playerForce);
        playerForce = undefined;
      }
      return;
    }
    if (UnitHelper.isUnitDead(customHero.unit)) {
      heat = 50;
      heatSpeed = 0;
      isHeatingUp = false;
      isCoolingDown = false;
      return;
    }

    if (GetOwningPlayer(customHero.unit) != player) {
      player = GetOwningPlayer(customHero.unit);
      if (playerForce) {
        ForceClear(playerForce);
        ForceAddPlayer(playerForce, GetOwningPlayer(customHero.unit));
        ShowTextTagForceBJ(true, textTag, playerForce);
      }
    }
    
    const isStunned = UnitHelper.isUnitStunned(customHero.unit);
    if (!isStunned) {
      // additional heat from heating up / cooling down
      if (isHeatingUp) {
        heatSpeed = heatSpeed + heatHeatingUp * heatLossPerTick * 0.5;
      } else if (isCoolingDown) {
        heatSpeed = heatSpeed + heatCoolingDown * heatLossPerTick * 0.5;
      }

      // heat speed loss
      let heatSpeedDelta = heatSpeed * heatLossPerTick;
      heatSpeed = heatSpeed - heatSpeedDelta;
      if (heatSpeedDelta > 0) {
        heatSpeed = Math.max(0, heatSpeed);
      } else {
        heatSpeed = Math.min(0, heatSpeed);
      }

      heat = Math.max(0, Math.min(100, heat + heatSpeed * 0.03));
      SaveReal(Globals.genericSpellHashtable, unitHandle, 0, heat);
    }

    SetTextTagPos(textTag, GetUnitX(customHero.unit), GetUnitY(customHero.unit), 25);
    SetTextTagTextBJ(textTag, getHeatString(heat, heatSpeed, isHeatingUp, isCoolingDown), 15);

    // if (GetUnitAbilityLevel(customHero.unit, Id.shotoTodorokiHeavenPiercingIceWall) > 0) {
    //   if ((ultMode == 1 && heat >= 50) || (ultMode == 2 && heat <= 50)) {
    //     ultMode = 0;
    //     // flashfreeze heatwave
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, true);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, false);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, false);
    //   } else if (ultMode != 1 && heat >= 10) {
    //     ultMode = 1;
    //     // heaven piercing ice wall
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, false);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, true);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, false);
    //   } else if (ultMode != 2 && heat <= 90 && GetUnitAbilityLevel(customHero.unit, Id.shotoTodorokiFlashfireFist) > 0) {
    //     ultMode = 2;
    //     // flashfire fist
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, false);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, false);
    //     SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, true);
    //   } 
    // }

    // heat penalty
    if (
      !BlzIsUnitInvulnerable(customHero.unit)
      && !isStunned
      && (
        heat == 100
        || heat == 0
      )
    ) {
      // if (heat == 100) {
      //   heatSpeed += heatCoolingDown * 0.1;
      // } else {
      //   heatSpeed += heatHeatingUp * 0.1;
      // }

      // let percentHP = GetUnitLifePercent(customHero.unit);
      // let newHP = percentHP - heatHPPenaltyPerTick;
      // // if (penaltyTick > 33) {
      // //   newHP -= Math.round(penaltyTick/99) * heatHPPenaltyPerTick;
      // // }
      // if (newHP > 1) {
      //   SetUnitLifePercentBJ(customHero.unit, newHP);
      // }

      // sfx on 0
      if (
        penaltyTick > heatHPPenaltyTickInterval-1 
        && penaltyTick % heatHPPenaltyTickInterval == 0
      ) {
        let percentHP = 0;
        if (penaltyTick == heatHPPenaltyTickInterval) {
          percentHP = GetUnitLifePercent(customHero.unit);
          if (percentHP > heatHPPenaltyInitial+1) {
            SetUnitLifePercentBJ(customHero.unit, percentHP - heatHPPenaltyInitial);
          }
        } else {
          percentHP = GetUnitLifePercent(customHero.unit);
          if (percentHP > heatHPPenaltyPerSecond) {
            SetUnitLifePercentBJ(customHero.unit, percentHP - heatHPPenaltyPerSecond);
          }
        }

        if (heat == 100) {
          DestroyEffect(
            AddSpecialEffect(
              "ValkFireExplosion.mdl",
              GetUnitX(customHero.unit),
              GetUnitY(customHero.unit),
            )
          );
        } else {
          DestroyEffect(
            AddSpecialEffect(
              "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl",
              GetUnitX(customHero.unit),
              GetUnitY(customHero.unit),
            )
          );
        }
      }

      ++penaltyTick;
    } else {
      penaltyTick = 0;
    }

    // update sfx
    if (heat < 50) {
      AddUnitAnimationProperties(customHero.unit, "alternate", true);
      if (!coldSfx) {
        coldSfx = AddSpecialEffectTarget(
          "Abilities\\Weapons\\ZigguratFrostMissile\\ZigguratFrostMissile.mdl",
          customHero.unit,
          "right hand"
        );
      }
      if (hotSfx) {
        DestroyEffect(hotSfx);
        hotSfx = undefined;
      }
      if (hotSfx2) {
        DestroyEffect(hotSfx2);
        hotSfx2 = undefined;
      }
      if (hotSfx3) {
        DestroyEffect(hotSfx3);
        hotSfx3 = undefined;
      }
    } else if (heat > 50) {
      AddUnitAnimationProperties(customHero.unit, "alternate", false);
      if (!hotSfx) {
        hotSfx = AddSpecialEffectTarget(
          "Environment\\LargeBuildingFire\\LargeBuildingFire1.mdl",
          customHero.unit,
          "left hand"
        );
      }
      if (!hotSfx2) {
        hotSfx2 = AddSpecialEffectTarget(
          "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl",
          customHero.unit,
          "left hand"
        );
      }
      if (!hotSfx3) {
        hotSfx3 = AddSpecialEffectTarget(
          "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl",
          customHero.unit,
          "head"
        );
      }
      if (coldSfx) {
        DestroyEffect(coldSfx);
        coldSfx = undefined;
      }
    }
  });


  // spells changing heat
  const castTrigger = CreateTrigger();
  customHero.addPassiveTrigger(castTrigger);
  TriggerRegisterAnyUnitEventBJ(castTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(castTrigger, Condition(() => {
    const unit = GetTriggerUnit();
    if (GetHandleId(unit) != unitHandle) return false;
    
    const spellId = GetSpellAbilityId();
    if (spellId == Id.shotoTodorokiCoolingDown) {
      if (isCoolingDown) {
        isCoolingDown = false;
        SaveInteger(Globals.genericSpellHashtable, unitHandle, 1, 0);
      } else {
        heatSpeed += heatCoolingDown;
        isCoolingDown = true;
        isHeatingUp = false;
        SaveInteger(Globals.genericSpellHashtable, unitHandle, 1, 1);
      }
    } else if (spellId == Id.shotoTodorokiHeatingUp) {
      if (isHeatingUp) {
        isHeatingUp = false;
        SaveInteger(Globals.genericSpellHashtable, unitHandle, 1, 0);
      } else {
        heatSpeed += heatHeatingUp;
        isHeatingUp = true;
        isCoolingDown = false;
        SaveInteger(Globals.genericSpellHashtable, unitHandle, 1, 2);
      }
    } else if (spellId == Id.shotoTodorokiGlacier) {
      heatSpeed += heatGlacier;
    } else if (spellId == Id.shotoTodorokiWallOfFlames) {
      heatSpeed += heatWallOfFlames;
    } else if (spellId == Id.shotoTodorokiIcePath) {
      heatSpeed += heatIcePath;
    } else if (spellId == Id.shotoTodorokiFlashfreezeHeatwave) {
      if (heat < 50) {
        heatSpeed += heatFlashfreezeHeatwave;
      } else {
        heatSpeed -= heatFlashfreezeHeatwave;
      }
    } else if (spellId == Id.shotoTodorokiHeavenPiercingIceWall) {
      heatSpeed += heatHeavenPiercingIceWall;
    } else if (spellId == Id.shotoTodorokiFlashfireFist) {
      heatSpeed += heatFlashfireFist;
    }
    
    const isFlashFireFistReady = GetUnitAbilityLevel(customHero.unit, Id.shotoTodorokiFlashfireFist) > 0;
    if (!isCoolingDown && (!isHeatingUp || !isFlashFireFistReady)) {
      // flashfreeze heatwave
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, true);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, false);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, false);
    } 
    else if (GetUnitAbilityLevel(customHero.unit, Id.shotoTodorokiHeavenPiercingIceWall) > 0 && isCoolingDown)
    {
      // heaven piercing ice wall
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, false);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, true);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, false);
    }
    else if (isFlashFireFistReady && isHeatingUp)
    {
      // flashfire fist
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfreezeHeatwave, false);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiHeavenPiercingIceWall, false);
      SetPlayerAbilityAvailable(player, Id.shotoTodorokiFlashfireFist, true);
    }

    return false;
  }));

  TimerStart(CreateTimer(), 0.3, true, () => {
    // cleanup text tag and self hashtable
    if (GetUnitTypeId(customHero.unit) != 0) return

    if (hotSfx) {
      DestroyEffect(hotSfx);
      hotSfx = undefined;
    }
    if (hotSfx2) {
      DestroyEffect(hotSfx2);
      hotSfx2 = undefined;
    }
    if (hotSfx3) {
      DestroyEffect(hotSfx3);
      hotSfx3 = undefined;
    }
    if (coldSfx) {
      DestroyEffect(coldSfx);
      coldSfx = undefined;
    }

    DestroyTextTag(textTag);
    FlushChildHashtable(Globals.genericSpellHashtable, unitHandle);
    DestroyTimer(GetExpiredTimer());
  });
}

export function sonicPassive(customHero: CustomHero) {
  // update stuff
  const timer = CreateTimer();
  customHero.addTimer(timer);

  const sonicId = GetHandleId(customHero.unit);
  const upgLevel = 60;
  const upg2Level = 125;
  const magnitudeMaxBase = 22;
  const magnitudeMaxUpg = 4;
  const magnitudeMaxUpg2 = 4;
  const magnitudeLowHPThreshold = 75;
  const bonusSpeedDmgMult = 2;
  const minMagnitudeBonus = 15;
  const magnitudeLossStunned = 0.95;
  const magnitudeLossStuck = 0.85;
  const dmgAOE = 280;
  const dmgMagnitudeMult = 0.1;
  const spinDmgDataMult = BASE_DMG.KAME_DPS * 0.05;
  const moveDir = new Vector2D(0, 0);
  const moveDist = 1.0;
  const moveDistSpin = 0.6;
  const moveDistSpinUpg = 0.05;
  const moveDistSpinUpg2 = 0.05;
  const oldPos = new Vector2D(0, 0);
  oldPos.setUnit(customHero.unit);
  const speedResetDist = 6000;

  const homingMagnitudeMaxMult = 1.75;
  const homingForwardsLatestTick = 12;
  const homingReversalDuration = 9;
  const dmgHomingAttack = BASE_DMG.KAME_DPS * 4.4;

  const magnitudeLossSpinDash = 0.9;

  const lightSpeedMult = 1.5;
  const lightSpeedOffset = 60;
  const lightSpeedMaxDistTravelled = 6000;
  const dmgLightSpeed = BASE_DMG.KAME_DPS * 10;

  const superSonicDistMult = 1.5;
  const superSonicMagnitudeMult = 1.5;

  let counter = 0;
  const counterMax = 3;

  UnitAddAbility(customHero.unit, Id.ghostVisible);

  const textTag = CreateTextTag();
  let player = GetOwningPlayer(customHero.unit);
  let playerId = GetPlayerId(player);
  let playerForce: force | undefined = CreateForce();
  ForceAddPlayer(playerForce, GetOwningPlayer(customHero.unit));
  SetTextTagPermanent(textTag, true);
  SetTextTagVisibility(textTag, true);
  ShowTextTagForceBJ(false, textTag, bj_FORCE_ALL_PLAYERS);
  ShowTextTagForceBJ(true, textTag, playerForce);
  SetTextTagText(textTag, "0", 15);


  TimerStart(timer, 0.03, true, () => {
    if (GetUnitTypeId(customHero.unit) == 0) {
      if (playerForce) {
        DestroyForce(playerForce);
        playerForce = undefined;
        DestroyTextTag(textTag);
      }
      return;
    }

    const spinVal = LoadInteger(Globals.genericSpellHashtable, sonicId, 0);
    let homingTicks = LoadInteger(Globals.genericSpellHashtable, sonicId, 1);
    const isHoming = homingTicks > 0;
    const spinDashTicks = LoadInteger(Globals.genericSpellHashtable, sonicId, 8);
    const prevSpeedMagnitude = LoadReal(Globals.genericSpellHashtable, sonicId, 10);
    let lightSpeedTicks = LoadInteger(Globals.genericSpellHashtable, sonicId, 11);
    const superSonicTicks = LoadInteger(Globals.genericSpellHashtable, sonicId, 16);


    if (spinVal == 1) {
      SetUnitMoveSpeed(customHero.unit, 100);
    }

    if (GetOwningPlayer(customHero.unit) != player) {
      player = GetOwningPlayer(customHero.unit);
      playerId = GetPlayerId(player);
      if (playerForce) {
        ForceClear(playerForce);
        ForceAddPlayer(playerForce, GetOwningPlayer(customHero.unit));
        ShowTextTagForceBJ(true, textTag, playerForce);
      }
    }

    let magnitudeMax = magnitudeMaxBase;
    const lvl = GetHeroLevel(customHero.unit);
    const isUpg = lvl >= upgLevel;
    const isUpg2 = lvl >= upg2Level;


    if (isUpg) {
      magnitudeMax += magnitudeMaxUpg;
    }
    if (isUpg2) {
      magnitudeMax += magnitudeMaxUpg2;
    }

    if (spinVal == 0 && !isHoming) {
      magnitudeMax *= 0.1;
    }

    const percentHP = GetUnitStatePercent(customHero.unit, UNIT_STATE_LIFE, UNIT_STATE_MAX_LIFE);
    if (percentHP < magnitudeLowHPThreshold) {
      magnitudeMax *= ((percentHP + (100 - magnitudeLowHPThreshold)) * 0.01);
    }


    Globals.tmpVector2.setUnit(customHero.unit);

    const oldDist = CoordMath.distance(Globals.tmpVector2, oldPos);
    if (oldDist > speedResetDist) {
      moveDir.setPos(0, 0);
      Globals.customPlayers[playerId].orderPoint.setPos(0, 0);
    } else if (oldDist < moveDist) {
      CoordMath.multiply(moveDir, magnitudeLossStunned);
    }
    
    const isStunned = (
      UnitHelper.isUnitStunned(customHero.unit) 
      || IsUnitType(customHero.unit, UNIT_TYPE_ETHEREAL)
    );
    const isBadOrderPoint = (
      Globals.customPlayers[playerId].orderPoint.x == 0
      && Globals.customPlayers[playerId].orderPoint.y == 0
    );
    let dist = moveDist;
    if (isBadOrderPoint || isStunned) {
      dist = 0;
    } else if (spinVal == 1) {
      dist = moveDistSpin;
      if (isUpg) {
        dist += moveDistSpinUpg;
      }
      if (isUpg2) {
        dist += moveDistSpinUpg2;
      }
    }

    let addToMoveDir = true;
    let angle = CoordMath.angleBetweenCoords(
      Globals.tmpVector2,
      Globals.customPlayers[playerId].orderPoint
    );


    if (superSonicTicks > 0) {
      dist *= superSonicDistMult;
      magnitudeMax *= superSonicMagnitudeMult;

      SaveInteger(Globals.genericSpellHashtable, sonicId, 16, Math.max(0, superSonicTicks-1));
    }

    if (lightSpeedTicks > 0) {
      dist *= lightSpeedMult;
      magnitudeMax *= lightSpeedMult;

      SaveInteger(Globals.genericSpellHashtable, sonicId, 11, Math.max(0, lightSpeedTicks-1));
    }




    if (isHoming) {
      const homingX = LoadReal(Globals.genericSpellHashtable, sonicId, 2);
      const homingY = LoadReal(Globals.genericSpellHashtable, sonicId, 3);
      const homingAngle = LoadReal(Globals.genericSpellHashtable, sonicId, 4);
      const homingState = LoadInteger(Globals.genericSpellHashtable, sonicId, 5);
      const homingReForwardsTick = LoadInteger(Globals.genericSpellHashtable, sonicId, 6);
      magnitudeMax *= homingMagnitudeMaxMult;
      const homingMagnitude = Math.max(magnitudeMax * 0.25, prevSpeedMagnitude * homingMagnitudeMaxMult);
      addToMoveDir = false;
      Globals.tmpVector.setPos(homingX, homingY);

      if (homingState == 0) {
        if (
          CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) < homingMagnitude * 1.2
          || homingTicks < homingForwardsLatestTick
        ) {
          // homing impact
          moveDir.setPos(0, 0);
          CoordMath.polarProjectCoords(moveDir, moveDir, homingAngle + 180, homingMagnitude * 0.8);

          SaveInteger(Globals.genericSpellHashtable, sonicId, 5, 1);

          DestroyEffect(
            AddSpecialEffect(
              "BlueBigExplosion.mdl",
              GetUnitX(customHero.unit),
              GetUnitY(customHero.unit),
            )
          );

          const homingAttackSpellLevel = LoadInteger(Globals.genericSpellHashtable, sonicId, 7);

          AOEDamage.genericDealAOEDamage(
            Globals.tmpUnitGroup,
            customHero.unit,
            GetUnitX(customHero.unit),
            GetUnitY(customHero.unit),
            dmgAOE,
            homingAttackSpellLevel,
            customHero.spellPower,
            dmgHomingAttack,
            1.0,
            bj_HEROSTAT_INT
          );
        } else {
          // rush homing
          angle = CoordMath.angleBetweenCoords(
            Globals.tmpVector2,
            Globals.tmpVector
          );
          
          Globals.tmpVector.subtract(Globals.tmpVector2);
          moveDir.setVector(Globals.tmpVector);
        }
      }
      else if (homingState == 1) {
        moveDir.setPos(0, 0);
        CoordMath.polarProjectCoords(moveDir, moveDir, homingAngle + 180, homingMagnitude * 0.8);
        SaveInteger(Globals.genericSpellHashtable, sonicId, 6, homingReForwardsTick+1);

        if (homingReForwardsTick >= homingReversalDuration || homingTicks <= 2) {
          moveDir.setPos(0, 0);
          CoordMath.polarProjectCoords(moveDir, moveDir, homingAngle, homingMagnitude * 0.1);
          SaveInteger(Globals.genericSpellHashtable, sonicId, 5, 2);
        }
      } 
      else if (homingState == 2) {
        // do homing re-forwards
        angle = CoordMath.angleBetweenCoords(
          Globals.tmpVector2,
          Globals.customPlayers[playerId].orderPoint
        );
        dist *= 3;
        homingTicks = 1;
        addToMoveDir = true;
      }

      SaveInteger(Globals.genericSpellHashtable, sonicId, 1, Math.max(0, homingTicks-1));
    }



    if (spinDashTicks > 0) {
      SaveInteger(Globals.genericSpellHashtable, sonicId, 8, spinDashTicks-1);

      if (spinDashTicks == 1) {
        const spinDashLevel = LoadInteger(Globals.genericSpellHashtable, sonicId, 9);
        
        angle = CoordMath.angleBetweenCoords(
          Globals.tmpVector2,
          Globals.customPlayers[playerId].orderPoint
        );
        CoordMath.polarProjectCoords(moveDir, moveDir, angle, magnitudeMax * (0.4 + 0.06 * spinDashLevel));
      } else {
        dist = 0;
        angle = 0;
        CoordMath.multiply(moveDir, magnitudeLossSpinDash);
      }
    }

    if (addToMoveDir) {
      Globals.tmpVector.setPos(0, 0);
      CoordMath.polarProjectCoords(Globals.tmpVector, Globals.tmpVector, angle, dist);
      moveDir.add(Globals.tmpVector);
    }


    let currentSpeedMagnitude = CoordMath.magnitude(moveDir);
    if (currentSpeedMagnitude > magnitudeMax) {
      CoordMath.normalize(moveDir);
      CoordMath.multiply(moveDir, magnitudeMax);
      currentSpeedMagnitude = magnitudeMax;
    }
    if (spinDashTicks > 0) {
      currentSpeedMagnitude = prevSpeedMagnitude;
    } else {
      SaveReal(Globals.genericSpellHashtable, sonicId, 10, currentSpeedMagnitude);
    }

    if (UnitHelper.isUnitDead(customHero.unit)) {
      CoordMath.multiply(moveDir, 0);
      AddUnitAnimationProperties(customHero.unit, "alternate", false);
      SaveInteger(Globals.genericSpellHashtable, sonicId, 0, 0);
    } else {
      Globals.tmpVector2.add(moveDir);
      if (isStunned) {
        CoordMath.multiply(moveDir, magnitudeLossStunned);
      } else {
        
        let doMove = true;
        let wasMoved = false;
        
        const currentOrder = GetUnitCurrentOrder(customHero.unit);

        // not spinning and not attacking
        if (spinVal == 0) {
          if (currentOrder == OrderIds.ATTACK && !isHoming) {
            doMove = false;
          } else {
            // if too close to target, stop moving fast
            if (Globals.customPlayers[playerId].orderWidget != null) {
              Globals.tmpVector.setWidget(Globals.customPlayers[playerId].orderWidget!);
            } else {
              Globals.tmpVector.setVector(Globals.customPlayers[playerId].orderPoint);
            }
            if (CoordMath.distance(oldPos, Globals.tmpVector) < currentSpeedMagnitude) {
              doMove = false;
            }
          }
        }

        if (doMove) {
          if (
            counter >= counterMax
            && Globals.customPlayers[playerId].lastOrderId != OrderIds.STOP
          ) {
            if (Globals.customPlayers[playerId].orderWidget != null) {
              IssueTargetOrderById(
                customHero.unit, 
                Globals.customPlayers[playerId].lastOrderId,
                Globals.customPlayers[playerId].orderWidget!
              );
            } else {
              IssuePointOrderById(
                customHero.unit, 
                Globals.customPlayers[playerId].lastOrderId, 
                Globals.customPlayers[playerId].orderPoint.x,
                Globals.customPlayers[playerId].orderPoint.y 
              );
            }
            counter = 0;
          }
          ++counter;

          wasMoved = PathingCheck.moveGroundUnitToCoord(customHero.unit, Globals.tmpVector2);
        }



        if (spinVal == 1) {
          if (!wasMoved) {
            CoordMath.multiply(moveDir, magnitudeLossStuck);
          } else {
            SetUnitFacing(customHero.unit, angle);

            // spin damage
            let speedToMult = Math.max(0.1, currentSpeedMagnitude * dmgMagnitudeMult);
            if (currentSpeedMagnitude >= minMagnitudeBonus) {
              speedToMult *= bonusSpeedDmgMult;
            }
            speedToMult = Math.min(10, speedToMult);

            const spinLvl = Math.min(10, 1 + lvl / 10);
            AOEDamage.genericDealAOEDamage(
              Globals.tmpUnitGroup,
              customHero.unit,
              GetUnitX(customHero.unit),
              GetUnitY(customHero.unit),
              dmgAOE,
              spinLvl,
              customHero.spellPower,
              spinDmgDataMult,
              speedToMult,
              bj_HEROSTAT_INT
            );
          }
        }
      }
    }


    if (lightSpeedTicks > 0) {
      if (
        homingTicks <= 0
        && spinDashTicks <= 0
      ) {
        const lightSpeedX = LoadReal(Globals.genericSpellHashtable, sonicId, 12);
        const lightSpeedY = LoadReal(Globals.genericSpellHashtable, sonicId, 13);
        const lightSpeedAngle = LoadReal(Globals.genericSpellHashtable, sonicId, 14);
        const lightSpeedState = LoadInteger(Globals.genericSpellHashtable, sonicId, 15);
        if (lightSpeedState == 0) {
          // move forwards until reached destination
          // or can no longer move forwards
          GroupClear(Globals.tmpUnitGroup);
          GroupClear(Globals.tmpUnitGroup2);

          Globals.tmpVector.setPos(lightSpeedX, lightSpeedY);
          Globals.tmpVector3.setUnit(customHero.unit);
          
          let sfxCounter = 0;
          let distTravelled = 0;
          while (
            CoordMath.distance(Globals.tmpVector3, Globals.tmpVector) > lightSpeedOffset * 1.2
            && distTravelled < lightSpeedMaxDistTravelled
          ) {
            CoordMath.polarProjectCoords(Globals.tmpVector3, Globals.tmpVector3, lightSpeedAngle, lightSpeedOffset);
            distTravelled += lightSpeedOffset;

            // create sfx
            if (sfxCounter % 16 == 0) {
              const tmpLightSpeedDashSfx = AddSpecialEffect(
                "LaxusSpark.mdl",
                Globals.tmpVector3.x,
                Globals.tmpVector3.y
              );
              BlzSetSpecialEffectScale(tmpLightSpeedDashSfx, 3.0);
              BlzSetSpecialEffectTimeScale(tmpLightSpeedDashSfx, 0.5);
              DestroyEffect(tmpLightSpeedDashSfx);
            }
            sfxCounter++;

            GroupEnumUnitsInRange(
              Globals.tmpUnitGroup2,
              Globals.tmpVector3.x,
              Globals.tmpVector3.y,
              2*dmgAOE,
              null
            );
            ForGroup(Globals.tmpUnitGroup2, () => {
              if (!IsUnitInGroup(GetEnumUnit(), Globals.tmpUnitGroup)) {
                GroupAddUnit(Globals.tmpUnitGroup, GetEnumUnit());
              }
            });

            if (
              !PathingCheck.isFlyingWalkable(Globals.tmpVector3) 
              || PathingCheck.isDeepWater(Globals.tmpVector3)
            ) {
              distTravelled = lightSpeedMaxDistTravelled;
            }
          }

          PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(customHero.unit, Globals.tmpVector3);
          PathingCheck.unstuckGroundUnitFromCliff(customHero.unit, Globals.tmpVector3);

          AOEDamage.genericDealDamageToGroup(
            Globals.tmpUnitGroup,
            customHero.unit,
            GetUnitAbilityLevel(customHero.unit, Id.sonicLightSpeedDash),
            customHero.spellPower,
            dmgLightSpeed,
            1.0,
            bj_HEROSTAT_INT
          );

          
          SaveInteger(Globals.genericSpellHashtable, sonicId, 15, 1);

          DestroyEffect(
            AddSpecialEffect(
              "LightStrikeArray2.mdl",
              Globals.tmpVector3.x,
              Globals.tmpVector3.y
            )
          );
          DestroyEffect(
            AddSpecialEffect(
              "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
              Globals.tmpVector3.x,
              Globals.tmpVector3.y
            )
          );
          DestroyEffect(
            AddSpecialEffect(
              "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
              Globals.tmpVector3.x,
              Globals.tmpVector3.y
            )
          );
        }
      }
    }


    SetTextTagPos(textTag, Globals.tmpVector2.x, Globals.tmpVector2.y, 25);
    SetTextTagTextBJ(textTag, R2S(currentSpeedMagnitude), 10);

    oldPos.setUnit(customHero.unit);
  });
}




export function gutsPassive(customHero: CustomHero) {
  const rageBasePercentHp = 8;
  const rageLevelPercentHp = 0.8;
  const ragePunishPercent = 0.8;
  const berserkBasePercentHp = 12;
  const berserkLevelPercentHp = 1.2;
  const berserkPunishPercent = 0.7;

  const castTrigger = CreateTrigger();
  customHero.addPassiveTrigger(castTrigger);

  let key = 1;
  const slashKey = key++; // 1
  const cannonSlashKey = key++; // 2
  const cannonKey = key++; // 3
  const chargeKey = key++; // 4
  const rageKey = key++; // 5
  const armorKey = key++; // 6

  const rageHpKey = key++; // 7
  const rageTimerKey = key++; // 8
  const berserkHpKey = key++; // 9
  const berserkTimerKey = key++; // 10

  const beastTimer = CreateTimer();
  customHero.addTimer(beastTimer);

  TriggerRegisterUnitEvent(castTrigger, customHero.unit, EVENT_UNIT_SPELL_EFFECT);
  TriggerAddCondition(castTrigger, Condition(() => {
    const unit = GetTriggerUnit();
    if (unit == customHero.unit) {
      const unitId = GetHandleId(unit);
      const spellId = GetSpellAbilityId();
      const player = GetOwningPlayer(unit);

      switch (spellId) {
        case Id.gutsHeavySlash:
          SaveReal(
            Globals.genericSpellHashtable, 
            unitId, slashKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsCannonSlash:
          SaveReal(
            Globals.genericSpellHashtable, unitId, cannonSlashKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsRecklessCharge:
          SaveReal(
            Globals.genericSpellHashtable, unitId, chargeKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsRage:
          doGutsRage(
            customHero, unitId, 
            rageBasePercentHp, rageLevelPercentHp,
            GetUnitAbilityLevel(customHero.unit, spellId),
            ragePunishPercent,
            rageHpKey, rageTimerKey
          );
          SaveReal(
            Globals.genericSpellHashtable, unitId, rageKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsBerserkerArmor:
          SaveReal(
            Globals.genericSpellHashtable, unitId, armorKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsCannonArm:
          SaveReal(
            Globals.genericSpellHashtable, unitId, cannonKey, 
            GetUnitState(customHero.unit, UNIT_STATE_LIFE)
          );
          break;
        case Id.gutsHeavySlam:
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsHeavySlam, Id.gutsHeavySlash, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, slashKey, 0);
          break;
        case Id.gutsBurstingFlame:
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsBurstingFlame, Id.gutsCannonSlash, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, cannonSlashKey, 0);
          break;
        case Id.gutsRelentlessAssault:
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsRelentlessAssault, Id.gutsRecklessCharge, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, chargeKey, 0);
          break;
        case Id.gutsBerserk:
          doGutsRage(
            customHero, unitId, 
            berserkBasePercentHp, berserkLevelPercentHp,
            GetUnitAbilityLevel(customHero.unit, spellId),
            berserkPunishPercent,
            berserkHpKey, berserkTimerKey
          );
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsBerserk, Id.gutsRage, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, rageKey, 0);
          break;
        case Id.gutsBeastOfDarkness:
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsBeastOfDarkness, Id.gutsBerserkerArmor, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, armorKey, 0);
          break;
        case Id.gutsDragonCannonShot:
          UnitHelper.abilitySwap(
            player, customHero.unit, Id.gutsDragonCannonShot, Id.gutsCannonArm, 
            false, 0, true, true, false, false, false, 
          );
          SaveReal(Globals.genericSpellHashtable, unitId, cannonKey, 0);
          break;
      }
    }
    return false;
  }));


  const gutsTimer = CreateTimer();
  customHero.addTimer(gutsTimer);
  TimerStart(gutsTimer, 0.03, true, () => {
    const unitId = GetHandleId(customHero.unit);
    const player = GetOwningPlayer(customHero.unit);
    const currentHp = GetUnitState(customHero.unit, UNIT_STATE_LIFE);
    const reqHpLoss = 0.15 * GetUnitState(customHero.unit, UNIT_STATE_MAX_LIFE);

    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, slashKey, Id.gutsHeavySlash, Id.gutsHeavySlam);
    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, cannonSlashKey, Id.gutsCannonSlash, Id.gutsBurstingFlame);
    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, chargeKey, Id.gutsRecklessCharge, Id.gutsRelentlessAssault);
    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, rageKey, Id.gutsRage, Id.gutsBerserk);
    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, armorKey, Id.gutsBerserkerArmor, Id.gutsBeastOfDarkness);
    doGutsAbilitySwap(customHero, player, unitId, currentHp, reqHpLoss, cannonKey, Id.gutsCannonArm, Id.gutsDragonCannonShot);

    doGutsRagePunish(customHero, unitId, currentHp, rageHpKey, rageTimerKey);
    doGutsRagePunish(customHero, unitId, currentHp, berserkHpKey, berserkTimerKey);
  });
}

function doGutsRage(
  customHero: CustomHero,
  unitId: number,
  basePercentHp: number,
  levelPercentHp: number,
  level: number,
  punishPercent: number,
  hpKey: number,
  timerKey: number,
) {
  const percentHp = GetUnitLifePercent(customHero.unit);
  let bonusDmg = Math.min(50, 0.5 * Math.max(1, 100 - percentHp));
  if (bonusDmg > 0) {
    BlzSetUnitBaseDamage(customHero.unit, R2I(BlzGetUnitBaseDamage(customHero.unit, 0) + bonusDmg), 0);
  }

  let heal = basePercentHp + level * levelPercentHp;
  if (percentHp + heal > 100) {
    heal = 100 - percentHp;
  }
  SetUnitLifePercentBJ(customHero.unit, percentHp + heal);
  SaveReal(Globals.genericSpellHashtable, unitId, hpKey, heal * punishPercent);
  SaveReal(Globals.genericSpellHashtable, unitId, timerKey, 20);  
}

function doGutsRagePunish(customHero: CustomHero, unitId: number, currentHp: number, hpKey: number, timerKey: number) {
  let timer = LoadReal(Globals.genericSpellHashtable, unitId, timerKey);
  if (timer <= 0) return;
  
  timer = Math.max(0, timer - 0.03);
  if (currentHp <= 0) timer = 0;
  SaveReal(Globals.genericSpellHashtable, unitId, timerKey, timer);
  
  if (timer < 10) {
    const heal = LoadReal(Globals.genericSpellHashtable, unitId, hpKey);
    const percentHp = GetUnitLifePercent(customHero.unit);
    SetUnitLifePercentBJ(customHero.unit, Math.max(1, percentHp - heal * 0.1 * 0.03));
  }
}

function doGutsAbilitySwap(
  customHero: CustomHero,
  player: player,
  unitId: number,
  unitHp: number,
  reqHpLoss: number,
  key: number,
  srcAbilityId: number,
  destAbilityId: number,
) {
  const hp = LoadReal(Globals.genericSpellHashtable, unitId, key);
  if (hp <= 0) return;

  const cd = BlzGetUnitAbilityCooldownRemaining(customHero.unit, srcAbilityId);
  if (cd <= 0) {
    UnitHelper.abilitySwap(player, customHero.unit, destAbilityId, srcAbilityId);
    SaveReal(Globals.genericSpellHashtable, unitId, key, 0);
    return;
  }

  if (unitHp > hp) {
    SaveReal(Globals.genericSpellHashtable, unitId, key, unitHp);
  } else if (unitHp < hp - reqHpLoss) {
    UnitHelper.abilitySwap(player, customHero.unit, srcAbilityId, destAbilityId);
    SaveReal(Globals.genericSpellHashtable, unitId, key, 0);
  }
}


export function getJacoEliteBeamChargeString(
  currentTick: number,
  bonusTick: number,
  maxTick: number,
) {
  const max = 10;
  const currentIndex = Math.floor(max * (currentTick) / maxTick);
  const bonusIndex = Math.floor(max * (bonusTick) / maxTick);
  
  let str = "|cff00ffff";
  for (let i = 0; i < max; ++i) {
    if (i == bonusIndex + 1 && currentIndex < bonusIndex + 1) {
      str += "|cff00ff00";
    } else if (i == bonusIndex + 2 && currentIndex < bonusIndex + 2) {
      str += "|cff00ff00";
    } else if (i == currentIndex + 1 || i == bonusIndex + 3) {
      str += "|cffffffff";
    }
    
    str += "I";
  }
  return str;
}

export function jacoPassive(customHero: CustomHero) {
  const eliteBeamMaxTicks = 100;

  const eliteBeamTimer = CreateTimer();
  customHero.addTimer(eliteBeamTimer);

  const jacoId = GetHandleId(customHero.unit);

  const textTag = CreateTextTag();
  let isTextShown = false;
  let player = GetOwningPlayer(customHero.unit);
  let playerId = GetPlayerId(player);
  SetTextTagPermanent(textTag, true);
  SetTextTagVisibility(textTag, false);
  SetTextTagText(textTag, "IIIIIIIIII", 13);

  UnitAddAbility(customHero.unit, Id.jacoEliteBeamPrime);
  UnitAddAbility(customHero.unit, Id.jacoEliteBeamFire);

  TimerStart(eliteBeamTimer, 0.03, true, () => {
    if (GetUnitTypeId(customHero.unit) == 0) {
      DestroyTextTag(textTag);
      return;
    }

    if (player != GetOwningPlayer(customHero.unit)) {
      player = GetOwningPlayer(customHero.unit);
      playerId = GetPlayerId(player);
      SetTextTagVisibility(textTag, false);
    }

    const beamState = LoadInteger(Globals.genericSpellHashtable, jacoId, 0);
    if (beamState == 0) {
      if (isTextShown) {
        SetTextTagVisibility(textTag, false);
        isTextShown = false;
      }
      return;
    }

    const currentTick = LoadInteger(Globals.genericSpellHashtable, jacoId, 1);
    const bonusTick = LoadInteger(Globals.genericSpellHashtable, jacoId, 2);
    const beamStr = getJacoEliteBeamChargeString(currentTick, bonusTick, eliteBeamMaxTicks);
    // print(
    //   "tick:", 
    //   currentTick, 
    //   bonusTick,
    //   beamStr, 
    //   "|r"
    // );
    if (beamState == 1) {
      if (currentTick < eliteBeamMaxTicks) {
        SaveInteger(Globals.genericSpellHashtable, jacoId, 1, currentTick+1);
      } else {
        // primed
        SaveInteger(Globals.genericSpellHashtable, jacoId, 0, 2);
        SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, false);
        SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, false);
        SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, true);
        
        Globals.tmpVector.setUnit(customHero.unit);
        DestroyEffect(
          AddSpecialEffect(
            "SpiritBomb.mdl", 
            Globals.tmpVector.x, Globals.tmpVector.y
          )
        );
      }
    }

    if (!isTextShown) {
      if (player == GetLocalPlayer()) {
        SetTextTagVisibility(textTag, true);
      }
      isTextShown = true;
    }
    SetTextTagPos(textTag, GetUnitX(customHero.unit) - 256, GetUnitY(customHero.unit) - 128, 25);
    SetTextTagTextBJ(textTag, beamStr, 25);
  });
}

export function pecoPassive(customHero: CustomHero) {
  const heroId = GetUnitTypeId(customHero.unit);

  const bonusArmrTimer = CreateTimer();
  customHero.addTimer(bonusArmrTimer);

  TimerStart(bonusArmrTimer, 0.33, true, () => {
    if (GetUnitLifePercent(customHero.unit) < 50) {
      if (
        GetUnitAbilityLevel(customHero.unit, Id.pecorineArmr) > 0
        && GetUnitAbilityLevel(customHero.unit, Id.pecorineEatFlag) == 0
      ) {
        UnitRemoveAbility(customHero.unit, Id.pecorineArmr);
      }
    } else {
      UnitAddAbility(customHero.unit, Id.pecorineArmr);
    }
  });

  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);

  const passiveRatio = 0.001;

  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );

  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      const attacked = GetAttackedUnitBJ();
      // const attacker = GetEventDamageSource();
      // const attacked = BlzGetEventDamageTarget();
      if (
        GetUnitTypeId(attacker) == heroId &&
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit) && 
        IsUnitType(attacked, UNIT_TYPE_HERO)
      ) {
        const princesSwordLevel = GetUnitAbilityLevel(customHero.unit, Id.pecorinePrincessSword);
        if (princesSwordLevel > 0) {
          const dmg = (
            AOEDamage.getIntDamageMult(attacker) 
            * customHero.spellPower
            * princesSwordLevel * passiveRatio
            * Math.max(1, GetUnitState(customHero.unit, UNIT_STATE_LIFE))
          );
          UnitDamageTarget(
            attacker, 
            attacked, 
            dmg, 
            true, 
            false, 
            ATTACK_TYPE_HERO, 
            DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WHOKNOWS
          );
  
          const attackSfx = AddSpecialEffect(
            "Abilities/Weapons/VengeanceMissile/VengeanceMissile.mdl",
            GetUnitX(attacked),
            GetUnitY(attacked),
          );
          BlzSetSpecialEffectScale(attackSfx, 2.0);
          DestroyEffect(attackSfx);

          SetUnitManaPercentBJ(
            attacker, 
            GetUnitManaPercent(attacker) + princesSwordLevel * passiveRatio * 100
          );
        }
      }
      return false;
    })
  );
}

export function linkPassive(customHero: CustomHero) {
  const heroId = GetUnitTypeId(customHero.unit);

  const timer = CreateTimer();
  customHero.addTimer(timer);

  const onHitAbility = customHero.getAbility(AbilityNames.Link.MASTER_SWORD_ON_HIT);
  
  const abilReadyKey = StringHash("rasengan_ready");
  const abilSfxKey = StringHash("rasengan_sfx");
  SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, false);

  TimerStart(timer, 0.04, true, () => {
    const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey);
    if (
      !isReady
      && onHitAbility.currentCd == 0
      && onHitAbility.currentTick == 0
    ) {
      // const sfx = AddSpecialEffectTarget(
      //   "Radiance_Royal.mdl", customHero.unit, "right hand"
      // );
      // const sfx = AddSpecialEffectTarget(
      //   "Radiance_Royal.mdl", customHero.unit, "origin"
      // );
      const sfx = AddSpecialEffect(
        "Radiance_Royal.mdl", GetUnitX(customHero.unit), GetUnitY(customHero.unit)
      );
      SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, true);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey, sfx);
    } else if (isReady) {
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey);
      if (sfx) {
        BlzSetSpecialEffectX(sfx, GetUnitX(customHero.unit));
        BlzSetSpecialEffectY(sfx, GetUnitY(customHero.unit));
      }
    }
  });

  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
  const targetPos = new Vector2D();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      if (attacker != customHero.unit) return false;
      const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey);
      if (!isReady) return false;

      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey);
      if (sfx) DestroyEffect(sfx);
      SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, false);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey, null);
      
      const target = GetTriggerUnit();
      targetPos.setUnit(target);

      const input = new CustomAbilityInput(
        Id.mightGuyDynamicEntry,
        customHero, 
        GetOwningPlayer(customHero.unit),
        Math.min(10, Math.max(1, GetHeroLevel(customHero.unit) * 0.03)),
        targetPos,
        targetPos,
        targetPos,
        target,
        target,
      );

      if (customHero.canCastAbility(onHitAbility.name, input)) {
        if (Globals.showAbilityFloatingText) {
          TextTagHelper.showPlayerColorTextOnUnit(
            onHitAbility.name, 
            GetPlayerId(GetOwningPlayer(customHero.unit)), 
            customHero.unit
          );
        }
        customHero.useAbility(onHitAbility.name, input);
      }
      
      return false;
    })
  );
}

export function ainzPassive(customHero: CustomHero) {
  const mpCostPct = 0.23;
  const mpCostNonOffensivePct = 0.03;
  const mpCostTickRate = 0.2;
  const mpCostDefensiveRatio = 0.5;
  
  const mpCostTimer = CreateTimer();
  customHero.addTimer(mpCostTimer);

  const offensiveSpells = [
    BlzGetUnitAbility(customHero.unit, Id.ainzRealitySlash),
    BlzGetUnitAbility(customHero.unit, Id.ainzBlackHole),
    BlzGetUnitAbility(customHero.unit, Id.ainzGreaterThunder),
    BlzGetUnitAbility(customHero.unit, Id.ainzExplodeMine),
    BlzGetUnitAbility(customHero.unit, Id.ainzEnergyDrain),
    BlzGetUnitAbility(customHero.unit, Id.ainzGraspHeart),
    BlzGetUnitAbility(customHero.unit, Id.ainzWallOfSkeleton),
    BlzGetUnitAbility(customHero.unit, Id.ainzHoldOfRibs),
  ];

  const defensiveSpells = [
    BlzGetUnitAbility(customHero.unit, Id.ainzPerfectUnknowable),
    BlzGetUnitAbility(customHero.unit, Id.ainzRemoteViewing),
    BlzGetUnitAbility(customHero.unit, Id.ainzGreaterTeleportation),
    BlzGetUnitAbility(customHero.unit, Id.ainzGate),
    BlzGetUnitAbility(customHero.unit, Id.ainzBodyOfEffulgentBeryl),
    BlzGetUnitAbility(customHero.unit, Id.ainzGreaterHardening),
    BlzGetUnitAbility(customHero.unit, Id.ainzGreaterFullPotential),
    BlzGetUnitAbility(customHero.unit, Id.ainzGreaterMagicShield),
    BlzGetUnitAbility(customHero.unit, Id.ainzMagicBoost),
    BlzGetUnitAbility(customHero.unit, Id.ainzPenetrateUp),
  ];

  let isAddSummon = false;
  let isAddSpecial = false;

  TimerStart(mpCostTimer, mpCostTickRate, true, () => {
    if (UnitHelper.isUnitAlive(customHero.unit)) {
      const maxMana = GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA);
      const lifePct = GetUnitLifePercent(customHero.unit) * 0.01;
      const offensiveManaCost = R2I(maxMana * mpCostPct);
      const defensiveManaCost = Math.max(
        R2I(maxMana * mpCostNonOffensivePct), 
        R2I(mpCostDefensiveRatio * offensiveManaCost * (1 - lifePct))
      );

      for (const abil of offensiveSpells) {
        BlzSetAbilityIntegerLevelField(abil, ABILITY_ILF_MANA_COST, 0, offensiveManaCost);
      }

      for (const abil of defensiveSpells) {
        BlzSetAbilityIntegerLevelField(abil, ABILITY_ILF_MANA_COST, 0, defensiveManaCost);
      }

      if (!isAddSummon && GetUnitAbilityLevel(customHero.unit, Id.ainzSummonAlbedo) > 0) {
        isAddSummon = true;
        offensiveSpells.push(
          BlzGetUnitAbility(customHero.unit, Id.ainzSummonAlbedo),
          BlzGetUnitAbility(customHero.unit, Id.ainzSummonShalltear),
          BlzGetUnitAbility(customHero.unit, Id.ainzSummonDemiurge),
          BlzGetUnitAbility(customHero.unit, Id.ainzSummonPandora),
        );
      }
      if (!isAddSpecial && GetUnitAbilityLevel(customHero.unit, Id.ainzTGOALID) > 0) {
        isAddSpecial = true;
        offensiveSpells.push(
          BlzGetUnitAbility(customHero.unit, Id.ainzTGOALID),
          BlzGetUnitAbility(customHero.unit, Id.ainzFallenDown),
          BlzGetUnitAbility(customHero.unit, Id.ainzLaShubNiggurath),
          BlzGetUnitAbility(customHero.unit, Id.ainzTimeStop),
        );
      }
    }
  });
}

export function demiurgePassive(customHero: CustomHero) {
  const heroUnitTypeId = GetUnitTypeId(customHero.unit);
  const hellfireMantleSP = 0.15;
  const hellfireMantleManaDrain = 0.015;
  const hellfireMantleDmgBlockPct = 0.25;
  const hellfireMantleTickRate = 0.03;
  const hellfireMantleDmgAOE = 300;
  const hellfireMantleDmgDataMult = BASE_DMG.KAME_DPS * 1.5 * hellfireMantleTickRate;

  const hellfireMantleTimer = CreateTimer();
  customHero.addTimer(hellfireMantleTimer);

  let mantleState = 0;
  let oldHp = 0;
  let hellfireSfx = null;
  let dummyUnit = null;
  TimerStart(hellfireMantleTimer, hellfireMantleTickRate, true, () => {
    if (mantleState == 0) {
      if (GetUnitAbilityLevel(customHero.unit, Id.demiurgeHellfireMantle) == 2) {
        // do hellfire
        mantleState = 1;
        oldHp = GetUnitState(customHero.unit, UNIT_STATE_LIFE);
        customHero.addSpellPower(hellfireMantleSP);
        hellfireSfx = AddSpecialEffectTarget(
          "Abilities/Spells/Other/ImmolationRed/ImmolationRedTarget.mdl", 
          customHero.unit, "origin"
        );
        dummyUnit = CreateUnit(
          GetOwningPlayer(customHero.unit), 
          Constants.dummyCasterId, 
          GetUnitX(customHero.unit), GetUnitY(customHero.unit), 
          0
        );
        UnitAddAbility(dummyUnit, DebuffAbilities.DEMIURGE_HELLFIRE_1);

        SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Voice/Demiurge/HellfireMantle.mp3", 2300);
        DestroyEffect(
          AddSpecialEffect(
            "Abilities/Spells/Other/Doom/DoomTarget.mdl", 
            GetUnitX(customHero.unit), GetUnitY(customHero.unit)
          )
        );
      }
    }

    if (mantleState == 1) {
      if (
        UnitHelper.isUnitDead(customHero.unit)
        || GetUnitAbilityLevel(customHero.unit, Id.demiurgeHellfireMantle) == 1
        || GetUnitManaPercent(customHero.unit) < hellfireMantleManaDrain
      ) {
        mantleState = 2;
      } else {
        const currentMana = GetUnitState(customHero.unit, UNIT_STATE_MANA);
        const maxMana = GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA);
        let mpDrain = maxMana * hellfireMantleManaDrain * hellfireMantleTickRate;

        const newHp = GetUnitState(customHero.unit, UNIT_STATE_LIFE);
        const hpDiff = oldHp - newHp;
        if (hpDiff < 0) {
          oldHp = newHp;
        } else {
          const hpToHeal = Math.min(
            GetUnitState(customHero.unit, UNIT_STATE_MANA) - mpDrain,
            hpDiff * hellfireMantleDmgBlockPct
          );
          mpDrain += hpToHeal;
          SetUnitState(customHero.unit, UNIT_STATE_LIFE, newHp + hpToHeal);
          oldHp = newHp + hpToHeal;
        }
        SetUnitState(customHero.unit, UNIT_STATE_MANA, currentMana - mpDrain);

        AOEDamage.genericDealAOEDamage(
          Globals.tmpUnitGroup,
          customHero.unit,
          GetUnitX(customHero.unit),
          GetUnitY(customHero.unit),
          hellfireMantleDmgAOE,
          10,
          customHero.spellPower,
          hellfireMantleDmgDataMult,
          1.0,
          bj_HEROSTAT_INT
        );

        ForGroup(Globals.tmpUnitGroup, () => {
          const target = GetEnumUnit();
          if (UnitHelper.isUnitTargetableForPlayer(target, GetOwningPlayer(customHero.unit), false)) {
            IssueTargetOrderById(dummyUnit, OrderIds.FAERIE_FIRE, target);
          }
        });
        GroupClear(Globals.tmpUnitGroup);
      }
    }

    if (mantleState == 2) {
      mantleState = 0;
      oldHp = 0;
      customHero.removeSpellPower(hellfireMantleSP);
      DestroyEffect(hellfireSfx);
      RemoveUnit(dummyUnit);
      SetUnitAbilityLevel(customHero.unit, Id.demiurgeHellfireMantle, 1);
      SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Voice/Demiurge/HellfireMantle2.mp3", 1500);
    }
  });

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
      const attacked = GetAttackedUnitBJ();
      // const attacker = GetEventDamageSource();
      // const attacked = BlzGetEventDamageTarget();
      if (
        GetUnitTypeId(attacker) == heroUnitTypeId &&
        GetOwningPlayer(attacker) == GetOwningPlayer(customHero.unit) && 
        IsUnitType(attacked, UNIT_TYPE_HERO)
      ) {
        if (GetUnitAbilityLevel(attacked, Buffs.DEMIURGE_HELLFIRE_1) > 0) {
          const castDummy = CreateUnit(
            GetOwningPlayer(customHero.unit), 
            Constants.dummyCasterId, 
            GetUnitX(attacked), GetUnitY(attacked), 
            0
          );
          UnitAddAbility(castDummy, DebuffAbilities.DEMIURGE_HELLFIRE_2);
          IssueTargetOrderById(castDummy, OrderIds.FAERIE_FIRE, attacked);
          RemoveUnit(castDummy);
        }
      }
      return false;
    })
  );
}

export function vegetaMajinPassive(customHero: CustomHero) {
  const mpCostTickRate = 0.1;
  
  const mpCostTimer = CreateTimer();
  customHero.addTimer(mpCostTimer);

  const data = [
    { 
      id: Id.vegetaMajinGalickGun,
      manaCost: 10
    },
    { 
      id: Id.vegetaMajinGalaxyBreaker,
      manaCost: 15
    },
    { 
      id: Id.vegetaMajinBigBangAttack2,
      manaCost: 15
    },
    { 
      id: Id.vegetaMajinFinalFlash,
      manaCost: 30
    },
    { 
      id: Id.vegetaMajinGalaxyDonut,
      manaCost: 15
    },
    { 
      id: Id.vegetaMajinFinalExplosion,
      manaCost: 200
    },
  ];

  TimerStart(mpCostTimer, mpCostTickRate, true, () => {
    if (UnitHelper.isUnitAlive(customHero.unit)) {
      const maxMana = GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA);
      const manaCostPct = R2I(maxMana * 0.01);

      for (const x of data) {
        const lvl = GetUnitAbilityLevel(customHero.unit, x.id);
        let lvlSet = lvl;
        if (lvl > 0) {
          if (x.id == Id.vegetaMajinGalaxyBreaker) {
            lvlSet = 10;
          }
          BlzSetAbilityIntegerLevelField(
            BlzGetUnitAbility(customHero.unit, x.id), 
            ABILITY_ILF_MANA_COST, 
            lvl-1, 
            R2I(x.manaCost * manaCostPct * lvlSet * 0.1)
          );
        }
      }
    }
  });
}

export function minatoPassive(customHero: CustomHero) {
  const heroId = GetHandleId(customHero.unit);

  const timer = CreateTimer();
  customHero.addTimer(timer);

  const onHitAbility = customHero.getAbility(AbilityNames.Minato.RASENGAN_ON_HIT);
  
  const rasenganReadyKey = StringHash("rasengan_ready");
  const rasenganSfxKey = StringHash("rasengan_sfx");
  SaveBoolean(Globals.genericSpellHashtable, heroId, rasenganReadyKey, false);

  TimerStart(timer, 0.25, true, () => {
    const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, rasenganReadyKey);
    if (
      !isReady
      && onHitAbility.currentCd == 0
      && onHitAbility.currentTick == 0
      && GetUnitState(customHero.unit, UNIT_STATE_MANA) > onHitAbility.costAmount
    ) {
      const sfx = AddSpecialEffectTarget(
        "Rasengan4.mdl", customHero.unit, "right hand"
      );
      SaveBoolean(Globals.genericSpellHashtable, heroId, rasenganReadyKey, true);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, rasenganSfxKey, sfx);
    }
  });

  
  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
  const targetPos = new Vector2D();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      if (attacker != customHero.unit) return false;
      const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, rasenganReadyKey);
      if (!isReady) return false;

      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, heroId, rasenganSfxKey);
      if (sfx) DestroyEffect(sfx);
      SaveBoolean(Globals.genericSpellHashtable, heroId, rasenganReadyKey, false);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, rasenganSfxKey, null);
      
      const target = GetTriggerUnit();
      targetPos.setUnit(target);

      const input = new CustomAbilityInput(
        Id.minatoKunai,
        customHero, 
        GetOwningPlayer(customHero.unit),
        Math.min(10, Math.max(1, GetHeroLevel(customHero.unit) * 0.03)),
        targetPos,
        targetPos,
        targetPos,
        target,
        target,
      );

      if (customHero.canCastAbility(onHitAbility.name, input)) {
        // if (Globals.showAbilityFloatingText) {
        //   TextTagHelper.showPlayerColorTextOnUnit(
        //     onHitAbility.name, 
        //     GetPlayerId(GetOwningPlayer(customHero.unit)), 
        //     customHero.unit
        //   );
        // }
        if (Math.random() * 100 < 25) {
          SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Voice/Minato/Rasengan.mp3", 600);
        }
        customHero.useAbility(onHitAbility.name, input);
      }
      
      return false;
    })
  );
}

export function mightGuyPassive(customHero: CustomHero) {
  const heroId = GetHandleId(customHero.unit);

  const timer = CreateTimer();
  customHero.addTimer(timer);

  const onHitAbility = customHero.getAbility(AbilityNames.MightGuy.STRONG_FIST);
  
  const abilReadyKey = StringHash("rasengan_ready");
  const abilSfxKey = StringHash("rasengan_sfx");
  SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, false);

  TimerStart(timer, 0.25, true, () => {
    const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey);
    if (
      !isReady
      && onHitAbility.currentCd == 0
      && onHitAbility.currentTick == 0
    ) {
      const sfx = AddSpecialEffectTarget(
        "Radiance_Silver.mdl", customHero.unit, "right hand"
      );
      SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, true);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey, sfx);
    }
  });

  const onHitTrigger = CreateTrigger();
  customHero.addPassiveTrigger(onHitTrigger);
  const targetPos = new Vector2D();
  TriggerRegisterAnyUnitEventBJ(
    onHitTrigger,
    EVENT_PLAYER_UNIT_ATTACKED,
  );
  TriggerAddCondition(
    onHitTrigger,
    Condition(() => {
      const attacker = GetAttacker();
      if (attacker != customHero.unit) return false;
      const isReady = LoadBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey);
      if (!isReady) return false;

      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey);
      if (sfx) DestroyEffect(sfx);
      SaveBoolean(Globals.genericSpellHashtable, heroId, abilReadyKey, false);
      SaveEffectHandle(Globals.genericSpellHashtable, heroId, abilSfxKey, null);
      
      const target = GetTriggerUnit();
      targetPos.setUnit(target);

      const input = new CustomAbilityInput(
        Id.mightGuyDynamicEntry,
        customHero, 
        GetOwningPlayer(customHero.unit),
        Math.min(10, Math.max(1, GetHeroLevel(customHero.unit) * 0.03)),
        targetPos,
        targetPos,
        targetPos,
        target,
        target,
      );

      if (customHero.canCastAbility(onHitAbility.name, input)) {
        // if (Globals.showAbilityFloatingText) {
        //   TextTagHelper.showPlayerColorTextOnUnit(
        //     onHitAbility.name, 
        //     GetPlayerId(GetOwningPlayer(customHero.unit)), 
        //     customHero.unit
        //   );
        // }
        customHero.useAbility(onHitAbility.name, input);
      }
      
      return false;
    })
  );
}

export function genosPassive(customHero: CustomHero) {
  const heroId = GetUnitTypeId(customHero.unit);
  const overchargeSPPerSecond = 0.05;
  const overchargeMaxSP = 0.2;
  const overchargeManaDrain = 0.05;
  const overchargeTickRate = 0.03;
  const bonusMs = 5;

  const overchargeTimer = CreateTimer();
  customHero.addTimer(overchargeTimer);

  const overChargeAbil = customHero.getAbility(AbilityNames.Genos.OVERCHARGE);

  let tempMultDelay = 0;
  let overchargeState = 0;
  let overchargeTempSP = 0;
  let overchargeSfx = null;
  TimerStart(overchargeTimer, overchargeTickRate, true, () => {
    if (overchargeState == 0) {
      if (overChargeAbil.isInUse()) {
        overChargeAbil.endAbility();
      }
      if (GetUnitAbilityLevel(customHero.unit, Id.genosOvercharge) == 2) {
        // do overcharge
        overchargeState = 1;
        overchargeTempSP = 0;
        overchargeSfx = AddSpecialEffectTarget(
          "GEHLightningOrb.mdl", 
          customHero.unit, "origin"
        );
        DestroyEffect(
          AddSpecialEffect(
            "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl", 
            GetUnitX(customHero.unit), GetUnitY(customHero.unit)
          )
        );
      }
    }

    if (overchargeState == 1) {
      if (
        UnitHelper.isUnitDead(customHero.unit)
        || GetUnitAbilityLevel(customHero.unit, Id.genosOvercharge) == 1
        || GetUnitManaPercent(customHero.unit) < overchargeManaDrain
      ) {
        overchargeState = 2;
      } else {
        const currentMana = GetUnitState(customHero.unit, UNIT_STATE_MANA);
        const maxMana = GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA);
        const mpDrain = maxMana * overchargeManaDrain * overchargeTickRate;
        SetUnitState(customHero.unit, UNIT_STATE_MANA, currentMana - mpDrain);

        if (overchargeTempSP < overchargeMaxSP) {
          customHero.removeSpellPower(overchargeTempSP);
          overchargeTempSP = Math.min(
            overchargeMaxSP,
            overchargeTempSP + overchargeSPPerSecond * overchargeTickRate
          );
          customHero.addSpellPower(overchargeTempSP);
        }
      }
    }

    if (overchargeState == 2) {
      overChargeAbil.endAbility();
      overchargeState = 0;
      customHero.removeSpellPower(overchargeTempSP);
      overchargeTempSP = 0;
      DestroyEffect(overchargeSfx);
      SetUnitAbilityLevel(customHero.unit, Id.genosOvercharge, 1);
    }

    if (GetUnitLifePercent(customHero.unit) > 99) {
      if (tempMultDelay == 0) {
        udg_StatMultUnit = customHero.unit;
        udg_MoroStatMultReal = 0.25;
        TriggerExecute(gg_trg_Moro_Modify_Temp_Mult);
      }
      tempMultDelay = (tempMultDelay+1) % 33;
    }
  });
}


export function tatsumakiPassive(customHero: CustomHero) {
  const maxDist = 2400;
  const minSpeed = 5;
  const distScaledSpeed = 45;
  const bonusSpeedRatio = 2;
  const vectorAOE = 200;
  const vectorManaCostPct = 0.03;
  const shieldHpThresholdPct = 70;

  const caster = customHero.unit;
  const casterId = GetHandleId(caster);
  const vectorKey = StringHash("tatsumaki_vector");
  const vectorXSourceKey = StringHash("tatsumaki_vector_x_source");
  const vectorYSourceKey = StringHash("tatsumaki_vector_y_source");
  const vectorXTargetKey = StringHash("tatsumaki_vector_x_target");
  const vectorYTargetKey = StringHash("tatsumaki_vector_y_target");
  const vectorAngKey = StringHash("tatsumaki_vector_ang");
  const vectorDistKey = StringHash("tatsumaki_vector_dist");
  const vectorSfxKey = StringHash("tatsumaki_vector_sfx");
  const vectorSfx1Key = StringHash("tatsumaki_vector_sfx_1");
  const vectorSfx2Key = StringHash("tatsumaki_vector_sfx_2");
  const vectorStop = StringHash("tatsumaki_vector_stop");

  const vectorTimer = CreateTimer();
  customHero.addTimer(vectorTimer);
  
  const shieldAbility = customHero.getAbility(AbilityNames.Tatsumaki.TELEKINETIC_SHIELD);

  const targetPos = new Vector2D();
  const seenGroup = CreateGroup(); // leaks
  let isSeen = false;
  TimerStart(vectorTimer, 0.03, true, () => {
    if (
      !shieldAbility.isOnCooldown()
      && UnitHelper.isUnitAlive(customHero.unit)
      && GetUnitLifePercent(customHero.unit) < shieldHpThresholdPct
    ) {
      const input = new CustomAbilityInput(
        Id.tatsumakiCompress,
        customHero, 
        GetOwningPlayer(customHero.unit),
        10,
        targetPos,
        targetPos,
        targetPos,
        customHero.unit,
        customHero.unit,
      );

      if (customHero.canCastAbility(shieldAbility.name, input)) {
        if (Globals.showAbilityFloatingText) {
          TextTagHelper.showPlayerColorTextOnUnit(
            shieldAbility.name, 
            GetPlayerId(GetOwningPlayer(customHero.unit)), 
            customHero.unit
          );
        }
        customHero.useAbility(shieldAbility.name, input);
        if (GetUnitLifePercent(customHero.unit) < shieldHpThresholdPct * 0.5) {
          SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Voice/Tatsumaki/Oh.mp3", 400);
        } else {
          SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Voice/Tatsumaki/BarelyAnAttack.mp3", 2100);
        }
      }
    }

    // vector
    const vectorState = LoadInteger(Globals.genericSpellHashtable, casterId, vectorKey);
    const vectorStopState = LoadBoolean(Globals.genericSpellHashtable, casterId, vectorStop);

    if (vectorStopState) {
      // force deactivation
      SaveBoolean(Globals.genericSpellHashtable, casterId, vectorStop, false);
      SaveInteger(Globals.genericSpellHashtable, casterId, vectorKey, 0);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorXSourceKey, 0);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorYSourceKey, 0);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorXTargetKey, 0);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorYTargetKey, 0);
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey);
      if (sfx) BlzSetSpecialEffectScale(sfx, 0.01);
      const sfx1 = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx1Key);
      if (sfx1) BlzSetSpecialEffectScale(sfx1, 0.01);
      const sfx2 = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx2Key);
      if (sfx2) BlzSetSpecialEffectScale(sfx2, 0.01);
      return;
    }

    if (vectorState == 1) {
      if (isSeen) GroupClear(seenGroup);
      isSeen = false;
      return;
    }
    const sourceX = LoadReal(Globals.genericSpellHashtable, casterId, vectorXSourceKey);
    const sourceY = LoadReal(Globals.genericSpellHashtable, casterId, vectorYSourceKey);
    const targetX = LoadReal(Globals.genericSpellHashtable, casterId, vectorXTargetKey);
    const targetY = LoadReal(Globals.genericSpellHashtable, casterId, vectorYTargetKey);
    if (sourceX == 0 && sourceY == 0 && targetX == 0 && targetY == 0) return;

    if (GetUnitManaPercent(customHero.unit) >= vectorManaCostPct * 100 && !vectorStopState) {
      UnitHelper.payMPPercentCost(caster, vectorManaCostPct * 0.03, UNIT_STATE_MAX_MANA);
    } else {
      SaveBoolean(Globals.genericSpellHashtable, casterId, vectorStop, true);
      return;
    }

    const ang = LoadReal(Globals.genericSpellHashtable, casterId, vectorAngKey);
    const dist = LoadReal(Globals.genericSpellHashtable, casterId, vectorDistKey);
    
    const player = GetOwningPlayer(customHero.unit);

    const speed = minSpeed + (1 - dist / maxDist) * distScaledSpeed;
    const intervals = Math.floor(dist / speed);
    Globals.tmpVector.setPos(sourceX, sourceY);

    GroupClear(Globals.tmpUnitGroup2);
    for (let i = 0; i < intervals; ++i) {
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, speed);
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        Globals.tmpVector.x, Globals.tmpVector.y, 
        vectorAOE, null
      );
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (
          !UnitHelper.isUnitTargetableForPlayer(unit, player, true)
          || IsUnitInGroup(unit, Globals.tmpUnitGroup2)
        ) return;
        if (
          !IsUnitInGroup(unit, seenGroup) 
          && SimpleSpellSystem.isUnitTatsumakiBeam(unit)
          && GetOwningPlayer(unit) == player
        ) {
          isSeen = true;
          SimpleSpellSystem.doTatsumakiBeamGroupReset(unit);
          GroupAddUnit(seenGroup, unit);
        }
        SimpleSpellSystem.doTatsumakiMoveBeam(
          unit, 
          speed, bonusSpeedRatio, 
          ang, 
          Globals.tmpVector2, 
          Globals.tmpVector3,
          Globals.tmpUnitGroup3
        );
        GroupAddUnit(Globals.tmpUnitGroup2, unit);
      });
    }
    GroupClear(Globals.tmpUnitGroup2);
  });
}

export function setupRegenTimer(customHero: CustomHero) {
  const regenTimer = CreateTimer();
  customHero.addTimer(regenTimer);

  TimerStart(regenTimer, Constants.REGEN_TICK_RATE, true, () => {
    // regen: 3 stam per 1 second
    const heroStr = GetHeroStr(customHero.unit, true);
    const heroAgi = GetHeroAgi(customHero.unit, true);
    const heroInt = GetHeroInt(customHero.unit, true);
    const sumStats = 0.33 * (heroStr + heroAgi + heroInt);

    const unitTypeId = GetUnitTypeId(customHero.unit);

    const guyGateLvl = GetUnitAbilityLevel(customHero.unit, Id.mightGuyGateArmor);
    const hasBuuFat = UnitHasItemOfTypeBJ(customHero.unit, ItemConstants.SagaDrops.MAJIN_BUU_FAT);
    const hasSuper17Gen = UnitHasItemOfTypeBJ(customHero.unit, ItemConstants.SagaDrops.SUPER_17_GENERATOR);

    // agi has flat 3 regen
    let spAgi = Math.max(
      Constants.STAMINA_REGEN_MULT_MIN_BONUS,
      Math.min(
        Constants.STAMINA_REGEN_MULT_MAX_BONUS,
        heroAgi / sumStats
      )
    );
    spAgi = Pow(spAgi, Constants.AGILITY_REGEN_EXPONENT);
    
    let spMult = 1.0;
    if (GetUnitAbilityLevel(customHero.unit, Id.itemHealingBuff) > 0) {
      spMult += 1;
    }
    if (unitTypeId == Id.saitama) {
      spMult += Constants.SAITAMA_PASSIVE_STAMINA_BONUS_MULT;
    } 
    if (GetUnitAbilityLevel(customHero.unit, Buffs.OMEGA_SHENRON_ENVOY_AGI_PASSIVE) > 0) {
      spMult += Constants.OMEGA_SHENRON_PASSIVE_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.MIGHT_GUY_SUNSET_OF_YOUTH_AURA)) {
      spMult += Constants.MIGHT_GUY_SUNSET_OF_YOUTH_REGEN_MULT;
    }
    if (guyGateLvl > 1) {
      spMult += Constants.MIGHT_GUY_GATE_SP_MULTS[guyGateLvl-1]
    }
    if (GetUnitAbilityLevel(customHero.unit, Id.genosOvercharge) == 2) {
      spMult += Constants.GENOS_OVERCHARGE_REGEN_MULT;
    }
    const incSp = (
      Constants.REGEN_TICK_RATE
      * Constants.BASE_SP_REGEN 
      * spAgi * spMult
    );
    customHero.setCurrentSP(customHero.getCurrentSP() + incSp);
    



    // hp, 1 agi gives 0.05 hp regen
    let incHp = 0;
    let hpMult = 1.0;
    let hpAgi = Pow(heroAgi / heroStr, Constants.AGILITY_REGEN_EXPONENT);
    if (GetUnitAbilityLevel(customHero.unit, Buffs.OMEGA_SHENRON_ENVOY_AGI_PASSIVE) > 0) {
      hpMult += Constants.OMEGA_SHENRON_PASSIVE_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Id.zamasuImmortality) > 0) {
      hpMult += Constants.ZAMASU_PASSIVE_HP_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.ALBEDO_GUARDIAN_AURA) > 0) {
      hpMult += Constants.ALBEDO_GUARDIAN_AURA_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.LIFE_REGENERATION_AURA) > 0) {
      hpMult += Constants.FOUNTAIN_REGEN_MULT;
    }
    if (guyGateLvl > 1) {
      const pctLife = GetUnitLifePercent(customHero.unit);
      if (pctLife > Constants.MIGHT_GUY_GATE_HP_THRESHOLD[guyGateLvl-1]) {
        // drain 33% hp per second when above threshold
        const drainPct = 0.33;
        incHp -= (
          Constants.REGEN_TICK_RATE
          * GetUnitState(customHero.unit, UNIT_STATE_MAX_LIFE) 
          * drainPct
        );
      } else {
        // increase hpMult when below
        hpMult += Constants.MIGHT_GUY_GATE_HP_MULTS[guyGateLvl-1];
      }
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.NUOVA_HEAT_ARMOR) > 0) {
      hpMult += Constants.NUOVA_HEAT_ARMOR_HP_MULT;
    }
    if (hasSuper17Gen) {
      hpMult += Constants.SUPER_17_GEN_REGEN_MULT;
    }
    incHp += (
      Constants.REGEN_TICK_RATE
      * GetUnitState(customHero.unit, UNIT_STATE_MAX_LIFE) 
      * Constants.BASE_HP_REGEN_PCT
      * hpAgi * hpMult
    );
    SetUnitState(
      customHero.unit, UNIT_STATE_LIFE, 
      Math.max(1, GetUnitState(customHero.unit, UNIT_STATE_LIFE) + incHp)
    );


    // 1 agi gives 0.1 mana regen
    let mpAgi = Pow(heroAgi / heroInt, Constants.AGILITY_REGEN_EXPONENT);
    let mpMult = 1.0;
    if (GetUnitAbilityLevel(customHero.unit, Buffs.OMEGA_SHENRON_ENVOY_AGI_PASSIVE) > 0) {
      mpMult += Constants.OMEGA_SHENRON_PASSIVE_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.INNER_FIRE_AINZ_MAGIC_BOOST) > 0) {
      mpMult += Constants.AINZ_MAGIC_BOOST_MP_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.ALBEDO_GUARDIAN_AURA) > 0) {
      mpMult += Constants.ALBEDO_GUARDIAN_AURA_REGEN_MULT;
    }
    if (GetUnitAbilityLevel(customHero.unit, Buffs.LIFE_REGENERATION_AURA) > 0) {
      mpMult += Constants.FOUNTAIN_REGEN_MULT;
    }
    if (hasSuper17Gen) {
      mpMult += Constants.SUPER_17_GEN_REGEN_MULT;
    }
    if (hasBuuFat) {
      mpMult += Constants.MAJIN_BUU_FAT_MP_REGEN_MULT;
    }
    const incMp = (
      Constants.REGEN_TICK_RATE
      * GetUnitState(customHero.unit, UNIT_STATE_MAX_MANA) 
      * Constants.BASE_MP_REGEN_PCT
      * mpAgi * mpMult
    );
    SetUnitState(
      customHero.unit, UNIT_STATE_MANA, 
      GetUnitState(customHero.unit, UNIT_STATE_MANA) + incMp
    );
  });

  const maxSpUpdateTimer = CreateTimer();
  customHero.addTimer(maxSpUpdateTimer);
  TimerStart(maxSpUpdateTimer, 5.0, true, () => {
    let maxStamina = Constants.BASE_STAMINA;
    const id = GetUnitTypeId(customHero.unit);
    if (
      IsUnitType(customHero.unit, UNIT_TYPE_SUMMONED)
      && id != Id.babidiDaburaUnit 
      && id != Id.babidiYakonUnit
    ) {
      maxStamina *= 0.55;
    } else if (id == Id.saitama) {
      maxStamina *= Constants.SAITAMA_PASSIVE_STAMINA_BONUS_MULT;
    }
    customHero.setMaxSP(maxStamina);
  });
}