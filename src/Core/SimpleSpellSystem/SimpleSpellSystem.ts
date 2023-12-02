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
import { PauseManager } from "Core/PauseSystem/PauseManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { TimerManager } from "Core/Utility/TimerManager";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { AOEHeal } from "CustomAbility/AbilityComponent/AOEHeal";
import { BeamComponent } from "CustomAbility/AbilityComponent/BeamComponent";
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

    setupGenericSpellEffectTrigger();
    setupEndFinishTriggers();


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

  export function setupGenericSpellEffectTrigger() {
    TriggerRegisterAnyUnitEventBJ(Globals.simpleSpellEffectTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
    TriggerAddAction(Globals.simpleSpellEffectTrigger, () => {
      const spellId = GetSpellAbilityId();
      const func = Globals.genericSpellMap.get(spellId);
      if (func) {
        func(spellId);
      }
      spellCDStartLogic(spellId);
    });
    
    Globals.genericSpellMap.set(Id.vegetaHakai, SimpleSpellSystem.doVegetaHakai);
    Globals.genericSpellMap.set(Id.toppoHakai, SimpleSpellSystem.doVegetaHakai);

    Globals.genericSpellMap.set(Id.meditate, SimpleSpellSystem.doJirenMeditate);
    Globals.genericSpellMap.set(Id.meditate2, SimpleSpellSystem.doJirenMeditate);
    Globals.genericSpellMap.set(Id.mightyPunch, SimpleSpellSystem.doJirenMightyPunch);
    Globals.genericSpellMap.set(Id.mightyPunch2, SimpleSpellSystem.doJirenMightyPunch);
    Globals.genericSpellMap.set(Id.followUp, SimpleSpellSystem.doJirenFollowUp);

    Globals.genericSpellMap.set(Id.marioJump, SimpleSpellSystem.doMarioJump);
    Globals.genericSpellMap.set(Id.marioGroundPound, SimpleSpellSystem.doMarioGroundPound);
    Globals.genericSpellMap.set(Id.spinJump, SimpleSpellSystem.doMarioSpinJump);

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
    Globals.genericSpellMap.set(Id.schalaProtect2, SimpleSpellSystem.schalaEmpoweredProtectDebuff);
    
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

    Globals.genericSpellMap.set(Id.ultimateCharge, SimpleSpellSystem.doUltimateCharge);

    Globals.genericSpellMap.set(Id.minatoHiraishin, SimpleSpellSystem.doMinatoHiraishinNoJutsu);
    Globals.genericSpellMap.set(Id.minatoKunai, SimpleSpellSystem.doMinatoKunaiThrow);
    Globals.genericSpellMap.set(Id.minatoFirstFlash, SimpleSpellSystem.doMinatoFirstFlash);
    Globals.genericSpellMap.set(Id.minatoSecondStep, SimpleSpellSystem.InitJirenGlare);
    Globals.genericSpellMap.set(Id.minatoThirdStage, SimpleSpellSystem.doMinatoThirdStage);
    Globals.genericSpellMap.set(Id.minatoSpiralFlash, SimpleSpellSystem.doMinatoSpiralFlash);

    Globals.genericSpellMap.set(Id.mightGuyFrontLotus, SimpleSpellSystem.doMightGuyFrontLotus);
    Globals.genericSpellMap.set(Id.mightGuyReverseLotus, SimpleSpellSystem.doMightGuyReverseLotus);
    Globals.genericSpellMap.set(Id.mightGuyAsaKujaku, SimpleSpellSystem.doMightGuyAsaKujaku);
    Globals.genericSpellMap.set(Id.mightGuyHirudora, SimpleSpellSystem.doMightGuyHirudora);
    Globals.genericSpellMap.set(Id.mightGuySekizo, SimpleSpellSystem.doMightGuySekizo);
    Globals.genericSpellMap.set(Id.mightGuyYagai, SimpleSpellSystem.doMightGuyYagai);

    Globals.genericSpellMap.set(Id.mightGuyGate5, SimpleSpellSystem.doMightGuyGate);
    Globals.genericSpellMap.set(Id.mightGuyGate6, SimpleSpellSystem.doMightGuyGate);
    Globals.genericSpellMap.set(Id.mightGuyGate7, SimpleSpellSystem.doMightGuyGate);
    Globals.genericSpellMap.set(Id.mightGuyGate8, SimpleSpellSystem.doMightGuyGate);

    Globals.genericSpellMap.set(Id.sephirothOneWingedAngel, SimpleSpellSystem.doOneWingedAngel);
    Globals.genericSpellMap.set(Id.sephirothParry, SimpleSpellSystem.doSephirothParry);
    
    Globals.genericSpellMap.set(Id.genosIncinerationCannon, SimpleSpellSystem.doIncinerationCannon);
    Globals.genericSpellMap.set(Id.genosOvercharge, SimpleSpellSystem.doGenosOvercharge);
    
    Globals.genericSpellMap.set(Id.tatsumakiCompress, SimpleSpellSystem.doTatsumakiCompress);
    Globals.genericSpellMap.set(Id.tatsumakiLift, SimpleSpellSystem.doTatsumakiLift);
    Globals.genericSpellMap.set(Id.tatsumakiTornado, SimpleSpellSystem.doTatsumakiTornado);
    Globals.genericSpellMap.set(Id.tatsumakiVector, SimpleSpellSystem.doTatsumakiVector);
    Globals.genericSpellMap.set(Id.tatsumakiGiantSpear, SimpleSpellSystem.doTatsumakiGiantSpear);

    Globals.genericSpellMap.set(Id.itemSacredWaterAbility, SimpleSpellSystem.doAinzResistance);
    Globals.genericSpellMap.set(Id.itemCellMaxWings, SimpleSpellSystem.doCellMaxWings);
    Globals.genericSpellMap.set(Id.itemMajinBuuFat, SimpleSpellSystem.doMajinBuuFat);
    Globals.genericSpellMap.set(Id.itemSuper17Generator, SimpleSpellSystem.doSuper17Generator);

    // Globals.genericSpellMap.set(Id.schalaPray, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal2, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate2, SimpleSpellSystem.doSchalaLinkChannels);
    
  }

  export function setupEndFinishTriggers() {
    // unit STOP casting, could be cancelled, no guarantete finished
    TriggerRegisterAnyUnitEventBJ(Globals.simpleSpellEndTrigger, EVENT_PLAYER_UNIT_SPELL_ENDCAST);
    TriggerAddAction(Globals.simpleSpellEndTrigger, () => {
      const spellId = GetSpellAbilityId();
      const func = Globals.genericSpellEndMap.get(spellId);
      if (func) {
        func(spellId);
      }
      spellCDEndFinishLogic(spellId);
    });

    // unit FINISH casting, fully casted channel, fully casted ability not interrupted
    TriggerRegisterAnyUnitEventBJ(Globals.simpleSpellFinishTrigger, EVENT_PLAYER_UNIT_SPELL_FINISH);
    TriggerAddAction(Globals.simpleSpellFinishTrigger, () => {
      const spellId = GetSpellAbilityId();
      const func = Globals.genericSpellFinishMap.get(spellId);
      if (func) {
        func(spellId);
      }
      spellCDEndFinishLogic(spellId);
    });

    // Globals.linkedSpellsMap.set(Id.leonShotgun, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonAssaultRifle, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonSniperRifle, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonRocketLauncher, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonFlashbang, SimpleSpellSystem.linkLeonSpellbook);
    // Globals.linkedSpellsMap.set(Id.leonHeavyGrenade, SimpleSpellSystem.linkLeonSpellbook);
    Globals.linkedSpellsMap.set(Id.fleshAttack, SimpleSpellSystem.linkBuuFleshCD);
    Globals.linkedSpellsMap.set(Id.fleshAttackAbsorbTarget, SimpleSpellSystem.linkBuuFleshCD);

    Globals.genericSpellEndMap.set(Id.vegetaHakai, endVegetaHakai);
    Globals.genericSpellFinishMap.set(Id.vegetaHakai, endVegetaHakai);

    Globals.genericSpellEndMap.set(Id.toppoHakai, endVegetaHakai);
    Globals.genericSpellFinishMap.set(Id.toppoHakai, endVegetaHakai);
  }

  export function doVegetaHakai(spellId: number) {
    const speed = 40;
    const channelTick = 32;
    const endTick = 66;
    const aoe = 450;
    const maxHpPct = 0.05;
    const currHpPct = 0.2;

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const damagedGroup = CreateGroup();

    const hakaiKey = StringHash(I2S(spellId) + "hakai_channel_end"); 
    SaveInteger(Globals.genericSpellHashtable, casterId, hakaiKey, 1);

    let targetX = GetSpellTargetX();
    let targetY = GetSpellTargetY();

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(targetX, targetY);

    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    Globals.tmpVector3.polarProjectCoords(Globals.tmpVector, ang, 300);
    targetX = Globals.tmpVector3.x;
    targetY = Globals.tmpVector3.y;

    const sfx = AddSpecialEffect("ToppoHakai.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectScale(sfx, 0.5);
    BlzSetSpecialEffectColor(sfx, 255, 0, 255);
    BlzSetSpecialEffectHeight(sfx, GetUnitFlyHeight(caster) + 100);

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks >= endTick) {
        const dmgSfx = AddSpecialEffect(
          "PurpleSlam.mdl", targetX, targetY
        );
        BlzSetSpecialEffectScale(dmgSfx, 3.0);
        DestroyEffect(dmgSfx);

        DestroyEffect(sfx);
        DestroyGroup(damagedGroup);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      if (ticks == 18) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Effects/HakaiToppo.mp3", 3082);
      }

      if (ticks % 2 == 0) {
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, targetX, targetY, aoe, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (
            IsUnitInGroup(unit, damagedGroup)
            || !UnitHelper.isUnitTargetableForPlayer(unit, player)
          ) {
            return;
          }
          if (UnitHelper.isUnitHakaiInstantDestroyable(unit, player)) {
            UnitHelper.dealHakaiDamage(caster, unit);
          } else if (ticks >= channelTick) {
            const dmg = (
              GetUnitState(unit, UNIT_STATE_LIFE) * currHpPct
              + GetUnitState(unit, UNIT_STATE_MAX_LIFE) * maxHpPct
            );
            GroupAddUnit(damagedGroup, unit);
            UnitDamageTarget(
              caster, unit, dmg, 
              false, false, 
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
              WEAPON_TYPE_WHOKNOWS
            );
          } 
          if (GetUnitTypeId(unit) == Constants.dummyBeamUnitId) {
            const dmgSfx = AddSpecialEffect(
              "PurpleSlam.mdl", GetUnitX(unit), GetUnitY(unit)
            );
            BlzSetSpecialEffectScale(dmgSfx, 2.0);
            DestroyEffect(dmgSfx);
          }
        });
      }

      if (ticks >= channelTick) {
        Globals.tmpVector.setPos(targetX, targetY);
        Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, speed);
        BlzSetSpecialEffectX(sfx, Globals.tmpVector.x);
        BlzSetSpecialEffectY(sfx, Globals.tmpVector.y);
        targetX = Globals.tmpVector.x;
        targetY = Globals.tmpVector.y;
      } else {
        BlzSetSpecialEffectScale(sfx, 0.5 + ticks * 0.04);
      }

      const flag = LoadInteger(Globals.genericSpellHashtable, casterId, hakaiKey);
      if (
        ticks < channelTick
        && (
          flag == 2
          || UnitHelper.isUnitDead(caster)
        )
      ) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  export function endVegetaHakai(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const hakaiKey = StringHash(I2S(spellId) + "hakai_channel_end"); 
    SaveInteger(Globals.genericSpellHashtable, casterId, hakaiKey, 2);
  }

  export function doJirenMeditate(spellId: number) {
    const endTick = 30;

    const caster = GetTriggerUnit();
    // const casterId = GetHandleId(caster);
    // const player = GetOwningPlayer(caster);
    // const playerId = GetPlayerId(player);

    PauseManager.getInstance().pause(caster, false);
    SetUnitAnimationByIndex(caster, 6);
    
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.1, true, () => {
      if (ticks > endTick) {
        PauseManager.getInstance().unpause(caster, false);
        ResetUnitAnimation(caster);
        UnitHelper.payMPPercentCost(caster, -0.1, UNIT_STATE_MAX_MANA);
        if (!RectContainsUnit(gg_rct_HeroPickRegion, caster)) {
          udg_TempUnit = caster;
          udg_TempInt = 1;
          TriggerExecute(gg_trg_Jiren_Upgrade_Spells);
        }
        TimerManager.getInstance().recycle(timer);
        return;
      }
      if (UnitHelper.isUnitDead(caster)) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  export function doJirenMightyPunch(spellId: number) {
    const moveTick = 33;
    const endTick = 66;
    const kbSpeed = 40;
    const dashSpeed = 50;
    const collisionStunAOE = 250;
    const dmgMult = BASE_DMG.KAME_DPS * 6;
    const strDiffMult = 1.1;
    const followUpKey = StringHash(I2S(Id.followUp) + "follow_up_flag");

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, spellId);
    const target = GetSpellTargetUnit();

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setUnit(target);

    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);

    let sfx = null;
    
    sfx = AddSpecialEffect("DetroitSmash_Effect.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectScale(sfx, 2.0);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    DestroyEffect(sfx);

    sfx = AddSpecialEffect("dash sfx.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectScale(sfx, 2.0);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    DestroyEffect(sfx);

    sfx = AddSpecialEffect("slam.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectScale(sfx, 1.5);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    DestroyEffect(sfx);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const spellPower = ch ? ch.spellPower : 1.0;

    PauseManager.getInstance().pause(target);

    let dmg = AOEDamage.calculateDamageRaw(
      caster, abilLvl, spellPower, dmgMult, 1.0, bj_HEROSTAT_INT
    );

    if (spellId == Id.mightyPunch2) {
      if (IsUnitType(target, UNIT_TYPE_HERO)) {
        const strDiff = Math.max(
          0, strDiffMult * (GetHeroStr(caster, true) - GetHeroStr(target, true))
        );
        dmg += AOEDamage.calculateDamageRawForced(
          caster, abilLvl, spellPower, dmgMult, 1.0, strDiff
        );
      }
    } 

    UnitDamageTarget(
      caster, target, 
      dmg, 
      false, false, 
      ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
      WEAPON_TYPE_WHOKNOWS
    );

    let isPaused = true;
    let dashTick = 0;
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > endTick) {
        if (isPaused) PauseManager.getInstance().unpause(target);

        ResetUnitAnimation(caster);

        SaveBoolean(Globals.genericSpellHashtable, casterId, followUpKey, false);
        if (spellId == Id.mightyPunch2) {
          SetPlayerAbilityAvailable(player, Id.followUp, false);
          const charges = LoadInteger(udg_StatMultHashtable, casterId, 11);
          if (charges > 0) {
            SetPlayerAbilityAvailable(player, Id.mightyPunch2, true);
          } else {
            UnitHelper.abilitySwap(player, caster, Id.mightyPunch2, Id.mightyPunch, true);
          }
        }

        TimerManager.getInstance().recycle(timer);
        return;
      }

      if (ticks < moveTick) {
        Globals.tmpVector.setUnit(target);
        Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, kbSpeed);
  
        if (!PathingCheck.moveGroundUnitToCoord(target, Globals.tmpVector)) {
          AddSpecialEffect("slam.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx, 1.5);
          BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
          DestroyEffect(sfx);
  
          const dummy = CreateUnit(player, Constants.dummyCasterId, Globals.tmpVector.x, Globals.tmpVector.y, 0);
          UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1.0);
          UnitAddAbility(dummy, DebuffAbilities.STUN_HALF_SECOND);
          IssueTargetOrderById(dummy, OrderIds.THUNDERBOLT, target);
          
          GroupEnumUnitsInRange(Globals.tmpUnitGroup, Globals.tmpVector.x, Globals.tmpVector.y, collisionStunAOE, null);
          ForGroup(Globals.tmpUnitGroup, () => {
            const unit = GetEnumUnit();
            if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
              IssueTargetOrderById(dummy, OrderIds.THUNDERBOLT, unit);
              UnitDamageTarget(
                caster, unit, dmg, 
                false, false, 
                ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WHOKNOWS
              );
            }
          });
  
          ticks = moveTick;
        }
      }

      if (ticks == moveTick && isPaused) {
        isPaused = false;
        PauseManager.getInstance().unpause(target);
      }

      if (LoadBoolean(Globals.genericSpellHashtable, casterId, followUpKey)) {
        if (LoadReal(udg_StatMultHashtable, casterId, 9) > 0) {
          SetUnitAnimationByIndex(caster, 6);
        } else {
          SetUnitAnimationByIndex(caster, 10);
        }
        Globals.tmpVector.setUnit(caster);
        Globals.tmpVector2.setUnit(target);

        const dist = Math.min(
          dashSpeed,
          CoordMath.distance(Globals.tmpVector, Globals.tmpVector2)
        );
        if (dist < dashSpeed) {
          SaveBoolean(Globals.genericSpellHashtable, casterId, followUpKey, false);
        }

        const dashAng = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
        Globals.tmpVector.polarProjectCoords(Globals.tmpVector, dashAng, dist);

        if (ticks % 3 == 0) {
          AddSpecialEffect("Abilities/Spells/Other/Volcano/VolcanoDeath.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx, 0.5);
          DestroyEffect(sfx);
          BlzSetUnitFacingEx(caster, dashAng);
        }

        if (dashTick == 0) {
          sfx = AddSpecialEffect("dash sfx.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx, 2.0);
          BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
          DestroyEffect(sfx);
        }

        PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector);
        dashTick++;
      }

      if (UnitHelper.isUnitDead(target)) {
        ticks = endTick;
      }

      ticks++;
    });
  }

  export function doJirenFollowUp(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const followUpKey = StringHash(I2S(Id.followUp) + "follow_up_flag");
    SaveBoolean(Globals.genericSpellHashtable, casterId, followUpKey, true);
  }

  export function doMarioJump(spellId: number) {
    const maxJumps = 9;
    const jumpAOE = 350;
    const jumpAirHeight = 3;
    const jumpAirTicks = 33;
    const groundPoundWaitTicks = 12;
    const groundPoundFallSpeed = -100;
    const groundPoundAOE = 400;
    const dmgMultPerJump = 0.15;
    const dmgJumpMult = BASE_DMG.KAME_DPS * 4;
    const dmgGroundPoundMult = BASE_DMG.KAME_DPS * 10;
    const groundPoundKey = StringHash(I2S(Id.marioGroundPound) + "ground_pound_flag");
    const spinJumpKey = StringHash(I2S(Id.spinJump) + "spin_jump_flag");

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const casterUnitTypeId = GetUnitTypeId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, spellId);

    UnitHelper.giveUnitFlying(caster);
    UnitAddAbility(caster, Id.ghostVisible);
    UnitHelper.abilitySwap(player, caster, Id.marioJump, Id.marioGroundPound);
    if (casterUnitTypeId == Id.mario) {
      UnitHelper.abilitySwap(player, caster, Id.hammerTime, Id.spinJump, true);
    }
    SetUnitTimeScale(caster, 0.01);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    const maxEmptyJumps = GetHeroLevel(caster) > 250 ? 2 : 1;
    let sfx = null;
    let height = 0;
    let groundPoundTicks = 0;
    let jumpTicks = 0;
    let numJumps = 0;
    let numEmptyJumps = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (numJumps >= maxJumps) {
        TimerManager.getInstance().recycle(timer);

        SetUnitFlyHeight(caster, 0, 0.0);

        UnitRemoveAbility(caster, Id.ghostVisible);
        UnitHelper.abilitySwap(player, caster, Id.marioGroundPound, Id.marioJump);
        if (casterUnitTypeId == Id.mario) {
          UnitHelper.abilitySwap(player, caster, Id.spinJump, Id.hammerTime, true);
        }

        SetUnitTimeScale(caster, 1.0);
        ResetUnitAnimation(caster);
        if (LoadBoolean(Globals.genericSpellHashtable, casterId, groundPoundKey)) {
          PauseManager.getInstance().unpause(caster);
          SaveBoolean(Globals.genericSpellHashtable, casterId, groundPoundKey, false);
        }

        if (LoadBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey)) {
          UnitRemoveAbility(caster, Id.flagArmor100k);
          udg_StatMultUnit = caster;
          TriggerExecute(gg_trg_Base_Armor_Set);
          SaveBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey, false);
        }

        BlzStartUnitAbilityCooldown(
          caster, Id.marioJump, 
          BlzGetAbilityCooldown(Id.marioJump, abilLvl-1)
        );
        SaveInteger(udg_StatMultHashtable, casterId, 11, 0);

        return;
      }

      Globals.tmpVector.setUnit(caster);
      const damageMultiplier = 1 + numJumps * dmgMultPerJump;

      if (LoadBoolean(Globals.genericSpellHashtable, casterId, groundPoundKey)) {
        groundPoundTicks++;
        // spin over in air until ready to fall
        if (groundPoundTicks > groundPoundWaitTicks) {
          height = Math.max(0, height + groundPoundFallSpeed);
          SetUnitFlyHeight(caster, height, 0.0);
          SetUnitTimeScale(caster, 0.01);
          if (height <= 0) {
            numJumps = maxJumps;

            sfx = AddSpecialEffect(
              "Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl", 
              Globals.tmpVector.x, Globals.tmpVector.y
            );
            DestroyEffect(sfx);

            // deal ground pound damage and slow
            const dummyCaster = CreateUnit(
              player, Constants.dummyCasterId, 
              Globals.tmpVector.x, Globals.tmpVector.y, 0
            );
            UnitAddAbility(dummyCaster, DebuffAbilities.FLATTEN);

            const groundPoundDmg = AOEDamage.calculateDamageRaw(
              caster, 
              abilLvl,
              ch ? ch.spellPower : 1.0,
              dmgGroundPoundMult,
              damageMultiplier,
              bj_HEROSTAT_INT
            );
            GroupEnumUnitsInRange(
              Globals.tmpUnitGroup, 
              Globals.tmpVector.x, Globals.tmpVector.y, 
              groundPoundAOE, null
            );
            ForGroup(Globals.tmpUnitGroup, () => {
              const unit = GetEnumUnit();
              if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
                UnitDamageTarget(
                  caster, unit,
                  groundPoundDmg, 
                  false, false,
                  ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
                  WEAPON_TYPE_WHOKNOWS
                );
                IssueTargetOrderById(dummyCaster, OrderIds.SLOW, unit);
              }
            });
          }
        }
      } else {
        // do normal jump
        height = Math.max(0, jumpTicks * (jumpAirTicks - jumpTicks) * jumpAirHeight);
        SetUnitFlyHeight(caster, height, 0.0);
        

        if (LoadBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey)) {
          SetUnitAnimationByIndex(caster, 0);
          BlzSetUnitFacingEx(caster, jumpTicks * 30 % 360);
        } else {
          SetUnitAnimationByIndex(caster, 7);
        }

        if (height == 0 && numJumps > 0) {
          // jump landing dmg
          SoundHelper.playSoundOnUnit(caster, "Audio/Effects/Mario/JumpDamage.mp3", 396);
          
          sfx = AddSpecialEffect("Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx, 0.5);
          BlzSetSpecialEffectTimeScale(sfx, 2);
          DestroyEffect(sfx);

          const jumpDmg = AOEDamage.calculateDamageRaw(
            caster,
            abilLvl,
            ch ? ch.spellPower : 1.0,
            dmgJumpMult,
            damageMultiplier,
            bj_HEROSTAT_INT
          );
          let numJumped = 0;
          GroupEnumUnitsInRange(Globals.tmpUnitGroup, Globals.tmpVector.x, Globals.tmpVector.y, jumpAOE, null);
          ForGroup(Globals.tmpUnitGroup, () => {
            const unit = GetEnumUnit();
            if (
              UnitHelper.isUnitTargetableForPlayer(unit, player, true)
              && unit != caster  
            ) {
              if (IsUnitEnemy(unit, player)) {
                UnitDamageTarget(
                  caster, unit,
                  jumpDmg, 
                  false, false,
                  ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
                  WEAPON_TYPE_WHOKNOWS
                );
              }
              numJumped++;
            }
          });
          if (numJumped == 0) {
            numEmptyJumps++;
            if (numEmptyJumps > maxEmptyJumps) numJumps = maxJumps;
          }
        }
        if (height == 0) {
          SaveInteger(udg_StatMultHashtable, casterId, 11, numJumps);
          jumpTicks = 0; // reset jump ticks
          numJumps++;
        }
        jumpTicks++;
      }

      if (UnitHelper.isUnitDead(caster)) {
        numJumps = maxJumps;
      }
    });
  }

  export function doMarioGroundPound(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const groundPoundKey = StringHash(I2S(Id.marioGroundPound) + "ground_pound_flag");
    SaveBoolean(Globals.genericSpellHashtable, casterId, groundPoundKey, true);
    SetUnitTimeScale(caster, 1.33);
    PauseManager.getInstance().pause(caster);
    SetUnitAnimationByIndex(caster, 8);
  }

  export function doMarioSpinJump(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const spinJumpKey = StringHash(I2S(Id.spinJump) + "spin_jump_flag");
    SaveBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey, true);
    BlzStartUnitAbilityCooldown(caster, Id.marioGroundPound, 1.0);

    const sfx = AddSpecialEffectTarget("Abilities/Spells/Other/Tornado/Tornado_Target.mdl", caster, "origin");
    BlzSetSpecialEffectTimeScale(sfx, 2.0);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 1.0, false, () => {
      DestroyEffect(sfx);
      TimerManager.getInstance().recycle(timer);
      if (LoadBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey)) {
        UnitRemoveAbility(caster, Id.flagArmor100k);
        udg_StatMultUnit = caster;
        TriggerExecute(gg_trg_Base_Armor_Set);
        SaveBoolean(Globals.genericSpellHashtable, casterId, spinJumpKey, false);
      }
    });

    UnitAddAbility(caster, Id.flagArmor100k);
    udg_StatMultUnit = caster;
    TriggerExecute(gg_trg_Base_Armor_Set);
  }

  export function BraveSwordAttack(spellId: number) {
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

          const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(caster);
          const spellPower = customHero ? customHero.spellPower : 1.0;
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

  export function InitDragonFists(spellId: number) {
    const sfxHeadModel = "DragonHead2.mdl";
    const sfxSpiralModel = "DragonSegment2.mdl";

    const sfxShadowHeadModel = "RedDragonHead.mdl";
    const sfxShadowSpiralModel = "RedDragonSegment.mdl";

    const sfxDinoTail = "DinoTail.mdl";
    const sfxDinoTailSpiral = "DinoSegment.mdl";

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
          SimpleSpellSystem.OmegaDFistSteal();
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

  export function OmegaDFistSteal() {
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

  export function GinyuChangeNowConfirm(spellId: number) {
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

  export function GinyuTelekinesis(spellId: number) {
    const ignoreItem = FourCC("wtlg");
    const telekinesisDuration = 30;
    const telekinesisSpeed = 50;
    const telekinesisPlayerSpeedModifier = 0.5;
    const telekinesisAOE = 400;
    const telekinesisMinDistance = 300;
    const telekinesisRect = Rect(0, 0, 800, 800);

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

  export function GuldoTimeStop(spellId: number) {
    const originalBAT: number = 1.8;
    const timeStopBAT: number = 0.4;

    const caster = GetTriggerUnit();
    BlzSetUnitAttackCooldown(caster, timeStopBAT, 0);

    TimerStart(CreateTimer(), 2.0, false, () => {
      BlzSetUnitAttackCooldown(caster, originalBAT, 0);
      DestroyTimer(GetExpiredTimer());
    });
  }

  export function KrillinSenzuThrow(spellId: number) {
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
        return;
      }

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

  export function InitJirenGlare(spellId: number) {
    /**
     * hashtable
     * 0: spellId, or 0 if not activated
     * 1: counter sfx
     * 2: ability level
     */

    const glareDuration = 2.5;
    const darkEyesDuration = 4.0;
    const negativeImpactShieldDuration = 3.0;
    const minatoSecondStepDuration = 1.5;

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
    } else if (spellId == Id.minatoSecondStep) {
      effect = AddSpecialEffectTarget("Rasengan4.mdl", unit, "right hand");
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
    } else if (spellId == Id.minatoSecondStep) {
      timerDuration = minatoSecondStepDuration;
    }

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, timerDuration, false, () => {
      SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
      SaveInteger(Globals.genericSpellHashtable, unitId, 2, 0);
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, unitId, 1);
      if (sfx) DestroyEffect(sfx);
      TimerManager.getInstance().recycle(timer);
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
        && spellId != Id.minatoSecondStep
      )
    ) return;

    const maxGlareDistance = 2500;
    const maxNegativeImpactShieldDistance = 600;
    const maxMinatoSecondStepDistance = 1500;
    const glareDamageMult = BASE_DMG.KAME_DPS * 5;
    const glare2DamageMult = BASE_DMG.KAME_DPS * 7.5;
    const negativeImpactShieldDamageMult = BASE_DMG.KAME_DPS * 10;
    const minatoSecondStepDamageMult = BASE_DMG.KAME_DPS * 10;
    const glare2StrDiffJirenBonus = 1.05;
    const glare2StrDiffMult = 1.1;
    const glarePunishDamageMult = 0.15;
    const darkEyesPunishDamageMult = 0.25;
    const minatoPunishDamageMult = 0.1;

    SaveInteger(Globals.genericSpellHashtable, targetId, 0, 0);

    const unitId = GetUnitTypeId(target);
    const player = GetOwningPlayer(target);
    Globals.tmpVector.setPos(GetUnitX(target), GetUnitY(target));
    Globals.tmpVector2.setPos(GetUnitX(source), GetUnitY(source));

    if (spellId == Id.shalltearNegativeImpactShield) {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > maxNegativeImpactShieldDistance) return;
    } else if (spellId == Id.minatoSecondStep) {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > maxMinatoSecondStepDistance) return;
    } else {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) > maxGlareDistance) return;
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
    let spellPower = customHero ? customHero.spellPower : 1.0;

    let punishMult = glarePunishDamageMult;
    if (spellId == Id.hirudegarnDarkEyes || spellId == Id.shalltearNegativeImpactShield) {
      punishMult = darkEyesPunishDamageMult;
    } else if (spellId == Id.minatoSecondStep) {
      punishMult = minatoPunishDamageMult;
    }

    let damageMult = glareDamageMult;
    if (spellId == Id.glare2) {
      damageMult = glare2DamageMult;
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      damageMult = negativeImpactShieldDamageMult;
    } else if (spellId == Id.minatoSecondStep) {
      damageMult = minatoSecondStepDamageMult;
    }

    let damageBase = CustomAbility.BASE_DAMAGE + GetHeroInt(target, true);
    if (spellId == Id.glare2) {
      damageBase += Math.max(0, glare2StrDiffMult * (glare2StrDiffJirenBonus * GetHeroStr(target, true) - GetHeroStr(source, true)));
    }

    const abilityLevel = LoadInteger(Globals.genericSpellHashtable, targetId, 2);

    
    if (spellId == Id.minatoSecondStep) {
      const animDelay = 0.9;
      const dmgDelay = 0.43 / animDelay;
      const animResetDelay = 0.66 - dmgDelay;

      minatoKunaiCreateVec(target, Globals.tmpVector2);
      
      PauseManager.getInstance().pause(target, true);
      SetUnitTimeScalePercent(target, animDelay * 100);
      SetUnitAnimation(target, "spell slam");
      // UnitHelper.giveUnitFlying(target);
      // SetUnitFlyHeight(target, 250, 250);

      if (Math.random() * 100 < 50) {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/Minato/SecondStep2.mp3", 1700);
      } else {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/Minato/SecondStep3.mp3", 1700);
      }
      SoundHelper.playSoundOnUnit(target, "Audio/Effects/Minato/Hiraishin1.mp3", 1000);
      
      const dmgTimer = TimerManager.getInstance().get();
      TimerStart(dmgTimer, dmgDelay, false, () => {

        spellPower = customHero ? customHero.spellPower : 1.0;
        Globals.tmpVector2.setUnit(target);
        AOEDamage.genericDealAOEDamage(
          Globals.tmpUnitGroup, 
          target,
          Globals.tmpVector2.x, Globals.tmpVector2.y,
          300,
          abilityLevel,
          spellPower,
          damageMult,
          1.0,
          bj_HEROSTAT_INT
        );
        const sfx1 = AddSpecialEffect("RasenganBomb2.mdl",Globals.tmpVector2.x, Globals.tmpVector2.y);
        const sfx2 = AddSpecialEffect("RasenganEffect4.mdl",Globals.tmpVector2.x, Globals.tmpVector2.y);
        const sfx3 = AddSpecialEffect("RasenganBlast.mdl",Globals.tmpVector2.x, Globals.tmpVector2.y);
        
        const animResetTimer = TimerManager.getInstance().get();
        TimerStart(animResetTimer, animResetDelay, false, () => {
          const sfx = LoadEffectHandle(Globals.genericSpellHashtable, targetId, 1);
          if (sfx) DestroyEffect(sfx);
          DestroyEffect(sfx1);
          DestroyEffect(sfx2);
          DestroyEffect(sfx3);
          PauseManager.getInstance().unpause(target, true);
          SetUnitTimeScalePercent(target, 100);
          ResetUnitAnimation(target);
          // SetUnitFlyHeight(target, GetUnitDefaultFlyHeight(target), 0);
          SelectUnitForPlayerSingle(target, player);
          TimerManager.getInstance().recycle(animResetTimer);
        });

        TimerManager.getInstance().recycle(dmgTimer);
      });
    } else {
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
    }
    IssueTargetOrderById(castDummy, OrderIds.THUNDERBOLT, source);
    RemoveUnit(castDummy);
    
    if (spellId == Id.shalltearNegativeImpactShield) {
      DestroyEffect(
        AddSpecialEffect(
          "PurpleBigExplosion.mdl",
          Globals.tmpVector2.x, Globals.tmpVector2.y
        )
      );
    } else if (spellId == Id.minatoSecondStep) {
      DestroyEffect(AddSpecialEffect("RasenganWhiteShockwave.mdl",Globals.tmpVector2.x, Globals.tmpVector2.y));
    } else {
      DestroyEffect(
        AddSpecialEffect("Slam.mdl", Globals.tmpVector2.x, Globals.tmpVector2.y)
      );
    }
    
    if (targetId == Id.jiren) {
      if (Math.random() * 100 < 5) {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenOmaeWaMouShindeiru.mp3", 3317);
      } else {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenGlare2.mp3", 1018);
      }
    }

    if (spellId != Id.minatoSecondStep) {
      SoundHelper.playSoundOnUnit(target, "Audio/Effects/Zanzo.mp3", 1149);
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, targetId, 1);
      if (sfx) DestroyEffect(sfx);
    }
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

  export function InitCero(spellId: number) {
    /**
     * 0: charge time (0-5s)
     */
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

  export function DoBankai(spellId: number) {
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

  export function dartRedEyedDragonSummoning(spellId: number) {
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

  export function dartDragoonTransformation(spellId: number) {
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

  export function DoMadnessDebuff(spellId: number) {
    const target = GetSpellTargetUnit();
    if (GetUnitAbilityLevel(target, Buffs.MADNESS_CURSE_MISS) != 0) return;
    // 0: stacks
    const maxMadnessStacks = 7;
    const madnessStunOrder = 852095;
    const madnessStunDamage = 0.1;
    const madnessCurseOrder = 852190;

    const madnessHeroDebuffKey = StringHash(I2S(spellId) + "madness_hero");

    const targetId = GetHandleId(target);
    const stacks = 1+LoadInteger(Globals.genericEnemyHashtable, targetId, madnessHeroDebuffKey);

    TextTagHelper.showPlayerColorTextOnUnit(
      I2S(stacks), 3, target, stacks + 8     
    );

    if (stacks >= maxMadnessStacks) {
      SaveInteger(Globals.genericEnemyHashtable, targetId, madnessHeroDebuffKey, 0);
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
      SaveInteger(Globals.genericEnemyHashtable, targetId, madnessHeroDebuffKey, stacks);
    }
  }

  export function AylaCharm(spellId: number) {
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

  export function MagusDarkMatter(spellId: number) {
    const closenessDamageMult = 1.0;
    const durationDamageMult = 1.0;
    const aoe = 750;
    const angle = 75;
    const closenessAngle = 90 + 12;
    const distance = 40;
    const closenessDistanceMult = -0.25;
    const maxDuration = 66;
  
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
            currentPos,
            false,
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
    affectAllies: boolean,
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
      if (UnitHelper.isUnitTargetableForPlayer(target, casterPlayer, affectAllies)) {

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
        if (!IsUnitAlly(target, casterPlayer)) {
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
      }
    });

    GroupClear(Globals.tmpUnitGroup);
  }

  export function JungleRushBananaFallout(spellId: number) {
    const bananaThrowDuration = 24;
    const bananaThrowSpeed = 49;
    const bananaThrowStealMinDuration = 16;
    const bananaThrowStealAOE = 300;
    const bananaThrowAmount = 6;
    const bananaThrowDirectionOffset = 360 / Math.max(1, bananaThrowAmount);
    
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

  export function BarrelCannon(spellId: number) {
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


  export function HirudegarnSkinChange(spellId: number) {
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


  export function VegetaFightingSpirit(spellId: number) {
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(unit);

    if (!ch) return;

    // give spell amp
    const spellAmp = 0.3 * (
      Math.max(
        0, 
        1 - GetUnitState(unit, UNIT_STATE_LIFE) / Math.max(1, GetUnitState(unit, UNIT_STATE_MAX_LIFE))
      )
    );
    ch.addSpellPower(spellAmp);

    // timer remove it
    TimerStart(CreateTimer(), 10.0, false, () => {
      ch.removeSpellPower(spellAmp);
      DestroyTimer(GetExpiredTimer());
    });
  }

  export function schalaEmpoweredProtectDebuff(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const boostGroup = CreateGroup();
    const debuffDuration = 10;
    const debuffAOE = 1000;
    const debuffSpellAmp = 0.05;

    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(caster), GetUnitY(caster), debuffAOE, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (
        !IsUnitInGroup(unit, boostGroup)
        && IsUnitType(unit, UNIT_TYPE_HERO) 
        && UnitHelper.isUnitTargetableForPlayer(unit, player)
      ) {
        const targetPlayer = GetOwningPlayer(unit);
        const targetPlayerId = GetPlayerId(targetPlayer);
        const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
        if (ch) {
          ch.removeSpellPower(debuffSpellAmp);
          GroupAddUnit(boostGroup, unit);
        }
      }
    });
    GroupClear(Globals.tmpUnitGroup);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, debuffDuration, false, () => {
      ForGroup(boostGroup, () => {
        const unit = GetEnumUnit();
        const targetPlayer = GetOwningPlayer(unit);
        const targetPlayerId = GetPlayerId(targetPlayer);
        const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
        if (ch) ch.addSpellPower(debuffSpellAmp);
      });
      DestroyGroup(boostGroup);
      TimerManager.getInstance().recycle(timer);
    });
  }

  export function SchalaTeleportation(spellId: number) {
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
              && !Globals.barrierBlockUnits.has(unit)
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

  export function YamchaCombos(spellId: number) {
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


  export function SkurvyPlunder(spellId: number) {
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
                && itemId != ItemConstants.SagaDrops.NUOVA_HEAT_ARMOR
                && itemId != ItemConstants.SagaDrops.MAJIN_BUU_FAT
                && itemId != ItemConstants.SagaDrops.BROLY_FUR
                && itemId != DragonBallsConstants.dragonBallItem
              ) {
                AOEDamage.dealDamageRaw(
                  caster,
                  GetUnitAbilityLevel(caster, spellId),
                  customHero.spellPower,
                  plunderDamageMult,
                  1.0 + plunderDamageMultPerItem * UnitHelper.countInventory(targetUnit),
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

  export function SetupSkurvyMirror(spellId: number) {
    // globals hashtable
    // 0: is mirrored
    // 1: mirror target

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

  export function SonicAbilities(spellId: number) {
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

  export function InitMafuba(spellId: number) {
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

  export function DoMafubaSealed(spellId: number) {
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

  export function doJacoEliteBeamCharge(spellId: number) {
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

  export function doJacoEliteBeamPrime(spellId: number) {
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

  export function doJacoEliteBeamFire(spellId: number) {
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    const player = GetOwningPlayer(unit);

    // swap to charge
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, true);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, false);
    SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, false);
    SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
  }

  export function doJacoEmergencyBoost(spellId: number) {
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

  export function doJacoAnnihilationBomb(spellId: number) {
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
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY())

    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, extinctionBombMaxDist);

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

  export function doJacoElitePose(spellId: number) {
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
  
  export function doJacoShip(spellId: number) {
    const flySpeed = 40;
    const macroCannonDmgMult = BASE_DMG.KAME_DPS * 10;
    const baseAOE = 400;
    const maxAOE = 600;
    const AOEperDistance = 50;
    const dmgMultPerDistance = 0.75;
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
          const distanceDmgMult = dmgMultPerDistance * Math.min(30, 1.0 + Math.max(0, (distanceTravelled - minExpandingDistance) / 1000));
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

  export function appuleVengeanceExtra(spellId: number) {
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

  export function appuleVengeanceIllusion(spellId: number) {
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
    UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1);
  }

  export function gohanBeastBuff(spellId: number) {
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

  export function specialBeastCannon(spellId: number) {
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

  export function doMeguminManatite(spellId: number) {
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

  export function doMeguminExplosion(spellId: number) {
    const unit = GetTriggerUnit();
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

  export function doPecoManaBonus(spellId: number) {
    const unit = GetTriggerUnit();
    let bonus = 0;
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

  export function farmingPlantCrops(spellId: number) {
    const x = GetUnitX(GetTriggerUnit());
    const y = GetUnitY(GetTriggerUnit());
    FarmingManager.getInstance().plantCropFromSpell(spellId, x, y);
    
    return false;
  }

  export function doDendeHeal(spellId: number) {
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

  export function doLinkBombCharge(spellId: number) {
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

  export function doLinkBombThrow(spellId: number) {
    const keyIsActive = StringHash("link|bomb|active");
    const keyBombCounter = StringHash("link|bomb|counter");

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
  
  export function doLinkHookshotPull(spellId: number) {
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

  export function doLinkHookshot(spellId: number) {
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
            && IsUnitType(target, UNIT_TYPE_HERO)
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

  export function doLinkBowShoot(spellId: number) {
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

  export function doLinkArrowSelect(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);

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

  export function doLinkFireArrowBurn(spellId: number) {
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

  export function doCellMaxDisasterRay(spellId: number) {
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

  export function doAinzLightningSFX(spellId: number) {
    const caster = GetTriggerUnit();
    const target = GetSpellTargetUnit();
    
    let str = "";
    if (spellId == Id.ainzEnergyDrain) {
      str = "DRAL";
    } else if (spellId == Id.ainzGraspHeart) {
      str = "AFOD";
    }

    let lightningSfx = AddLightning(
      str, true, 
      GetUnitX(caster), GetUnitY(caster),
      GetUnitX(target), GetUnitY(target),
    );

    str = "";
    if (spellId == Id.ainzEnergyDrain) {
      str = "Abilities/Spells/Other/Drain/DrainTarget.mdl";
    } else if (spellId == Id.ainzGraspHeart) {
      str = "Objects/Spawnmodels/Human/HumanBlood/HumanBloodFootman.mdl";
    }
    let sfx = AddSpecialEffect(str, GetUnitX(target), GetUnitY(target));
    BlzSetSpecialEffectScale(sfx, 5.0);
    DestroyEffect(sfx);
    
    str = "";
    if (spellId == Id.ainzEnergyDrain) {
      str = "Objects/Spawnmodels/Undead/UCancelDeath/UCancelDeath.mdl";
    } else if (spellId == Id.ainzGraspHeart) {
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

  export function doAinzGreaterHardening(spellId: number) {
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

  export function doAinzGreaterMagicShield(spellId: number) {
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

  export function doAinzMagicBoost(spellId: number) {
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

  export function doAinzPerfectUnknowable(spellId: number) {
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

  export function doAinzGate(spellId: number) {
    const moveDurationTicks = 16;
    const schalaTpEndTick = 333;
    const tpAOE = 400;
    const tpMaxDist = 6000;
    const excludeTicks = 100;
    const tpRegisterKey = StringHash(I2S(spellId) + "gate_tp_count");
    const tpTimeKey = StringHash(I2S(spellId) + "gate_tp_exclude_time");

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
          genericGateTP(spellId, caster, srcPos, targetPos, tpAOE, tpMaxDist, excludeGroup, excludeTicks)
          genericGateTP(spellId, caster, targetPos, srcPos, tpAOE, tpMaxDist, excludeGroup, excludeTicks)
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
    spellId: number,
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
        && !Globals.barrierBlockUnits.has(unit)
        && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
        && !IsUnitInGroup(unit, excludeGroup)
      ) {
        Globals.tmpVector.setPos(GetUnitX(unit), GetUnitY(unit));
        const distance = CoordMath.distance(Globals.tmpVector, pos1);
        if (CoordMath.distance(Globals.tmpVector, pos2) < maxTpDist) {       
          GroupAddUnit(excludeGroup, unit);
          
          const unitId = GetHandleId(unit);
          const tpRegisterKey = StringHash(I2S(spellId) + "gate_tp_count");
          const tpTimeKey = StringHash(I2S(spellId) + "gate_tp_exclude_time");
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

  export function doAinzResistance(spellId: number) {
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
      if (GetSpellAbilityId() == Id.itemSacredWaterAbility) {
        UnitHelper.payHPPercentCost(target, 0.1, UNIT_STATE_MAX_LIFE);
      }
    }
  }

  export function doAinzWish(spellId: number) {
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

      sfx = AddSpecialEffect(
        "SuperTierMagic.mdl", GetUnitX(caster), GetUnitY(caster)
      );
      DestroyEffect(sfx);

      DragonBallsManager.getInstance().summonShenron(GetUnitX(caster), GetUnitY(caster));

      const timer = TimerManager.getInstance().get();
      TimerStart(timer, 0.5, false, () => {
        UnitRemoveAbility(caster, Id.ainzWish);
        TimerManager.getInstance().recycle(timer);
      });
    }
  }

  export function doAlbedoFormSwap(spellId: number) {
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

  export function doAlbedoAegis(spellId: number) {
    const caster = GetTriggerUnit();
    const target = GetSpellTargetUnit();
    const maxTick = 1000;
    const absorbRatio = 0.5;
    const absorbReductionRatio = 0.8;
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

      if (UnitHelper.isUnitDead(caster) || UnitHelper.isUnitDead(target)) {
        tick += maxTick;
      } else {
        const currentHp = GetUnitState(target, UNIT_STATE_LIFE);
        if (currentHp > oldHp) {
          oldHp = currentHp;
        } else if (oldHp > currentHp + minHpDiff) {
          const hpDiff = oldHp - currentHp;
          const hpAbsorb = hpDiff * absorbRatio;
          const casterHp = GetUnitState(caster, UNIT_STATE_LIFE);
          if (casterHp > hpAbsorb + minHpDiff) {
            SetUnitState(target, UNIT_STATE_LIFE, currentHp + hpAbsorb);
            SetUnitState(caster, UNIT_STATE_LIFE, casterHp - hpAbsorb * absorbReductionRatio);
            oldHp = currentHp + hpAbsorb;
          }
        }
      }
      ++tick;
    });
  }

  export function doAlbedoSkillBoost(spellId: number) {
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

  export function doShalltearValhalla(spellId: number) {
    const caster = GetTriggerUnit();
    const valhallaAOE = 1800;
    const valhallaHeal = 0.25;
    const valhallaHealMin = 0.1;

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
        healMult += (
          valhallaHealMin 
          + (
            (valhallaHeal - valhallaHealMin) 
            * GetUnitLifePercent(unit) * 0.01
          )
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

  export function doDemiurgeHellfireMantle(spellId: number) {
    const caster = GetTriggerUnit();
    const lvl = GetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle);

    if (lvl == 1) {
      SetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle, 2);
    } else {
      SetUnitAbilityLevel(caster, Id.demiurgeHellfireMantle, 1);
    }
  }

  export function doUltimateCharge(spellId: number) {
    const tickRate = 0.03;
    const endTick = 2000;
    const minHPTick = 7 * 33;
    const mpPct = 0.04;
    const hpPct = 0.01;

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const chargeKey = StringHash("ultimate_charge_flag");

    let sfx1 = null;
    let sfx2 = null;
    let tick = 0;

    const isCharging = LoadBoolean(Globals.genericSpellHashtable, casterId, chargeKey);
    if (isCharging) return;
    SaveBoolean(Globals.genericSpellHashtable, casterId, chargeKey, true);

    const dustWaveSfx = AddSpecialEffect(
      "DustWave1.mdl", 
      GetUnitX(caster), GetUnitY(caster)
    );
    BlzSetSpecialEffectScale(dustWaveSfx, 1.5);

    const tpTimer = TimerManager.getInstance().get();
    TimerStart(tpTimer, tickRate, true, () => {
      if (tick > endTick || UnitHelper.isUnitDead(caster)) {
        if (sfx1 != null) DestroyEffect(sfx1); 
        if (sfx2 != null) DestroyEffect(sfx2);
        DestroyEffect(dustWaveSfx);
        SaveBoolean(Globals.genericSpellHashtable, casterId, chargeKey, false);
        TimerManager.getInstance().recycle(tpTimer);
        return;
      }

      const maxMp = GetUnitState(caster, UNIT_STATE_MAX_MANA);
      const currentMp = GetUnitState(caster, UNIT_STATE_MANA);
      const agi = GetHeroAgi(caster, true);
      const int = GetHeroInt(caster, true);
      const mpRegen = (agi / Math.max(1, int)) * mpPct * maxMp * tickRate;
      SetUnitState(caster, UNIT_STATE_MANA, Math.min(maxMp, currentMp + mpRegen));

      if (tick > minHPTick) {
        const maxHp = GetUnitState(caster, UNIT_STATE_MAX_LIFE);
        const currentHp = GetUnitState(caster, UNIT_STATE_LIFE);
        const str = GetHeroInt(caster, true);
        const hpRegen = (agi / Math.max(1, str)) * hpPct * maxHp * tickRate;
        SetUnitState(caster, UNIT_STATE_LIFE, Math.min(maxHp, currentHp + hpRegen));
        if (sfx1 == null) {
          sfx1 = AddSpecialEffectTarget(
            "Abilities/Spells/Other/TalkToMe/TalkToMe.mdl",
            caster, "overhead"
          );
        }
        if (sfx2 == null) {
          sfx2 = AddSpecialEffect(
            "Abilities/Spells/NightElf/Tranquility/Tranquility.mdl", 
            GetUnitX(caster), GetUnitY(caster)
          );
        }
      }
        
      // hack to check channel
      if (GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_OFF) {
        tick += endTick;
      }
      ++tick;
    });
  }

  export function doMinatoHiraishinNoJutsu(spellId: number) {
    const maxCastDistance = 1400;
    const maxTravelDistance = 1500;
    let searchAOE = maxTravelDistance;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());

    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxCastDistance);

    let closestUnit = caster;
    let minDistance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

    if (!Globals.barrierBlockUnits.has(caster)) {
      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsInRange(Globals.tmpUnitGroup, Globals.tmpVector2.x, Globals.tmpVector2.y, searchAOE, null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();

        if (
          IsUnitAlly(unit, player)
          && UnitHelper.isUnitAlive(unit)
          && (
            IsUnitType(unit, UNIT_TYPE_HERO)
            || (
              GetUnitTypeId(unit) == Constants.dummyBeamUnitId
              && GetUnitName(unit) == "Hiraishin Kunai"
            )
          )
          && unit != caster
        ) {
          Globals.tmpVector3.setUnit(unit);
          if (!PathingCheck.isGroundWalkable(Globals.tmpVector3)) return;
          const targetDist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector3);
          if (targetDist > maxTravelDistance) return;
          const newDist = CoordMath.distance(Globals.tmpVector3, Globals.tmpVector2);
          if (
            newDist < minDistance 
            || closestUnit == caster
          ) {
            closestUnit = unit;
            minDistance = newDist;
          }
        }
      });
    }

    Globals.tmpVector3.setUnit(closestUnit);
    doMinatoTeleportEffect(Globals.tmpVector);
    doMinatoTeleportEffect(Globals.tmpVector3);
    minatoIllusionSFXLogic(
      caster, 
      Globals.tmpVector, 
      Globals.tmpVector3, 
      AbilityNames.Minato.HIRAISHIN_ZANZO
    );
    if (closestUnit != caster) {
      PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector3);
    } else {
      const errorSfx = AddSpecialEffect(
        "Spell_Marker_Red.mdl", 
        Globals.tmpVector2.x, Globals.tmpVector2.y
      );
      if (player == GetLocalPlayer()) {
        BlzSetSpecialEffectScale(errorSfx, 1.0);
      } else {
        BlzSetSpecialEffectScale(errorSfx, 0.0);
      }
      DestroyEffect(errorSfx);
    }
  }

  export function doMinatoKunaiThrow(spellId: number) {
    const caster = GetTriggerUnit();
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());

    doMinatoKunaiBeam(caster, GetSpellTargetX(), GetSpellTargetY(), abilLvl);
  }

  export function doMinatoKunaiBeam(
    caster: unit,
    targetX: number,
    targetY: number,
    abilLvl: number,
  ) {
    const tickRate = 0.03;
    const moveSpeed = BeamComponent.BEAM_SPEED_INSANE;
    const maxDistance = 1200;
    const dmgAOE = 150;
    const dmgMult = BASE_DMG.KAME_DPS * 2;
    const beamHeight = 150;

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(targetX, targetY);
    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxDistance);

    const damagedGroup = CreateGroup();
    const beam = minatoKunaiCreateVec(caster, Globals.tmpVector);
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    const distance = Math.max(100, CoordMath.distance(Globals.tmpVector, Globals.tmpVector2));
    const maxTicks = Math.max(1, distance / moveSpeed);

    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const spellPower = ch ? ch.spellPower : 1.0;
    
    SetUnitScale(beam, 0.0, 0.0, 0.0);

    const sfx = AddSpecialEffect("MinatoKunai.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectScale(sfx, 3.0);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    BlzSetSpecialEffectPitch(sfx, 90 * CoordMath.degreesToRadians);

    const castDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      Globals.tmpVector.x, Globals.tmpVector.y, 
      0
    );
    UnitAddAbility(castDummy, DebuffAbilities.FAERIE_FIRE_MINATO_KUNAI);

    const dmg = AOEDamage.calculateDamageRaw(
      caster,
      abilLvl,
      spellPower,
      dmgMult,
      1.0,
      bj_HEROSTAT_INT,
    );

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, tickRate, true, () => {
      if (ticks >= maxTicks) {
        RemoveUnit(castDummy);
        DestroyGroup(damagedGroup);
        DestroyEffect(sfx);
        BlzSetSpecialEffectScale(sfx, 0.0);
        SetUnitScale(beam, 1.0, 1.0, 1.0);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      Globals.tmpVector.setUnit(beam);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, moveSpeed);

      const isMoved = PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector);
      if (isMoved) {
        BlzSetSpecialEffectPosition(
          sfx, 
          Globals.tmpVector.x, 
          Globals.tmpVector.y, 
          BlzGetUnitZ(beam) + GetUnitFlyHeight(beam) + beamHeight
        );
        
        GroupClear(Globals.tmpUnitGroup);
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(beam), GetUnitY(beam), dmgAOE, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(unit, player)
            && !IsUnitInGroup(unit, damagedGroup)
          ) {
            UnitDamageTarget(
              caster, 
              unit, 
              dmg, 
              false, false, 
              ATTACK_TYPE_HERO, 
              DAMAGE_TYPE_NORMAL, 
              WEAPON_TYPE_WHOKNOWS
            );
            IssueTargetOrderById(castDummy, OrderIds.FAERIE_FIRE, unit);
            GroupAddUnit(damagedGroup, unit);
          }
        });
        GroupClear(Globals.tmpUnitGroup);
      }

      if (
        UnitHelper.isUnitDead(beam) 
        || !isMoved
      ) {
        ticks = maxTicks;
      }
      ticks++;
    });
  }

  export function doMinatoFirstFlash(spellId: number) {
    const pathingCheckSpeed = 32;
    const maxDistance = 1000;
    const dmgAOE = 300;
    const dmgSpeed = 100;
    const dmgMult = BASE_DMG.KAME_DPS * 6;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());
    Globals.tmpVector3.setVector(Globals.tmpVector);

    if (Globals.barrierBlockUnits.has(caster)) {
      Globals.tmpVector2.setVector(Globals.tmpVector);
    }

    const originX = Globals.tmpVector.x;
    const originY = Globals.tmpVector.y;

    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);

    // minatoEnableAttachSfx(caster, 3);
    minatoKunaiCreateVec(caster, Globals.tmpVector);
    doMinatoTeleportEffect(Globals.tmpVector);

    PathingCheck.extendVectorUntilGroundUnwalkable(
      Globals.tmpVector,
      Globals.tmpVector2,
      Globals.tmpVector3,
      pathingCheckSpeed,
      maxDistance
    );
    PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector3, pathingCheckSpeed);

    minatoIllusionSFXLogic(
      caster, 
      Globals.tmpVector, 
      Globals.tmpVector3, 
      AbilityNames.Minato.FIRST_FLASH
    );
    doMinatoTeleportEffect(Globals.tmpVector3);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const spellPower = ch ? ch.spellPower : 1.0;

    GroupClear(Globals.tmpUnitGroup2);
    // deal damage in a line from tmpVector to tmpVector3
    Globals.tmpVector.setPos(originX, originY);
    for (let i = 0; i < maxDistance; i += dmgSpeed) {
      if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector3) < dmgSpeed) {
        Globals.tmpVector.setVector(Globals.tmpVector3);
        i = maxDistance;
      }

      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        Globals.tmpVector.x, Globals.tmpVector.y,
        dmgAOE, 
        null
      );
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (
          UnitHelper.isUnitTargetableForPlayer(unit, player)
          && !IsUnitInGroup(unit, Globals.tmpUnitGroup2)
        ) {
          GroupAddUnit(Globals.tmpUnitGroup2, unit);
        }
      });

      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, dmgSpeed);
    }

    AOEDamage.genericDealDamageToGroup(
      Globals.tmpUnitGroup2,
      caster,
      abilLvl,
      spellPower,
      dmgMult,
      1.0,
      bj_HEROSTAT_INT
    );
    GroupClear(Globals.tmpUnitGroup2);
  }

  export function doMinatoThirdStage(spellId: number) {
    const maxRadius = 600;
    const numKunai = 6;

    const caster = GetTriggerUnit();
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());

    BlzStartUnitAbilityCooldown(caster, Id.minatoSpiralFlash, 0);

    Globals.tmpVector.setUnit(caster);

    const ang = GetUnitFacing(caster);

    for (let i = 0; i < numKunai; ++i) {
      Globals.tmpVector2.polarProjectCoords(
        Globals.tmpVector, 
        ang + i * 360/numKunai, 
        maxRadius
      );
      doMinatoKunaiBeam(caster, Globals.tmpVector2.x, Globals.tmpVector2.y, abilLvl);
    }
  }

  export function collectKunaisInAOE(
    kunaiArray: unit[],
    tmpGroup: group,
    player: player,
    x: number,
    y: number,
    radius: number,
  ) {
    GroupEnumUnitsInRange(
      tmpGroup, 
      x, y, 
      radius, 
      null
    );
    ForGroup(tmpGroup, () => {
      const unit = GetEnumUnit();
      if (
        UnitHelper.isUnitAlive(unit)
        && GetUnitTypeId(unit) == Constants.dummyBeamUnitId
        && GetUnitName(unit) == "Hiraishin Kunai"
        && GetOwningPlayer(unit) == player
      ) {
        kunaiArray.push(unit);
      }
    });
    GroupClear(tmpGroup);
    return kunaiArray;
  }

  export function doMinatoSpiralFlash(spellId: number) {
    const tickRate = 0.02;
    const maxTicks = 50;
    const searchAOE = 700;
    const dmgMult = BASE_DMG.KAME_DPS * 3 * tickRate;
    const minKunai = 2;
    const maxKunaiSfxLength = 9;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    Globals.tmpVector.setUnit(caster);
    const originX = Globals.tmpVector.x;
    const originY = Globals.tmpVector.y;

    const sfx = AddSpecialEffect("Spell_Marker_Gray.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectAlpha(sfx, 155);
    BlzSetSpecialEffectColor(sfx, 255, 255, 55);
    BlzSetSpecialEffectScale(sfx, 7.0);

    let wasInvul = false;
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, tickRate, true, () => {
      if (ticks > maxTicks) {
        if (wasInvul) {
          ShowUnit(caster, true);
          PauseManager.getInstance().unpause(caster, true);
        }
        DestroyEffect(sfx);
        SelectUnitForPlayerSingle(caster, player);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      const kunais = [];
      collectKunaisInAOE(kunais, Globals.tmpUnitGroup, player, originX, originY, searchAOE);
      if (kunais.length >= minKunai) {
        const spellPower = ch ? ch.spellPower : 1.0;

        GroupClear(Globals.tmpUnitGroup);
        AOEDamage.genericDealAOEDamage(
          Globals.tmpUnitGroup,
          caster,
          originX, originY,
          searchAOE,
          abilLvl,
          spellPower,
          dmgMult,
          kunais.length,
          bj_HEROSTAT_INT
        );

        if (ticks == 0) {
          wasInvul = true;
          ShowUnit(caster, false);
          PauseManager.getInstance().pause(caster, true);
        }

        if (ticks == 0) {
          for (const kunai of kunais) {
            Globals.tmpVector.setUnit(kunai);
            doMinatoTeleportEffect(Globals.tmpVector);
          }
        }

        if (ticks % 5 == 0) {
          let currentIndex = -1;
          let nextIndex = -1;
          const startIndex = 1 + Math.floor(Math.random() * kunais.length);
          const halfIndex = Math.floor(kunais.length * 0.5);
          for (let i = 0; i < kunais.length && i < maxKunaiSfxLength; ++i) {
            if (currentIndex < 0) {
              currentIndex = (startIndex+i) % kunais.length;
            }
            const randomIndex = Math.floor(Math.random() * halfIndex - 1);
            nextIndex = (currentIndex + halfIndex + randomIndex) % kunais.length;
  
            Globals.tmpVector.setUnit(kunais[currentIndex]);
            Globals.tmpVector2.setUnit(kunais[nextIndex]);
            minatoIllusionSFXLogic(
              caster,
              Globals.tmpVector,
              Globals.tmpVector2,
              AbilityNames.Minato.SPIRAL_FLASH
            );
  
            currentIndex = nextIndex;
          }
        }
      }

      if (
        !UnitHelper.isUnitAlive(caster)
        || kunais.length < minKunai
      ) {
        ticks = maxTicks;
        if (kunais.length < minKunai) {
          const errorSfx = AddSpecialEffect(
            "Spell_Marker_Red.mdl", 
            Globals.tmpVector.x, Globals.tmpVector.y
          );
          if (player == GetLocalPlayer()) {
            BlzSetSpecialEffectScale(errorSfx, 7.0);
          } else {
            BlzSetSpecialEffectScale(errorSfx, 0.0);
          }
          DestroyEffect(errorSfx);
        }
      }
      ticks++;
    });
  }

  // export function minatoEnableAttachSfx(caster: unit, ticks: number) {
  //   const unitId = GetHandleId(caster);
  //   const sfxTimeKey = StringHash("sfx_time");
  //   const time = LoadInteger(Globals.minatoHashtable, unitId, sfxTimeKey);
  //   if (time == 0) {
  //     const sfx1 = LoadEffectHandle(Globals.minatoHashtable, unitId, StringHash("sfx1"));
  //     const sfx2 = LoadEffectHandle(Globals.minatoHashtable, unitId, StringHash("sfx2"));
  //     const sfx3 = LoadEffectHandle(Globals.minatoHashtable, unitId, StringHash("sfx3"));
  //     BlzSetSpecialEffectScale(sfx1, 1.0);
  //     BlzSetSpecialEffectScale(sfx2, 1.0);
  //     BlzSetSpecialEffectScale(sfx3, 1.0);
  //   }
  //   SaveInteger(Globals.minatoHashtable, unitId, sfxTimeKey, Math.max(time, ticks));
  // }

  export function doMightGuyFrontLotus(spellId: number) {
    const minDistance = 60;
    const maxDistance = 700;
    const maxHeight = 600;
    const heightRate = 1800;
    const moveUpTick = 16;
    const moveDownTick = 16;
    const maxTick = 33;
    const dmgMult = BASE_DMG.KAME_DPS * 8;
    const lifePctCost = 0.05;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const target = GetSpellTargetUnit();
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());

    if (!target || !UnitHelper.isUnitTargetableForPlayer(target, player)) return;

    UnitHelper.payHPPercentCost(
      caster, lifePctCost, 
      UNIT_STATE_MAX_LIFE
    );

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setUnit(target);

    const castDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      Globals.tmpVector.x, Globals.tmpVector.y, 
      0
    );
    UnitApplyTimedLife(castDummy, Buffs.TIMED_LIFE, 0.5);
    UnitAddAbility(castDummy, DebuffAbilities.STUN_MICRO);
    IssueTargetOrderById(castDummy, OrderIds.THUNDERBOLT, target);

    PauseManager.getInstance().pause(caster, false);
    SetUnitTimeScalePercent(caster, 200);
    SetUnitAnimation(caster, "spell channel");

    PauseManager.getInstance().pause(target, false);
    UnitHelper.giveUnitFlying(target);
    SetUnitFlyHeight(target, maxHeight, heightRate);
    SetUnitAnimation(target, "death");

    const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    if (dist > minDistance && dist < maxDistance) {
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, dist - minDistance);
      PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector);
    }

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > maxTick) {
        PauseManager.getInstance().unpause(caster, false);
        SetUnitTimeScalePercent(caster, 100);
        ResetUnitAnimation(caster);

        PauseManager.getInstance().unpause(target, false);
        ResetUnitAnimation(target);
        
        DestroyEffect(
          AddSpecialEffect(
            "Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl", 
            GetUnitX(caster), GetUnitY(caster)
          )
        );
        
        if (UnitHelper.isUnitAlive(caster)) {
          const spellPower = ch ? ch.spellPower : 1.0;
          AOEDamage.dealDamageRaw(
            caster,
            abilLvl,
            spellPower,
            dmgMult,
            1.0,
            bj_HEROSTAT_INT,
            target
          );
        }
        
        TimerManager.getInstance().recycle(timer);
        return;
      }

      // if (ticks == moveUpTick) {
      // }

      if (ticks == moveDownTick) {
        RemoveUnit(castDummy);
        SetUnitFlyHeight(target, 0, heightRate);
      }
      ++ticks;
    });
  }

  export function doMightGuyReverseLotus(spellId: number) {
    const reverseLotusAOE = 400;
    const maxHeight = 600;
    const heightUpRate = 1800;
    const heightDownRate = 6000;
    const moveUpTick = 11;
    const moveDownTick = 32;
    const teleportTicksFrequencyMod = 2;
    const maxTick = 33;
    const dmgMult = BASE_DMG.KAME_DPS * 10;
    const lifePctCost = 0.05;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, GetSpellAbilityId());

    UnitHelper.payHPPercentCost(
      caster, lifePctCost, 
      UNIT_STATE_MAX_LIFE
    );

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    const originX = GetUnitX(caster);
    const originY = GetUnitY(caster);

    const targetGroup = CreateGroup();

    const castDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      Globals.tmpVector.x, Globals.tmpVector.y, 
      0
    );
    UnitApplyTimedLife(castDummy, Buffs.TIMED_LIFE, 0.5);
    UnitAddAbility(castDummy, DebuffAbilities.STUN_MICRO);
    
    PauseManager.getInstance().pause(caster, false);
    SetUnitTimeScalePercent(caster, 300);
    SetUnitAnimation(caster, "spell one");

    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(caster), GetUnitY(caster), reverseLotusAOE, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
        PauseManager.getInstance().pause(unit, false);
        SetUnitAnimation(unit, "death");

        UnitHelper.giveUnitFlying(unit);
        SetUnitFlyHeight(unit, maxHeight, heightUpRate);
        GroupAddUnit(targetGroup, unit);

        IssueTargetOrderById(castDummy, OrderIds.THUNDERBOLT, unit);
      }
    });

    const numTargets = CountUnitsInGroup(targetGroup);

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > maxTick) {
        PauseManager.getInstance().unpause(caster, false);
        SetUnitTimeScalePercent(caster, 100);
        ResetUnitAnimation(caster);

        DestroyEffect(
          AddSpecialEffect(
            "Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl", 
            GetUnitX(caster), GetUnitY(caster)
          )
        );

        ForGroup(targetGroup, () => {
          const unit = GetEnumUnit();
          PauseManager.getInstance().unpause(unit, false);
          ResetUnitAnimation(unit);
        });
        
        if (UnitHelper.isUnitAlive(caster)) {
          const spellPower = ch ? ch.spellPower : 1.0;
          AOEDamage.genericDealDamageToGroup(
            targetGroup,
            caster,
            abilLvl,
            spellPower,
            dmgMult,
            1.0,
            bj_HEROSTAT_INT
          );

          Globals.tmpVector.setPos(originX, originY);
          PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector);
        }

        DestroyGroup(targetGroup);
        RemoveUnit(castDummy);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      if (ticks == moveUpTick) {
        SetUnitTimeScalePercent(caster, 100);
      }

      if (
        ticks >= moveUpTick 
        && ticks % teleportTicksFrequencyMod == 0
        && ticks <= moveDownTick
      ) {
        let groupCounter = 0;
        const tpIndex = Math.floor(Math.random() * numTargets);
        ForGroup(targetGroup, () => {
          const unit = GetEnumUnit();
          if (tpIndex == groupCounter) {
            const sfx = AddSpecialEffect("BlackBlink.mdl", GetUnitX(unit), GetUnitY(unit));
            BlzSetSpecialEffectZ(sfx, maxHeight);
            DestroyEffect(sfx);
            Globals.tmpVector.setUnit(unit);
            PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector);
          }
          groupCounter++;
        });
      }

      if (ticks == moveDownTick) {
        ForGroup(targetGroup, () => {
          const unit = GetEnumUnit();
          SetUnitFlyHeight(unit, 0, heightDownRate);
        });
      }
      ++ticks;
    });
  }

  export function doMightGuyAsaKujaku(spellId: number) {
    const caster = GetTriggerUnit();
    const lifePctCost = 0.08;
    UnitHelper.payHPPercentCost(
      caster, lifePctCost, 
      UNIT_STATE_MAX_LIFE
    );
  }

  export function doMightGuyHirudora(spellId: number) {
    const caster = GetTriggerUnit();
    const lifePctCost = 0.1;
    UnitHelper.payHPPercentCost(
      caster, lifePctCost, 
      UNIT_STATE_MAX_LIFE
    );

    const guyGateLevel = GetUnitAbilityLevel(caster, Id.mightGuyGateArmor);
    if (guyGateLevel < 5) {
      SetUnitAnimationByIndex(caster, 9);
      SetUnitTimeScalePercent(caster, 200);
    } else {
      SetUnitAnimationByIndex(caster, 13);
      SetUnitTimeScalePercent(caster, 50);
    }

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 1.0, false, () => {
      SetUnitTimeScalePercent(caster, 100);
      ResetUnitAnimation(caster);
      TimerManager.getInstance().recycle(timer);
    });
  }

  export function doMightGuySekizo(spellId: number) {
    const caster = GetTriggerUnit();
    const lifePctCost = 0.08;
    UnitHelper.payHPPercentCost(
      caster, lifePctCost, 
      UNIT_STATE_MAX_LIFE
    );
  }

  export function doMightGuyYagai(spellId: number) {
    const birthTick = 50;
    const launchTick = 100;
    const deathTick = 316;
    const maxTicks = 333;
    const sfxMaxScale = 1.5;
    const sfxHeight = 100;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    SoundHelper.playTwoSoundsWithDelay(
      caster,
      "Audio/Voice/MightGuy/Yagai1.mp3", 2300, 2.3,
      "Audio/Voice/MightGuy/Yagai2.mp3", 650
    );

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    PauseManager.getInstance().pause(caster, false);
    SetUnitAnimationByIndex(caster, 9);

    let sfx = null;
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > maxTicks) {
        if (sfx) {
          BlzSetSpecialEffectScale(sfx, 0.0);
          DestroyEffect(sfx);
        }
        
        PauseManager.getInstance().unpause(caster, true);
        ResetUnitAnimation(caster);
        SetUnitTimeScalePercent(caster, 100);

        TimerManager.getInstance().recycle(timer);
        return;
      }
      if (ticks == birthTick) {
        sfx = AddSpecialEffect(
          "MightGuyYagai.mdl", 
          Globals.tmpVector.x,
          Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfx, sfxMaxScale);
        BlzPlaySpecialEffectWithTimeScale(sfx, ANIM_TYPE_BIRTH, 1.5);
      }
      if (ticks >= birthTick) {
        BlzSetSpecialEffectYaw(sfx, GetUnitFacing(caster) * CoordMath.degreesToRadians);
        BlzSetSpecialEffectX(sfx, GetUnitX(caster));
        BlzSetSpecialEffectY(sfx, GetUnitY(caster));
        BlzSetSpecialEffectZ(sfx, GetUnitFlyHeight(caster) + BlzGetUnitZ(caster) + sfxHeight);
      }
      if (ticks == launchTick) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/MightGuy/YagaiLaunch.mp3", 7500);
        PauseManager.getInstance().unpause(caster, true);
      }
      if (ticks == deathTick) {
        BlzPlaySpecialEffectWithTimeScale(sfx, ANIM_TYPE_DEATH, 1.819);
      }
      if (UnitHelper.isUnitDead(caster)) {
        if (ch && ch.isAbilityInUse(AbilityNames.MightGuy.YAGAI)) {
          ch.forceEndAbility(AbilityNames.MightGuy.YAGAI);
        }
        ticks = maxTicks;
      }
      ++ticks;
    });
  }

  export function doMightGuyGate(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    let index = 0;
    switch (spellId) {
      case Id.mightGuyGate6:
        index = 1;
        break;
      case Id.mightGuyGate7:
        index = 2;
        break;
      case Id.mightGuyGate8:
        index = 3;
        break;
    }

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    if (index >= 1) {
      ch.forceEndAbility(AbilityNames.MightGuy.FIFTH_GATE);
      if (index >= 2) {
        ch.forceEndAbility(AbilityNames.MightGuy.SIXTH_GATE);
        if (index >= 3) {
          ch.forceEndAbility(AbilityNames.MightGuy.SEVENTH_GATE);
        }
      }
    }
  }

  export function doMinatoTeleportEffect(v: Vector2D) {
    const sfx1 = AddSpecialEffect("MinatoYellowSFX.mdl", v.x, v.y);
    BlzSetSpecialEffectScale(sfx1, 0.6);
    const sfx2 = AddSpecialEffect("Abilities/Spells/NightElf/Blink/BlinkCaster.mdl", v.x, v.y);
    BlzSetSpecialEffectScale(sfx2, 0.6);
    const sfx3 = AddSpecialEffect("JumpDustF.mdl", v.x, v.y);
    BlzSetSpecialEffectScale(sfx3, 4.0);
    DestroyEffect(sfx1);
    DestroyEffect(sfx2);
    DestroyEffect(sfx3);
  }

  export function createMinatoYellowLinesSFX(vec: Vector2D, count: number) {
    const yellowLinesSfx = [];
    for (let i = 0; i < 3; ++i) {
      const sfx = AddSpecialEffect(
        "Abilities/Spells/Items/ScrollOfRegeneration/Scroll_Regen_Target.mdl", 
        vec.x, vec.y
      );
      BlzSetSpecialEffectScale(sfx, 1.0 + i * 0.3);
      BlzSetSpecialEffectTimeScale(sfx, 1.0 + i * 0.3);
      yellowLinesSfx.push(sfx);
    }
    return yellowLinesSfx;
  }

  export function minatoIllusionSFXLogic(
    caster: unit, 
    start: Vector2D, 
    end: Vector2D,
    mode: string
  ) {
    switch (mode) {
      default:
      case AbilityNames.Minato.HIRAISHIN_ZANZO:
        minatoIllusionSFXPathRepeat(
          1,
          start, end, 
          GetUnitAbilityLevel(caster, Id.minatoKuramaModeFlag) > 0,
          mode,
        );
        break;
      case AbilityNames.Minato.FIRST_FLASH:
        minatoIllusionSFXPathRepeat(
          4,
          start, end, 
          GetUnitAbilityLevel(caster, Id.minatoKuramaModeFlag) > 0,
          mode,
        );
        break;
    }
  }

  export function minatoIllusionSFXPathRepeat(
    repeat: number,
    start: Vector2D,
    end: Vector2D,
    isKurama: boolean,
    mode: string,
  ) {
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;

    let count = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.02, true, () => {
      if (count >= repeat) {
        TimerManager.getInstance().recycle(timer);
        return;
      }
      Globals.tmpVector.setPos(startX, startY);
      Globals.tmpVector2.setPos(endX, endY);
      minatoIllusionSFXPath(count, Globals.tmpVector, Globals.tmpVector2, isKurama, mode);
      count++;
    });
  }

  export function minatoIllusionSFXPath(
    repeatNum: number,
    start: Vector2D,
    end: Vector2D,
    isKurama: boolean,
    mode: string,
  ) {
    const tickRate = 0.02;
    const moveSpeed = 90;
    const firstSideSpeed = 150;

    const yellowLinesSfx = createMinatoYellowLinesSFX(start, 3);

    const ang = CoordMath.angleBetweenCoords(start, end);

    const minatoModel = isKurama ? "Minato_KM_squished.mdl" : "Minato_squished.mdl";
    const sfxMinato = AddSpecialEffect(minatoModel, start.x, start.y);
    BlzSetSpecialEffectYaw(sfxMinato, ang * CoordMath.degreesToRadians);
    BlzSetSpecialEffectScale(sfxMinato, 1.8);
    BlzPlaySpecialEffectWithTimeScale(sfxMinato, ANIM_TYPE_WALK, 3.0);

    let prevX = start.x;
    let prevY = start.y;
    const distance = CoordMath.distance(start, end);
    let maxTicks = (1 + Math.floor(distance / moveSpeed));
    // let duration = tickRate * maxTicks;

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, tickRate, true, () => {
      if (ticks >= maxTicks) {
        BlzSetSpecialEffectScale(sfxMinato, 0);
        for (const sfx of yellowLinesSfx) {
          DestroyEffect(sfx);
        }
        DestroyEffect(sfxMinato);
        TimerManager.getInstance().recycle(timer);
        return;
      }
      
      Globals.tmpVector3.setPos(prevX, prevY);
      Globals.tmpVector3.polarProjectCoords(Globals.tmpVector3, ang, moveSpeed);
      prevX = Globals.tmpVector3.x;
      prevY = Globals.tmpVector3.y;
      if (mode == AbilityNames.Minato.FIRST_FLASH) {
        let angDelta = 90;
        if (ticks % 3 == 1) {
          angDelta = 0;
        } else if (ticks % 3 == 2) {
          angDelta = -90;
        }
        Globals.tmpVector3.polarProjectCoords(Globals.tmpVector3, ang + angDelta, firstSideSpeed);
        if (repeatNum == 0 && angDelta != 0) doMinatoTeleportEffect(Globals.tmpVector3);
      }
      BlzSetSpecialEffectPosition(
        sfxMinato, 
        Globals.tmpVector3.x, Globals.tmpVector3.y, 
        BlzGetLocalSpecialEffectZ(sfxMinato)
      );
      for (const sfx of yellowLinesSfx) {
        BlzSetSpecialEffectPosition(
          sfx, 
          Globals.tmpVector3.x, Globals.tmpVector3.y, 
          BlzGetLocalSpecialEffectZ(sfx)
        );
      }

      const ratio = (1 - ticks / Math.max(1, maxTicks));
      // alpha has to be integer
      BlzSetSpecialEffectAlpha(sfxMinato, R2I(255 * ratio));

      ticks++;
    });
  }

  export function minatoIllusionSFXPath2(
    repeatNum: number,
    start: Vector2D,
    end: Vector2D,
    isKurama: boolean,
    mode: string,
  ) {

  }

  export function minatoIllusionSFXSingle(
    vec: Vector2D,
    ang: number, 
    duration: number,
    isKurama: boolean
  ) {
    const tickRate = 0.02;

    const minatoModel = isKurama ? "Minato_KM_squished.mdl" : "Minato_squished.mdl";
    const sfxMinato = AddSpecialEffect(minatoModel, vec.x, vec.y);
    BlzSetSpecialEffectYaw(sfxMinato, ang * CoordMath.degreesToRadians);
    BlzSetSpecialEffectScale(sfxMinato, 1.8);
    BlzPlaySpecialEffectWithTimeScale(sfxMinato, ANIM_TYPE_WALK, 2.0);

    let counter = 0;
    const fadeTimer = TimerManager.getInstance().get();
    TimerStart(fadeTimer, tickRate, true, () => {
      counter += tickRate;
      if (counter > duration) {
        BlzSetSpecialEffectScale(sfxMinato, 0);
        DestroyEffect(sfxMinato);
        TimerManager.getInstance().recycle(fadeTimer);
        return;
      } else {
        const ratio = (1 - (counter / Math.max(tickRate, duration)));
        BlzSetSpecialEffectAlpha(sfxMinato, 255 * ratio);
      }
    });
  }

  export function minatoKunaiCreateVec(caster: unit, v: Vector2D) {
    return minatoKunaiCreateXY(caster, v.x, v.y);
  }

  export function minatoKunaiCreateXY(caster: unit, x: number, y: number) {
    const player = GetOwningPlayer(caster);
    const kunaiDuration = 30;
    const kunaiHpMult = 0.3;

    // const casterId = GetHandleId(caster);
    // const kunaiGroupKey = StringHash("kunai_group");

    // let kunaiGroup = null;
    // if (HaveSavedHandle(Globals.minatoHashtable, casterId, kunaiGroupKey)) {
    //   kunaiGroup = LoadGroupHandle(Globals.minatoHashtable, casterId, kunaiGroupKey);
    // } else {
    //   kunaiGroup = CreateGroup();
    //   SaveGroupHandle(Globals.minatoHashtable, casterId, kunaiGroupKey, kunaiGroup);
    // }

    const beam = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      x, y, 0,
    );
    BlzSetUnitName(beam, "Hiraishin Kunai");
    
    const maxHp = BeamComponent.calculateBeamHp(
      10, BASE_DMG.KAME_DPS * kunaiHpMult, caster, bj_HEROSTAT_INT
    );

    BlzSetUnitMaxHP(beam, maxHp);
    SetUnitLifePercentBJ(beam, 100);
    SetUnitMoveSpeed(beam, 0);
    UnitRemoveAbility(beam, Id.attack);

    const sfx = AddSpecialEffectTarget("MinatoKunai.mdl", beam, "origin");
    BlzSetSpecialEffectScale(sfx, 3.0);
    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, kunaiDuration);

    const beamTimer = TimerManager.getInstance().get();
    TimerStart(beamTimer, kunaiDuration, false, () => {
      if (sfx) DestroyEffect(sfx);
      TimerManager.getInstance().recycle(beamTimer);
      return;
    });

    return beam;
  }

  export function doOneWingedAngel(spellId: number) {
    const caster = GetTriggerUnit();

    PauseManager.getInstance().pause(caster, true);
    SetUnitTimeScale(caster, 2.0);
    SetUnitAnimationByIndex(caster, 13);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 1.25, false, () => {
      PauseManager.getInstance().unpause(caster, true);
      SetUnitTimeScale(caster, 1.0);
      ResetUnitAnimation(caster);
    });
  }

  export function doSephirothParry(spellId: number) {
    const activateTick = 20;
    const endTick = 99;
    const aoe = 500;
    const dmgMult = BASE_DMG.KAME_DPS * 20;
    const agiDiffMult = 1.1;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, spellId); 

    PauseManager.getInstance().pause(caster, false);
    SetUnitAnimationByIndex(caster, 2);

    Globals.tmpVector.setUnit(caster);

    const sfx = AddSpecialEffect("DTBlueNoRingWhite.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectScale(sfx, 3.0);
    DestroyEffect(sfx);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > endTick) {
        PauseManager.getInstance().unpause(caster, false);
        ResetUnitAnimation(caster);
        SetUnitTimeScale(caster, 1.0);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      if (ticks > activateTick && ticks % 2 == 0) {
        let numUnits = 0;
        GroupClear(Globals.tmpUnitGroup2);

        Globals.tmpVector.setUnit(caster);
        GroupClear(Globals.tmpUnitGroup);
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, Globals.tmpVector.x, Globals.tmpVector.y, aoe, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (
            UnitHelper.isUnitTargetableForPlayer(unit, player)
            && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
          ) {
            GroupAddUnit(Globals.tmpUnitGroup2, unit);
            numUnits++;
          }
        });

        if (numUnits > 0) {
          ticks = endTick;
          SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Sephiroth/ParryStrike.mp3", 1410);

          const spellPower = ch ? ch.spellPower : 1.0;

          SetUnitTimeScale(caster, 2.0);
          SetUnitAnimation(caster, "attack");
          ForGroup(Globals.tmpUnitGroup2, () => {
            const unit = GetEnumUnit();
            if (UnitHelper.isUnitHakaiInstantDestroyable(unit, player)) {
              UnitHelper.dealHakaiDamage(caster, unit);
            } else {
              let dmg = 0;
              let agiDiff = 0;
              if (IsUnitType(unit, UNIT_TYPE_HERO)) {
                agiDiff = Math.max(
                  0, agiDiffMult * (GetHeroAgi(caster, true) - GetHeroAgi(unit, true))
                );
                dmg += AOEDamage.calculateDamageRawForced(
                  caster, abilLvl, spellPower, dmgMult, 1.0, agiDiff
                );
              }
              dmg += AOEDamage.calculateDamageRaw(
                caster, abilLvl, spellPower, dmgMult, 1.0, bj_HEROSTAT_INT
              );
              if (agiDiff > 0 && Globals.showAbilityFloatingText) {
                TextTagHelper.showPlayerColorTextOnUnit(
                  I2S(Math.floor(dmg)) + "!",
                  playerId, unit, 
                  10, 3.0
                );
              }
              UnitDamageTarget(
                caster, unit, 
                dmg, false, false, 
                ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WHOKNOWS
              );
            }
            const sfx2 = AddSpecialEffect("animeslashfinal.mdl", GetUnitX(unit), GetUnitY(unit));
            BlzSetSpecialEffectScale(sfx2, 1.5);
            DestroyEffect(sfx2);
          });
        }
      }

      if (UnitHelper.isUnitDead(caster)) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  export function doIncinerationCannon(spellId: number) {
    const detonationAOE = 800;
    const detectionAOE = 400;
    const beamSpeed = 70;
    const beamHpMult = BASE_DMG.KAME_DPS * 3;
    const detonationDmgMult = BASE_DMG.KAME_DPS * 20;
    const endTick = 33;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const abilLvl = GetUnitAbilityLevel(caster, spellId);
    
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());

    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);

    const beam = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      ang
    );
    BlzSetUnitName(beam, "beam genos incineration cannon detect");

    const beamHp = BeamComponent.calculateBeamHp(abilLvl, beamHpMult, caster, bj_HEROSTAT_INT);
    BlzSetUnitMaxHP(beam, beamHp);
    SetUnitLifePercentBJ(beam, 100);

    PauseUnit(beam, true);
    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, 1.0);
    SetUnitPathing(beam, false);
    
    let oldHp = GetUnitState(beam, UNIT_STATE_LIFE);
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > endTick) {
        RemoveUnit(beam);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      const currentHp = GetUnitState(beam, UNIT_STATE_LIFE);
      if (currentHp < oldHp) {
        oldHp = currentHp;
      } else {
        Globals.tmpVector.setUnit(beam);
        Globals.tmpVector.polarProjectCoords(
          Globals.tmpVector, 
          GetUnitFacing(beam), 
          beamSpeed
        );
        PathingCheck.moveFlyingUnitToCoord(beam, Globals.tmpVector);
      }

      let firstBeam = null;
      let secondBeam = null;
      Globals.tmpVector.setUnit(beam);
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        Globals.tmpVector.x, Globals.tmpVector.y,
        detectionAOE, null
      );
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (
          GetOwningPlayer(unit) == player
          && GetUnitTypeId(unit) == Constants.dummyBeamUnitId
        ) {
          if (GetUnitName(unit) == "beam genos incinerate") {
            firstBeam = unit;
          } else if (GetUnitName(unit) == "beam genos incineration cannon") {
            secondBeam = unit;
          }
        }
      });

      if (firstBeam != null && secondBeam != null) {
        // detonate
        ticks = endTick;

        Globals.tmpVector.setUnit(firstBeam);
        const sfx = AddSpecialEffect(
          "NuclearExplosion.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y
        );
        BlzSetSpecialEffectScale(sfx, 1.71);
        BlzSetSpecialEffectTimeScale(sfx, 1.33);
        DestroyEffect(sfx);
        AOEDamage.genericDealAOEDamage(
          Globals.tmpUnitGroup,
          caster,
          Globals.tmpVector.x, Globals.tmpVector.y,
          detonationAOE,
          abilLvl,
          ch ? ch.spellPower : 1.0,
          detonationDmgMult,
          1.0,
          bj_HEROSTAT_INT
        );

        ticks = endTick;
        UnitHelper.dealHakaiDamage(caster, firstBeam);
        UnitHelper.dealHakaiDamage(caster, secondBeam);
      }

      if (UnitHelper.isUnitDead(beam)) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  export function doGenosOvercharge(spellId: number) {
    const caster = GetTriggerUnit();
    const lvl = GetUnitAbilityLevel(caster, Id.genosOvercharge);

    if (lvl == 1) {
      SetUnitAbilityLevel(caster, Id.genosOvercharge, 2);
      if (Math.random() * 100 < 50) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Genos/Overcharge2.mp3", 1500);
      } else {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Genos/Overcharge3.mp3", 1000);
      }
    } else {
      SetUnitAbilityLevel(caster, Id.genosOvercharge, 1);
      SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Genos/Overcharge1.mp3", 1500);
    }
  }

  export function doTatsumakiCompress(spellId: number) {
    const aoe = 500;
    const kbSpeed = 8;
    const kbSpeedInc = 12;
    const bonusSpeedRatio = 1.5;
    const incSpeedTick = 33;
    const endTick = 100;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);

    const targetX = GetSpellTargetX();
    const targetY = GetSpellTargetY();

    const seenGroup = CreateGroup();
    
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks >= endTick) {
        DestroyGroup(seenGroup);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      Globals.tmpVector.setPos(targetX, targetY);
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        Globals.tmpVector.x, Globals.tmpVector.y, 
        aoe, null
      );
      ForGroup(Globals.tmpUnitGroup, () => {
        // move units to targetX / targetY
        const unit = GetEnumUnit();
        if (
          !UnitHelper.isUnitTargetableForPlayer(unit, player, true)
          || (
            IsUnitAlly(unit, player)
            && GetUnitTypeId(unit) != Constants.dummyBeamUnitId
          )
        ) return;

        Globals.tmpVector2.setUnit(unit);
        const ang = CoordMath.angleBetweenCoords(Globals.tmpVector2, Globals.tmpVector);
        const speed = Math.min(
          kbSpeed + (ticks > incSpeedTick ? kbSpeedInc : 0), 
          CoordMath.distance(Globals.tmpVector2, Globals.tmpVector)
        );

        if (
          !IsUnitInGroup(unit, seenGroup)
          && SimpleSpellSystem.isUnitTatsumakiBeam(unit)
          && GetOwningPlayer(unit) == player
        ) {
          SimpleSpellSystem.doTatsumakiBeamGroupReset(unit);
          GroupAddUnit(seenGroup, unit);
        }

        SimpleSpellSystem.doTatsumakiMoveBeam(
          unit, speed, bonusSpeedRatio, 
          ang, 
          Globals.tmpVector2,
          Globals.tmpVector3,
          Globals.tmpUnitGroup3
        );
      });

      ++ticks;
    });
  }
  
  export function doTatsumakiLift(spellId: number) {
    const caster = GetTriggerUnit();
    const targetX = GetSpellTargetX();
    const targetY = GetSpellTargetY();

    createTatsumakiRock(caster, targetX, targetY);
  }

  export function doTatsumakiTornado(spellId: number) {
    const dmgMult = BASE_DMG.KAME_DPS * 0.06;
    const bonusDmgMultPerBeam = 0.25;
    const bonusSpeedRatio = 1;
    const aoe = 600;
    const angle = 75;
    const closenessAngle = 90 + 10;
    const distance = 30;
    const closenessDistanceMult = -0.25;
    const endTick = 166;
  
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    const abilLvl = GetUnitAbilityLevel(caster, spellId);

    if (!customHero) return;
    Globals.tmpVector3.setPos(GetSpellTargetX(), GetSpellTargetY());

    const sfx = AddSpecialEffect(
      "Abilities/Spells/Other/Tornado/TornadoElemental.mdl", 
      Globals.tmpVector3.x, Globals.tmpVector3.y
    );
    BlzSetSpecialEffectScale(sfx, 3);
    

    const seenGroup = CreateGroup();

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks >= endTick) {
        DestroyGroup(seenGroup);
        BlzSetSpecialEffectScale(sfx, 0.01);
        DestroyEffect(sfx);
        TimerManager.getInstance().recycle(timer);
        return;
      } 
      // const durationRatio = ticks / Math.max(1, maxDuration);
      
      let numBeams = 0;
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup, 
        Globals.tmpVector3.x, Globals.tmpVector3.y, 
        aoe, null
      );

      // this.currentCoord.setUnit(input.caster.unit);
      ForGroup(Globals.tmpUnitGroup, () => {
        const target = GetEnumUnit();
        if (
          UnitHelper.isUnitTargetableForPlayer(target, player, true)
          && (
            !IsUnitAlly(target, player)
            || GetUnitTypeId(target) == Constants.dummyBeamUnitId
          )
        ) {

          Globals.tmpVector.setUnit(target);
          const targetDistance = CoordMath.distance(Globals.tmpVector3, Globals.tmpVector);

          // closenessRatio = 1 at 0 distance, 0 at max distance
          const closenessRatio = 1 - (targetDistance / Math.max(1, aoe));

          const projectionAngle = (
            angle + 
            (closenessAngle - angle) * closenessRatio + 
            CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector3)
          );
          const projectionDistance = (
            distance + 
            (closenessDistanceMult * distance) * closenessRatio
          );
          
          // Globals.tmpVector.polarProjectCoords(
          //   Globals.tmpVector, 
          //   projectionAngle,
          //   projectionDistance
          // );

          SimpleSpellSystem.doTatsumakiMoveBeam(
            target, projectionDistance, bonusSpeedRatio, projectionAngle,
            Globals.tmpVector, Globals.tmpVector2,
            Globals.tmpUnitGroup3
          );

          if (
            GetOwningPlayer(target) == player 
            && SimpleSpellSystem.isUnitTatsumakiBeam(target)
          ) {
            numBeams++;
            if (!IsUnitInGroup(target, seenGroup)) {
              doTatsumakiBeamGroupReset(target);
              GroupAddUnit(seenGroup, target);
            }
          }
        }
      });
      
      AOEDamage.genericDealDamageToGroup(
        Globals.tmpUnitGroup,
        caster,
        abilLvl,
        customHero.spellPower,
        dmgMult,
        1.0 + bonusDmgMultPerBeam * numBeams,
        bj_HEROSTAT_INT
      );

      GroupClear(Globals.tmpUnitGroup);

      // TODO: get tornado order id
      if (
        GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_OFF
        || !UnitHelper.isUnitAlive(caster)
      ) {
        ticks += endTick;
      }

      ++ticks;
    });
  }

  export function doTatsumakiVector(spellId: number) {
    const vectorMaxDist = 2400;
    const sfxPathSize = 5.0;
    const sfxMarkerSize = 2.0;
    const vectorManaCostPct = 0.09;
    const sfxHeight = 100;

    const caster = GetTriggerUnit();
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
    const vectorTimerKey = StringHash("tatsumaki_vector_timer");

    const targetX = GetSpellTargetX();
    const targetY = GetSpellTargetY();

    const abil = BlzGetUnitAbility(caster, Id.tatsumakiVector);

    let sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey);
    const vectorState = LoadInteger(Globals.genericSpellHashtable, casterId, vectorKey);
    if (vectorState == 0) {
      SaveInteger(Globals.genericSpellHashtable, casterId, vectorKey, 1);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorXSourceKey, targetX);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorYSourceKey, targetY);

      if (!sfx) {
        sfx = AddSpecialEffect("Abilities/Spells/Other/ANrm/ANrmTarget.mdl", targetX, targetY);
        SaveEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey, sfx);
        BlzSetSpecialEffectScale(sfx, sfxPathSize);

        sfx = AddSpecialEffect("Spell_Marker_Green.mdl", targetX, targetY);
        SaveEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx1Key, sfx);

        sfx = AddSpecialEffect("Spell_Marker_Green.mdl", targetX, targetY);
        SaveEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx2Key, sfx);
      }
      // sfx path
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey);
      BlzSetSpecialEffectScale(sfx, sfxPathSize);
      BlzSetSpecialEffectPitch(sfx, 0);
      BlzSetSpecialEffectX(sfx, targetX);
      BlzSetSpecialEffectY(sfx, targetY);
      BlzSetSpecialEffectZ(sfx, BlzGetLocalSpecialEffectZ(sfx) + sfxHeight);
      // sfx1 marker
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx1Key);
      BlzSetSpecialEffectScale(sfx, sfxMarkerSize);
      BlzSetSpecialEffectX(sfx, targetX);
      BlzSetSpecialEffectY(sfx, targetY);
      BlzSetSpecialEffectZ(sfx, BlzGetLocalSpecialEffectZ(sfx) + sfxHeight);
      // sfx2 marker
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx2Key);
      BlzSetSpecialEffectScale(sfx, 0.01);

    } else if (vectorState == 1) {
      SaveInteger(Globals.genericSpellHashtable, casterId, vectorKey, 0);
      const sourceX = LoadReal(Globals.genericSpellHashtable, casterId, vectorXSourceKey);
      const sourceY = LoadReal(Globals.genericSpellHashtable, casterId, vectorYSourceKey);
      Globals.tmpVector.setPos(sourceX, sourceY);
      Globals.tmpVector2.setPos(targetX, targetY);
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      const dist = Math.min(
        vectorMaxDist, 
        Math.max(100, CoordMath.distance(Globals.tmpVector, Globals.tmpVector2))
      );
      Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, ang, dist);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorXTargetKey, Globals.tmpVector2.x);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorYTargetKey, Globals.tmpVector2.y);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorAngKey, ang);
      SaveReal(Globals.genericSpellHashtable, casterId, vectorDistKey, dist);
      
      // sfx path
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey);
      BlzSetSpecialEffectMatrixScale(sfx, sfxPathSize, sfxPathSize, sfxPathSize * dist / 10);
      BlzSetSpecialEffectZ(sfx, BlzGetLocalSpecialEffectZ(sfx) + sfxHeight);
      BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
      BlzSetSpecialEffectPitch(sfx, 90 * CoordMath.degreesToRadians);
      // sfx2
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx2Key);
      BlzSetSpecialEffectX(sfx, Globals.tmpVector2.x);
      BlzSetSpecialEffectY(sfx, Globals.tmpVector2.y);
      BlzSetSpecialEffectZ(sfx, BlzGetLocalSpecialEffectZ(sfx) + sfxHeight);
      BlzSetSpecialEffectScale(sfx, sfxMarkerSize);

      UnitHelper.payMPPercentCost(caster, vectorManaCostPct - 0.01, UNIT_STATE_MAX_MANA);

      const rng = Math.random() * 100;
      if (rng < 25) { 
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/Disgust.mp3", 2000);
      } else if (rng < 50) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/GoOnHome.mp3", 1100);
      } else if (rng < 75) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/OutOfMyWay.mp3", 1100);
      } else {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/TakeBack.mp3", 2900);
      }
    }
    
    // set mana cost to 1%
    const manaCost = vectorState == 1 ? 1 : Math.max(
      BlzGetAbilityIntegerLevelField(abil, ABILITY_ILF_MANA_COST, 0),
      Math.floor(0.01 * GetUnitState(caster, UNIT_STATE_MAX_MANA))
    );
    BlzSetAbilityIntegerLevelField(abil, ABILITY_ILF_MANA_COST, 0, manaCost);
  }

  export function doTatsumakiGiantSpear(spellId: number) {
    const collisionSpacing = 50;
    const spearDetonationAOE = 900;
    const fuseAOE = 800;
    const fuseSpeed1 = 10;
    const fuseSpeed2 = 120;
    const fuseTick = 66;
    const endTick = 500;
    const beamDuration = 20;
    const dmgMult = BASE_DMG.KAME_DPS * 4;
    const dmgMultPerBeam = BASE_DMG.KAME_DPS * 4;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const casterId = GetHandleId(caster);
    const casterX = GetUnitX(caster);
    const casterY = GetUnitY(caster);
    let targetX = GetSpellTargetX();
    let targetY = GetSpellTargetY();

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    const fuseGroup = CreateGroup();

    // create tatsumaki giant spear
    const beam = createTatsumakiGiantSpear(caster, targetX, targetY);
    const beamId = GetHandleId(beam);
    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, beamDuration);
    PauseUnit(beam, true);

    const sfx = AddSpecialEffect("UlquiorraSpear.mdl", targetX, targetY);
    BlzSetSpecialEffectYaw(sfx, GetUnitFacing(beam) * CoordMath.degreesToRadians);
    BlzSetSpecialEffectZ(sfx, GetUnitFlyHeight(beam) + BlzGetUnitZ(beam));
    const sfx2 = AddSpecialEffect("SpiritBomb.mdl", targetX, targetY);
    BlzSetSpecialEffectColor(sfx2, 55, 255, 175);
    BlzSetSpecialEffectZ(sfx2, GetUnitFlyHeight(beam) + BlzGetUnitZ(beam));
    
    let hasCollided = false;
    let fusedBeams = 0;
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > endTick) {
        Globals.tmpVector.setUnit(beam);
        AOEDamage.genericDealAOEDamage(
          Globals.tmpUnitGroup3,
          caster,
          Globals.tmpVector.x, Globals.tmpVector.y,
          spearDetonationAOE,
          10,
          ch ? ch.spellPower : 1.0,
          dmgMult + dmgMultPerBeam * fusedBeams,
          1.0,
          bj_HEROSTAT_INT
        );

        DestroyEffect(sfx);
        DestroyEffect(sfx2);

        const sfxExplode = AddSpecialEffect(
          "AncientExplode.mdl", Globals.tmpVector.x, Globals.tmpVector.y
        );
        BlzSetSpecialEffectScale(sfxExplode, 3.0);
        DestroyEffect(sfxExplode);

        DestroyGroup(fuseGroup);
        FlushChildHashtable(Globals.genericSpellHashtable, beamId);
        RemoveUnit(beam);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      const facing = GetUnitFacing(beam);
      if (ticks < fuseTick) {
        SetUnitX(beam, targetX);
        SetUnitY(beam, targetY);
        BlzSetSpecialEffectScale(sfx, 1.0 + 3 * ticks * 0.03);
      }

      Globals.tmpVector.setUnit(beam);
      BlzSetSpecialEffectX(sfx, Globals.tmpVector.x);
      BlzSetSpecialEffectY(sfx, Globals.tmpVector.y);
      BlzSetSpecialEffectZ(sfx, GetUnitFlyHeight(beam) + BlzGetUnitZ(beam));
      BlzSetSpecialEffectYaw(sfx, facing * CoordMath.degreesToRadians);
      BlzSetSpecialEffectX(sfx2, Globals.tmpVector.x);
      BlzSetSpecialEffectY(sfx2, Globals.tmpVector.y);
      BlzSetSpecialEffectZ(sfx2, GetUnitFlyHeight(beam) + BlzGetUnitZ(beam));
      BlzSetSpecialEffectScale(sfx2, 1.0 + 0.2 * fusedBeams);

      GroupEnumUnitsInRange(Globals.tmpUnitGroup, Globals.tmpVector.x, Globals.tmpVector.y, fuseAOE, null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (
          !IsUnitInGroup(unit, fuseGroup)
          && GetOwningPlayer(unit) == player 
          && isUnitTatsumakiBeam(unit)
          && GetUnitName(unit) != GetUnitName(beam)
        ) {
          GroupAddUnit(fuseGroup, unit);
        }
      });
      GroupClear(Globals.tmpUnitGroup);

      let index = 0;
      ForGroup(fuseGroup, () => {
        const unit = GetEnumUnit();
        if (UnitHelper.isUnitAlive(unit)) {
          Globals.tmpVector2.setUnit(unit);

          const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
          const ang = CoordMath.angleBetweenCoords(Globals.tmpVector2, Globals.tmpVector);

          if (dist > fuseSpeed1) {
            const fuseSpeed = ticks < fuseTick ? fuseSpeed1 : fuseSpeed2;
            SimpleSpellSystem.doTatsumakiMoveBeam(
              unit, 
              Math.min(dist, fuseSpeed), 1.0, 
              ang, 
              Globals.tmpVector2, Globals.tmpVector3, Globals.tmpUnitGroup3
            );
          } else {
            // reached the center, destroy beam
            ++fusedBeams;
            KillUnit(unit);
          }
        }
        ++index;
      });

      if (ticks % 16 == 0) {
        const sfx2 = AddSpecialEffect(
          "WindCircleFaster.mdl", Globals.tmpVector.x, Globals.tmpVector.y
        );
        BlzSetSpecialEffectScale(sfx2, 1.3);
        DestroyEffect(sfx2);
      }

      if (ticks == fuseTick) {
        const sfxReady = AddSpecialEffect(
          "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl", Globals.tmpVector.x, Globals.tmpVector.y
        );
        BlzSetSpecialEffectScale(sfxReady, 3.0);
        DestroyEffect(sfxReady);
      }

      if (ticks >= fuseTick) {
        // hit detection for a spear type beam
        for (let j = 0; j <= 1; ++j) {
          for (let i = collisionSpacing; i <= fuseAOE - collisionSpacing; i += collisionSpacing) {
            Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, (facing + 180 * j + 360 % 360), i);
            // print(j, " ", i, " : ", Globals.tmpVector2.x, " - ", Globals.tmpVector2.y);
            GroupEnumUnitsInRange(
              Globals.tmpUnitGroup, 
              Globals.tmpVector2.x, Globals.tmpVector2.y, 
              collisionSpacing * 2, null
            );
            ForGroup(Globals.tmpUnitGroup, () => {
              const unit = GetEnumUnit();
              if (
                UnitHelper.isUnitTargetableForPlayer(unit, player)
                && IsUnitType(unit, UNIT_TYPE_HERO)
              ) {
                hasCollided = true;
              }
            });
            if (hasCollided) break;
          }
          if (hasCollided) break;
        }
      }

      if (!UnitHelper.isUnitAlive(beam) || hasCollided) {
        ticks = endTick;
      }
      ++ticks;
    });
  }

  export function createTatsumakiRock(caster: unit, x: number, y: number) {
    const casterKey = StringHash("tatsumaki_caster");
    const dmgGroupKey = StringHash("tatsumaki_dmg_group");

    const beamDuration = 30;
    const beamHpMult = 1.0;
    const rotationsPerSecond = 0.5;
    const beamHeight = 150;

    const player = GetOwningPlayer(caster);
    const beam = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      x, y, 
      CoordMath.angleBetweenXY(
        GetUnitX(caster), GetUnitY(caster),
        x, y
      )
    );
    BlzSetUnitName(beam, "Tatsumaki Rock");
    const beamId = GetHandleId(beam);

    UnitHelper.giveUnitFlying(beam);
    SetUnitFlyHeight(beam, beamHeight, beamHeight);
    
    const maxHp = BeamComponent.calculateBeamHp(
      10, BASE_DMG.KAME_DPS * beamHpMult, caster, bj_HEROSTAT_INT
    );
    BlzSetUnitMaxHP(beam, maxHp);
    SetUnitLifePercentBJ(beam, 100);
    SetUnitMoveSpeed(beam, 0);
    UnitRemoveAbility(beam, Id.attack);

    const sfx = AddSpecialEffect("Doodads/LordaeronSummer/Terrain/LoardaeronRockChunks/LoardaeronRockChunks1.mdl", x, y);
    BlzSetSpecialEffectScale(sfx, 1.7);
    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, beamDuration);

    const sfx2 = AddSpecialEffect("SpiritBomb.mdl", x, y);
    BlzSetSpecialEffectScale(sfx2, 2.5);
    BlzSetSpecialEffectColor(sfx2, 155, 205, 155);
    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, beamDuration);

    SaveUnitHandle(Globals.genericSpellHashtable, beamId, casterKey, caster);

    const dmgGroup = CreateGroup();
    SaveGroupHandle(Globals.genericSpellHashtable, beamId, dmgGroupKey, dmgGroup);
    
    const beamTimer = TimerManager.getInstance().get();
    let ticks = 0;
    TimerStart(beamTimer, 0.03, true, () => {
      if (!UnitHelper.isUnitAlive(beam)) {
        if (sfx) DestroyEffect(sfx);
        if (sfx2) DestroyEffect(sfx2);
        if (dmgGroup) DestroyGroup(dmgGroup);
        FlushChildHashtable(Globals.genericSpellHashtable, beamId);
        TimerManager.getInstance().recycle(beamTimer);
        return;
      }

      const newX = GetUnitX(beam);
      const newY = GetUnitY(beam);
      const newZ = Math.min(beamHeight, ticks * 0.03 * beamHeight);
      BlzSetSpecialEffectPosition(sfx, newX, newY, newZ);
      BlzSetSpecialEffectPosition(sfx2, newX, newY, newZ);

      const ang = (ticks * 0.03 * rotationsPerSecond * 360) % 360;
      // BlzSetSpecialEffectRoll(sfx, ang * CoordMath.degreesToRadians);
      // BlzSetSpecialEffectPitch(sfx, ang * CoordMath.degreesToRadians);
      BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
      ++ticks;
    });
    return beam;
  }

  export function createTatsumakiGiantSpear(caster: unit, x: number, y: number) {
    const beamHeight = 200;
    const beamHpMult = 5.0;
    const casterKey = StringHash("tatsumaki_caster");

    const player = GetOwningPlayer(caster);
    const beam = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      x, y, 
      CoordMath.angleBetweenXY(
        GetUnitX(caster), GetUnitY(caster),
        x, y
      )
    );
    BlzSetUnitName(beam, "Tatsumaki Giant Spear");
    const beamId = GetHandleId(beam);

    UnitHelper.giveUnitFlying(beam);
    SetUnitFlyHeight(beam, beamHeight, beamHeight);
    
    const maxHp = BeamComponent.calculateBeamHp(
      10, BASE_DMG.KAME_DPS * beamHpMult, caster, bj_HEROSTAT_INT
    );
    BlzSetUnitMaxHP(beam, maxHp);
    SetUnitLifePercentBJ(beam, 100);
    SetUnitMoveSpeed(beam, 0);
    UnitRemoveAbility(beam, Id.attack);

    SaveUnitHandle(Globals.genericSpellHashtable, beamId, casterKey, caster);

    return beam;
  }

  export function doTatsumakiMoveBeam(
    unit: unit, 
    speed: number,
    bonusSpeedRatio: number,
    ang: number,
    pos1: Vector2D,
    pos2: Vector2D,
    tmpGroup: group,
  ) {
    pos1.setUnit(unit);
    const isTatsumakiBeam = SimpleSpellSystem.isUnitTatsumakiBeam(unit);
    const adjSpeed = isTatsumakiBeam && bonusSpeedRatio != 1 ? 
      Math.max(30, speed * bonusSpeedRatio) : 
      speed
    ;
    if (isTatsumakiBeam) {
      BlzSetUnitFacingEx(unit, ang);
    }
    pos2.polarProjectCoords(pos1, ang, adjSpeed);
    PathingCheck.moveGroundUnitToCoord(unit, pos2, speed);
    if (GetUnitName(unit) == "Tatsumaki Rock") {
      pos2.setUnit(unit);
      SimpleSpellSystem.doTatsumakiMoveBeamDamage(
        unit, Math.min(speed * bonusSpeedRatio, CoordMath.distance(pos1, pos2)),
        pos1, tmpGroup,
      );
    }
  }

  export function doTatsumakiMoveBeamDamage(
    beam: unit, 
    speed: number,
    tmpPos: Vector2D,
    tmpGroup: group,
  ) {
    const dmgMult = BASE_DMG.KAME_DPS * 4;
    const aoe = 300;
    // Globals.tmpUnitGroup and Globals.tmpUnitGroup2 in use
    // Globals.tmpVector and Globals.tmpVector2 in use
    const casterKey = StringHash("tatsumaki_caster");
    const dmgGroupKey = StringHash("tatsumaki_dmg_group");

    const beamId = GetHandleId(beam);
    const caster = LoadUnitHandle(Globals.genericSpellHashtable, beamId, casterKey);
    const dmgGroup = LoadGroupHandle(Globals.genericSpellHashtable, beamId, dmgGroupKey);
    // make caster deal damage in aoe
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const spellPower = ch ? ch.spellPower : 1.0;

    const abilLvl = GetUnitAbilityLevel(caster, Id.tatsumakiLift);
    
    tmpPos.setUnit(beam);
    GroupEnumUnitsInRange(tmpGroup, tmpPos.x, tmpPos.y, aoe, null);
    ForGroup(tmpGroup, () => {
      const unit = GetEnumUnit();
      if (
        !IsUnitInGroup(unit, dmgGroup)
        && UnitHelper.isUnitTargetableForPlayer(unit, player)
      ) {
        AOEDamage.dealDamageRaw(
          caster,
          abilLvl,
          spellPower,
          dmgMult,
          1.0,
          bj_HEROSTAT_INT,
          unit,
        );
        GroupAddUnit(dmgGroup, unit);
      }
    });
  }

  export function isUnitTatsumakiBeam(unit: unit) {
    const name = GetUnitName(unit);
    return (
      GetUnitTypeId(unit) == Constants.dummyBeamUnitId
      && (
        name == "Tatsumaki Rock" 
        || name == "beam tatsumaki bombs"
        || name == "Tatsumaki Giant Spear" 
      )
    );
  }

  export function doTatsumakiBeamGroupReset(unit: unit) {
    const dmgGroupKey = StringHash("tatsumaki_dmg_group");
    const beamId = GetHandleId(unit);
    const dmgGroup = LoadGroupHandle(Globals.genericSpellHashtable, beamId, dmgGroupKey);
    GroupClear(dmgGroup);
  }

  export function doCellMaxWings(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const boostGroup = CreateGroup();
    const maxTick = 333;
    const lastDebuffTick = 166;
    const boostAOE = 500;
    const boostSpellPower = -0.1;
    
    const cellMaxWingsKey = StringHash(I2S(GetSpellAbilityId()) + "cell_max_wings");

    let tick = 0;
    const boostTimer = TimerManager.getInstance().get();
    TimerStart(boostTimer, 0.03, true, () => {
      if (tick > maxTick) {
        ForGroup(boostGroup, () => {
          const unit = GetEnumUnit();
          const unitId = GetHandleId(unit);
          SaveBoolean(Globals.genericEnemyHashtable, unitId, cellMaxWingsKey, false);
          const targetPlayer = GetOwningPlayer(unit);
          const targetPlayerId = GetPlayerId(targetPlayer);
          const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
          if (ch) ch.removeSpellPower(boostSpellPower);
        });
        DestroyGroup(boostGroup);
        TimerManager.getInstance().recycle(boostTimer);
        return;
      }

      if (tick < lastDebuffTick) {
        GroupClear(Globals.tmpUnitGroup);
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(caster), GetUnitY(caster), boostAOE, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (
            !IsUnitInGroup(unit, boostGroup)
            && UnitHelper.isUnitTargetableForPlayer(unit, player)
          ) {
            const unitId = GetHandleId(unit);
            if (!LoadBoolean(Globals.genericEnemyHashtable, unitId, cellMaxWingsKey)) {
              const targetPlayer = GetOwningPlayer(unit);
              const targetPlayerId = GetPlayerId(targetPlayer);
              const ch = Globals.customPlayers[targetPlayerId].getCustomHero(unit);
              SaveBoolean(Globals.genericEnemyHashtable, unitId, cellMaxWingsKey, true);
              if (ch) {
                ch.addSpellPower(boostSpellPower);
                GroupAddUnit(boostGroup, unit);
              }
            }
          }
        });
        GroupClear(Globals.tmpUnitGroup);
      }

      
      if (UnitHelper.isUnitDead(caster)) {
        tick += maxTick;
      }
      ++tick;
    });
  }

  export function doMajinBuuFat(spellId: number) {
    const target = GetTriggerUnit();

    UnitRemoveBuffs(target, false, true);
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Human/DispelMagic/DispelMagicTarget.mdl",
        GetUnitX(target), GetUnitY(target)
      )
    );
    DestroyEffect(
      AddSpecialEffect(
        "FatBuu.mdl",
        GetUnitX(target), GetUnitY(target)
      )
    );
    UnitHelper.payHPPercentCost(target, -0.15, UNIT_STATE_MANA);
    UnitHelper.payMPPercentCost(target, 1.0, UNIT_STATE_MAX_MANA);
  }

  export function doSuper17Generator(spellId: number) {
    const target = GetTriggerUnit();
    UnitHelper.payMPPercentCost(target, -0.2, UNIT_STATE_MAX_LIFE);
    UnitHelper.payHPPercentCost(target, 0.2, UNIT_STATE_MAX_LIFE);
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Items/AIma/AImaTarget.mdl",
        GetUnitX(target), GetUnitY(target)
      )
    );
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Other/Charm/CharmTarget.mdl",
        GetUnitX(target), GetUnitY(target)
      )
    );
  }

  export function linkLeonSpellbook(unit: unit, cd: number) {
    BlzStartUnitAbilityCooldown(unit, Id.leonShotgun, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonAssaultRifle, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonSniperRifle, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonRocketLauncher, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonFlashbang, cd);
    BlzStartUnitAbilityCooldown(unit, Id.leonHeavyGrenade, cd);
  }

  export function spellCDStartLogic(spellId: number) {
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
      if (
        spellId == Id.aylaTripleKick
        || spellId == Id.hirudegarnFlameBreath
        || spellId == Id.hirudegarnFlameBall
        || spellId == Id.hirudegarnTailSweep
      ) {
        return;
      }
      const unitId = GetHandleId(unit);
      SaveBoolean(Globals.simpleSpellCDHashtable, unitId, spellId, true);
    }
  }

  export function spellCDEndFinishLogic(spellId: number) {
    // get custom hero casting it
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
      if (
        spellId == Id.aylaTripleKick
        || spellId == Id.hirudegarnFlameBreath
        || spellId == Id.hirudegarnFlameBall
        || spellId == Id.hirudegarnTailSweep
      ) {
        return;
      }

      // const abilLvl = GetUnitAbilityLevel(unit, spellId)-1;
      // const baseCd = BlzGetUnitAbilityCooldown(unit, spellId, abilLvl);
      const baseCd = BlzGetUnitAbilityCooldownRemaining(unit, spellId);
      // print("cd " + spellId + " " + baseCd);
      if (baseCd <= 0) return;

      const unitId = GetHandleId(unit);
      const wasCasted = LoadBoolean(Globals.simpleSpellCDHashtable, unitId, spellId);
      if (!wasCasted) return;
      SaveBoolean(Globals.simpleSpellCDHashtable, unitId, spellId, false);

      let newCd = baseCd;

      if (spellId == Id.tatsumakiVector) {
        if (LoadInteger(Globals.genericSpellHashtable, unitId, StringHash("tatsumaki_vector")) == 0) {
          // newCd = 3.0
        }
      }

      if (Globals.clownValue > 0) {
        newCd = newCd * ((100 - Globals.clownValue) * 0.01)
      }

      const getiCDR = GetPlayerTechCountSimple(Id.getiStarUpgradeCDR, player);
      if (getiCDR > 0) {
        newCd = newCd * (100 - getiCDR) * 0.01;
      }

      if (GetUnitAbilityLevel(unit, Id.minatoKuramaModeFlag) > 0) {
        newCd *= 0.5;
      }

      if (UnitHasItemOfTypeBJ(unit, ItemConstants.SagaDrops.SPARE_PARTS)) {
        newCd *= 0.9;
      }


      if (newCd != baseCd) {
        BlzStartUnitAbilityCooldown(unit, spellId, newCd);
        // BlzSetUnitAbilityCooldown(unit, spellId, abilLvl, newCd);
      }

      const callback = Globals.linkedSpellsMap.get(spellId);
      if (callback) {
        callback(unit, newCd);
      }
    }
  }

  export function linkBuuFleshCD(unit: unit, cd: number) {
    BlzStartUnitAbilityCooldown(unit, Id.fleshAttack, cd);
    if (GetUnitAbilityLevel(unit, Id.fleshAttackAbsorbTarget) > 0) {
      BlzStartUnitAbilityCooldown(unit, Id.fleshAttackAbsorbTarget, cd);
    }
  }

}