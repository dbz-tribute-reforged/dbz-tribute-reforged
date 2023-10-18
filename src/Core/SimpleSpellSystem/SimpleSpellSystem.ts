import { Colorizer } from "Common/Colorizer";
import { BASE_DMG, Buffs, Constants, CostType, DebuffAbilities, Globals, Id, OrderIds } from "Common/Constants";
import { CoordMath } from "Common/CoordMath";
import { DamageData } from "Common/DamageData";
import { PathingCheck } from "Common/PathingCheck";
import { SoundHelper } from "Common/SoundHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { DragonBallsConstants } from "Core/DragonBallsSystem/DragonBallsConstants";
import { DragonBallsManager } from "Core/DragonBallsSystem/DragonBallsManager";
import { FarmingManager } from "Core/FarmingSystem/FarmingManager";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { TimerManager } from "Core/Utility/TimerManager";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { AOEHeal } from "CustomAbility/AbilityComponent/AOEHeal";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { CustomHero } from "CustomHero/CustomHero";

export module SimpleSpellSystem {
  const darkMatterDamage: DamageData = new DamageData(
    BASE_DMG.KAME_DPS * 0.06,
    bj_HEROSTAT_INT,
    ATTACK_TYPE_HERO,
    DAMAGE_TYPE_NORMAL, 
    WEAPON_TYPE_WHOKNOWS
  );

  export function initialize () {
    TriggerRegisterAnyUnitEventBJ(Globals.genericSpellTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);

    setupSpellStartEndCastTrigger();


    TriggerRegisterAnyUnitEventBJ(Globals.genericUpgradeTrigger, EVENT_PLAYER_UNIT_RESEARCH_FINISH);
    TriggerAddAction(Globals.genericUpgradeTrigger, () => {
      const researchId = GetResearched();
      if (researchId == Id.getiStarUpgradeSpellPower) {
        // add +1 sp
        const unit = GetResearchingUnit();
        const player = GetOwningPlayer(unit);
        const playerId = GetPlayerId(player);
        for (const x of Globals.customPlayers[playerId].allHeroes) {
          if (GetUnitTypeId(x.unit) == Id.getiStarHero) {
            x.addSpellPower(0.01);
          }
        }
      }
    });
    
    
    TriggerRegisterAnyUnitEventBJ(Globals.simpleSpellEffectTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
    TriggerAddAction(Globals.simpleSpellEffectTrigger, () => {
      const spellId = GetSpellAbilityId();
      const func = Globals.genericSpellMap.get(spellId);
      if (func) {
        func();
      }
    });
    

    Globals.genericSpellMap.set(Id.braveSwordAttack, SimpleSpellSystem.BraveSwordAttack);

    Globals.genericSpellMap.set(Id.dragonFist, SimpleSpellSystem.InitDragonFists);
    Globals.genericSpellMap.set(Id.superDragonFist, SimpleSpellSystem.InitDragonFists);
    Globals.genericSpellMap.set(Id.shadowFist, SimpleSpellSystem.InitDragonFists);
    Globals.genericSpellMap.set(Id.aylaDinoTail, SimpleSpellSystem.InitDragonFists);

    Globals.genericSpellMap.set(Id.ginyuChangeNowConfirm, SimpleSpellSystem.GinyuChangeNowConfirm);
    Globals.genericSpellMap.set(Id.ginyuTelekinesis, SimpleSpellSystem.GinyuTelekinesis);

    Globals.genericSpellMap.set(Id.guldoTimeStop, SimpleSpellSystem.GuldoTimeStop);

    Globals.genericSpellMap.set(Id.senzuThrow, SimpleSpellSystem.KrillinSenzuThrow);

    Globals.genericSpellMap.set(Id.glare, SimpleSpellSystem.InitJirenGlare);
    Globals.genericSpellMap.set(Id.glare2, SimpleSpellSystem.InitJirenGlare);
    Globals.genericSpellMap.set(Id.hirudegarnDarkEyes, SimpleSpellSystem.InitJirenGlare);
    Globals.genericSpellMap.set(Id.shalltearNegativeImpactShield, SimpleSpellSystem.InitJirenGlare);

    Globals.genericSpellMap.set(Id.ceroCharge, SimpleSpellSystem.InitCero);
    Globals.genericSpellMap.set(Id.ceroFire, SimpleSpellSystem.InitCero);

    Globals.genericSpellMap.set(Id.bankai, SimpleSpellSystem.DoBankai);
    Globals.genericSpellMap.set(Id.bankaiFinal, SimpleSpellSystem.DoBankai);

    Globals.genericSpellMap.set(Id.redEyedDragonSummoning, SimpleSpellSystem.dartRedEyedDragonSummoning);
    Globals.genericSpellMap.set(Id.dragoonTransformation, SimpleSpellSystem.dartDragoonTransformation);

    Globals.genericSpellMap.set(Id.madnessDebuffSlow, SimpleSpellSystem.DoMadnessDebuff);

    Globals.genericSpellMap.set(Id.aylaCharm, SimpleSpellSystem.AylaCharm);

    Globals.genericSpellMap.set(Id.magusDarkMatter, SimpleSpellSystem.MagusDarkMatter);
    
    // // SimpleSpellSystem.SetupAylaTripleKick(, Globals.customPlayers);
    
    Globals.genericSpellMap.set(Id.dkJungleRush, SimpleSpellSystem.JungleRushBananaFallout);
    Globals.genericSpellMap.set(Id.dkBarrelCannon, SimpleSpellSystem.BarrelCannon);

    Globals.genericSpellMap.set(Id.hirudegarnDarkMist, SimpleSpellSystem.HirudegarnSkinChange);
    
    Globals.genericSpellMap.set(Id.vegetaFightingSpirit, SimpleSpellSystem.VegetaFightingSpirit);
    
    Globals.genericSpellMap.set(Id.schalaTeleportation, SimpleSpellSystem.SchalaTeleportation);
    Globals.genericSpellMap.set(Id.schalaTeleportation2, SimpleSpellSystem.SchalaTeleportation);
    
    Globals.genericSpellMap.set(Id.yamchaRLightPunch, SimpleSpellSystem.YamchaCombos);
    Globals.genericSpellMap.set(Id.yamchaRMediumPunch, SimpleSpellSystem.YamchaCombos);
    Globals.genericSpellMap.set(Id.yamchaRHeavyPunch, SimpleSpellSystem.YamchaCombos);

    Globals.genericSpellMap.set(Id.skurvyPlunder, SimpleSpellSystem.SkurvyPlunder);
    Globals.genericSpellMap.set(Id.skurvyMirrorNeverLies, SimpleSpellSystem.SetupSkurvyMirror);
    
    Globals.genericSpellMap.set(Id.sonicSpin, SimpleSpellSystem.SonicAbilities);
    Globals.genericSpellMap.set(Id.sonicHomingAttack, SimpleSpellSystem.SonicAbilities);
    Globals.genericSpellMap.set(Id.sonicSpinDash, SimpleSpellSystem.SonicAbilities);
    Globals.genericSpellMap.set(Id.sonicLightSpeedDash, SimpleSpellSystem.SonicAbilities);
    Globals.genericSpellMap.set(Id.sonicSuper, SimpleSpellSystem.SonicAbilities);
    
    Globals.genericSpellMap.set(Id.roshiMafuba, SimpleSpellSystem.InitMafuba);
    Globals.genericSpellMap.set(DebuffAbilities.MAFUBA_SEALED, SimpleSpellSystem.DoMafubaSealed);

    Globals.genericSpellMap.set(Id.jacoEliteBeamCharge, SimpleSpellSystem.doJacoEliteBeamCharge);
    Globals.genericSpellMap.set(Id.jacoEliteBeamPrime, SimpleSpellSystem.doJacoEliteBeamPrime);
    Globals.genericSpellMap.set(Id.jacoEliteBeamFire, SimpleSpellSystem.doJacoEliteBeamFire);
    Globals.genericSpellMap.set(Id.jacoEmergencyBoost, SimpleSpellSystem.doJacoEmergencyBoost);
    Globals.genericSpellMap.set(Id.jacoAnnihilationBomb, SimpleSpellSystem.doJacoAnnihilationBomb);
    Globals.genericSpellMap.set(Id.jacoElitePose, SimpleSpellSystem.doJacoElitePose);
    Globals.genericSpellMap.set(Id.jacoShip, SimpleSpellSystem.doJacoShip);
    
    Globals.genericSpellMap.set(Id.appuleVengeance, SimpleSpellSystem.appuleVengeanceExtra);
    Globals.genericSpellMap.set(DebuffAbilities.APPULE_VENGEANCE, SimpleSpellSystem.appuleVengeanceIllusion);
    
    Globals.genericSpellMap.set(Id.beastGohan, SimpleSpellSystem.gohanBeastBuff);
    Globals.genericSpellMap.set(Id.specialBeastCannon, SimpleSpellSystem.specialBeastCannon);
    
    Globals.genericSpellMap.set(Id.meguminExplosion1, SimpleSpellSystem.doMeguminExplosion);
    Globals.genericSpellMap.set(Id.meguminExplosion2, SimpleSpellSystem.doMeguminExplosion);
    Globals.genericSpellMap.set(Id.meguminExplosion3, SimpleSpellSystem.doMeguminExplosion);
    Globals.genericSpellMap.set(Id.meguminExplosion4, SimpleSpellSystem.doMeguminExplosion);
    Globals.genericSpellMap.set(Id.meguminExplosion5, SimpleSpellSystem.doMeguminExplosion);
    Globals.genericSpellMap.set(Id.meguminManatite, SimpleSpellSystem.doMeguminManatite);
    
    Globals.genericSpellMap.set(Id.pecorinePrincessSplash, SimpleSpellSystem.doPecoManaBonus);
    Globals.genericSpellMap.set(Id.pecorineRoyalSlash, SimpleSpellSystem.doPecoManaBonus);
    Globals.genericSpellMap.set(Id.pecorinePrincessStrike, SimpleSpellSystem.doPecoManaBonus);
    Globals.genericSpellMap.set(Id.pecorinePrincessValiant, SimpleSpellSystem.doPecoManaBonus);
    Globals.genericSpellMap.set(Id.pecorinePrincessForce, SimpleSpellSystem.doPecoManaBonus);
    
    Globals.genericSpellMap.set(Id.plantWheat, SimpleSpellSystem.farmingPlantCrops);
    Globals.genericSpellMap.set(Id.plantCorn, SimpleSpellSystem.farmingPlantCrops);
    Globals.genericSpellMap.set(Id.plantRice, SimpleSpellSystem.farmingPlantCrops);

    Globals.genericSpellMap.set(Id.dendeHeal, SimpleSpellSystem.doDendeHeal);
    Globals.genericSpellMap.set(Id.dendeHeal2, SimpleSpellSystem.doDendeHeal);
    
    Globals.genericSpellMap.set(Id.linkHookshot, SimpleSpellSystem.doLinkHookshot);
    Globals.genericSpellMap.set(Id.linkHookshotPullTowards, SimpleSpellSystem.doLinkHookshotPull);
    Globals.genericSpellMap.set(Id.linkHookshotPullIn, SimpleSpellSystem.doLinkHookshotPull);
    
    Globals.genericSpellMap.set(Id.linkBombCharge, SimpleSpellSystem.doLinkBombCharge);
    Globals.genericSpellMap.set(Id.linkBombThrow, SimpleSpellSystem.doLinkBombThrow);
    
    Globals.genericSpellMap.set(Id.linkBow, SimpleSpellSystem.doLinkBowShoot);
    Globals.genericSpellMap.set(Id.linkArrowNormal, SimpleSpellSystem.doLinkArrowSelect);
    Globals.genericSpellMap.set(Id.linkArrowFire, SimpleSpellSystem.doLinkArrowSelect);
    Globals.genericSpellMap.set(Id.linkArrowIce, SimpleSpellSystem.doLinkArrowSelect);
    Globals.genericSpellMap.set(Id.linkArrowLightning, SimpleSpellSystem.doLinkArrowSelect);
    Globals.genericSpellMap.set(Id.linkArrowBomb, SimpleSpellSystem.doLinkArrowSelect);
    
    Globals.genericSpellMap.set(DebuffAbilities.SLOW_LINK_FIRE_ARROW, SimpleSpellSystem.doLinkFireArrowBurn);

    Globals.genericSpellMap.set(Id.cellMaxDisaster, SimpleSpellSystem.doCellMaxDisasterRay);
    
    Globals.genericSpellMap.set(Id.ainzEnergyDrain, SimpleSpellSystem.doAinzLightningSFX);
    Globals.genericSpellMap.set(Id.ainzGraspHeart, SimpleSpellSystem.doAinzLightningSFX);
    Globals.genericSpellMap.set(Id.ainzGreaterHardening, SimpleSpellSystem.doAinzGreaterHardening);
    Globals.genericSpellMap.set(Id.ainzGreaterMagicShield, SimpleSpellSystem.doAinzGreaterMagicShield);
    Globals.genericSpellMap.set(Id.ainzMagicBoost, SimpleSpellSystem.doAinzMagicBoost);
    Globals.genericSpellMap.set(Id.ainzPerfectUnknowable, SimpleSpellSystem.doAinzPerfectUnknowable);
    Globals.genericSpellMap.set(Id.ainzGate, SimpleSpellSystem.doAinzGate);
    // Globals.genericSpellMap.set(Id.ainzSummonPandora, SimpleSpellSystem.doAinzPandorasActor);
    Globals.genericSpellMap.set(Id.ainzResistance, SimpleSpellSystem.doAinzResistance);
    Globals.genericSpellMap.set(Id.ainzWish, SimpleSpellSystem.doAinzWish);

    Globals.genericSpellMap.set(Id.albedoFormSwap, SimpleSpellSystem.doAlbedoFormSwap);
    Globals.genericSpellMap.set(Id.albedoAegis, SimpleSpellSystem.doAlbedoAegis);
    Globals.genericSpellMap.set(Id.albedoSkillBoost, SimpleSpellSystem.doAlbedoSkillBoost);

    Globals.genericSpellMap.set(Id.shalltearValhalla, SimpleSpellSystem.doShalltearValhalla);

    Globals.genericSpellMap.set(Id.demiurgeHellfireMantle, SimpleSpellSystem.doDemiurgeHellfireMantle);

    // Globals.genericSpellMap.set(Id.schalaPray, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal2, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate2, SimpleSpellSystem.doSchalaLinkChannels);
    
    // add units to dds
    TriggerRegisterEnterRectSimple(Globals.DDSEntryTrigger, GetEntireMapRect());
    TriggerAddCondition(Globals.DDSEntryTrigger, Condition(() => {
      const unit = GetTriggerUnit();
      if (
        !Globals.DDSUnitMap.has(unit)
        && IsUnitType(unit, UNIT_TYPE_HERO)
        && GetHeroProperName(unit) == "Test Dummy"
      ) {
        Globals.DDSUnitMap.set(unit, true);
        TriggerRegisterUnitEvent(Globals.DDSTrigger, unit, EVENT_UNIT_DAMAGED);
      }
      return false;
    }));

    // add DDS stuff
    TriggerAddCondition(Globals.DDSTrigger, Condition(() => {
      const target = BlzGetEventDamageTarget();
      const dmg = GetEventDamage();
      const source = GetEventDamageSource();
      DDSRunJirenGlare(target, source, dmg);
      DDSRunDPSCheck(target, source, dmg);
      return false;
    }));

    
    // barrel
    TriggerRegisterTimerEventPeriodic(Globals.barrelMoveTrigger, 0.03);
    TriggerAddAction(Globals.barrelMoveTrigger, () => {
      const barrelMoveSpeed = 50;
      const barrelMoveDuration = 24;
      const minOffsetDistance = 30;
      ForGroup(Globals.barrelUnitGroup, () => {
        // move barrel
        const unit = GetEnumUnit();
        const unitId = GetHandleId(unit);
        const angle = LoadReal(Globals.barrelHashtable, unitId, 1);
        const expectedX = LoadReal(Globals.barrelHashtable, unitId, 2);
        const expectedY = LoadReal(Globals.barrelHashtable, unitId, 3);

        Globals.tmpVector2.setPos(expectedX, expectedY);
        Globals.tmpVector.setUnit(unit);
        const offsetFromExpected = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

        // normal direction movement
        Globals.tmpVector.polarProjectCoords(Globals.tmpVector, angle, barrelMoveSpeed);
        PathingCheck.moveGroundUnitToCoord(unit, Globals.tmpVector);
        
        // if barrel strayed from expected path, attempt to move it back (up to a limit)
        if (offsetFromExpected >= minOffsetDistance) {
          Globals.tmpVector2.polarProjectCoords(Globals.tmpVector2, angle, barrelMoveSpeed);

          const reverseAngle = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
          Globals.tmpVector.polarProjectCoords(
            Globals.tmpVector, 
            reverseAngle, 
            Math.min(offsetFromExpected, minOffsetDistance)
          );
          PathingCheck.moveGroundUnitToCoord(unit, Globals.tmpVector);
        }

        SaveReal(Globals.barrelHashtable, unitId, 2, GetUnitX(unit));
        SaveReal(Globals.barrelHashtable, unitId, 3, GetUnitY(unit));
        SetUnitFacingTimed(unit, angle, 0.03);

        const duration = LoadInteger(Globals.barrelHashtable, unitId, 0);
        if (duration >= barrelMoveDuration) {
          FlushChildHashtable(Globals.barrelHashtable, unitId);
          GroupRemoveUnit(Globals.barrelUnitGroup, unit);
        } else {
          SaveInteger(Globals.barrelHashtable, unitId, 0, duration + 1);
        }
      });

      if (CountUnitsInGroup(Globals.barrelUnitGroup) == 0) {
        DisableTrigger(Globals.barrelMoveTrigger);
      }
    });
    DisableTrigger(Globals.barrelMoveTrigger);


    TriggerRegisterEnterRectSimple(Globals.appuleVengeanceTeleportTrigger, GetPlayableMapRect());
    TriggerAddCondition(Globals.appuleVengeanceTeleportTrigger, Condition(() => {
      const unit = GetTriggerUnit();

      if (IsUnitType(unit, UNIT_TYPE_HERO) && UnitHelper.isUnitAlive(unit)) {
        const playerId = GetPlayerId(GetOwningPlayer(unit));
        if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
          Globals.customPlayers[playerId].addHero(unit);
          Globals.customPlayers[playerId].addUnit(unit);
        }
      }
      if (
        GetUnitTypeId(unit) == Id.appule 
        && IsUnitIllusion(unit)
      ) {
        const player = GetOwningPlayer(unit);
        const playerId = GetPlayerId(player);
        const hero = Globals.customPlayers[playerId].firstCustomHero;
        if (!hero) return false;
        const heroId = GetHandleId(hero.unit);

        SetUnitMoveSpeed(unit, GetUnitMoveSpeed(hero.unit));

        const is_active = LoadBoolean(
          Globals.genericSpellHashtable, 
          GetHandleId(hero.unit),
          StringHash("appule|illusion|active")
        );
        if (!is_active) return;

        const target = LoadUnitHandle(Globals.genericSpellHashtable, heroId, StringHash("appule|illusion|target"));

        Globals.tmpVector.setUnit(hero.unit);
        Globals.tmpVector2.setUnit(target);
        
        // max cap teleportation distance
        if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > 4000) {
          return false;
        }

        SetUnitPosition(unit, GetUnitX(target), GetUnitY(target));
        IssueTargetOrderById(unit, OrderIds.ATTACK, target);
      }
      return false;
    }));
  }

  export function BraveSwordAttack() {
    const spellId = GetSpellAbilityId();
    // 0 : target x
    // 1 : target y
    const casterPos: Vector2D = new Vector2D(0, 0);
    const tmpPos: Vector2D = new Vector2D(0, 0);
    const dummyStunOrder = OrderIds.THUNDERBOLT;
    const tickRate = 0.02;
    const jumpDuration = 40;
    const jumpHeight = 900;
    const jumpMoveDistance = 2;
    // const jumpMoveDistance = 30;
    // const jumpSpeedModifier = 0.0015;
    // const jumpSpeedModifierMax = 1.33;
    // const jumpSpeedModifierMin = 0.15;
    const braveSwordAOE = 425;
    const braveSwordDamageMult = BASE_DMG.KAME_DPS * 12;
    const braveSwordManaBurnMult = 0.01;
    const debuffDamageMult = 1.5;
    const maxManaCostMult = 0.2;
    

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const abilityLevel = GetUnitAbilityLevel(caster, spellId);
    const player = GetTriggerPlayer();

    tmpPos.setUnit(caster);
    SaveReal(Globals.genericSpellHashtable, casterId, 0, tmpPos.x);
    SaveReal(Globals.genericSpellHashtable, casterId, 1, tmpPos.y);

    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      tmpPos.x, 
      tmpPos.y, 
      braveSwordAOE,
      null
    );
    
    let checkCount = 1;
    // ForGroup(Globals.tmpUnitGroup, () => {
    //   const checkUnit = GetEnumUnit();
    //   if (
    //     UnitHelper.isUnitTargetableForPlayer(checkUnit, player) && 
    //     GetUnitAbilityLevel(checkUnit, Buffs.HEROS_SONG) > 0
    //   ) {
    //     ++checkCount;
    //   }
    // });
    
    if (checkCount > 0) {
      const mpCost = maxManaCostMult * GetUnitState(caster, UNIT_STATE_MAX_MANA);
      SetUnitState(
        caster, UNIT_STATE_MANA, 
        Math.max(0, GetUnitState(caster, UNIT_STATE_MANA) - mpCost)
      );
      casterPos.setUnit(caster);
      const moveAngle = CoordMath.angleBetweenCoords(casterPos, tmpPos);
      let time = 0;
      // PauseUnit(caster, true);
      // SetUnitInvulnerable(caster, true);
      UnitHelper.giveUnitFlying(caster);
      
      const jumpTimer = TimerManager.getInstance().get();
      TimerStart(jumpTimer, tickRate, true, () => {
        casterPos.setUnit(caster);
        if (time > jumpDuration) {
          
          const castDummy = CreateUnit(
            player, 
            Constants.dummyCasterId, 
            casterPos.x, casterPos.y, 
            0
          );
          UnitAddAbility(castDummy, DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND);

          // PauseUnit(caster, false);
          // SetUnitInvulnerable(caster, false);

          const damageGroup = CreateGroup();

          GroupEnumUnitsInRange(
            damageGroup, 
            casterPos.x, 
            casterPos.y, 
            braveSwordAOE,
            null
          );

          let spellPower = 1.0;
          const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(caster);
          if (customHero) {
            spellPower = customHero.spellPower;
          }
          const damage = AOEDamage.getIntDamageMult(caster) * abilityLevel * spellPower * braveSwordDamageMult * (
            CustomAbility.BASE_DAMAGE + 
            GetHeroInt(caster, true)
          );
          const manaBurn = damage * braveSwordManaBurnMult * abilityLevel;

          ForGroup(damageGroup, () => {
            const damagedUnit = GetEnumUnit();
            if (UnitHelper.isUnitTargetableForPlayer(damagedUnit, player)) {
              const finalDamage = GetUnitAbilityLevel(damagedUnit, Buffs.HEROS_SONG) > 0 ? 
                damage * debuffDamageMult : 
                damage
              ;
              const finalManaBurn = GetUnitAbilityLevel(damagedUnit, Buffs.HEROS_SONG) > 0 ? 
                manaBurn * debuffDamageMult : 
                manaBurn
              ;
              
              SetUnitState(
                damagedUnit, 
                UNIT_STATE_MANA, 
                Math.max(
                  0, 
                  GetUnitState(damagedUnit, UNIT_STATE_MANA) - finalManaBurn
                )
              );

              UnitDamageTarget(
                caster, 
                damagedUnit, 
                finalDamage, 
                true, 
                false, 
                ATTACK_TYPE_HERO, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WHOKNOWS
              );

              if (IsUnitType(damagedUnit, UNIT_TYPE_HERO)) {
                IssueTargetOrderById(castDummy, dummyStunOrder, damagedUnit);
              }
            }
          });

          DestroyGroup(damageGroup);
          RemoveUnit(castDummy);

          const clapSfx = AddSpecialEffect(
            "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
            casterPos.x, casterPos.y
          );
          BlzSetSpecialEffectScale(clapSfx, 2.0);
          DestroyEffect(clapSfx);

          const novaSfx = AddSpecialEffect(
            "IceNova.mdl",
            casterPos.x, casterPos.y
          );
          BlzSetSpecialEffectScale(novaSfx, 1.0);
          BlzSetSpecialEffectTimeScale(novaSfx, 1.25);
          DestroyEffect(novaSfx);

          const feedbackSfx = AddSpecialEffect(
            "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl",
            casterPos.x, casterPos.y
          );
          BlzSetSpecialEffectScale(feedbackSfx, 3.0);
          DestroyEffect(feedbackSfx);

          SetUnitFlyHeight(caster, 0, 0);

          TimerManager.getInstance().recycle(jumpTimer);
        } else {
          const timeJumpRatio = -1 + 2 * time / jumpDuration;
          const height = jumpHeight * (
            1 - timeJumpRatio * timeJumpRatio
          );
          SetUnitFlyHeight(caster, height, 0);

          tmpPos.setUnit(caster);
          tmpPos.polarProjectCoords(tmpPos, GetUnitFacing(caster), jumpMoveDistance);
          PathingCheck.moveGroundUnitToCoord(caster, tmpPos);
          
          // tmpPos.setPos(
          //   LoadReal(Globals.genericSpellHashtable, casterId, 0),
          //   LoadReal(Globals.genericSpellHashtable, casterId, 1),
          // )
          // const distanceToTarget = CoordMath.distance(casterPos, tmpPos);

          // tmpPos.polarProjectCoords(
          //   casterPos, moveAngle, 
          //   Math.max(
          //     jumpSpeedModifierMin, 
          //     Math.min(
          //       jumpSpeedModifierMax, 
          //       distanceToTarget * jumpSpeedModifier
          //     )
          //   ) * jumpMoveDistance
          // );

          // PathingCheck.moveGroundUnitToCoord(caster, tmpPos);
        }
        ++time;
      });

    } else {
      // const playerForce = CreateForce();
      // ForceAddPlayer(playerForce, player);
      // DisplayTimedTextToForce(
      //   playerForce, 
      //   5, 
      //   "|cffff2020Error|r: No unit with |cffffff00Hero's Song|r in target area."
      // );
      // DestroyForce(playerForce);

      // UnitRemoveAbility(caster, spellId);
      // UnitAddAbility(caster, spellId);
      // SetUnitAbilityLevel(caster, spellId, abilityLevel);
      // UnitMakeAbilityPermanent(caster, true, spellId);
    }
    GroupClear(Globals.tmpUnitGroup);
  }

  export function InitDragonFists() {
    const sfxHeadModel = "DragonHead2.mdl";
    const sfxSpiralModel = "DragonSegment2.mdl";

    const sfxShadowHeadModel = "RedDragonHead.mdl";
    const sfxShadowSpiralModel = "RedDragonSegment.mdl";

    const sfxDinoTail = "DinoTail.mdl";
    const sfxDinoTailSpiral = "DinoSegment.mdl";

    const spellId = GetSpellAbilityId();
    if (
      spellId == Id.dragonFist 
      || spellId == Id.superDragonFist 
      || spellId == Id.shadowFist
      || spellId == Id.aylaDinoTail
    ) {
      const caster = GetTriggerUnit();
      switch (spellId) 
      {
        case Id.aylaDinoTail:
          SimpleSpellSystem.DoDragonFistSFX(caster, sfxDinoTail, sfxDinoTailSpiral);
          break;
        
        case Id.shadowFist:
          SimpleSpellSystem.DoDragonFistSFX(caster, sfxShadowHeadModel, sfxShadowSpiralModel);
          SimpleSpellSystem.OmegaShenronShadowFist();
          break;

        case Id.dragonFist:
        case Id.superDragonFist:
        default:
          SimpleSpellSystem.DoDragonFistSFX(caster, sfxHeadModel, sfxSpiralModel);
          break;
      }
    }
  }

  export function DoDragonFistSFX(
    caster: unit,
    headModel: string,
    spiralModel: string,
  ) {
    const tickRate = 0.02;
    const updatesPerTick = 1;
    // const duration = 45;
    // const duration = 0.91 * updatesPerTick/tickRate;
    const baseDuration = 1.8 * updatesPerTick/tickRate;
    const startingAngle = 0;
    // const anglesPerTick = -20;
    const anglesPerTick = 5;
    const bonusUpdatesPerDistance = 0.07;
    const distanceFromMiddle = 240;
    const maxTimeBasedDistanceMult = 1.3;
    const heightOffset = 100 + maxTimeBasedDistanceMult * distanceFromMiddle;
    const facingAnglePerTick = 5;
    const sfxScale = 3.0;
    const sfxHeadScale = 3.5;
    const startingPitch = 90.0;
    const sfxRed = 255;
    const sfxGreen = 205;
    const sfxBlue = 25;

    let casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    let oldPos = new Vector2D(casterPos.x, casterPos.y);
    let currentPos = new Vector2D(0, 0);
    let newPos = new Vector2D(0, 0);

    // const targetPos = Globals.customPlayers[GetPlayerId(GetTriggerPlayer())].orderPoint;
    const sfxList: effect[] = [];
    let sfxIndex = 0;
    const sfxHead = AddSpecialEffect(headModel, casterPos.x, casterPos.y);
    BlzSetSpecialEffectScale(sfxHead, sfxHeadScale);
    BlzSetSpecialEffectColor(sfxHead, sfxRed, sfxGreen, sfxBlue);
    sfxList.push(sfxHead);  
    ++sfxIndex;

    let duration = baseDuration;

    let time = 0; 
    TimerStart(CreateTimer(), tickRate, true, () => {
      oldPos.setVector(casterPos);
      casterPos.setUnit(caster);
      const distanceTravelled = CoordMath.distance(casterPos, oldPos);
      let facingAngle = GetUnitFacing(caster);
      // if (distanceTravelled < 1) {
      //   facingAngle = GetUnitFacing(caster);
      // } else {
      //   facingAngle = CoordMath.angleBetweenCoords(oldPos, casterPos) + 360;
      // }
      const bonusUpdates = Math.min(
        25,
        Math.floor(distanceTravelled * bonusUpdatesPerDistance)
      );
      const updatesThisTick = updatesPerTick + bonusUpdates;
      const segmentedDistance = distanceTravelled / updatesThisTick;

      duration += updatesThisTick - 1;
      for (let i = 0; i < updatesThisTick; ++i) {    
        if (time > duration) {
          for (const removeSfx of sfxList) {
            DestroyEffect(removeSfx);
          }
          DestroyTimer(GetExpiredTimer());
        } else {
          const angle = (startingAngle + time * anglesPerTick) * CoordMath.degreesToRadians;
          const timeRatio = (maxTimeBasedDistanceMult - Math.min(1, time / baseDuration));
          // const timeRatio = (maxTimeBasedDistanceMult);
          const x = timeRatio * distanceFromMiddle * Math.cos(angle);
          const y = timeRatio * distanceFromMiddle * Math.sin(angle);
          const height = GetUnitFlyHeight(caster) + BlzGetUnitZ(caster) + 
          (
            heightOffset + y
          );

          currentPos.polarProjectCoords(
            oldPos, 
            facingAngle, 
            (i+1) * distanceTravelled / updatesThisTick
          );
          newPos.polarProjectCoords(
            currentPos, 
            facingAngle - 90, 
            x
          );
          let yawModifier = 1;
          if (y < 0) {
            yawModifier = 1;
          }
          const yaw = CoordMath.degreesToRadians * (
            facingAngle + yawModifier * (
              90 - Math.min(90, segmentedDistance)
            )
          );
          // const targetYaw = facingAngle * CoordMath.degreesToRadians;

          const pitch = (startingAngle - startingPitch + yawModifier *  time * anglesPerTick) * CoordMath.degreesToRadians;

          const sfx = AddSpecialEffect(spiralModel, newPos.x, newPos.y);
          // sfxList.push(sfx);
          // ++sfxIndex;
          DestroyEffect(sfx);
          BlzSetSpecialEffectScale(sfx, sfxScale);
          BlzSetSpecialEffectHeight(sfx, height);
          BlzSetSpecialEffectColor(sfx, sfxRed, sfxGreen, sfxBlue);
          // BlzSetSpecialEffectYaw(sfx, targetYaw);
          BlzSetSpecialEffectYaw(sfx, yaw);
          BlzSetSpecialEffectPitch(sfx, pitch);
          //   "Angle: " + (angle * CoordMath.radiansToDegrees) + 
          //   " Yaw: " + (yaw * CoordMath.radiansToDegrees) + 
          //   " Pitch: " + (pitch * CoordMath.radiansToDegrees)
          // );

          // update dragon head
          if (i >= updatesThisTick - 1) {
            BlzSetSpecialEffectX(sfxHead, newPos.x);
            BlzSetSpecialEffectY(sfxHead, newPos.y);
            BlzSetSpecialEffectHeight(sfxHead, height);
            BlzSetSpecialEffectYaw(sfxHead, facingAngle * CoordMath.degreesToRadians);
            // BlzSetSpecialEffectPitch(sfxHead, pitch);
          }
        }
        ++time;
      }
    });
  }

  export function GinyuChangeNowConfirm() {
    const spellId = GetSpellAbilityId();

    const casterPlayer = GetTriggerPlayer();
    const casterPlayerId = GetPlayerId(casterPlayer);
    const targetUnit = GetSpellTargetUnit();
    let targetPlayer = GetOwningPlayer(targetUnit);
    if (GetPlayerId(targetPlayer) == casterPlayerId) {
      targetPlayer = GetOwningPlayer(GetTriggerUnit());
    }
    const targetPlayerId = GetPlayerId(targetPlayer);
    const targetX = GetUnitX(targetUnit);
    const targetY = GetUnitY(targetUnit);

    if (
      Globals.customPlayers[targetPlayerId].hasHero(targetUnit) && 
      IsUnitType(targetUnit, UNIT_TYPE_HERO) &&
      !IsUnitType(targetUnit, UNIT_TYPE_SUMMONED) &&
      (
        (
          targetX < TournamentData.budokaiArenaBottomLeft.x ||
          targetX > TournamentData.budokaiArenaTopRight.x
        ) &&
        (
          targetY < TournamentData.budokaiArenaBottomLeft.y ||
          targetY > TournamentData.budokaiArenaTopRight.y
        )
      ) && 
      !TournamentManager.getInstance().isTournamentActive(Constants.finalBattleName)
    ) {
      const tmp = Globals.customPlayers[casterPlayerId].heroes;
      Globals.customPlayers[casterPlayerId].heroes = Globals.customPlayers[targetPlayerId].heroes;
      Globals.customPlayers[targetPlayerId].heroes = tmp;
      for (const hero of Globals.customPlayers[targetPlayerId].allHeroes) {
        if (IsUnitType(hero.unit, UNIT_TYPE_SUMMONED) && GetOwningPlayer(hero.unit) != targetPlayer) {
          SetUnitOwner(hero.unit, targetPlayer, true);
        }
      }
      for (const hero of Globals.customPlayers[casterPlayerId].allHeroes) {
        if (IsUnitType(hero.unit, UNIT_TYPE_SUMMONED) && GetOwningPlayer(hero.unit) != casterPlayer) {
          SetUnitOwner(hero.unit, casterPlayer, true);
        }
      }
    }
  }

  export function GinyuTelekinesis() {
    const ignoreItem = FourCC("wtlg");
    const telekinesisDuration = 30;
    const telekinesisSpeed = 50;
    const telekinesisPlayerSpeedModifier = 0.5;
    const telekinesisAOE = 400;
    const telekinesisMinDistance = 300;
    const telekinesisRect = Rect(0, 0, 800, 800);

    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const newPos = new Vector2D();
    const player = GetTriggerPlayer();
    const itemsToMove: item[] = [];

    const unitsToMove = CreateGroup();
    GroupEnumUnitsInRange(
      unitsToMove, 
      targetPos.x, 
      targetPos.y, 
      telekinesisAOE,
      null
    );

    MoveRectTo(telekinesisRect, targetPos.x, targetPos.y);
    EnumItemsInRectBJ(telekinesisRect, () => {
      const item = GetEnumItem();
      targetPos.setPos(GetItemX(item), GetItemY(item));
      if (
        CoordMath.distance(targetPos, targetPos) < telekinesisAOE && 
        GetItemTypeId(item) != ignoreItem
      ) {
        itemsToMove.push(GetEnumItem());
      }
    });

    let counter: number = 0;
    TimerStart(CreateTimer(), 0.03, true, () => {
      if (
        counter > telekinesisDuration ||
        UnitHelper.isUnitDead(caster)
      ) {
        DestroyGroup(unitsToMove);
        itemsToMove.splice(0, itemsToMove.length);
        DestroyTimer(GetExpiredTimer());
      } else {
        casterPos.setPos(GetUnitX(caster), GetUnitY(caster));
        for (const item of itemsToMove) {
          targetPos.setPos(GetItemX(item), GetItemY(item));
          newPos.polarProjectCoords(
            targetPos, 
            CoordMath.angleBetweenCoords(targetPos, casterPos), 
            telekinesisSpeed,
          );
          if (
            CoordMath.distance(casterPos, targetPos) > telekinesisMinDistance &&
            PathingCheck.isFlyingWalkable(newPos)
          ) {
            SetItemPosition(item, newPos.x, newPos.y);
          }
        }

        ForGroup(unitsToMove, () => {
          const targetUnit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(targetUnit, player) && 
            !IsUnitType(targetUnit, UNIT_TYPE_ETHEREAL) && 
            !IsUnitType(targetUnit, UNIT_TYPE_MAGIC_IMMUNE)
          ) {
            targetPos.setPos(GetUnitX(targetUnit), GetUnitY(targetUnit));
            if (
              GetPlayerId(GetOwningPlayer(targetUnit)) < Constants.maxActivePlayers
            ) {
              newPos.polarProjectCoords(
                targetPos, 
                CoordMath.angleBetweenCoords(targetPos, casterPos), 
                telekinesisSpeed * telekinesisPlayerSpeedModifier,
              );
            } else {  
              newPos.polarProjectCoords(
                targetPos, 
                CoordMath.angleBetweenCoords(targetPos, casterPos), 
                telekinesisSpeed,
              );
            }
            if (CoordMath.distance(casterPos, targetPos) > telekinesisMinDistance) {
              PathingCheck.moveGroundUnitToCoord(targetUnit, newPos);
            }
          }
        });

        ++counter;
      }
    })

  }

  export function GuldoTimeStop() {
    const originalBAT: number = 1.8;
    const timeStopBAT: number = 0.4;

    const caster = GetTriggerUnit();
    BlzSetUnitAttackCooldown(caster, timeStopBAT, 0);

    TimerStart(CreateTimer(), 2.0, false, () => {
      BlzSetUnitAttackCooldown(caster, originalBAT, 0);
      DestroyTimer(GetExpiredTimer());
    });
  }

  export function OmegaShenronShadowFist() {
    const spellId = GetSpellAbilityId();

    const shadowFistAOE = 350;
    const shadowFistDuration = 48;
    const tickRate = 0.03;
    const maxDragonBallsToSteal = 1;
    const maxSizedDragonBallStackToSteal = 7;

    const caster = GetTriggerUnit();
    const player = GetTriggerPlayer();

    let time = 0;
    let totalStolenDragonBalls = 0;
    TimerStart(CreateTimer(), tickRate, true, () => {
      if (time > shadowFistDuration || totalStolenDragonBalls >= maxDragonBallsToSteal) {
        DestroyTimer(GetExpiredTimer());
      } else {
        const targetPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));

        GroupEnumUnitsInRange(
          Globals.tmpUnitGroup, 
          targetPos.x, 
          targetPos.y, 
          shadowFistAOE,
          null
        );
        
        let stolenDragonBalls = 0;

        const casterDragonBallIndex = UnitHelper.getInventoryIndexOfItemType(caster, DragonBallsConstants.dragonBallItem);
        const casterInventoryCount = UnitInventoryCount(caster);

        ForGroup(Globals.tmpUnitGroup, () => {
          const targetUnit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(targetUnit, player) && 
            totalStolenDragonBalls < maxDragonBallsToSteal
          ) {
            const targetDragonBallIndex = UnitHelper.getInventoryIndexOfItemType(targetUnit, DragonBallsConstants.dragonBallItem);
            if (targetDragonBallIndex >= 0) {
              const stealItem = UnitItemInSlot(targetUnit, targetDragonBallIndex);
              const numCharges = GetItemCharges(stealItem);
              if (numCharges < maxSizedDragonBallStackToSteal) {    
                if (numCharges > 1) {
                  SetItemCharges(stealItem, numCharges - 1);
                }
                if (casterDragonBallIndex >= 0) {
                  // has dball to inc charges
                  const casterItem = UnitItemInSlot(caster, casterDragonBallIndex);
                  SetItemCharges(casterItem, GetItemCharges(casterItem) + 1);
                  if (numCharges == 1) {
                    RemoveItem(stealItem);
                  }
                } else if (casterInventoryCount <= 5) {
                  // no dball but has space
                  UnitAddItemById(caster, DragonBallsConstants.dragonBallItem);
                  if (numCharges == 1) {
                    RemoveItem(stealItem);
                  }
                } else {
                  // no dballs and no space
                  if (numCharges == 1) {
                    SetItemPosition(stealItem, targetPos.x, targetPos.y);
                  } else {
                    CreateItem(DragonBallsConstants.dragonBallItem, targetPos.x, targetPos.y);
                  }
                }
                ++stolenDragonBalls;
                ++totalStolenDragonBalls
              }
            }
          }
        });

        if (stolenDragonBalls > 0) {
          const auraSfx = AddSpecialEffect(
            "AuraDBalls.mdl",
            targetPos.x, targetPos.y
          );
          BlzSetSpecialEffectScale(auraSfx, 2.0);
          DestroyEffect(auraSfx);
        }

        ++time;
        GroupClear(Globals.tmpUnitGroup);
      }
    });
  }


  export function KrillinSenzuThrow() {
    const spellId = GetSpellAbilityId();

    const senzuThrowDuration = 40;
    const senzuThrowSpeed = 49;
    const senzuThrowStealMinDuration = 10;
    const senzuThrowStealAOE = 300;
    const senzuItemId = ItemConstants.Consumables.SENZU_BEAN;
    
    const caster = GetTriggerUnit();
    const casterPlayer = GetTriggerPlayer();
    // const casterPlayerId = GetPlayerId(casterPlayer);
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());
    const senzuItem = CreateItem(senzuItemId, Globals.tmpVector.x, Globals.tmpVector.y);
    const direction = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    SimpleSpellSystem.moveItemAndDoPickup(
      senzuItem,
      senzuThrowSpeed,
      direction,
      senzuThrowDuration,
      senzuThrowStealMinDuration,
      senzuThrowStealAOE
    );
  }

  export function moveItemAndDoPickup(
    movedItem: item,
    itemMS: number,
    direction: number,
    duration: number,
    minDuration: number,
    stealAOE: number,
  ) {
    Globals.tmpVector3.setPos(GetItemX(movedItem), GetItemY(movedItem));
    let counter: number = 0;

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (counter >= duration) {
        TimerManager.getInstance().recycle(timer);
      } else {
        if (counter < duration) {
          Globals.tmpVector3.polarProjectCoords(
            Globals.tmpVector3,
            direction,
            itemMS
          );

          if (PathingCheck.isGroundWalkable(Globals.tmpVector3)) {
            SetItemPosition(movedItem, Globals.tmpVector3.x, Globals.tmpVector3.y);
          } else {
            Globals.tmpVector3.x = GetItemX(movedItem);
            Globals.tmpVector3.y = GetItemY(movedItem);
          }
        }
        
        if (
          counter > minDuration
          && SimpleSpellSystem.doAOEItemPickup(movedItem, Globals.tmpVector3, stealAOE)
        ) {
          counter = duration;
        }

        ++counter;
      }
    });
  }

  export function doAOEItemPickup(
    pickupItem: item,
    pos: Vector2D,
    stealAOE: number,
  ) {
    let result = false;

    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      pos.x, 
      pos.y, 
      stealAOE,
      null
    );

    ForGroup(Globals.tmpUnitGroup, () => {
      const targetUnit = GetEnumUnit();
      const playerId = GetPlayerId(GetOwningPlayer(targetUnit));
      if (
        !result &&
        IsUnitType(targetUnit, UNIT_TYPE_HERO) && 
        playerId < Constants.maxActivePlayers &&
        !UnitHelper.isUnitDead(targetUnit) &&
        !UnitHelper.isUnitStunned(targetUnit) &&
        !IsUnitType(targetUnit, UNIT_TYPE_ETHEREAL) &&
        UnitInventoryCount(targetUnit) < UnitInventorySize(targetUnit)
      ) {
        UnitAddItem(targetUnit, pickupItem);
        // SetItemPlayer(pickupItem, GetOwningPlayer(targetUnit), false);
        result = true;
      }
    });
    GroupClear(Globals.tmpUnitGroup);

    return result;
  }

  export function InitJirenGlare() {
    /**
     * hashtable
     * 0: spellId, or 0 if not activated
     * 1: counter sfx
     * 2: ability level
     */

    const glareDuration = 2.5;
    const darkEyesDuration = 4.0;
    const negativeImpactShieldDuration = 3.0;

    const spellId = GetSpellAbilityId();
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    SaveInteger(Globals.genericSpellHashtable, unitId, 0, spellId);
    
    let effect: effect;
    if (spellId == Id.glare || spellId == Id.glare2) {
      effect = AddSpecialEffectTarget("AuraJirenCounter2.mdl", unit, "origin");
      // BlzSetSpecialEffectScale(effect, 1.5);
    } else if (spellId == Id.hirudegarnDarkEyes) {
      effect = AddSpecialEffectTarget("MagusDarkMist.mdl", unit, "head");
      // BlzSetSpecialEffectScale(effect, 2.0);
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      effect = AddSpecialEffectTarget("AuraKaox10.mdl", unit, "origin");
    }
    SaveEffectHandle(Globals.genericSpellHashtable, unitId, 1, effect);
    SaveInteger(Globals.genericSpellHashtable, unitId, 2, GetUnitAbilityLevel(unit, spellId));
    
    if (!Globals.DDSUnitMap.has(unit)) {
      Globals.DDSUnitMap.set(unit, true);
      TriggerRegisterUnitEvent(Globals.DDSTrigger, unit, EVENT_UNIT_DAMAGED);
    }
    
    let timerDuration = glareDuration;
    if (spellId == Id.hirudegarnDarkEyes) {
      timerDuration = darkEyesDuration;
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      timerDuration = negativeImpactShieldDuration;
    }

    TimerStart(CreateTimer(), timerDuration, false, () => {
      DestroyTimer(GetExpiredTimer());
      SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
      SaveInteger(Globals.genericSpellHashtable, unitId, 2, 0);
      DestroyEffect(LoadEffectHandle(Globals.genericSpellHashtable, unitId, 1));
    });
  }

  export function DDSRunJirenGlare(
    target: unit,
    source: unit,
    dmg: number,
  ) {
    if (
      UnitHelper.isUnitDead(target)
      || !IsUnitType(source, UNIT_TYPE_HERO)
      || dmg <= 2
    ) return;

    const targetId = GetHandleId(target);
    const spellId = LoadInteger(Globals.genericSpellHashtable, targetId, 0);
    if (
      spellId == 0 
      || (
        spellId != Id.glare
        && spellId != Id.glare2
        && spellId != Id.hirudegarnDarkEyes
        && spellId != Id.shalltearNegativeImpactShield
      )
    ) return;

    const maxGlareDistance = 2500;
    const maxNegativeImpactShieldDistance = 600;
    const glareDamageMult = BASE_DMG.KAME_DPS * 5;
    const glare2DamageMult = BASE_DMG.KAME_DPS * 7.5;
    const negativeImpactShieldDamageMult = BASE_DMG.KAME_DPS * 10;
    const glare2StrDiffJirenBonus = 1.05;
    const glare2StrDiffMult = 1.1;
    const glarePunishDamageMult = 0.15;
    const darkEyesPunishDamageMult = 0.25;

    SaveInteger(Globals.genericSpellHashtable, targetId, 0, 0);

    const player = GetOwningPlayer(target);
    Globals.tmpVector.setPos(GetUnitX(target), GetUnitY(target));
    Globals.tmpVector2.setPos(GetUnitX(source), GetUnitY(source));

    if (spellId == Id.shalltearNegativeImpactShield) {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > maxNegativeImpactShieldDistance) {
        return;
      }
    } else {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > maxGlareDistance) {
        return;
      }
    }

    SetUnitX(target, Globals.tmpVector2.x);
    SetUnitY(target, Globals.tmpVector2.y);
        
    const castDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      Globals.tmpVector2.x, Globals.tmpVector2.y, 
      0
    );
    UnitAddAbility(castDummy, DebuffAbilities.STUN_ONE_SECOND);

    const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(target);
    let spellPower = 1.0;
    if (customHero) {
      spellPower = customHero.spellPower;
    }

    let punishMult = glarePunishDamageMult;
    if (spellId == Id.hirudegarnDarkEyes || spellId == Id.shalltearNegativeImpactShield) {
      punishMult = darkEyesPunishDamageMult;
    }

    let damageMult = glareDamageMult;
    if (spellId == Id.glare2) {
      damageMult = glare2DamageMult;
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      damageMult = negativeImpactShieldDamageMult;
    }

    let damageBase = CustomAbility.BASE_DAMAGE + GetHeroInt(target, true);
    if (spellId == Id.glare2) {
      damageBase += Math.max(0, glare2StrDiffMult * (glare2StrDiffJirenBonus * GetHeroStr(target, true) - GetHeroStr(source, true)));
    }

    const abilityLevel = LoadInteger(Globals.genericSpellHashtable, targetId, 2);
    const damage = (
      (AOEDamage.getIntDamageMult(target) * abilityLevel * spellPower * damageMult * damageBase) +
      GetEventDamage() * punishMult
    );

    UnitDamageTarget(
      target,
      source,
      damage,
      true,
      false,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL, 
      WEAPON_TYPE_WHOKNOWS
    );

    IssueTargetOrderById(castDummy, OrderIds.THUNDERBOLT, source);
    RemoveUnit(castDummy);
    
    if (spellId == Id.shalltearNegativeImpactShield) {
      DestroyEffect(
        AddSpecialEffect(
          "PurpleBigExplosion.mdl",
          Globals.tmpVector2.x, Globals.tmpVector2.y
        )
      );
    } else {
      DestroyEffect(
        AddSpecialEffect(
          "Slam.mdl",
          Globals.tmpVector2.x, Globals.tmpVector2.y
        )
      );
    }
    
    if (GetUnitTypeId(target) == Id.jiren) {
      if (Math.random() * 100 < 5) {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenOmaeWaMouShindeiru.mp3", 3317);
      } else {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenGlare2.mp3", 1018);
      }
    }
    SoundHelper.playSoundOnUnit(target, "Audio/Effects/Zanzo.mp3", 1149);
  }
  
  export function DDSRunDPSCheck(
    target: unit,
    source: unit,
    dmg: number,
  ) {
    if (
      UnitHelper.isUnitDead(target)
      || !IsUnitType(source, UNIT_TYPE_HERO)
      || !IsUnitType(target, UNIT_TYPE_HERO)
      || dmg <= 0
    ) return;

    if (GetHeroProperName(target) != "Test Dummy") return;

    const targetId = GetHandleId(target);


    if (!HaveSavedHandle(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_texttag"))) {
      const texttag = CreateTextTag();
      SaveTextTagHandle(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_texttag"), texttag);
      SetTextTagPermanent(texttag, true);
      SetTextTagColor(texttag, 255, 25, 25, 100);
      SetTextTagVisibility(texttag, true);
    }

    const texttag = LoadTextTagHandle(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_texttag"));

    // if no dps timer add one
    if (!HaveSavedHandle(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timer"))) {
      const timer = TimerManager.getInstance().get();
      SaveTimerHandle(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timer"), timer);

      TimerStart(timer, 0.03, true, () => {
        SetTextTagPos(texttag, GetUnitX(target), GetUnitY(target), 10);
        if (GetHandleId(target) == 0) {
          if (texttag) DestroyTextTag(texttag);
          TimerManager.getInstance().recycle(GetExpiredTimer());
          FlushChildHashtable(Globals.genericDDSHashtable, targetId);
          return;
        }
        
        const dmgTotal = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total"));
        if (dmgTotal > 0) {
          // make dmg requirement for incrementing prev dmg time counter nbefore reset
          const prevDmgTotal = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total_prev"))
          const dmgTimeout = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"))
          const dmgTime = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time"));

          if (dmgTotal > prevDmgTotal) {
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total_prev"), dmgTotal);
          } else {
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"), dmgTimeout + 0.03);
          }

          let stunSoftTime = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_soft"));
          let stunHardTime = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_hard"));
          // track stun time
          if (UnitHelper.isUnitStunned(target)) {
            stunSoftTime += 0.03;
            if (UnitHelper.isUnitHardStunned(target)) {
              stunHardTime += 0.03;
            }
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_soft"), stunSoftTime);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_hard"), stunHardTime);
          }

          if (dmgTimeout < Globals.ddsTimeoutSeconds) {
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time"), dmgTime+0.03);
          } else {
            const adjDmgTime = Math.max(1, dmgTime - Globals.ddsTimeoutSeconds);
            const pctDmg = dmgTotal / Math.max(1, GetUnitState(target, UNIT_STATE_MAX_LIFE));
            const actualDps = dmgTotal / adjDmgTime;
            const pctDps = actualDps / Math.max(1, GetUnitState(target, UNIT_STATE_MAX_LIFE));
            const pctStunSoft = stunSoftTime / adjDmgTime;
            const pctStunHard = stunHardTime / adjDmgTime;
            // show final dps stats
            print("SEC: " + R2S(adjDmgTime));
            print("DMG: " + R2S(dmgTotal) + " (" + I2S(R2I(pctDmg * 100)) + "%)");
            print("DPS: " + R2S(actualDps) + " (" + I2S(R2I(pctDps * 100)) + "%)");
            print("CCS: " + R2S(stunSoftTime) + "(" + I2S(R2I(pctStunSoft * 100)) + "%)");
            print("CCH: " + R2S(stunHardTime) + "(" + I2S(R2I(pctStunHard * 100)) + "%)");

            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total_prev"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_soft"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time_stun_hard"), 0);
            SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"), 0);
            SetTextTagTextBJ(texttag, "", 0);
          }
        }
        
        // revive if dead
        if (UnitHelper.isUnitDead(target)) {
          const revTimer = TimerManager.getInstance().get();
          ReviveHero(target, GetUnitX(target), GetUnitY(target), false);
          ShowUnit(target, false);
          PauseUnit(target, true);

          const dmgTimeout = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"))
          const dmgTime = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time"));
          SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_timeout"), Globals.ddsTimeoutSeconds);
          SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_time"), dmgTime + Globals.ddsTimeoutSeconds - dmgTimeout);

          TimerStart(revTimer, Globals.ddsTimeoutSeconds * 0.5, false, () => {
            ShowUnit(target, true);
            PauseUnit(target, false);
            SetUnitManaPercentBJ(target, 100);
            TimerManager.getInstance().recycle(revTimer);
          });
        }
      });
    }

    const dmgTotal = LoadReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total"));
    const newDmg = dmgTotal + dmg;
    SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total"), newDmg);
    SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total_prev"), dmgTotal);
    SetTextTagTextBJ(texttag, R2S(newDmg), 10);
  }

  export function InitCero() {
    /**
     * 0: charge time (0-5s)
     */

    const spellId = GetSpellAbilityId();
    if (spellId == Id.ceroCharge) {
      const caster = GetTriggerUnit();
      const casterId = GetHandleId(caster);
      const player = GetOwningPlayer(caster);
      const playerId = GetPlayerId(player);
      const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
      const chargeAbil = (customHero) ? customHero.getAbility(AbilityNames.Ichigo.CERO_CHARGE) : undefined;
      
      // setup hashtable
      SaveReal(Globals.genericSpellHashtable, casterId, 0, 0);

      TimerStart(CreateTimer(), 0.03, true, () => {
        const newCharge = LoadReal(Globals.genericSpellHashtable, casterId, 0) + 0.03;
        
        SaveReal(Globals.genericSpellHashtable, casterId, 0, newCharge);
        // BlzSetSpecialEffectScale(effect, 1.5 + newCharge * 0.1);
        
        // force fire
        if (Math.abs(newCharge - 4.74) < 0.01) {
          TextTagHelper.showPlayerColorTextOnUnit(
            GetAbilityName(Id.ceroFire), 
            playerId, 
            caster
          );
          SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Ichigo/Cero.mp3", 1880);
          SimpleSpellSystem.doCeroFire(caster, player, Globals.genericSpellHashtable);
          DestroyTimer(GetExpiredTimer());
          SaveReal(Globals.genericSpellHashtable, casterId, 0, 0);
        }
        // reset
        if (
          newCharge >= 4.98 || 
          (
            chargeAbil &&
            !chargeAbil.isInUse()
          )
        ) {
          DestroyTimer(GetExpiredTimer());
          SaveReal(Globals.genericSpellHashtable, casterId, 0, 0);
          // DestroyEffect(effect);
        }
      });
      
    } else if (spellId == Id.ceroFire) {
      const caster = GetTriggerUnit();
      const player = GetOwningPlayer(caster);
      SimpleSpellSystem.doCeroFire(caster, player, Globals.genericSpellHashtable);
    }
  }

  export function doCeroFire(
    caster: unit,
    player: player,
    spellHashtable: hashtable, 
  ) {
    const casterId = GetHandleId(caster);
    const playerId = GetPlayerId(player);

    let damageMult: number = LoadReal(spellHashtable, casterId, 0);
    if (damageMult < 5.01) {
      SaveReal(spellHashtable, casterId, 0, 5.04);
    }
    if (damageMult < 2) {
      damageMult = 0;
    } else {
      damageMult = Math.max(0, damageMult - 1);
    }

    const spellName = abilityCodesToNames.get(Id.ceroFire);
    if (spellName) { 
      const abilityLevel = GetUnitAbilityLevel(caster, Id.ceroCharge);
      Globals.customPlayers[playerId].selectedUnit = caster;
      // let spellTargetUnit = undefined;
      // if (GetSpellTargetUnit()) {
      //   Globals.customPlayers[playerId].targetUnit = GetSpellTargetUnit();
      //   spellTargetUnit = Globals.customPlayers[playerId].targetUnit;
      // }
      const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
      if (customHero) {
        const abilityInput = new CustomAbilityInput(
          Id.ceroFire,
          customHero,
          player,
          abilityLevel,
          Globals.customPlayers[playerId].orderPoint,
          Globals.customPlayers[playerId].mouseData,
          Globals.customPlayers[playerId].lastCastPoint.clone(),
          undefined,
          undefined,
          damageMult
        );
        customHero.useAbility(spellName, abilityInput);
      }
    }
  }

  export function DoBankai() {
    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    let abilityLevel = GetUnitAbilityLevel(caster, Id.bankai);
    let spellName = AbilityNames.Ichigo.BANKAI;
    let spellTargetUnit = caster;
    if (abilityLevel >= 10 || spellId == Id.bankaiFinal) {
      // final
      spellName = AbilityNames.Ichigo.BANKAI_FINAL;
    } else if (abilityLevel >= 7) {
      // blut vene
      spellName = AbilityNames.Ichigo.BANKAI_BLUT_VENE;
      abilityLevel = 1;
    } else if (abilityLevel >= 4) {
      spellName = AbilityNames.Ichigo.BANKAI_HOLLOW;
    }
    
    Globals.customPlayers[playerId].selectedUnit = caster;
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (customHero) {
      // reset bankai cooldown if it is already active
      const abil = customHero.getAbility(spellName);
      if (abil) {
        abil.resetCooldown();
        abil.endAbility();
      }
      const abilityInput = new CustomAbilityInput(
        spellId,
        customHero,
        player,
        abilityLevel,
        Globals.customPlayers[playerId].orderPoint,
        Globals.customPlayers[playerId].mouseData,
        Globals.customPlayers[playerId].lastCastPoint.clone(),
        spellTargetUnit,
        spellTargetUnit
      );
      customHero.useAbility(spellName, abilityInput);
    }
  }

  export function dartRedEyedDragonSummoning() {
    const duration = 10.0;
    const spellAmpBonus = 0.25;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (customHero) {
      let elapsedTime = 0;

      customHero.addSpellPower(spellAmpBonus);
      TimerStart(CreateTimer(), 0.03, true, () => {
        elapsedTime += 0.03;
        if (
          elapsedTime >= duration || 
          GetUnitAbilityLevel(caster, Buffs.DRAGOON_TRANSFORMATION) == 0
        ) {
          customHero.removeSpellPower(spellAmpBonus);
          DestroyTimer(GetExpiredTimer());
        }
      });
    }
  }

  export function dartDragoonTransformation() {
    const duration = 10.0;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (customHero) {
      let elapsedTime = 0;
      const abil = customHero.getAbility(AbilityNames.DartFeld.DRAGOON_TRANSFORMATION);
      if (abil) {
        TimerStart(CreateTimer(), 2.0, true, () => {
          elapsedTime += 2.0;
          if (
            elapsedTime >= duration || 
            GetUnitAbilityLevel(caster, Buffs.DRAGOON_TRANSFORMATION) == 0
          ) {
            abil.setCd(0);
            abil.setCurrentTick(abil.getDuration());
            DestroyTimer(GetExpiredTimer());
          }
        });
      }
    }
  }

  export function DoMadnessDebuff() {
    const spellId = GetSpellAbilityId();
    // 0: stacks
    const maxMadnessStacks = 7;
    const madnessStunOrder = 852095;
    const madnessStunDamage = 0.1;
    const madnessCurseOrder = 852190;

    const target = GetSpellTargetUnit();
    const targetId = GetHandleId(target);
    if (GetUnitAbilityLevel(target, Buffs.MADNESS_CURSE_MISS) == 0) {
      const stacks = 1+LoadInteger(Globals.genericEnemyHashtable, targetId, 0);

      TextTagHelper.showPlayerColorTextOnUnit(
        I2S(stacks), 3, target, stacks + 8     
      );

      if (stacks >= maxMadnessStacks) {
        FlushChildHashtable(Globals.genericEnemyHashtable, targetId);
        // stun.. n debuff 
        const caster = GetTriggerUnit();
        const casterPlayer = GetOwningPlayer(caster);
        Globals.tmpVector.setUnit(caster);

        const castDummy = CreateUnit(
          casterPlayer, 
          Constants.dummyCasterId, 
          Globals.tmpVector.x, Globals.tmpVector.y, 
          0
        );
        UnitAddAbility(castDummy, Id.madnessDebuffCurse);
        UnitAddAbility(castDummy, DebuffAbilities.STUN_TWO_SECOND);

        if (UnitHelper.isUnitTargetableForPlayer(target, casterPlayer)) {
          IssueTargetOrderById(castDummy, madnessCurseOrder, target);
          IssueTargetOrderById(castDummy, madnessStunOrder, target);
          const newHP = (
            GetUnitState(target, UNIT_STATE_LIFE) - 
            (madnessStunDamage * GetUnitState(target, UNIT_STATE_MAX_LIFE))
          );
          SetUnitState(
            target, 
            UNIT_STATE_LIFE, 
            Math.max(50, newHP)
          );
        }

        RemoveUnit(castDummy);

      } else {
        SaveInteger(Globals.genericEnemyHashtable, targetId, 0, stacks);
      }
    }
  }

  export function AylaCharm() {
    const spellId = GetSpellAbilityId();

    const charmDuration = 10.0;
    const maxHPReduction = 0.18;
    const allyHPModifier = 0.5;
    const stealThreshold = 0.8;

    const caster = GetTriggerUnit();
    const casterPlayer = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();
    
    if (UnitHelper.isUnitTargetableForPlayer(target, casterPlayer, true)) {
      const targetMaxHP = GetUnitState(target, UNIT_STATE_MAX_LIFE);
      let hpReduction = maxHPReduction * targetMaxHP;
      if (IsUnitAlly(target, casterPlayer)) {
        hpReduction *= allyHPModifier;
      }
      
      // temporarily reduce hp
      // amount is lesser for allied targets
      const newHP = Math.max(
        50,
        GetUnitState(target, UNIT_STATE_LIFE)
        - hpReduction
      );
      SetUnitState(target, UNIT_STATE_LIFE, newHP);
      
      // restore reduced hp
      TimerStart(CreateTimer(), charmDuration, false, () => {
        if (UnitHelper.isUnitAlive(target)) {
          const restoredHP = Math.max(
            50,
            GetUnitState(target, UNIT_STATE_LIFE)
            + maxHPReduction * GetUnitState(target, UNIT_STATE_MAX_LIFE)
          );
          SetUnitState(target, UNIT_STATE_LIFE, restoredHP);

          DestroyEffect(
            AddSpecialEffect(
              "Abilities\\Spells\\Human\\Feedback\\SpellBreakerAttack.mdl",
              GetUnitX(target), GetUnitY(target)
            )
          );
        }

        DestroyTimer(GetExpiredTimer());
      });

      if (
        GetOwningPlayer(target) == Constants.sagaPlayer
        && newHP <= stealThreshold * targetMaxHP
      ) {
        const casterInventoryCount = UnitInventoryCount(caster);
        for (let i = 0; i < 6; ++i) {
          const item = UnitItemInSlot(target, i);
          if (item) {
            if (casterInventoryCount <= 5) {
              UnitAddItem(caster, item);
            } else {
              SetItemPosition(item, GetUnitX(caster), GetUnitY(caster));
            }
            break;
          }
        }
      }
    }

  }

  // SetupAylaTripleKick(
  //   Globals.genericSpellTrigger: trigger, 
  //   Globals.genericSpellHashtable: hashtable, 
  //   Globals.customPlayers: CustomPlayer[]
  // ) {
  //   const tripleKickMaxCast: number = 3;
  //   const tripleKickLongCooldown: number = 30.0;

  //   /**
  //    * hashtable
  //    * 0: counter
  //    */

  //   TriggerAddAction(Globals.genericSpellTrigger, () => {
  //     const spellId = GetSpellAbilityId();
  //     if (spellId == Id.aylaTripleKick) {
  //       const unit = GetTriggerUnit();
  //       const unitId = GetHandleId(unit);
  //       let counter = LoadInteger(Globals.genericSpellHashtable, unitId, 0) + 1;

  //       if (counter >= tripleKickMaxCast) {
  //         counter = 0;
  //         // force long cd
  //         BlzStartUnitAbilityCooldown(unit, spellId, tripleKickLongCooldown);
  //       }

  //       SaveInteger(Globals.genericSpellHashtable, unitId, 0, counter);
  //     }
  //   });

  // }

  export function MagusDarkMatter() {
    const closenessDamageMult = 1.0;
    const durationDamageMult = 1.0;
    const aoe = 750;
    const angle = 75;
    const closenessAngle = 90 + 12;
    const distance = 40;
    const closenessDistanceMult = -0.25;
    const maxDuration = 66;
  
    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    const abilityLevel = GetUnitAbilityLevel(caster, spellId);
    const currentPos = new Vector2D();

    if (customHero) {
      currentPos.setUnit(caster);
      let currentTick = 0;
      TimerStart(CreateTimer(), 0.03, true, () => {
        if (currentTick >= maxDuration) {
          DestroyTimer(GetExpiredTimer());
        } else {
          const durationRatio = currentTick / Math.max(1, maxDuration);
          SimpleSpellSystem.performGroundVortex(
            customHero,
            player,
            abilityLevel,
            darkMatterDamage,
            closenessDamageMult,
            durationDamageMult,
            aoe,
            angle,
            closenessAngle,
            distance,
            closenessDistanceMult,
            durationRatio,
            currentPos
          );
          ++currentTick;
        }
      });
    }
  }

  export function groundVortexDamageTarget(
    target: unit,
    caster: CustomHero,
    level: number,
    damage: DamageData,
    closenessDamageMult: number,
    closenessRatio: number,
    durationDamageMult: number,
    durationRatio: number,
  ) {
    let damageThisTick = AOEDamage.getIntDamageMult(caster.unit) * level * caster.spellPower * damage.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(damage.attribute, caster.unit, true)
      ) *
      (
        (1 + closenessDamageMult * closenessRatio) * 
        (1 + durationDamageMult * durationRatio)
      )
    ;

    UnitDamageTarget(
      caster.unit, 
      target,
      damageThisTick,
      true,
      false,
      damage.attackType,
      damage.damageType,
      damage.weaponType
    );
  }

  export function performGroundVortex(
    caster: CustomHero,
    casterPlayer: player,
    level: number,
    damage: DamageData,
    closenessDamageMult: number,
    durationDamageMult: number,
    aoe: number,
    angle: number,
    closenessAngle: number,
    distance: number,
    closenessDistanceMult: number,
    durationRatio: number,
    currentPos: Vector2D,
  ) {
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      currentPos.x, 
      currentPos.y, 
      aoe,
      null
    );

    // this.currentCoord.setUnit(input.caster.unit);
    ForGroup(Globals.tmpUnitGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, casterPlayer)) {

        Globals.tmpVector.setUnit(target);
        const targetDistance = CoordMath.distance(currentPos, Globals.tmpVector);

        // closenessRatio = 1 at 0 distance, 0 at max distance
        const closenessRatio = 1 - (targetDistance / Math.max(1, aoe));

        const projectionAngle = 
          angle + 
          (closenessAngle - angle) * closenessRatio + 
          CoordMath.angleBetweenCoords(currentPos, Globals.tmpVector);
        
        const projectionDistance = 
          distance + 
          (closenessDistanceMult * distance) * closenessRatio;
        
        Globals.tmpVector.polarProjectCoords(
          Globals.tmpVector, 
          projectionAngle,
          projectionDistance
        );

        PathingCheck.moveGroundUnitToCoord(target, Globals.tmpVector);
        SimpleSpellSystem.groundVortexDamageTarget(
          target,
          caster,
          level,
          damage,
          closenessDamageMult,
          durationDamageMult,
          closenessRatio,
          durationRatio
        );
      }
    });

    GroupClear(Globals.tmpUnitGroup);
  }


  export function JungleRushBananaFallout() {
    const bananaThrowDuration = 24;
    const bananaThrowSpeed = 49;
    const bananaThrowStealMinDuration = 16;
    const bananaThrowStealAOE = 300;
    const bananaThrowAmount = 6;
    const bananaThrowDirectionOffset = 360 / Math.max(1, bananaThrowAmount);
    
    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterPlayer = GetTriggerPlayer();
    // const casterPlayerId = GetPlayerId(casterPlayer);
    const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const direction = CoordMath.angleBetweenCoords(casterPos, targetPos);

    TimerStart(CreateTimer(), 1.0, false, () => {
      DestroyTimer(GetExpiredTimer());

      SoundHelper.playSoundOnUnit(caster, "Audio/Effects/BananaBunch.mp3", 1071);

      for (let i = 0; i < bananaThrowAmount; ++i) {
        const bananaItem = CreateItem(
          ItemConstants.Consumables.BANANA, 
          GetUnitX(caster), GetUnitY(caster)
        );
        SimpleSpellSystem.moveItemAndDoPickup(
          bananaItem,
          bananaThrowSpeed,
          direction + i * bananaThrowDirectionOffset,
          bananaThrowDuration,
          bananaThrowStealMinDuration,
          bananaThrowStealAOE
        );

        TimerStart(CreateTimer(), 10.0, false, () => {
          if (!IsItemOwned(bananaItem)) {
            RemoveItem(bananaItem);
          }
        });
      }
    });
  }


  export function BarrelCannon() {
    const barrelDuration = 33 * 10;
    const barrelShootMinDuration = 33;
    const updateRate = 0.03;
    const turnRate = 9.0;
    const barrelAOE = 300;
    const barrelMoveMinDuration = 12;

    // 0: timer
    // 1: direction (angle)
    // 2: prev x
    // 3: prev y

    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetTriggerPlayer();

    Globals.tmpVector.setUnit(caster);

    // create a barrel blast
    const barrelDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      Globals.tmpVector.x, Globals.tmpVector.y, 
      0
    );

    const newHP = 250 * GetHeroLevel(caster) + 1000;
    BlzSetUnitMaxHP(barrelDummy, newHP);
    ShowUnitHide(barrelDummy);

    const barrelSfx = AddSpecialEffect(
      "DKBarrelCannon.mdl",
      Globals.tmpVector.x,
      Globals.tmpVector.y
    );
    BlzSetSpecialEffectScale(barrelSfx, 1.5);

    let direction = GetUnitFacing(caster);
    BlzSetSpecialEffectYaw(barrelSfx, direction * CoordMath.degreesToRadians);
    

    let counter = 0;
    TimerStart(CreateTimer(), updateRate, true, () => {
      if (counter >= barrelDuration || UnitHelper.isUnitDead(barrelDummy)) {
        if (UnitHelper.isUnitAlive(barrelDummy)) {
          RemoveUnit(barrelDummy);
        }
        DestroyEffect(barrelSfx);
        DestroyTimer(GetExpiredTimer());

      } else if (counter >= barrelShootMinDuration) {
        BlzSetSpecialEffectYaw(barrelSfx, direction * CoordMath.degreesToRadians);
        BlzSetSpecialEffectX(barrelSfx, GetUnitX(barrelDummy));
        BlzSetSpecialEffectY(barrelSfx, GetUnitY(barrelDummy));

        // collect nearby units and shoot them away
        const barrelGroup = CreateGroup();
        GroupEnumUnitsInRange(
          barrelGroup,
          GetUnitX(barrelDummy),
          GetUnitY(barrelDummy),
          barrelAOE,
          null
        );

        ForGroup(barrelGroup, () => {
          const unit = GetEnumUnit();
          const unitId = GetHandleId(unit);
          const barrelMoveTime = LoadInteger(Globals.barrelHashtable, unitId, 0);
          if (
            UnitHelper.isUnitAlive(unit)
            // && IsUnitType(unit, UNIT_TYPE_HERO)
            && UnitHelper.isUnitTargetableForPlayer(unit, player, true)
            && (
              barrelMoveTime <= 0 ||
              barrelMoveTime > barrelMoveMinDuration
            )
          ) {
            SaveInteger(Globals.barrelHashtable, unitId, 0, 1);
            SaveReal(Globals.barrelHashtable, unitId, 1, direction);
            SaveReal(Globals.barrelHashtable, unitId, 2, GetUnitX(unit));
            SaveReal(Globals.barrelHashtable, unitId, 3, GetUnitY(unit));
            GroupAddUnit(Globals.barrelUnitGroup, unit);
            EnableTrigger(Globals.barrelMoveTrigger);

            DestroyEffect(
              AddSpecialEffect(
                "Abilities\\Weapons\\Mortar\\MortarMissile.mdl",
                GetUnitX(unit),
                GetUnitY(unit)
              )
            );
          }
        });

        
        DestroyGroup(barrelGroup);
        
        // make it spin
        direction += turnRate;
      }

      counter++;
    });
  }


  export function HirudegarnSkinChange() {
    const abilityId = GetSpellAbilityId();
    const unit = GetTriggerUnit();
    const unitId = GetUnitTypeId(unit);
    const player = GetOwningPlayer(unit);
    if (
      unitId == Id.hirudegarn 
      && abilityId == Id.hirudegarnDarkMist
    ) {

      const formLevel = GetUnitAbilityLevel(unit, Id.hirudegarnPassive);
      const heroLevel = GetHeroLevel(unit);
      if (formLevel == 1) {
        AddUnitAnimationProperties(unit, "alternate", false);
        AddUnitAnimationProperties(unit, "gold", true);
        SetUnitAbilityLevel(unit, Id.hirudegarnPassive, 2);

        SetPlayerAbilityAvailable(player, Id.hirudegarnFlameBreath, false);
        SetPlayerAbilityAvailable(player, Id.hirudegarnFlameBall, false);
        SetPlayerAbilityAvailable(player, Id.hirudegarnChouMakousen, false);
        // form 2 abilities
        SetPlayerAbilityAvailable(player, Id.hirudegarnTailSweep, true);
        SetPlayerAbilityAvailable(player, Id.hirudegarnTailAttack, true);
        if (heroLevel >= 150) {
          SetPlayerAbilityAvailable(player, Id.hirudegarnHeavyStomp, true);
        }

      } else if (formLevel == 2) {
        AddUnitAnimationProperties(unit, "alternate", true);
        AddUnitAnimationProperties(unit, "gold", false);
        SetUnitAbilityLevel(unit, Id.hirudegarnPassive, 1);

        SetPlayerAbilityAvailable(player, Id.hirudegarnTailSweep, false);
        SetPlayerAbilityAvailable(player, Id.hirudegarnTailAttack, false);
        SetPlayerAbilityAvailable(player, Id.hirudegarnHeavyStomp, false);
        // form 1 abilities
        SetPlayerAbilityAvailable(player, Id.hirudegarnFlameBreath, true);
        SetPlayerAbilityAvailable(player, Id.hirudegarnFlameBall, true);
        if (heroLevel >= 150) {
          SetPlayerAbilityAvailable(player, Id.hirudegarnChouMakousen, true);
        }
      }
    }
  }


  export function VegetaFightingSpirit() {
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    const customHero = Globals.customPlayers[playerId].getCustomHero(unit);

    if (customHero) {
      // give spell amp
      const spellAmp = 0.3 * (
        Math.max(
          0, 
          1 - GetUnitState(unit, UNIT_STATE_LIFE) / Math.max(1, GetUnitState(unit, UNIT_STATE_MAX_LIFE))
        )
      );
      customHero.addSpellPower(spellAmp);

      // timer remove it
      TimerStart(CreateTimer(), 10.0, false, () => {
        customHero.removeSpellPower(spellAmp);
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  export function SchalaTeleportation() {
    const spellId = GetSpellAbilityId();
    const schalaTpMoveDuration = 33;
    const schalaTpMoveDuration2 = 16;
    const schalaTpEndTick = 166;
    const schalaTpAOE = 600;
    const schalaTpMaxDist = 6000;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);

    const tpUnit = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    ShowUnit(tpUnit, false);
    SetUnitInvulnerable(tpUnit, true);
    
    const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const direction = CoordMath.angleBetweenCoords(casterPos, targetPos);
    const maxDist =  Math.min(4000, Math.max(1500, CoordMath.distance(casterPos, targetPos)));

    let beamSpeed = maxDist
    if (spellId == Id.schalaTeleportation) {
      beamSpeed /= schalaTpMoveDuration;
    } else if (spellId == Id.schalaTeleportation2) {
      beamSpeed /= schalaTpMoveDuration2;
    }
    beamSpeed *= 2;
    const sfxCast = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      casterPos.x, casterPos.y
    );
    BlzSetSpecialEffectScale(sfxCast, 3.0);
    const sfxBeam = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      casterPos.x, casterPos.y
    );
    BlzSetSpecialEffectScale(sfxBeam, 3.0);

    let tick = 0;
    const tpTimer = TimerManager.getInstance().get();
    TimerStart(tpTimer, 0.03, true, () => {
      if (tick > schalaTpEndTick) {
        RemoveUnit(tpUnit);
        DestroyEffect(sfxCast);
        DestroyEffect(sfxBeam);
        TimerManager.getInstance().recycle(tpTimer);
      } else {
        targetPos.setUnit(tpUnit);
        if (
          CoordMath.distance(casterPos, targetPos) < maxDist
          && (
            (
              spellId == Id.schalaTeleportation && 
              tick < schalaTpMoveDuration
            ) ||
            (
              spellId == Id.schalaTeleportation2 &&
              tick < schalaTpMoveDuration2
            )
          )
        ) {
          targetPos.polarProjectCoords(targetPos, direction, beamSpeed);
          BlzSetSpecialEffectX(sfxBeam, targetPos.x);
          BlzSetSpecialEffectY(sfxBeam, targetPos.y);
          PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(tpUnit, targetPos);
        }

        if (
          tick >= schalaTpMoveDuration
          || (
            spellId == Id.schalaTeleportation2
            && tick >= schalaTpMoveDuration2
          )
        ) {
          const schalaUnitGroup = CreateGroup();
          
          GroupEnumUnitsInRange(schalaUnitGroup, casterPos.x, casterPos.y, schalaTpAOE, null);

          ForGroup(schalaUnitGroup, () => {
            const unit = GetEnumUnit();
            if (
              // TODO: turn this back on
              IsUnitAlly(unit, player)
              && UnitHelper.isUnitTargetableForPlayer(unit, player, true) 
              && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
              && GetUnitTypeId(unit) != Id.schala
              // true
            ) {
              Globals.tmpVector.setPos(GetUnitX(unit), GetUnitY(unit));
              const distance = CoordMath.distance(Globals.tmpVector, casterPos);
              if (CoordMath.distance(Globals.tmpVector, targetPos) < schalaTpMaxDist) {                  
                Globals.tmpVector.polarProjectCoords(
                  targetPos, 
                  CoordMath.angleBetweenCoords(casterPos, Globals.tmpVector), 
                  distance
                );
                PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(unit, Globals.tmpVector);
                DestroyEffect(
                  AddSpecialEffect(
                    "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportCaster.mdl", 
                    Globals.tmpVector.x, Globals.tmpVector.y
                  )
                );

                if (
                  IsUnitType(unit, UNIT_TYPE_HERO)
                  && !IsUnitType(unit, UNIT_TYPE_SUMMONED)
                  && GetPlayerController(GetOwningPlayer(unit)) == MAP_CONTROL_USER
                ) {
                  SetCameraPositionForPlayer(
                    GetOwningPlayer(unit), 
                    Globals.tmpVector.x, Globals.tmpVector.y
                  );
                }
              }
            }
          });
          DestroyGroup(schalaUnitGroup);
        }
        
        // hack to check channel
        if (
          GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_OFF
          && GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_ON
        ) {
          tick += schalaTpEndTick;
        }
        ++tick;
      }
    });

  }

  export function YamchaCombos() {
    const spellId = GetSpellAbilityId();
    // globals hashtable
    // 0: 1st slot
    // 1: 2nd slot
    // 2: 3rd slot
    const yamchaComobCdInc = 0.2;
    const yamchaComobCdMax = 15;

    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);

    const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
    if (customHero) {
      IssuePointOrderById(
        unit, 
        OrderIds.MOVE, 
        Globals.customPlayers[playerId].orderPoint.x, 
        Globals.customPlayers[playerId].orderPoint.y
      );

      let s1 = LoadInteger(Globals.genericSpellHashtable, unitId, 0);
      let s2 = LoadInteger(Globals.genericSpellHashtable, unitId, 1);
      let s3 = LoadInteger(Globals.genericSpellHashtable, unitId, 2);

      if (s3 > 0) {
        SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
        SaveInteger(Globals.genericSpellHashtable, unitId, 1, 0);
        SaveInteger(Globals.genericSpellHashtable, unitId, 2, 0);
        s1 = 0;
        s2 = 0;
        s3 = 0;
      }

      let castVal = 0;
      if (spellId == Id.yamchaRLightPunch) {
        castVal = 1;
      } else if (spellId == Id.yamchaRMediumPunch) {
        castVal = 2;
      } else if (spellId == Id.yamchaRHeavyPunch) {
        castVal = 3;
      }

      if (s1 == 0) {
        SaveInteger(Globals.genericSpellHashtable, unitId, 0, castVal);
      } else if (s2 == 0) {
        SaveInteger(Globals.genericSpellHashtable, unitId, 1, castVal);
      } else if (s3 == 0) {
        s3 = castVal;
        SaveInteger(Globals.genericSpellHashtable, unitId, 2, castVal);
        
        // BJDebugMsg(I2S(s1) + I2S(s2) + I2S(s3));

        let sum = s1 * 100 + s2 * 10 + s3; 
        let abilName = AbilityNames.YamchaR.LIGHT_PUNCH;
        
        if (sum == 111) {
          abilName = AbilityNames.YamchaR.DASH_FORWARD;
        } else if (sum == 112) {
          abilName = AbilityNames.YamchaR.DASH_LEFT;
        } else if (sum == 113) {
          abilName = AbilityNames.YamchaR.DASH_RIGHT;
        } else if (sum == 121) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_HURRICANE;
        } else if (sum == 122) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_VOLLEY;
        } else if (sum == 123) {
          abilName = AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST;
        } else if (sum == 131) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK;
        } else if (sum == 132) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_FLASH;
        } else if (sum == 133) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_FINISHER;
        } else if (sum == 211) {
          abilName = AbilityNames.YamchaR.SPIRIT_BALL;
        } else if (sum == 212) {
          abilName = AbilityNames.YamchaR.FLASH_KAME;
        } else if (sum == 213) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_BARRAGE;
        } else if (sum == 221) {
          abilName = AbilityNames.YamchaR.SUPER_SPIRIT_BALL;
        } else if (sum == 222) {
          abilName = AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA;
        } else if (sum == 223) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_BLAST;
        } else if (sum == 231) {
          abilName = AbilityNames.YamchaR.HOMERUN;
        } else if (sum == 232) {
          abilName = AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST;
        } else if (sum == 233) {
          abilName = AbilityNames.YamchaR.BATTER_UP;
        } else if (sum == 311) {
          abilName = AbilityNames.YamchaR.NEO_WOLF_FANG_FIST;
        } else if (sum == 312) {
          abilName = AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST;
        } else if (sum == 313) {
          abilName = AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST;
        } else if (sum == 321) {
          abilName = AbilityNames.YamchaR.SUMMON_PUAR;
        } else if (sum == 322) {
          abilName = AbilityNames.YamchaR.YAMCHA_BLAST;
        } else if (sum == 323) {
          abilName = AbilityNames.YamchaR.PLAY_DEAD;
        } else if (sum == 331) {
          abilName = AbilityNames.YamchaR.UPPERCUT;
        } else if (sum == 332) {
          abilName = AbilityNames.YamchaR.METEOR_CRASH;
        } else if (sum == 333) {          
          abilName = AbilityNames.YamchaR.SLEDGEHAMMER;
        }

        SetUnitState(
          unit, 
          UNIT_STATE_MANA, 
          GetUnitState(unit, UNIT_STATE_MANA) 
          + 0.01 * GetUnitState(unit, UNIT_STATE_MAX_MANA)
        );

        const dmgMult = 0.5 + (GetHeroLevel(unit) * 0.0005);

        // BJDebugMsg(R2S(Globals.customPlayers[playerId].orderPoint.x) + "," + R2S(Globals.customPlayers[playerId].orderPoint.y));
        // fire a special qwe
        const abilityInput = new CustomAbilityInput(
          spellId,
          customHero,
          player,
          GetUnitAbilityLevel(unit, spellId),
          Globals.customPlayers[playerId].orderPoint,
          Globals.customPlayers[playerId].mouseData,
          Globals.customPlayers[playerId].orderPoint.clone(),
          unit,
          unit,
          dmgMult
        );

        if (customHero.canCastAbility(abilName, abilityInput)) {
          // apply cooldown penalty

          // const abilNames = [];
          // let numCd = 0;
          // for (const customAbility of customHero.getCustomAbilities()) {
          //   if (
          //     customAbility.isOnCooldown()
          //     && customAbility.costType != CostType.SP
          //   ) {
          //     abilNames.push(customAbility.getName());
          //     numCd++;
          //   }
          // }

          // for (const name of abilNames) {
          //   const customAbility = customHero.getAbility(name);
          //   if (customAbility) {
          //     const min_cd = Min(
          //       yamchaComobCdMax,
          //       customAbility.getCurrentCd() + (yamchaComobCdInc * numCd)
          //     )
          //     customAbility.setCd(min_cd);
          //   }
          // }

          TextTagHelper.showPlayerColorTextOnUnit(
            abilName, 
            playerId, 
            unit
          );
          customHero.useAbility(abilName, abilityInput);

          


          // BlzStartUnitAbilityCooldown(unit, Id.yamchaRLightPunch, 0);
          // BlzStartUnitAbilityCooldown(unit, Id.yamchaRMediumPunch, 0);
          // BlzStartUnitAbilityCooldown(unit, Id.yamchaRHeavyPunch, 0);
          // const lPunch = customHero.getAbility(AbilityNames.YamchaR.LIGHT_PUNCH);
          // if (lPunch) {
          //   lPunch.setCd(0);
          // }
          // const mPunch = customHero.getAbility(AbilityNames.YamchaR.MEDIUM_PUNCH);
          // if (mPunch) {
          //   mPunch.setCd(0);
          // }
          // const hPunch = customHero.getAbility(AbilityNames.YamchaR.HEAVY_PUNCH);
          // if (hPunch) {
          //   hPunch.setCd(0);
          // }
        } else {
          const customAbil = customHero.getAbility(abilName);
          if (customAbil) {
            const playerForce = Globals.tmpForce;
            ForceClear(playerForce);
            ForceAddPlayer(playerForce, player);
            TextTagHelper.showPlayerColorTextToForce(
              R2S(customAbil.getCurrentCd()),
              GetUnitX(customHero.unit),
              GetUnitY(customHero.unit),
              0, 0, 0,
              playerForce,
              10, 
              255, 255, 255, 255,
              40, 90, 2.0, 3.0
            );
            ForceClear(playerForce);
          }
        }
      }
    }
  }





  export function SkurvyPlunder() {
    const spellId = GetSpellAbilityId();

    const plunderAOE = 350;
    const plunderDuration = 80; // RTT 
    const plunderSendOutDuration = 40;
    const plunderSpeed = 40;
    const plunderDamageMult = BASE_DMG.KAME_DPS * 8;
    const plunderDamageMultPerItem = 0.2;
    const maxPlunderItems = 1;

    const caster = GetTriggerUnit();
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);

    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!customHero) return;
    
    Globals.tmpVector.setPos(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const direction = CoordMath.angleBetweenCoords(Globals.tmpVector, targetPos);

    const plunderBird = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      direction
    );
    SetUnitScale(plunderBird, 1.5, 1.5, 1.5);
    BlzSetUnitSkin(plunderBird, Id.skurvyPlunderBird);
    UnitAddAbility(plunderBird, Id.inventoryHero);
    PauseUnit(plunderBird, true);

    const newHP = 100 * GetHeroLevel(caster) + 500;
    BlzSetUnitMaxHP(plunderBird, newHP);
    SetUnitState(plunderBird, UNIT_STATE_LIFE, newHP);
    // ShowUnit(plunderBird, false);
    
    let time = 0;
    let itemsStolen = 0;
    let birdSpeed = plunderSpeed;
    let lootSignalSfx: effect | undefined = undefined;
    TimerStart(CreateTimer(), 0.03, true, () => {
      if (
        time > plunderDuration 
        // || itemsStolen >= maxPlunderItems
        || UnitHelper.isUnitDead(plunderBird)
      ) {
        // drop loot
        if (itemsStolen > 0) {
          Globals.tmpVector.setUnit(plunderBird);
          for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
            const lootItem = UnitItemInSlot(plunderBird, i);
            SetItemPosition(lootItem, Globals.tmpVector.x, Globals.tmpVector.y);
          }
        }
        if (lootSignalSfx) {
          DestroyEffect(lootSignalSfx);
        }
        RemoveUnit(plunderBird);
        DestroyTimer(GetExpiredTimer());
      } else {
        Globals.tmpVector.setUnit(plunderBird);

        if (
          time > plunderSendOutDuration
          || itemsStolen > 0
        ) {
          // make bird return to caster
          targetPos.setUnit(caster);
          SetUnitFacing(plunderBird, CoordMath.angleBetweenCoords(Globals.tmpVector, targetPos));
          birdSpeed = plunderSpeed * 2;
        }

        Globals.tmpVector.polarProjectCoords(Globals.tmpVector, GetUnitFacing(plunderBird), birdSpeed);
        PathingCheck.moveFlyingUnitToCoord(plunderBird, Globals.tmpVector);
        
        Globals.tmpVector.setUnit(plunderBird);
        GroupEnumUnitsInRange(
          Globals.tmpUnitGroup, 
          Globals.tmpVector.x, 
          Globals.tmpVector.y, 
          plunderAOE,
          null
        );

        ForGroup(Globals.tmpUnitGroup, () => {
          const targetUnit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(targetUnit, player) && 
            itemsStolen < maxPlunderItems
          ) {
            for (let i = 0; i < bj_MAX_INVENTORY && itemsStolen < maxPlunderItems; ++i) {
              const stealItem = UnitItemInSlot(targetUnit, i);
              const itemId = GetItemTypeId(stealItem);
              if (
                itemsStolen < maxPlunderItems
                && BlzGetItemBooleanField(stealItem, ITEM_BF_CAN_BE_DROPPED)
                && BlzGetItemBooleanField(stealItem, ITEM_BF_DROPPED_WHEN_CARRIER_DIES)
                && itemId != ItemConstants.SagaDrops.KING_COLD_ARMOR
                && itemId != ItemConstants.SagaDrops.BROLY_FUR
                && itemId != DragonBallsConstants.dragonBallItem
              ) {
                AOEDamage.dealDamageRaw(
                  GetUnitAbilityLevel(caster, spellId),
                  customHero.spellPower,
                  plunderDamageMult,
                  1.0 + plunderDamageMultPerItem * UnitHelper.countInventory(targetUnit),
                  caster,
                  bj_HEROSTAT_AGI,
                  targetUnit
                );

                UnitDropItemPoint(targetUnit, stealItem, Globals.tmpVector.x, Globals.tmpVector.y);
                UnitAddItem(plunderBird, stealItem);
                ++itemsStolen;

                const auraSfx = AddSpecialEffect(
                  "Abilities\\Spells\\Other\\Transmute\\PileofGold.mdl",
                  Globals.tmpVector.x, Globals.tmpVector.y
                );
                BlzSetSpecialEffectScale(auraSfx, 2.0);
                DestroyEffect(auraSfx);

                lootSignalSfx = AddSpecialEffectTarget(
                  "Objects\\InventoryItems\\PotofGold\\PotofGold.mdl",
                  plunderBird,
                  "overhead"
                );
              }
            }
          } 
          else if (
            itemsStolen > 0 
            && targetUnit == caster 
            && !UnitHelper.isUnitDead(caster))
          { 
            time = plunderDuration;
            targetPos.setUnit(caster);
            // transfer loot to caster
            for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
              const lootItem = UnitItemInSlot(plunderBird, i);
              if (lootItem) {
                SetItemPosition(lootItem, targetPos.x, targetPos.y);
                UnitAddItem(caster, lootItem);
              }
            }
          }
        });

        ++time;
        GroupClear(Globals.tmpUnitGroup);
      }
    });
  }

  export function skurvyMirrorProcessOrder() {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const target = GetOrderTargetUnit();
    const order = GetIssuedOrderId();
    const mirrorState: number = LoadInteger(Globals.genericSpellHashtable, unitId, 0);

    if (mirrorState == 1) {
      const mirrorTarget: unit = LoadUnitHandle(Globals.genericSpellHashtable, unitId, 1);

      const mirrorTargetId: number = GetHandleId(target);
      // only mirror-ify if that unit is not also mirror-ing someone else
      if (LoadInteger(Globals.genericSpellHashtable, mirrorTargetId, 0) == 0) {
        if (order == OrderIds.STOP) {
          IssueImmediateOrderById(mirrorTarget, OrderIds.STOP);
        } 
        else if (!target) {
          const x = GetOrderPointX();
          const y = GetOrderPointY();
          if (x != 0 && y != 0) {
            IssuePointOrderById(mirrorTarget, OrderIds.MOVE, x, y);
          }
        } 
        else if (order == OrderIds.ATTACK) {
          IssueTargetOrderById(mirrorTarget, OrderIds.ATTACK, target);
        }
      }
    }
  }

  export function SetupSkurvyMirror() {
    // globals hashtable
    // 0: is mirrored
    // 1: mirror target

    const spellId = GetSpellAbilityId();
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    // const player = GetTriggerPlayer();
    const target = GetSpellTargetUnit();

    if (LoadInteger(Globals.genericSpellHashtable, unitId, 0) == 0) {
      SaveInteger(Globals.genericSpellHashtable, unitId, 0, 1);
      SaveUnitHandle(Globals.genericSpellHashtable, unitId, 1, target);

      Globals.tmpVector.setUnit(unit);
      Globals.tmpVector2.setUnit(target);
      const angle = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(
        Globals.tmpVector,
        angle,
        0.5 * CoordMath.distance(Globals.tmpVector, Globals.tmpVector2)
      );
      
      const sfx = AddSpecialEffect("SkurvyMirror.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx, 1.5);
      BlzSetSpecialEffectYaw(sfx, angle * CoordMath.degreesToRadians);

      DestroyEffect(
        AddSpecialEffect("SpiritBombShine.mdl", Globals.tmpVector.x, Globals.tmpVector.y)
      );

      TimerStart(CreateTimer(), 4.0, false, () => {
        if (sfx) {
          DestroyEffect(sfx);
        }
        FlushChildHashtable(Globals.genericSpellHashtable, unitId);
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  export function SonicAbilities() {
    // globals hashtable
    // 0: is spinning (0 = false, 1 = true)
    // 1: homing attack ticks
    // 2: homing attack x
    // 3: homing attack y
    // 4: homing attack (original) angle?
    // 5: homing attack state (0 = forwards, 1 = backwards, 2 = re-forwards)
    // 6: homing re-forwards tick
    // 7: homing attack spell level
    // 8: spin dash ticks
    // 9: spin dash level
    // 10: previous speed magnitude
    // 11: light speed dash ticks
    // 12: light speed x
    // 13: light speed y
    // 14: light speed angle
    // 15: light speed dash state (0 = non-init, 1 = charge, 2 = forwards)
    // 16: super sonic ticks

    const spellId = GetSpellAbilityId();
    const unit = GetTriggerUnit();
    const sonicId = GetHandleId(unit);
    let spinVal = LoadInteger(Globals.genericSpellHashtable, sonicId, 0);

    if (
      spellId == Id.sonicSpin || 
      spellId == Id.sonicSpinDash
    ) {
      if (spellId == Id.sonicSpinDash) {
        spinVal = 0;
        SaveInteger(Globals.genericSpellHashtable, sonicId, 8, 28);
        SaveInteger(Globals.genericSpellHashtable, sonicId, 9, GetUnitAbilityLevel(unit, Id.sonicSpinDash));
      }

      if (spinVal == 0) {
        AddUnitAnimationProperties(unit, "alternate", true);
        SaveInteger(Globals.genericSpellHashtable, sonicId, 0, 1);
      } else {
        AddUnitAnimationProperties(unit, "alternate", false);
        SaveInteger(Globals.genericSpellHashtable, sonicId, 0, 0);
      }
    } 
    else if (spellId == Id.sonicHomingAttack) {
      const x = GetSpellTargetX();
      const y = GetSpellTargetY();
      
      // due to some sort of race condition
      // tmpVector2 must be caster
      Globals.tmpVector2.setUnit(unit);
      Globals.tmpVector.setPos(x, y);
      const angle = CoordMath.angleBetweenCoords(
        Globals.tmpVector2,
        Globals.tmpVector
      );

      SaveInteger(Globals.genericSpellHashtable, sonicId, 1, 32);
      SaveReal(Globals.genericSpellHashtable, sonicId, 2, x);
      SaveReal(Globals.genericSpellHashtable, sonicId, 3, y);
      SaveReal(Globals.genericSpellHashtable, sonicId, 4, angle);
      SaveInteger(Globals.genericSpellHashtable, sonicId, 5, 0);
      SaveInteger(Globals.genericSpellHashtable, sonicId, 6, 0);
      SaveInteger(Globals.genericSpellHashtable, sonicId, 7, GetUnitAbilityLevel(unit, Id.sonicHomingAttack));
    } 
    else if (spellId == Id.sonicLightSpeedDash) {
      const x = GetSpellTargetX();
      const y = GetSpellTargetY();

      // due to some sort of race condition
      // tmpVector2 must be caster
      Globals.tmpVector2.setUnit(unit);
      Globals.tmpVector.setPos(x, y);
      const angle = CoordMath.angleBetweenCoords(
        Globals.tmpVector2,
        Globals.tmpVector
      );

      SaveInteger(Globals.genericSpellHashtable, sonicId, 11, 166);
      SaveReal(Globals.genericSpellHashtable, sonicId, 12, x);
      SaveReal(Globals.genericSpellHashtable, sonicId, 13, y);
      SaveReal(Globals.genericSpellHashtable, sonicId, 14, angle);
      SaveInteger(Globals.genericSpellHashtable, sonicId, 15, 0);
    }
    else if (spellId == Id.sonicSuper) {
      SaveInteger(Globals.genericSpellHashtable, sonicId, 16, 500);
    }
  }


  export function InitMafuba() {
    const mafubaMaxHpMult = 0.05;
    const mafubaCurrentHpMult = 0.1;

    // deal damage self
    const caster = GetTriggerUnit();
    const currentHp = GetUnitState(caster, UNIT_STATE_LIFE);
    const selfDmg = (
      mafubaMaxHpMult * GetUnitState(caster, UNIT_STATE_MAX_LIFE)
      + mafubaCurrentHpMult * currentHp
    );
    SetUnitState(caster, UNIT_STATE_LIFE, Math.max(1, currentHp - selfDmg));
  }


  export function DoMafubaSealed() {
    const mafubaSagaDmgMult = 0.25;

    // end cooldowns for target
    const caster = GetTriggerUnit();
    const casterPlayer = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();
    const targetPlayer = GetOwningPlayer(target);
    if (
      IsUnitType(target, UNIT_TYPE_HERO)
      && UnitHelper.isUnitTargetableForPlayer(target, casterPlayer, false)
    ) {
      UnitRemoveBuffs(target, true, true);
      const targetPlayerId = GetPlayerId(targetPlayer);
      if (targetPlayerId == Constants.sagaPlayerId) {
        SetUnitState(
          target, UNIT_STATE_LIFE, 
          Math.max(
            1, 
            GetUnitState(target, UNIT_STATE_LIFE) 
            - mafubaSagaDmgMult * GetUnitState(target, UNIT_STATE_MAX_LIFE)
          )
        );
      }
      if (targetPlayerId >= 0 && targetPlayerId < Globals.customPlayers.length) {
        for (const hero of Globals.customPlayers[targetPlayerId].allHeroes) {
          if (!hero) continue;
          hero.forceEndAllAbilities();
        }
      }
    }
  }

  export function getJacoEliteBeamMult(unit: unit) {
    const eliteBeamMaxTicks = 100;
    const unitId = GetHandleId(unit);
    const isBonus = LoadInteger(Globals.genericSpellHashtable, unitId, 3) == 1;
    const chargeTicks = isBonus ? eliteBeamMaxTicks : LoadInteger(Globals.genericSpellHashtable, unitId, 1);
    let mult = 1 + chargeTicks / eliteBeamMaxTicks;
    if (isBonus) mult += 1;
    // print("ELITE BEAM MULT: ", mult, " BONUS:", isBonus);
    return mult;
  }

  

  export function doJacoEliteBeamCharge() {
    // globals hashtable
    // 0: charge state (0 = base, 1 = charge, 2 = primed)
    // 1: charge ticks (0 - 166)
    // 2: charge bonus start point (prime around this time to receive full bonus)
    // 3: is charge bonused

    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    const eliteBeamPrimeStart = 33;
    const eliteBeamPrimeVariance = 1;
    const eliteBeamPrimeBonusLeeway = 33;
    
    // swap prime
    SetUnitAbilityLevel(unit, Id.jacoEliteBeamPrime, GetUnitAbilityLevel(unit, GetSpellAbilityId()));
    SetUnitAbilityLevel(unit, Id.jacoEliteBeamFire, GetUnitAbilityLevel(unit, GetSpellAbilityId()));
    
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, false);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, true);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, false);

    const bonusTick = R2I(
      eliteBeamPrimeStart 
      + eliteBeamPrimeBonusLeeway * Math.round(eliteBeamPrimeVariance * Math.random()) 
    );

    SaveInteger(Globals.genericSpellHashtable, unitId, 0, 1);
    SaveInteger(Globals.genericSpellHashtable, unitId, 1, 0);
    SaveInteger(Globals.genericSpellHashtable, unitId, 2, bonusTick);
    SaveInteger(Globals.genericSpellHashtable, unitId, 3, 0);
  }

  export function doJacoEliteBeamPrime() {
    const eliteBeamPrimeBonusLeeway = 33;

    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    // swap fire
    Globals.tmpVector.setUnit(unit);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, false);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, false);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, true);

    SaveInteger(Globals.genericSpellHashtable, unitId, 0, 2);

    const currentTick = LoadInteger(Globals.genericSpellHashtable, unitId, 1);
    const bonusTickStart = LoadInteger(Globals.genericSpellHashtable, unitId, 2);
    if (
      currentTick > bonusTickStart 
      && currentTick < bonusTickStart + eliteBeamPrimeBonusLeeway
    ) {
      SaveInteger(Globals.genericSpellHashtable, unitId, 3, 1);
      DestroyEffect(
        AddSpecialEffect(
          "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
          Globals.tmpVector.x, Globals.tmpVector.y
        )
      );
    }
    DestroyEffect(
      AddSpecialEffect(
        "SpiritBomb.mdl", 
        Globals.tmpVector.x, Globals.tmpVector.y
      )
    );
  }

  export function doJacoEliteBeamFire() {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    // swap to charge
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, true);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, false);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, false);
    SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
  }

  export function doJacoEmergencyBoost() {
    const unit = GetTriggerUnit();

    const cdMod = 10;
    BlzStartUnitAbilityCooldown(unit, Id.jacoEliteBeamCharge, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoEliteBeamCharge) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoEliteBeamFire, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoEliteBeamFire) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoAnnihilationBomb, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoAnnihilationBomb) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoRocketBoots, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoRocketBoots) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoSuperEliteCombo, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoSuperEliteCombo) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoElitePose, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoElitePose) + cdMod);
    BlzStartUnitAbilityCooldown(unit, Id.jacoShip, BlzGetUnitAbilityCooldownRemaining(unit, Id.jacoShip) + cdMod);
  }

  export function doJacoAnnihilationBomb() {
    const extinctionBombDelay = 3;
    const extinctionBombMaxDist = 600;
    const extinctionBombAOE = 500;
    const extinctionBombStrMult = 1;
    const extinctionBombHpMult = 0.75;

    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    const playerId = GetPlayerId(player);

    Globals.tmpVector.setUnit(unit);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());

    const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    if (dist > extinctionBombMaxDist) {
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, ang, extinctionBombMaxDist);
    }

    const bomb = CreateUnit(
      Player(PLAYER_NEUTRAL_AGGRESSIVE), 
      Id.taoGrenade, 
      Globals.tmpVector2.x, Globals.tmpVector2.y, 
      0
    );
    BlzSetUnitName(bomb, "Extinction Bomb");
    SetUnitMoveSpeed(bomb, 400);
    
    // blow it up in 5seconds
    let delay = extinctionBombDelay;
    let ttSize = math.max(5, 5 * (extinctionBombDelay + 1 - delay));
    
    ForceClear(Globals.tmpForce);
    ForceAddPlayer(Globals.tmpForce, GetOwningPlayer(unit));
    TextTagHelper.showTempText(
      Colorizer.getPlayerColorText(playerId) + I2S(delay) + "!",
      GetUnitX(bomb), GetUnitY(bomb),
      ttSize, 1.5, 0.5,
      Globals.tmpForce
    );
    ForceClear(Globals.tmpForce);


    TimerStart(CreateTimer(), 1.0, true, () => {
      --delay;
      if (delay <= 0) {
        // go boom deal str * 2 + HP dmg
        DestroyTimer(GetExpiredTimer());

        let spellPower = 1.0;
        const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(unit);
        if (customHero) spellPower = customHero.spellPower;

        GroupEnumUnitsInRange(
          Globals.tmpUnitGroup,
          GetUnitX(bomb),
          GetUnitY(bomb),
          extinctionBombAOE,
          null
        );
        
        const maxHpDamage = spellPower * (
          GetHeroInt(unit, true) * extinctionBombStrMult
          + extinctionBombHpMult * (GetUnitState(unit, UNIT_STATE_MAX_LIFE) - GetUnitState(unit, UNIT_STATE_LIFE))
        );
        ForGroup(Globals.tmpUnitGroup, () => {
          const damagedUnit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(damagedUnit, player)
            || damagedUnit == unit
          ) {
            if (damagedUnit == unit) {
              SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Jaco/WSelfDMG.mp3", 500);
            }
            UnitDamageTarget(
              unit, 
              damagedUnit, 
              maxHpDamage, 
              true, 
              false, 
              ATTACK_TYPE_HERO, 
              DAMAGE_TYPE_NORMAL, 
              WEAPON_TYPE_WHOKNOWS
            );
          }
        });
        
        TextTagHelper.showTempText(
          Colorizer.getPlayerColorText(playerId) + "KABOOM! " + I2S(R2I(maxHpDamage)) + "!",
          GetUnitX(bomb), GetUnitY(bomb),
          ttSize, 3.0, 2.0
        );

        const sfx = AddSpecialEffect(
          "NuclearExplosion.mdl", GetUnitX(bomb), GetUnitY(bomb),
        );
        DestroyEffect(sfx);

        RemoveUnit(bomb);
      } else {
        ttSize = math.max(5, 5 * (extinctionBombDelay + 1 - delay));
        TextTagHelper.showTempText(
          Colorizer.getPlayerColorText(playerId) + I2S(delay) + "!",
          GetUnitX(bomb), GetUnitY(bomb),
          ttSize, 1.5, 0.5
        );
      }
    });
  }

  export function doJacoElitePose() {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    PauseUnit(unit, true);
    SetUnitInvulnerable(unit, true);
    SetUnitAnimationByIndex(unit, 5);

    TimerStart(CreateTimer(), 1.0, false, () => {
      DestroyTimer(GetExpiredTimer());
      ResetUnitAnimation(unit);
      PauseUnit(unit, false);
      // hardcode check hero pick region
      if (!RectContainsUnit(gg_rct_HeroPickRegion, unit)) {
        SetUnitInvulnerable(unit, false);
      }
    });
  }
  
  export function doJacoShip() {
    const flySpeed = 40;
    const macroCannonDmgMult = BASE_DMG.KAME_DPS * 5;
    const baseAOE = 400;
    const maxAOE = 600;
    const AOEperDistance = 50;
    const minExpandingDistance = 1000;

    const flyHeightTicks = 20;
    const flyHeightGainedPerTick = 45;
    const maxStuckTicks = 33;
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    const targetX = GetSpellTargetX();
    const targetY = GetSpellTargetY();
    
    Globals.tmpVector.setUnit(unit);
    Globals.tmpVector2.setPos(targetX, targetY);
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    const origDistance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    const descendTick = origDistance / flySpeed;

    const height = GetUnitFlyHeight(unit) + BlzGetUnitZ(unit);

    UnitHelper.giveUnitFlying(unit);

    PauseUnit(unit, true);
    SetUnitAnimationByIndex(unit, 1);

    const sfx = AddSpecialEffect("JacoShip.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    const sfx2 = AddSpecialEffect("PlanetCrusherGeneric.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    const sfx3 = AddSpecialEffect("SpiritBomb.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectHeight(sfx2, height);
    BlzSetSpecialEffectColor(sfx2, 255, 125, 255);
    BlzSetSpecialEffectColor(sfx3, 255, 125, 255);

    const flyTimer = TimerManager.getInstance().get();
    let flyTicks = 0;
    let stuckTicks = 0;
    let prevX = GetUnitX(unit);
    let prevY = GetUnitY(unit);
    TimerStart(flyTimer, 0.03, true, () => {
      Globals.tmpVector.setUnit(unit); // new pos
      Globals.tmpVector2.setPos(targetX, targetY);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, flySpeed);

      const sfxScale = Math.min(4, 1.0 + Math.max(0, (flyTicks * flySpeed - minExpandingDistance) / 1000));
      BlzSetSpecialEffectScale(sfx2, sfxScale * 0.6);
      BlzSetSpecialEffectScale(sfx3, sfxScale * 2);

      BlzSetSpecialEffectX(sfx, Globals.tmpVector.x);
      BlzSetSpecialEffectY(sfx, Globals.tmpVector.y);
      BlzSetSpecialEffectX(sfx2, Globals.tmpVector.x);
      BlzSetSpecialEffectY(sfx2, Globals.tmpVector.y);
      BlzSetSpecialEffectX(sfx3, Globals.tmpVector.x);
      BlzSetSpecialEffectY(sfx3, Globals.tmpVector.y);

      if (origDistance > 1000) {
        if (flyTicks < flyHeightTicks) {
          const newHeight = flyTicks * flyHeightGainedPerTick;
          BlzSetSpecialEffectHeight(sfx, height + newHeight);
          BlzSetSpecialEffectHeight(sfx2, height + newHeight);
          BlzSetSpecialEffectHeight(sfx3, height + newHeight);
          SetUnitFlyHeight(unit, newHeight, 0);
        } else if (flyTicks > descendTick - flyHeightTicks) {
          const newHeight = flyHeightTicks * flyHeightGainedPerTick - (flyTicks - (descendTick - flyHeightTicks)) * flyHeightGainedPerTick;
          BlzSetSpecialEffectHeight(sfx, height + newHeight);
          BlzSetSpecialEffectHeight(sfx2, height + newHeight);
          BlzSetSpecialEffectHeight(sfx3, height + newHeight);
          SetUnitFlyHeight(unit, newHeight, 0);
        } else {
          BlzSetSpecialEffectHeight(sfx, height + flyHeightTicks * flyHeightGainedPerTick);
          BlzSetSpecialEffectHeight(sfx2, height + flyHeightTicks * flyHeightGainedPerTick);
          BlzSetSpecialEffectHeight(sfx3, height + flyHeightTicks * flyHeightGainedPerTick);
        }
      }

      if (
        CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) <= flySpeed
        || !PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(unit, Globals.tmpVector)
        || UnitHelper.isUnitDead(unit)
        || stuckTicks > maxStuckTicks
        || flyTicks > descendTick
      ) {
        // finish
        PauseUnit(unit, false);
        ResetUnitAnimation(unit);
        SetUnitFlyHeight(unit, 0, 0);

        DestroyEffect(sfx);
        DestroyEffect(sfx2);
        DestroyEffect(sfx3);
        const sfx4 = AddSpecialEffect("PurpleSlam.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
        BlzSetSpecialEffectScale(sfx4, sfxScale * 0.6);
        DestroyEffect(sfx4);
        const sfx5 = AddSpecialEffect("PurpleBigExplosion.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
        BlzSetSpecialEffectScale(sfx5, sfxScale * 0.6);
        DestroyEffect(sfx5);
        const sfx6 = AddSpecialEffect("AncientExplode.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
        BlzSetSpecialEffectScale(sfx6, sfxScale * 0.6);
        DestroyEffect(sfx6);

        const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
        if (customHero) {
          const distanceTravelled = flyTicks * flySpeed;
          const distanceDmgMult = Math.min(30, 1.0 + Math.max(0, (distanceTravelled - minExpandingDistance) / 1000));
          const scaledAOE = Math.min(maxAOE, baseAOE + Math.max(0, (distanceTravelled - minExpandingDistance)/AOEperDistance));

          AOEDamage.genericDealAOEDamage(
            Globals.tmpUnitGroup,
            unit,
            Globals.tmpVector.x,
            Globals.tmpVector.y,
            scaledAOE,
            10,
            customHero.spellPower,
            macroCannonDmgMult,
            distanceDmgMult,
            bj_HEROSTAT_INT
          );
          GroupClear(Globals.tmpUnitGroup);
        }

        TimerManager.getInstance().recycle(flyTimer);
      }

      // check if stuck
      Globals.tmpVector.setUnit(unit); // current pos
      Globals.tmpVector3.setPos(prevX, prevY); // old pos
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector3) < flySpeed * 0.4) {
        // likely stuck
        ++stuckTicks;
      }
      prevX = GetUnitX(unit);
      prevY = GetUnitY(unit);

      ++flyTicks;
    });
  }

  export function appuleVengeanceExtra() {
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);

    const hero = Globals.customPlayers[playerId].firstCustomHero;
    if (!hero) return;

    TimerStart(CreateTimer(), 3.0, false, () => {
      SaveBoolean(
        Globals.genericSpellHashtable, 
        GetHandleId(hero.unit),
        StringHash("appule|illusion|active"),
        false
      );

      DestroyTimer(GetExpiredTimer());
    });
  }

  export function appuleVengeanceIllusion() {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    const target = GetSpellTargetUnit();

    const hero = Globals.customPlayers[playerId].firstCustomHero;
    if (!hero) return;

    SaveBoolean(
      Globals.genericSpellHashtable, 
      GetHandleId(hero.unit),
      StringHash("appule|illusion|active"),
      true
    );
    SaveUnitHandle(
      Globals.genericSpellHashtable, 
      GetHandleId(hero.unit),
      StringHash("appule|illusion|target"),
      target
    );

    const dummy = CreateUnit(
      player, Constants.dummyCasterId, GetUnitX(hero.unit), GetUnitY(hero.unit), 0
    );
    UnitAddAbility(dummy, DebuffAbilities.APPULE_VENGEANCE_CLONE);
    SetUnitOwner(dummy, player, false);
    const x = IssueTargetOrderById(
      dummy, 
      OrderIds.WAND_OF_ILLUSION, 
      hero.unit
    );
    UnitApplyTimedLife(dummy, FourCC("BTLF"), 1);
  }

  export function gohanBeastBuff() {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);

    if (GetUnitAbilityLevel(unit, Id.specialBeastCannon) <= 0) return;

    const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
    if (!customHero) return;

    const aoe = 5000;
    const spellPowerPerDead = 0.15;
    const spellPowerPerHPPct = 0.1;
    const spellPowerMin = 0.2;
    const spellPowerMax = 1.0;
    
    // get nearby allied heroes
    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      GetUnitX(unit), 
      GetUnitY(unit),
      aoe,
      null
    );

    let spellPower = spellPowerMin;
    ForGroup(Globals.tmpUnitGroup, () => {
      const alliedHero = GetEnumUnit();
      if (
        UnitHelper.isUnitRealHero(alliedHero)
        && IsUnitAlly(alliedHero, player)
        && alliedHero != unit
      ) {
        if (UnitHelper.isUnitDead(alliedHero)) {
          spellPower += spellPowerPerDead;
        } else {
          spellPower += spellPowerPerHPPct * (
            1 - (
              GetUnitState(alliedHero, UNIT_STATE_LIFE) 
              / GetUnitState(alliedHero, UNIT_STATE_MAX_LIFE)
            )
          );
        }
      }
    });
    GroupClear(Globals.tmpUnitGroup);

    spellPower = Math.max(
      spellPowerMin, 
      Math.min(spellPowerMax, spellPower)
    );
    customHero.addSpellPower(spellPower);
    
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.5, true, () => {
      if (GetUnitAbilityLevel(unit, Id.specialBeastCannon) == 0) {
        customHero.removeSpellPower(spellPower);
        TimerManager.getInstance().recycle(timer);
      }
    });
  }

  export function specialBeastCannon() {
    const unit = GetTriggerUnit();

    const initTimer = TimerManager.getInstance().get();
    const secondTimer = TimerManager.getInstance().get();

    const delay = 2.1;

    SetUnitAnimationByIndex(unit, 12);

    TimerStart(initTimer, delay, false, () => {
      SetUnitAnimationByIndex(unit, 13);
      TimerManager.getInstance().recycle(initTimer);
    });
    TimerStart(secondTimer, delay+1, false, () => {
      ResetUnitAnimation(unit);
      TimerManager.getInstance().recycle(secondTimer);
    });
  }

  
  export function doMeguminManatite() {
    const unit = GetTriggerUnit();
    SetUnitState(
      unit, UNIT_STATE_MANA, 
      GetUnitState(unit, UNIT_STATE_MAX_MANA)
    );
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl",
        unit, "origin"
      )
    );
  }

  export function doMeguminExplosion() {
    const unit = GetTriggerUnit();
    const spellId = GetSpellAbilityId();
    SetUnitState(unit, UNIT_STATE_MANA, 1);

    let timeout = 1;
    switch (spellId) {
      default:
      case Id.meguminExplosion1:
        break;
      case Id.meguminExplosion2:
        timeout = 2;
        break;
      case Id.meguminExplosion3:
        timeout = 3;
        break;
      case Id.meguminExplosion4:
        timeout = 4;
        break;
      case Id.meguminExplosion5:
        timeout = 5;
        break;
    }

    const invulSfx = AddSpecialEffectTarget(
      "Abilities/Spells/Human/DivineShield/DivineShieldTarget.mdl",
      unit, "chest"
    );

    let weaponSfx = null;
    let weaponSfx2 = null;
    const sfxTimer = TimerManager.getInstance().get();
    TimerStart(sfxTimer, Math.max(0, timeout-2), false, () => {
      weaponSfx = AddSpecialEffectTarget(
        "Abilities/Weapons/FireBallMissile/FireBallMissile.mdl",
        unit, "weapon"
      );
      weaponSfx2 = AddSpecialEffectTarget(
        "StarSFX.mdl",
        unit, "weapon"
      );
      TimerManager.getInstance().recycle(sfxTimer);
    });

    const isAdd = UnitAddAbility(unit, Id.meguminInvul);
    PauseUnit(unit, true);
    SetUnitAnimationByIndex(unit, 8);
    const invulTimer = TimerManager.getInstance().get();
    TimerStart(invulTimer, timeout, false, () => {
      PauseUnit(unit, false);
      ResetUnitAnimation(unit);
      SoundHelper.playSoundOnUnit(unit, "Audio/Effects/MeguminExplosion1.mp3", 3160);

      DestroyEffect(invulSfx);
      if (weaponSfx != null) DestroyEffect(weaponSfx);
      if (weaponSfx2 != null) DestroyEffect(weaponSfx2);
      
      TimerManager.getInstance().recycle(invulTimer);
      if (isAdd) {
        UnitRemoveAbility(unit, Id.meguminInvul);
        udg_StatMultUnit = unit;
        TriggerExecute(gg_trg_Base_Armor_Set);
      }
    });

    const animDelay = 0.2;
    const animDelay2 = animDelay + 1;
    const animTimer2 = TimerManager.getInstance().get();
    TimerStart(animTimer2, Math.max(animDelay, timeout-animDelay2), false, () => {
      SetUnitAnimationByIndex(unit, 9);
      TimerManager.getInstance().recycle(animTimer2);
    });
    
    udg_StatMultUnit = unit;
    TriggerExecute(gg_trg_Base_Armor_Set);
  }

  export function doPecoManaBonus() {
    const unit = GetTriggerUnit();
    let bonus = 0;
    const spellId: number = GetSpellAbilityId();
    switch (spellId) {
      default:
      case Id.pecorinePrincessSplash:
        bonus = 10;
        break;
      case Id.pecorineRoyalSlash:
        bonus = 20;
        break;
      case Id.pecorinePrincessStrike:
        bonus = 30;
        break;
      case Id.pecorinePrincessValiant:
        bonus = 30;
        break;
      case Id.pecorinePrincessForce:
        bonus = 30;
        break;
    }
    SetUnitManaPercentBJ(unit, GetUnitManaPercent(unit) + bonus);
  }

  export function farmingPlantCrops() {
    const spellId = GetSpellAbilityId();
    const x = GetUnitX(GetTriggerUnit());
    const y = GetUnitY(GetTriggerUnit());
    FarmingManager.getInstance().plantCropFromSpell(spellId, x, y);
    
    return false;
  }

  export function doDendeHeal() {
    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const target = GetSpellTargetUnit();
    const standardRange = 700;
    const maxRange = standardRange + 400;
    const warningRange = standardRange + 50;

    const updateRate = 0.03;
    const healDamageMult = BASE_DMG.KAME_DPS * 4.8 * updateRate;
    const healMult = spellId == Id.dendeHeal ? 1.0 : 1.5;
    const selfHealRatio = 0.2;
    const healToManaRatio = 0.55;
    const selfHealToManaRatio = 0.5;
    const warningInterval = 16;

    if (!target || caster == target) return;

    const playerId = GetPlayerId(GetOwningPlayer(caster));
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!customHero) return;

    const keyIsActive = StringHash("dende|heal|active");
    const keySpellTimer = StringHash("dende|heal|timer");
    const keyLightningSfx = StringHash("dende|heal|lightning");
    const keyCounter = StringHash("dende|heal|counter");
    
    let isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);
    let newTimer = null;
    let lightningSfx = null;
    let counter = 0;
    
    if (isActive) {
      // linked
      // break previous link and re-link
      newTimer = LoadTimerHandle(Globals.genericSpellHashtable, casterId, keySpellTimer);
      lightningSfx = LoadLightningHandle(Globals.genericSpellHashtable, casterId, keyLightningSfx);
      counter = LoadInteger(Globals.genericSpellHashtable, casterId, keyCounter);

      MoveLightning(
        lightningSfx, true, 
        GetUnitX(target), GetUnitY(target),
        GetUnitX(caster), GetUnitY(caster) 
      );

    } else {
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, true);
      newTimer = TimerManager.getInstance().get();
      SaveTimerHandle(Globals.genericSpellHashtable, casterId, keySpellTimer, newTimer);
      
      lightningSfx = AddLightning(
        "DRAL", true, 
        GetUnitX(target), GetUnitY(target),
        GetUnitX(caster), GetUnitY(caster) 
      );

      SaveLightningHandle(Globals.genericSpellHashtable, casterId, keyLightningSfx, lightningSfx);
      SaveInteger(Globals.genericSpellHashtable, casterId, keyCounter, counter);
    }

    TimerStart(newTimer, updateRate, true, () => {
      Globals.tmpVector.setUnit(target);
      Globals.tmpVector2.setUnit(caster);
      const abilLvl = GetUnitAbilityLevel(caster, spellId);
      const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
      isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);

      if (
        !isActive
        || UnitHelper.isUnitHardStunned(caster)
        || dist > maxRange
        || GetUnitManaPercent(caster) < 1
        || UnitHelper.isUnitDead(caster)
        || UnitHelper.isUnitDead(target)
        || abilLvl == 0
      ) {
        TimerManager.getInstance().recycle(newTimer);
        SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, false);
        SaveInteger(Globals.genericSpellHashtable, casterId, keyCounter, 0);
        DestroyLightning(lightningSfx);
        
        DestroyEffect(AddSpecialEffect(
          "Abilities/Weapons/GreenDragonMissile/GreenDragonMissile.mdl",
          Globals.tmpVector.x, Globals.tmpVector.y
        ));
        DestroyEffect(AddSpecialEffect(
          "Abilities/Weapons/GreenDragonMissile/GreenDragonMissile.mdl",
          Globals.tmpVector2.x, Globals.tmpVector2.y
        ));

        return;
      } else {

        MoveLightning(
          lightningSfx, true, 
          Globals.tmpVector.x, Globals.tmpVector.y,
          Globals.tmpVector2.x, Globals.tmpVector2.y
        );

        // check target hp
        if (
          UnitHelper.isUnitAlive(target)
          && UnitHelper.isUnitAlive(caster)
          && GetUnitManaPercent(caster) >= 1
        ) {
          const healAmount = AOEHeal.calculateHealRaw(
            abilLvl, customHero.spellPower,
            healDamageMult, healMult,
            caster, bj_HEROSTAT_INT
          );

          if (GetUnitLifePercent(target) < 100) {
            const targetHp = GetUnitState(target, UNIT_STATE_LIFE);
            SetUnitState(target, UNIT_STATE_LIFE, targetHp + healAmount);

            if (GetUnitAbilityLevel(caster, Id.dendeOrangeFlag) == 0) {
              SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) - healAmount * healToManaRatio);
            }
          }

          if (GetUnitLifePercent(caster) < 100) {
            SetUnitState(caster, UNIT_STATE_LIFE, GetUnitState(caster, UNIT_STATE_LIFE) + selfHealRatio * healAmount);
            
            if (GetUnitAbilityLevel(caster, Id.dendeOrangeFlag) == 0) {
              SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) - selfHealRatio * healAmount * selfHealToManaRatio);
            }
          }
        }

        if (dist > warningRange) {
          if (counter == 0) {
            DestroyEffect(AddSpecialEffect(
              "Abilities/Weapons/GreenDragonMissile/GreenDragonMissile.mdl",
              Globals.tmpVector2.x, Globals.tmpVector2.y
            ));
          }
          // const lightningRatio = 1 - (0.5 * (dist - warningRange) / Math.max(1, maxRange - warningRange));
          // SetLightningColor(lightningSfx, 1, lightningRatio, lightningRatio, 1);

          ++counter;
          if (counter > warningInterval) counter = 0;
          SaveInteger(Globals.genericSpellHashtable, casterId, keyCounter, counter);
        } else {
          // SetLightningColor(lightningSfx, 1, 1, 1, 1);
        }
      }
    });

    return false;
  }

  export function doLinkBombCharge() {
    const bombMaxDelay = 99;
    
    const keyIsActive = StringHash("link|bomb|active");
    const keyTimerSpell = StringHash("link|bomb|timer");
    const keyBombSfx = StringHash("link|bomb|sfx");
    const keyBombCounter = StringHash("link|bomb|counter");

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!customHero) return;

    let newTimer: timer = null;
    let bombSfx: effect = null;

    const isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);
    if (isActive) {
      // unhook any previous target
      newTimer = LoadTimerHandle(Globals.genericSpellHashtable, casterId, keyTimerSpell);
      bombSfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, keyBombSfx);

    } else {
      newTimer = TimerManager.getInstance().get();
      bombSfx = AddSpecialEffect("LinkBomb.mdl", GetUnitX(caster), GetUnitY(caster));
      BlzSetSpecialEffectScale(bombSfx, 2.5);
      BlzSetSpecialEffectTimeScale(bombSfx, 10);

      if (GetUnitAbilityLevel(caster, Id.linkBombThrow) == 0) {
        UnitAddAbility(caster, Id.linkBombThrow);
      }
      SetUnitAbilityLevel(caster, Id.linkBombThrow, GetUnitAbilityLevel(caster, Id.linkBombCharge));
      SetPlayerAbilityAvailable(player, Id.linkBombCharge, false);
      SetPlayerAbilityAvailable(player, Id.linkBombThrow, true);
      
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, true);
      SaveEffectHandle(Globals.genericSpellHashtable, casterId, keyBombSfx, bombSfx);
      SaveInteger(Globals.genericSpellHashtable, casterId, keyBombCounter, 0);
    }

    TimerStart(newTimer, 0.03, true, () => {
      // save stuff and countdown
      const counter = LoadInteger(Globals.genericSpellHashtable, casterId, keyBombCounter);
      const stillActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);
      
      if (counter < bombMaxDelay && stillActive) {
        SaveInteger(Globals.genericSpellHashtable, casterId, keyBombCounter, counter+1);
        
        BlzSetSpecialEffectX(bombSfx, GetUnitX(caster));
        BlzSetSpecialEffectY(bombSfx, GetUnitY(caster));

        let floatingText = "";
        if (counter == 0) {
          floatingText = "3.0";
        } else if (counter == 16) {
          floatingText = "2.5";
          BlzSetSpecialEffectColor(bombSfx, 255, 25, 25);
        } else if (counter == 33) {
          floatingText = "2.0";
          BlzSetSpecialEffectColor(bombSfx, 255, 255, 255);
        } else if (counter == 50) {
          floatingText = "1.5";
          BlzSetSpecialEffectColor(bombSfx, 255, 25, 25);
        } else if (counter == 66) {
          floatingText = "1.0";
          BlzSetSpecialEffectColor(bombSfx, 255, 255, 255);
        } else if (counter == 83) {
          floatingText = "0.5";
          BlzSetSpecialEffectColor(bombSfx, 255, 25, 25);
        } else if (counter == 92) {
          floatingText = "!";
          BlzSetSpecialEffectColor(bombSfx, 255, 255, 255);
        }

        if (floatingText != "") {
          ForceClear(Globals.tmpForce);
          ForceAddPlayer(Globals.tmpForce, player);
          TextTagHelper.showTempText(
            Colorizer.getPlayerColorText(playerId) + floatingText + "!",
            GetUnitX(caster), GetUnitY(caster),
            8, 0.5, 0.25,
            Globals.tmpForce
          );
          ForceClear(Globals.tmpForce);
        }

      } else {
        if (stillActive) {
          // detonate on self
          const abilityInput = new CustomAbilityInput(
            Id.linkBombThrow,
            customHero,
            player,
            GetUnitAbilityLevel(caster, Id.linkBombCharge),
            Globals.customPlayers[playerId].orderPoint,
            Globals.customPlayers[playerId].mouseData,
            Globals.customPlayers[playerId].lastCastPoint.clone(),
          );
          customHero.useAbility(AbilityNames.Link.BOMB_THROW_7, abilityInput);
        }

        SetPlayerAbilityAvailable(player, Id.linkBombCharge, true);
        SetPlayerAbilityAvailable(player, Id.linkBombThrow, false);

        BlzStartUnitAbilityCooldown(caster, Id.linkBombThrow, 5);

        SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, false);
        SaveInteger(Globals.genericSpellHashtable, casterId, keyBombCounter, 0);

        BlzSetSpecialEffectScale(bombSfx, 0.01);
        DestroyEffect(bombSfx);
        TimerManager.getInstance().recycle(newTimer);
      }
    });
  }

  export function doLinkBombThrow() {
    const keyIsActive = StringHash("link|bomb|active");
    const keyBombCounter = StringHash("link|bomb|counter");

    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);
    if (!isActive) return;

    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!customHero) return;

    const counter = LoadInteger(Globals.genericSpellHashtable, casterId, keyBombCounter);

    let abilityName = "";
    if (counter < 16) {
      abilityName = AbilityNames.Link.BOMB_THROW_1; // 3s
    } else if (counter < 33) {
      abilityName = AbilityNames.Link.BOMB_THROW_2; // 2.5s
    } else if (counter < 50) {
      abilityName = AbilityNames.Link.BOMB_THROW_3; // 2s
    } else if (counter < 66) {
      abilityName = AbilityNames.Link.BOMB_THROW_4; // 1.5s
    } else if (counter < 83) {
      abilityName = AbilityNames.Link.BOMB_THROW_5; // 1.0s
    } else {
      abilityName = AbilityNames.Link.BOMB_THROW_6; // 0.5s
    }

    SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, false);
    SetPlayerAbilityAvailable(player, Id.linkBombCharge, true);
    SetPlayerAbilityAvailable(player, Id.linkBombThrow, false);

    const abilityInput = new CustomAbilityInput(
      spellId,
      customHero,
      player,
      GetUnitAbilityLevel(caster, Id.linkBombCharge),
      Globals.customPlayers[playerId].orderPoint,
      Globals.customPlayers[playerId].mouseData,
      Globals.customPlayers[playerId].lastCastPoint.clone(),
    );
    customHero.useAbility(abilityName, abilityInput);
  }

  export function doLinkHookshotSwap(unit: unit, player: player, val: boolean, isMobile: boolean) {
    SetPlayerAbilityAvailable(player, Id.linkHookshot, !val);
    SetPlayerAbilityAvailable(player, Id.linkHookshotPullTowards, val);
    if (isMobile) {
      if (GetUnitTypeId(unit) == Id.kidBuu) {
        SetPlayerAbilityAvailable(player, Id.vanishingBall, !val);
      }
      SetPlayerAbilityAvailable(player, Id.linkInventoryBook, !val);
      SetPlayerAbilityAvailable(player, Id.linkHookshotPullIn, val);
    }
  }
  
  export function doLinkHookshotPull() {
    const spellId = GetSpellAbilityId();
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    
    if (spellId == Id.linkHookshotPullTowards) {
      const keyHookPullTowards = StringHash("link|hookshot|pull|towards");
      const keyHookMobileTarget = StringHash("link|hookshot|mobile");
      // disable pull towards and pull in
      doLinkHookshotSwap(caster, player, false, LoadBoolean(Globals.genericSpellHashtable, casterId, keyHookMobileTarget));
      // pull link towards the target
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookPullTowards, true);

    } else if (spellId == Id.linkHookshotPullIn) {
      const keyHookPullIn = StringHash("link|hookshot|pull|in");
      // disable pull towards and pull in
      doLinkHookshotSwap(caster, player, false, true);
      // pull the target towards link
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookPullIn, true);
    }
  }

  export function doLinkHookshot() {
    const hookTravelSpeed = 60;
    const hookPullSpeed = 60;
    const hookMaxStuckTicks = 16;
    const hookStuckPercent = 0.4;
    const hookMaxDist = 1600;
    const hookBreakDist = hookMaxDist * 1.25;
    const hookUnitRadius = 150;
    const hookMaxActiveTicks = 166;

    const keyIsActive = StringHash("link|hookshot|active");
    const keyLightningSfx = StringHash("link|hookshot|lightning");
    const keyTimerSpell = StringHash("link|hookshot|timer");
    const keyHookCaster = StringHash("link|hookshot|caster");
    const keyHookMobileTarget = StringHash("link|hookshot|mobile");
    const keyHookPullTowards = StringHash("link|hookshot|pull|towards");
    const keyHookPullIn = StringHash("link|hookshot|pull|in");
    const keyHookHeadSfx = StringHash("link|hookshot|sfx|head");

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    
    let newTimer: timer = null;
    let lightningSfx: lightning = null;
    let hookHeadSfx: effect = null;

    SaveUnitHandle(Globals.genericSpellHashtable, casterId, keyHookCaster, caster);
    
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());
    const angle = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);

    const isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, keyIsActive);
    if (isActive) {
      // unhook any previous target
      newTimer = LoadTimerHandle(Globals.genericSpellHashtable, casterId, keyTimerSpell);
      lightningSfx = LoadLightningHandle(Globals.genericSpellHashtable, casterId, keyLightningSfx);
      hookHeadSfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, keyHookHeadSfx);
    } else {
      newTimer = TimerManager.getInstance().get();
      lightningSfx = AddLightning(
        "WHCH", true, 
        Globals.tmpVector.x, Globals.tmpVector.y,
        Globals.tmpVector.x, Globals.tmpVector.y,
      );

      hookHeadSfx = AddSpecialEffect("LinkBoomerang.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectYaw(hookHeadSfx, angle * CoordMath.degreesToRadians);
      BlzSetSpecialEffectRoll(hookHeadSfx, 90 * CoordMath.degreesToRadians);

      SaveTimerHandle(Globals.genericSpellHashtable, casterId, keyTimerSpell, newTimer);
      SaveLightningHandle(Globals.genericSpellHashtable, casterId, keyLightningSfx, lightningSfx);
      SaveEffectHandle(Globals.genericSpellHashtable, casterId, keyHookHeadSfx, hookHeadSfx);
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, true);
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookMobileTarget, false);
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookPullTowards, false);
      SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookPullIn, false);
      
      // disable inventory 
      // (to prevent accidentally pressing when wanting to pull in)
      SetPlayerAbilityAvailable(player, Id.linkInventoryBook, false);
      if (GetUnitTypeId(caster) == Id.kidBuu) {
        SetPlayerAbilityAvailable(player, Id.vanishingBall, false);
      }
    }
    
    let distance = 0;
    let prevX = 0;
    let prevY = 0;
    let hookX = Globals.tmpVector.x;
    let hookY = Globals.tmpVector.y;
    let isBroken = false;
    let isMobileTarget = false;
    let isStuck = false;
    let stuckTicks = 0;
    let activeTicks = 0;
    let unitTarget = caster;


    TimerStart(newTimer, 0.03, true, () => {
      Globals.tmpVector.setUnit(caster);
      BlzSetSpecialEffectX(hookHeadSfx, hookX);
      BlzSetSpecialEffectY(hookHeadSfx, hookY);

      if (isStuck) {
        // stuck the hook
        // if mobile target, update end point
        // update caster hook side
        // broken if stuck, or is too close or is too far
        // if pull towards, move caster towards
        // if pull in, move target into caster
        const isTowards = LoadBoolean(Globals.genericSpellHashtable, casterId, keyHookPullTowards);
        const isIn = LoadBoolean(Globals.genericSpellHashtable, casterId, keyHookPullIn);
        
        // update hook location
        if (isMobileTarget) {
          if (unitTarget != caster) {
            Globals.tmpVector2.setUnit(unitTarget);
          }

          hookX = Globals.tmpVector2.x;
          hookY = Globals.tmpVector2.y;
        } else {
          Globals.tmpVector2.setPos(hookX, hookY);
        }

        distance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

        // check for breakage
        isBroken = (
          stuckTicks > hookMaxStuckTicks
          || distance <= hookPullSpeed
          || distance > hookBreakDist
          || activeTicks > hookMaxActiveTicks
        );

        if (isMobileTarget) {
          if (unitTarget != caster && UnitHelper.isUnitDead(unitTarget)) {
            isBroken = true;
          }
        }
        
        if (!isBroken) {

          // move caster towards target
          if (isTowards) {
            const pullAngle = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
            CoordMath.polarProjectCoords(Globals.tmpVector, Globals.tmpVector, pullAngle, hookPullSpeed);
            PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector);

            if (prevX != 0 && prevY != 0) {
              Globals.tmpVector3.setPos(prevX, prevY);
              if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector3) < hookStuckPercent * hookPullSpeed) {
                ++stuckTicks;
              }
            }
            prevX = Globals.tmpVector.x;
            prevY = Globals.tmpVector.y;
          }

          // move target towards self
          if (isIn) {
            const pullAngle = CoordMath.angleBetweenCoords(Globals.tmpVector2, Globals.tmpVector);
            CoordMath.polarProjectCoords(Globals.tmpVector2, Globals.tmpVector2, pullAngle, hookPullSpeed);
            if (unitTarget != caster) {
              PathingCheck.moveGroundUnitToCoord(unitTarget, Globals.tmpVector2);
            }

            if (prevX != 0 && prevY != 0) {
              Globals.tmpVector3.setPos(prevX, prevY);
              if (CoordMath.distance(Globals.tmpVector2, Globals.tmpVector3) < hookStuckPercent * hookPullSpeed) {
                ++stuckTicks;
              }
            }
            prevX = Globals.tmpVector2.x;
            prevY = Globals.tmpVector2.y;
          }

          // tie together
          MoveLightning(
            lightningSfx, true, 
            Globals.tmpVector.x, Globals.tmpVector.y, 
            Globals.tmpVector2.x, Globals.tmpVector2.y,
          );
          ++activeTicks;

        } else {
          doLinkHookshotSwap(caster, player, false, true);
          BlzStartUnitAbilityCooldown(caster, Id.linkHookshot, BlzGetUnitAbilityCooldown(caster, Id.linkHookshot, 0));
          // snap link
          DestroyEffect(hookHeadSfx);
          DestroyLightning(lightningSfx);
          SaveBoolean(Globals.genericSpellHashtable, casterId, keyIsActive, false);
          TimerManager.getInstance().recycle(newTimer);
        }

      } else {
        // move the hook
        // hit valid target or exeed max range
        // stuck the hook and register target if any
        Globals.tmpVector2.setPos(hookX, hookY);
        CoordMath.polarProjectCoords(Globals.tmpVector2, Globals.tmpVector2, angle, hookTravelSpeed);
        distance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

        // unit collision check
        GroupClear(Globals.tmpUnitGroup);
        GroupEnumUnitsInRange(
          Globals.tmpUnitGroup,
          Globals.tmpVector2.x, Globals.tmpVector2.y,
          hookUnitRadius,
          null
        );
        
        let closestDist = hookBreakDist;
        ForGroup(Globals.tmpUnitGroup, () => {
          const target = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(target, player, true)
            && target != caster
          ) {
            Globals.tmpVector3.setUnit(target);
            if (CoordMath.distance(Globals.tmpVector2, Globals.tmpVector3) < closestDist) {
              unitTarget = target;
            }
          }
        });
        GroupClear(Globals.tmpUnitGroup);

        isStuck = (
          distance >= hookMaxDist
          || !PathingCheck.isGroundWalkable(Globals.tmpVector2)
          || unitTarget != caster
        );

        MoveLightning(
          lightningSfx, true, 
          Globals.tmpVector.x, Globals.tmpVector.y, 
          Globals.tmpVector2.x, Globals.tmpVector2.y,
        );
        
        if (!isStuck) {
          // keep moving the hook
          hookX = Globals.tmpVector2.x;
          hookY = Globals.tmpVector2.y;

        } else {
          isMobileTarget = (
            unitTarget != caster
            && !IsUnitType(unitTarget, UNIT_TYPE_STRUCTURE)
          );

          // save linked target
          if (GetUnitAbilityLevel(caster, Id.linkHookshotPullIn) == 0) {
            UnitAddAbility(caster, Id.linkHookshotPullTowards);
            UnitAddAbility(caster, Id.linkHookshotPullIn);
            SetPlayerAbilityAvailable(player, Id.linkHookshotPullIn, false);
          }
          SaveBoolean(Globals.genericSpellHashtable, casterId, keyHookMobileTarget, isMobileTarget);
          doLinkHookshotSwap(caster, player, true, isMobileTarget);
        }
      }

    });
  }

  export function doLinkBowShoot() {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const keyArrowSelected = StringHash("link|arrow|selection");
    const arrowSelected = LoadInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected);

    let abilityName = AbilityNames.Link.BOW_ARROW_NORMAL;
    switch (arrowSelected) {
      default:
      case 0:
        abilityName = AbilityNames.Link.BOW_ARROW_NORMAL;
        break;
      case 1:
        abilityName = AbilityNames.Link.BOW_ARROW_FIRE;
        break;
      case 2:
        abilityName = AbilityNames.Link.BOW_ARROW_ICE;
        break;
      case 3:
        abilityName = AbilityNames.Link.BOW_ARROW_LIGHTNING;
        break;
      case 4:
        abilityName = AbilityNames.Link.BOW_ARROW_BOMB;
        break;
    }

    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    if (customHero) {
      const abilityInput = new CustomAbilityInput(
        GetSpellAbilityId(),
        customHero,
        player,
        GetUnitAbilityLevel(customHero.unit, Id.linkBow),
        Globals.customPlayers[playerId].orderPoint,
        Globals.customPlayers[playerId].mouseData,
        Globals.customPlayers[playerId].lastCastPoint.clone()
      );
      customHero.useAbility(abilityName, abilityInput);
    }
  }

  export function doLinkArrowSelect() {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const spellId = GetSpellAbilityId();

    const keyArrowSelected = StringHash("link|arrow|selection");
    switch (spellId) {
      default:
      case Id.linkArrowNormal:
        SaveInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected, 0);
        break;
      case Id.linkArrowFire:
        SaveInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected, 1);
        break;
      case Id.linkArrowIce:
        SaveInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected, 2);
        break;
      case Id.linkArrowLightning:
        SaveInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected, 3);
        break;
      case Id.linkArrowBomb:
        SaveInteger(Globals.genericSpellHashtable, casterId, keyArrowSelected, 4);
        break;
    }
  }

  export function doLinkFireArrowBurn() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const target = GetSpellTargetUnit();

    const ch = Globals.customPlayers[playerId].firstCustomHero;
    if (!ch) return;

    const maxDmgTicks = 166;
    const dmgPctSecond = 0.03;

    let dmgTicks = 0;
    const dmgTimer = TimerManager.getInstance().get();
    TimerStart(dmgTimer, 0.03, true, () => {
      if (dmgTicks >= maxDmgTicks) {
        TimerManager.getInstance().recycle(dmgTimer);
      } else {
        const dmg = 0.03 * dmgPctSecond * GetUnitState(target, UNIT_STATE_MAX_LIFE);
        UnitDamageTarget(ch.unit, target, dmg, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WHOKNOWS);
        ++dmgTicks;
      }
    });
  }

  export function doCellMaxDisasterRay() {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);

    const delayTimer = TimerManager.getInstance().get();
    const maxDelay = 200;
    const maxIndex = 12;
    let highestIndex = 0;
    let counter = 0;
    let beamUnit = caster;

    TimerStart(delayTimer, 0.03, true, () => {
      if (counter > maxDelay) {
        // stop and clear up
        TimerManager.getInstance().recycle(delayTimer);
        for (let i = 0; i < highestIndex; ++i) {
          modDisasterRaySfx(caster, "delete", i, counter);
        }
        return;
      }

      if (counter >= 16 && beamUnit == caster) {
        beamUnit = null;
      }

      // if (counter >= 33 && beamUnit == caster) {
      //   // find beam
      //   const ux = GetUnitX(caster);
      //   const uy = GetUnitY(caster);
      //   GroupClear(Globals.tmpUnitGroup);
      //   GroupEnumUnitsInRange(Globals.tmpUnitGroup, ux, uy, 600, null);
      //   ForGroup(Globals.tmpUnitGroup, () => {
      //     const unit = GetEnumUnit();
      //     if (
      //       beamUnit == caster
      //       && GetUnitTypeId(unit) == Constants.dummyBeamUnitId
      //       && GetOwningPlayer(unit) == player
      //       && GetUnitName(unit) == "beam cell max disaster ray"
      //     ) {
      //       beamUnit = unit;
      //     }
      //   });
      //   GroupClear(Globals.tmpUnitGroup);
      // }

      if (beamUnit != caster) {
        // beam was found, run sfx logic
        for (let i = highestIndex; i < maxIndex; ++i) {
          modDisasterRaySfx(caster, "add", i, counter);
          highestIndex++;
        }
        for (let i = 0; i < highestIndex; ++i) {
          modDisasterRaySfx(caster, "update", i, counter);
        }
      }

      counter += 1;
    });
  }

  export function modDisasterRaySfx(
    caster: unit, 
    action: string,
    index: number, 
    counter: number,
  ) {
    const casterId = GetHandleId(caster);
    const ux = GetUnitX(caster);
    const uy = GetUnitY(caster);
    const angOffset = index * 30;
    const yaw = (GetUnitFacing(caster) + angOffset) * CoordMath.degreesToRadians;
    const yawOpposite = (GetUnitFacing(caster) + angOffset + 180) * CoordMath.degreesToRadians;
    
    const keySfx1 = StringHash("disaster_sfx_1_" + I2S(index));
    const keySfx2 = StringHash("disaster_sfx_2_" + I2S(index));
    const minPitch = -15;
    const maxPitch = 165;

    let sfx1 = null;
    let sfx2 = null;

    if (action == "add") {
      sfx1 = AddSpecialEffect("GodzillaLaser1.mdl", ux, uy);
      sfx2 = AddSpecialEffect("GodzillaLaser2.mdl", ux, uy);
      SaveEffectHandle(Globals.genericSpellHashtable, casterId, keySfx1, sfx1);
      SaveEffectHandle(Globals.genericSpellHashtable, casterId, keySfx2, sfx2);
      
      BlzSetSpecialEffectScale(sfx1, 2.5);
      BlzSetSpecialEffectScale(sfx2, 2.5);
      BlzSetSpecialEffectTimeScale(sfx1, 0.5);
      BlzSetSpecialEffectTimeScale(sfx2, 0.5);
      
      const pitch = Math.min(
        maxPitch, 
        Math.max(
          minPitch,
          Math.random() * 180 - 90
        )
      );
      BlzSetSpecialEffectPitch(sfx1, pitch * CoordMath.degreesToRadians);
      BlzSetSpecialEffectPitch(sfx2, pitch * CoordMath.degreesToRadians);

      BlzSetSpecialEffectColor(sfx1, 200, 225, 255)
    } else {
      sfx1 = LoadEffectHandle(Globals.genericSpellHashtable, casterId, keySfx1);
      sfx2 = LoadEffectHandle(Globals.genericSpellHashtable, casterId, keySfx2);
    }

    if (sfx1 == null || sfx2 == null) return;
    
    if (action == "update") {
      let heightMod = 300;
      const height = heightMod + GetUnitFlyHeight(caster) + BlzGetUnitZ(caster);
      BlzSetSpecialEffectX(sfx1, ux);
      BlzSetSpecialEffectY(sfx1, uy);
      BlzSetSpecialEffectX(sfx2, ux);
      BlzSetSpecialEffectY(sfx2, uy);
      BlzSetSpecialEffectScale(sfx1, 2.5 + 7.5 * Math.min(1, (counter - 16) * 0.04));

      BlzSetSpecialEffectHeight(sfx1, height);
      BlzSetSpecialEffectHeight(sfx2, height);
      BlzSetSpecialEffectYaw(sfx1, yawOpposite);
      BlzSetSpecialEffectYaw(sfx2, yaw);
    }

    if (action == "delete") {
      DestroyEffect(sfx1);
      DestroyEffect(sfx2);
    }
  }

  export function doAinzLightningSFX() {
    const caster = GetTriggerUnit();
    const target = GetSpellTargetUnit();
    const abilId = GetSpellAbilityId();
    
    let str = "";
    if (abilId == Id.ainzEnergyDrain) {
      str = "DRAL";
    } else if (abilId == Id.ainzGraspHeart) {
      str = "AFOD";
    }

    let lightningSfx = AddLightning(
      str, true, 
      GetUnitX(caster), GetUnitY(caster),
      GetUnitX(target), GetUnitY(target),
    );

    str = "";
    if (abilId == Id.ainzEnergyDrain) {
      str = "Abilities/Spells/Other/Drain/DrainTarget.mdl";
    } else if (abilId == Id.ainzGraspHeart) {
      str = "Objects/Spawnmodels/Human/HumanBlood/HumanBloodFootman.mdl";
    }
    let sfx = AddSpecialEffect(str, GetUnitX(target), GetUnitY(target));
    BlzSetSpecialEffectScale(sfx, 5.0);
    DestroyEffect(sfx);
    
    str = "";
    if (abilId == Id.ainzEnergyDrain) {
      str = "Objects/Spawnmodels/Undead/UCancelDeath/UCancelDeath.mdl";
    } else if (abilId == Id.ainzGraspHeart) {
      str = "Objects/Spawnmodels/Human/HumanLargeDeathExplode/HumanLargeDeathExplode.mdl";
    }
    sfx = AddSpecialEffect(str, GetUnitX(target), GetUnitY(target));
    BlzSetSpecialEffectScale(sfx, 3.0);
    DestroyEffect(sfx);
    
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.25, false, () => {
      DestroyLightning(lightningSfx);
      TimerManager.getInstance().recycle(timer);
    });
  }

  export function doAinzGreaterHardening() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    
    const dummy = CreateUnit(
      player,
      Constants.dummyCasterId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    UnitAddAbility(dummy, DebuffAbilities.AINZ_GREATER_HARDENING);
    SetUnitOwner(dummy, player, false);
    IssueTargetOrderById(
      dummy, 
      OrderIds.INNER_FIRE, 
      caster
    );
    UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1);
  }

  export function doAinzGreaterMagicShield() {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const numCharges = 2;
    const hashKey = StringHash("ainz_greater_magic_shield_flag");

    const dummy = CreateUnit(
      player,
      Constants.dummyCasterId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    UnitAddAbility(dummy, DebuffAbilities.AINZ_GREATER_MAGIC_SHIELD);
    SetUnitOwner(dummy, player, false);
    IssueTargetOrderById(
      dummy, 
      OrderIds.INNER_FIRE, 
      caster
    );
    UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1);

    let counter = numCharges;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (GetUnitAbilityLevel(caster, Buffs.INNER_FIRE_AINZ_GREATER_MAGIC_SHIELD) == 0) {
        TimerManager.getInstance().recycle(timer);
        SaveInteger(Globals.genericSpellHashtable, casterId, hashKey, 0);
        return;
      }
      if (UnitHelper.isUnitStunned(caster)) {
        UnitRemoveBuffs(caster, false, true);
        if (LoadInteger(Globals.genericSpellHashtable, casterId, hashKey) == 0 && counter > 0) {
          const tmpTimer = TimerManager.getInstance().get();
          SaveInteger(Globals.genericSpellHashtable, casterId, hashKey, 1);
          const wasInvul = BlzIsUnitInvulnerable(caster);
          if (!wasInvul) SetUnitInvulnerable(caster, true);
          const sfx = AddSpecialEffectTarget(
            "Abilities/Spells/Human/DivineShield/DivineShieldTarget.mdl",
            caster,
            "origin"
          );
          TimerStart(tmpTimer, 1, false, () => {
            TimerManager.getInstance().recycle(tmpTimer);
            if (!wasInvul) SetUnitInvulnerable(caster, false);
            DestroyEffect(sfx);
            SaveInteger(Globals.genericSpellHashtable, casterId, hashKey, 0);
            counter--;
            if (counter <= 0) UnitRemoveAbility(caster, Buffs.INNER_FIRE_AINZ_GREATER_MAGIC_SHIELD);
          });
        }
      }
    });
  }

  export function doAinzMagicBoost() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    
    const dummy = CreateUnit(
      player,
      Constants.dummyCasterId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    UnitAddAbility(dummy, DebuffAbilities.AINZ_MAGIC_BOOST);
    SetUnitOwner(dummy, player, false);
    IssueTargetOrderById(
      dummy, 
      OrderIds.INNER_FIRE, 
      caster
    );
    UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1);
  }

  export function doAinzPerfectUnknowable() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();

    const dummy = CreateUnit(
      player,
      Constants.dummyCasterId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );  
    UnitAddAbility(dummy, DebuffAbilities.AINZ_INVISIBILITY);
    SetUnitOwner(dummy, player, false);
    IssueTargetOrderById(
      dummy, 
      OrderIds.INVISIBILITY, 
      target
    );
    UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1);
  }

  export function doAinzGate() {
    const moveDurationTicks = 16;
    const schalaTpEndTick = 333;
    const tpAOE = 400;
    const tpMaxDist = 6000;
    const excludeTicks = 100;
    const tpRegisterKey = StringHash("gate_tp_count");
    const tpTimeKey = StringHash("gate_tp_exclude_time");

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);

    const tpUnit = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    ShowUnit(tpUnit, false);
    SetUnitInvulnerable(tpUnit, true);
    
    const srcPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const direction = CoordMath.angleBetweenCoords(srcPos, targetPos);
    const maxDist =  Math.min(4000, Math.max(1500, CoordMath.distance(srcPos, targetPos)));
    const excludeGroup = CreateGroup();

    let beamSpeed = maxDist / moveDurationTicks;
    const sfxCast = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      srcPos.x, srcPos.y
    );
    BlzSetSpecialEffectScale(sfxCast, 2.2);
    const sfxBeam = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      srcPos.x, srcPos.y
    );
    BlzSetSpecialEffectScale(sfxBeam, 2.2);

    let tick = 0;
    const tpTimer = TimerManager.getInstance().get();
    TimerStart(tpTimer, 0.03, true, () => {
      if (tick > schalaTpEndTick) {
        RemoveUnit(tpUnit);
        DestroyEffect(sfxCast);
        DestroyEffect(sfxBeam);
        DestroyGroup(excludeGroup);
        TimerManager.getInstance().recycle(tpTimer);
        
        ForGroup(excludeGroup, () => {
          const tmpUnit = GetEnumUnit();
          const tmpUnitId = GetHandleId(tmpUnit);
          
          const numRegisters = LoadInteger(Globals.genericGateTPHashtable, tmpUnitId, tpRegisterKey);

          if (UnitHelper.isUnitDead(tmpUnit) || numRegisters == 1) {
            FlushChildHashtable(Globals.genericGateTPHashtable, tmpUnitId);
          } else if (numRegisters > 0) {
            SaveInteger(Globals.genericGateTPHashtable, tmpUnitId, tpRegisterKey, numRegisters-1);
          }
        });
      } else {
        targetPos.setUnit(tpUnit);
        if (
          CoordMath.distance(srcPos, targetPos) < maxDist
          && tick < moveDurationTicks
        ) {
          targetPos.polarProjectCoords(targetPos, direction, beamSpeed);
          BlzSetSpecialEffectX(sfxBeam, targetPos.x);
          BlzSetSpecialEffectY(sfxBeam, targetPos.y);
          PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(tpUnit, targetPos);
        }

        if (tick >= moveDurationTicks) {
          genericGateTP(caster, srcPos, targetPos, tpAOE, tpMaxDist, excludeGroup, excludeTicks)
          genericGateTP(caster, targetPos, srcPos, tpAOE, tpMaxDist, excludeGroup, excludeTicks)
        }

        // every x ticks, clear the exclude group
        if (CountUnitsInGroup(excludeGroup) > 0) {
          ForGroup(excludeGroup, () => {
            const tmpUnit = GetEnumUnit();
            const tmpUnitId = GetHandleId(tmpUnit);
            const tpTime = LoadInteger(Globals.genericGateTPHashtable, tmpUnitId, tpTimeKey);
            if (tpTime == 0) {
              FlushChildHashtable(Globals.genericGateTPHashtable, tmpUnitId);
              GroupRemoveUnit(excludeGroup, tmpUnit);
              DestroyEffect(
                AddSpecialEffect(
                  "Abilities/Spells/Human/DispelMagic/DispelMagicTarget.mdl", 
                  GetUnitX(tmpUnit), GetUnitY(tmpUnit)
                )
              );
            } else {
              SaveInteger(Globals.genericGateTPHashtable, tmpUnitId, tpTimeKey, tpTime - 1);
            }
          });
        }

        ++tick;
      }
    });
  }

  export function genericGateTP(
    caster: unit,
    pos1: Vector2D,
    pos2: Vector2D,
    aoe: number,
    maxTpDist: number,
    excludeGroup: group,
    excludeTicks: number,
  ) {
    const player = GetOwningPlayer(caster);

    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(Globals.tmpUnitGroup, pos1.x, pos1.y, aoe, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (
        UnitHelper.isUnitTargetableForPlayer(unit, player, true) 
        && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
        && !IsUnitInGroup(unit, excludeGroup)
      ) {
        Globals.tmpVector.setPos(GetUnitX(unit), GetUnitY(unit));
        const distance = CoordMath.distance(Globals.tmpVector, pos1);
        if (CoordMath.distance(Globals.tmpVector, pos2) < maxTpDist) {       
          GroupAddUnit(excludeGroup, unit);
          
          const unitId = GetHandleId(unit);
          const tpRegisterKey = StringHash("gate_tp_count");
          const tpTimeKey = StringHash("gate_tp_exclude_time");
          SaveInteger(Globals.genericGateTPHashtable, unitId, tpRegisterKey, 
            LoadInteger(Globals.genericGateTPHashtable, unitId, tpRegisterKey) + 1
          );
          SaveInteger(Globals.genericGateTPHashtable, unitId, tpTimeKey, excludeTicks);
          
          Globals.tmpVector.polarProjectCoords(
            pos2, 
            CoordMath.angleBetweenCoords(pos1, Globals.tmpVector), 
            distance
          );
          PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(unit, Globals.tmpVector);
          DestroyEffect(
            AddSpecialEffect(
              "Abilities/Spells/Human/MassTeleport/MassTeleportCaster.mdl", 
              Globals.tmpVector.x, Globals.tmpVector.y
            )
          );

          if (
            IsUnitType(unit, UNIT_TYPE_HERO)
            && !IsUnitType(unit, UNIT_TYPE_SUMMONED)
            && GetPlayerController(GetOwningPlayer(unit)) == MAP_CONTROL_USER
          ) {
            SetCameraPositionForPlayer(
              GetOwningPlayer(unit), 
              Globals.tmpVector.x, Globals.tmpVector.y
            );
          }
        }
      }
    });
    GroupClear(Globals.tmpUnitGroup);
  }

  // export function doAinzPandorasActor() {
  //   const caster = GetTriggerUnit();
  //   const player = GetOwningPlayer(caster);
  //   const timer = TimerManager.getInstance().get();
  //   SetPlayerAbilityAvailable(player, Id.ainzSummonPandora, false);

  //   TimerStart(timer, 45, false, () => {
  //     SetPlayerAbilityAvailable(player, Id.ainzSummonPandora, true);
  //     TimerManager.getInstance().recycle(timer);
  //   });
  // }

  export function doAinzResistance() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();
    if (UnitHelper.isUnitTargetableForPlayer(target, player, true)) {
      UnitRemoveBuffs(target, false, true);
      DestroyEffect(
        AddSpecialEffect(
          "Abilities/Spells/Human/DispelMagic/DispelMagicTarget.mdl",
          GetUnitX(target), GetUnitY(target)
        )
      );
    }
  }

  export function doAinzWish() {
    const caster = GetTriggerUnit();

    if (!DragonBallsManager.getInstance().isSummoned()) {
      let sfx = AddSpecialEffect(
        "MCBlue2.mdl", GetUnitX(caster), GetUnitY(caster)
      );
      BlzSetSpecialEffectScale(sfx, 5.0);
      DestroyEffect(sfx);

      sfx = AddSpecialEffect(
        "MCBlue2.mdl", GetUnitX(caster), GetUnitY(caster)
      );
      BlzSetSpecialEffectScale(sfx, 8.0);
      DestroyEffect(sfx);

      DragonBallsManager.getInstance().summonShenron(GetUnitX(caster), GetUnitY(caster));
      UnitRemoveAbility(caster, GetSpellAbilityId());
    }
  }

  export function doAlbedoFormSwap() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    let avail = true;

    if (GetUnitAbilityLevel(caster, Id.albedoFormSwap) == 1) {
      SetUnitAbilityLevel(caster, Id.albedoFormSwap, 2);

      avail = true;
      SetPlayerAbilityAvailable(player, Id.albedoGinnungagap, avail);
      SetPlayerAbilityAvailable(player, Id.albedoGuardianAura, avail);
      SetPlayerAbilityAvailable(player, Id.albedoVoracityAura, avail);
      SetPlayerAbilityAvailable(player, Id.albedoFearAura, avail);

      avail = false;
      SetPlayerAbilityAvailable(player, Id.albedoDecapitate, avail);
      SetPlayerAbilityAvailable(player, Id.albedoDefensiveSlash, avail);
      SetPlayerAbilityAvailable(player, Id.albedoChargeAttack, avail);
      SetPlayerAbilityAvailable(player, Id.albedoAegis, avail);

      BlzSetUnitSkin(caster, Id.albedoDress);
    } else {
      // 2
      SetUnitAbilityLevel(caster, Id.albedoFormSwap, 1);

      avail = false;
      SetPlayerAbilityAvailable(player, Id.albedoGinnungagap, avail);
      SetPlayerAbilityAvailable(player, Id.albedoGuardianAura, avail);
      SetPlayerAbilityAvailable(player, Id.albedoVoracityAura, avail);
      SetPlayerAbilityAvailable(player, Id.albedoFearAura, avail);

      avail = true;
      SetPlayerAbilityAvailable(player, Id.albedoDecapitate, avail);
      SetPlayerAbilityAvailable(player, Id.albedoDefensiveSlash, avail);
      SetPlayerAbilityAvailable(player, Id.albedoChargeAttack, avail);
      SetPlayerAbilityAvailable(player, Id.albedoAegis, avail);

      BlzSetUnitSkin(caster, Id.albedo);
    }
  }

  export function doAlbedoAegis() {
    const caster = GetTriggerUnit();
    const target = GetSpellTargetUnit();
    const maxTick = 1000;
    const absorbRatio = 0.5;
    const minHpDiff = 3;

    const sfx1 = AddSpecialEffectTarget(
      "Abilities/Spells/Orc/Voodoo/VoodooAura.mdl",
      caster,
      "origin"
    );
    const sfx2 = AddSpecialEffectTarget(
      "Abilities/Spells/Orc/Voodoo/VoodooAuraTarget.mdl",
      target,
      "origin"
    );

    let oldHp = GetUnitState(target, UNIT_STATE_LIFE);
    let tick = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (tick > maxTick) {
        DestroyEffect(sfx1);
        DestroyEffect(sfx2);
        TimerManager.getInstance().recycle(timer);
        return;
      }
      
      const currentHp = GetUnitState(target, UNIT_STATE_LIFE);
      if (currentHp > oldHp) {
        oldHp = currentHp;
      } else if (oldHp > currentHp + minHpDiff) {
        const hpDiff = oldHp - currentHp;
        const hpAbsorb = hpDiff * absorbRatio;
        const casterHp = GetUnitState(caster, UNIT_STATE_LIFE);
        if (casterHp > hpAbsorb + minHpDiff) {
          SetUnitState(target, UNIT_STATE_LIFE, currentHp + hpAbsorb);
          SetUnitState(caster, UNIT_STATE_LIFE, casterHp - hpAbsorb);
          oldHp = currentHp + hpAbsorb;
        }
      }

      if (UnitHelper.isUnitDead(caster) || UnitHelper.isUnitDead(target)) {
        tick += maxTick;
      }
      ++tick;
    });
  }

  export function doAlbedoSkillBoost() {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const boostGroup = CreateGroup();
    const maxTick = 666;
    const boostAOE = 1800;
    const boostSpellPower = 0.1;

    let tick = 0;
    const boostTimer = TimerManager.getInstance().get();
    TimerStart(boostTimer, 0.03, true, () => {
      if (tick > maxTick) {
        ForGroup(boostGroup, () => {
          const unit = GetEnumUnit();
          const targetPlayer = GetOwningPlayer(unit);
          const targetPlayerId = GetPlayerId(targetPlayer);
          const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
          if (ch) ch.removeSpellPower(boostSpellPower);
        });
        DestroyGroup(boostGroup);
        TimerManager.getInstance().recycle(boostTimer);
        return;
      }

      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(caster), GetUnitY(caster), boostAOE, null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (
          !IsUnitInGroup(unit, boostGroup)
          && IsUnitAlly(unit, player)
          && IsUnitType(unit, UNIT_TYPE_HERO) 
          && UnitHelper.isUnitAlive(unit)
        ) {
          const targetPlayer = GetOwningPlayer(unit);
          const targetPlayerId = GetPlayerId(targetPlayer);
          const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
          if (ch) {
            ch.addSpellPower(boostSpellPower);
            GroupAddUnit(boostGroup, unit);
          }
        }
      });
      GroupClear(Globals.tmpUnitGroup);
      
      if (
        UnitHelper.isUnitDead(caster)
        || GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_OFF
      ) {
        tick += maxTick;
      }
      ++tick;
    });
  }

  export function doShalltearValhalla() {
    const caster = GetTriggerUnit();
    const valhallaAOE = 1800;
    const valhallaHeal = 0.25;

    let healMult = 0;
    
    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      GetUnitX(caster), GetUnitY(caster),
      valhallaAOE, null
    );
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (
        UnitHelper.isUnitAlive(unit)
        && GetUnitTypeId(unit) == GetUnitTypeId(caster)
        && IsUnitIllusion(unit)
      ) {
        healMult = Math.max(
          healMult,
          valhallaHeal * GetUnitLifePercent(unit) * 0.01
        );

        DestroyEffect(
          AddSpecialEffect(
            "Abilities/Spells/Human/Resurrect/ResurrectCaster.mdl",
            GetUnitX(unit), GetUnitY(unit)
          )
        );

        SetUnitState(unit, UNIT_STATE_LIFE, 1);
        UnitDamageTarget(
          caster, unit, 
          1000, 
          true, false, 
          ATTACK_TYPE_HERO, 
          DAMAGE_TYPE_NORMAL, 
          WEAPON_TYPE_WHOKNOWS
        );
      }
    });

    if (healMult > 0) {
      DestroyEffect(
        AddSpecialEffect(
          "Abilities/Spells/Human/HolyBolt/HolyBoltSpecialArt.mdl",
          GetUnitX(caster), GetUnitY(caster)
        )
      );
      
      SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Shalltear/Subarashi.mp3", 1500);

      SetUnitState(
        caster, 
        UNIT_STATE_LIFE, 
        GetUnitState(caster, UNIT_STATE_LIFE) 
        + healMult * GetUnitState(caster, UNIT_STATE_MAX_LIFE)
      );
    }
  }

  export function doDemiurgeHellfireMantle() {
    const caster = GetTriggerUnit();
    const lvl = GetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle);

    if (lvl == 1) {
      SetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle, 2);
    } else {
      SetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle, 1);
    }
  }

  export function linkLeonSpellbook(unit: unit, cd: number) {
    BlzStartUnitAbilityCooldown(unit, Id.leonShotgun, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonAssaultRifle, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonSniperRifle, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonRocketLauncher, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonFlashbang, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonHeavyGrenade, cd);
  }

  export function setupSpellStartEndCastTrigger() {
    // Globals.linkedSpellsMap.set(Id.leonShotgun, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonAssaultRifle, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonSniperRifle, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonRocketLauncher, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonFlashbang, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonHeavyGrenade, SimpleSpellSystem.linkLeonSpellbook);
    Globals.linkedSpellsMap.set(Id.fleshAttack, SimpleSpellSystem.linkBuuFleshCD);
    Globals.linkedSpellsMap.set(Id.fleshAttackAbsorbTarget, SimpleSpellSystem.linkBuuFleshCD);

    TriggerRegisterAnyUnitEventBJ(Globals.simpleSpellCDTrigger, EVENT_PLAYER_UNIT_SPELL_ENDCAST);
    TriggerAddAction(Globals.simpleSpellCDTrigger, () => {
      // get custom hero casting it
      const unit = GetTriggerUnit();
      const player = GetOwningPlayer(unit);
      const playerId = GetPlayerId(player);
      if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
        const abilId = GetSpellAbilityId();
        
        if (
          abilId == Id.aylaTripleKick
          || abilId == Id.hirudegarnFlameBreath
          || abilId == Id.hirudegarnFlameBall
          || abilId == Id.hirudegarnTailSweep
        ) {
          return;
        }

        const abilLvl = GetUnitAbilityLevel(unit, abilId)-1;
        const baseCd = BlzGetUnitAbilityCooldown(unit, abilId, abilLvl);

        let newCd = baseCd;

        if (Globals.clownValue > 0) {
          newCd = newCd * ((100 - Globals.clownValue) * 0.01)
        }

        const getiCDR = GetPlayerTechCountSimple(Id.getiStarUpgradeCDR, player);
        if (getiCDR > 0) {
          newCd = newCd * (100 - getiCDR) * 0.01;
        }

        if (newCd != baseCd) {
          BlzStartUnitAbilityCooldown(unit, abilId, newCd);
          // BlzSetUnitAbilityCooldown(unit, abilId, abilLvl, newCd);
        }

        const callback = Globals.linkedSpellsMap.get(abilId);
        if (callback) {
          callback(unit, newCd);
        }
      }
    });
  }


  // export function doSchalaLinkChannels() {
  //   const unit = GetTriggerUnit();
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaPray, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaPray))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaMagicSeal, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaMagicSeal))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaMagicSeal2, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaMagicSeal2))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaTeleportation, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaTeleportation))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaTeleportation2, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaTeleportation2))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaSkygate, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaSkygate))
  //   );
  //   BlzStartUnitAbilityCooldown(
  //     unit, Id.schalaSkygate2, 
  //     Math.max(0.5, BlzGetUnitAbilityCooldownRemaining(unit, Id.schalaSkygate2))
  //   );
  // }

  export function linkBuuFleshCD(unit: unit, cd: number) {
    BlzStartUnitAbilityCooldown(unit, Id.fleshAttack, cd);
    if (GetUnitAbilityLevel(unit, Id.fleshAttackAbsorbTarget) > 0) {
      BlzStartUnitAbilityCooldown(unit, Id.fleshAttackAbsorbTarget, cd);
    }
  }

}