import { Colorizer } from "Common/Colorizer";
import { BASE_DMG, Buffs, Constants, CostType, DebuffAbilities, Globals, Id, OrderIds } from "Common/Constants";
import { CoordMath } from "Common/CoordMath";
import { DamageData } from "Common/DamageData";
import { PathingCheck } from "Common/PathingCheck";
import { SoundHelper } from "Common/SoundHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { DDS } from "Core/DDS/DDS";
import { DDSData } from "Core/DDS/DDSData";
import { DDSHandler } from "Core/DDS/DDSHandler";
import { DragonBallsConstants } from "Core/DragonBallsSystem/DragonBallsConstants";
import { DragonBallsManager } from "Core/DragonBallsSystem/DragonBallsManager";
import { FarmingManager } from "Core/FarmingSystem/FarmingManager";
import { FusionUnit } from "Core/FusionSystem/FusionUnit";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { KeyInput } from "Core/KeyInputSystem/KeyInput";
import { KeyInputManager } from "Core/KeyInputSystem/KeyInputManager";
import { PauseManager } from "Core/PauseSystem/PauseManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { TimerManager } from "Core/Utility/TimerManager";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { AOEHeal } from "CustomAbility/AbilityComponent/AOEHeal";
import { AOEKnockback } from "CustomAbility/AbilityComponent/AOEKnockback";
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
  const gojoBlueBurstDmgDataMult = BASE_DMG.KAME_DPS * 1;
  const gojoBlueDPSDmgDataMult = BASE_DMG.KAME_DPS * 0.012;
  const gojoRedBurstDmgDataMult = BASE_DMG.KAME_DPS * 3;
  const gojoRedDPSDmgDataMult = BASE_DMG.KAME_DPS * 0.005;
  const gojoPurpleBlueDmgMult = 1.6;
  const gojoPurpleRedDmgMult = 1.6;
  const gojoPurpleBlueLesserDmgMult = 1.1;
  const gojoPurpleRedLesserDmgMult = 1.1;
  const gojoPurpleAOE = 500;
  const gojoPurpleBeamSpeed = 50;
  const gojoPurpleKBRelativeSpeed = 20;
  const gojoPurpleLesserMPCostPct = 0.03 * 0.02;
  const gojoPurpleBeamExistTicks = 40;
  const gojoPurpleSoundStrings = [
    "Audio/Voice/Gojo/BlueCharge1.mp3",
    "Audio/Voice/Gojo/BlueFire1.mp3",
    "Audio/Voice/Gojo/RedCharge2.mp3",
    "Audio/Voice/Gojo/RedFire2.mp3",
  ];
  const gojoPurpleSoundDur = [
    1003,
    330,
    1015,
    329,
  ];
  const gojoVoiceTick = 2;

  export function initialize () {
    TriggerRegisterAnyUnitEventBJ(Globals.genericSpellTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);

    setupGenericSpellEffectTrigger();
    setupEndFinishTriggers();
    setupTatsumakiMovementTimer();
    KeyInputManager.getInstance().addCallback(gojoKeyCallback);

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

    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSAggronorDamageDeal);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSFarmerDamageDeal);

    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSAggronorDamageBlock);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSWhisDamageBlock);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSBeerusCataclysmicOrb);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSGojoBlackFlash);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSCheongMyeong);
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSJirenGlare);

    // should have lowest priority possible since it saves damage to heal
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSWhisDoOver);
    
    // link fusion damage
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSLinkFusionDamage);
    
    // record information, after all modifications
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSDPSCheck);
    // log all player damage
    DDS.getInstance().addCallback(DDSHandler.DDS_DAMAGED, DDSLogDamage);

    
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

      if (BlzGroupGetSize(Globals.barrelUnitGroup) == 0) {
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
    
    Globals.genericSpellMap.set(Id.gokuKaiokenOn, SimpleSpellSystem.doGokuKaiokenOn);
    Globals.genericSpellMap.set(Id.gokuKaiokenOff, SimpleSpellSystem.doGokuKaiokenOff);
    Globals.genericSpellMap.set(Id.gokuLimitBreaker, SimpleSpellSystem.doGokuLimitBreakerSpellPower);

    Globals.genericSpellMap.set(Id.vegetaHakai, SimpleSpellSystem.doVegetaHakai);
    Globals.genericSpellMap.set(Id.vegetaLimitBreaker, SimpleSpellSystem.doGokuLimitBreakerSpellPower);
    Globals.genericSpellMap.set(Id.toppoHakai, SimpleSpellSystem.doVegetaHakai);
    Globals.genericSpellMap.set(Id.beerusHakai, SimpleSpellSystem.doVegetaHakai);

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
    
    Globals.genericSpellMap.set(Id.schalaTeleportation, SimpleSpellSystem.doSchalaTeleportation);
    Globals.genericSpellMap.set(Id.schalaTeleportation2, SimpleSpellSystem.doSchalaTeleportation);
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
    Globals.genericSpellMap.set(Id.shalltearDrainingLance, SimpleSpellSystem.doShalltearDrainingLance);
    Globals.genericSpellMap.set(Id.shalltearBloodFrenzyOn, SimpleSpellSystem.doShalltearBloodFrenzyOn);
    Globals.genericSpellMap.set(Id.shalltearBloodFrenzyOff, SimpleSpellSystem.doShalltearBloodFrenzyOff);

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
    Globals.genericSpellMap.set(Id.genosOverchargeOn, SimpleSpellSystem.doGenosOvercharge);
    Globals.genericSpellMap.set(Id.genosOverchargeOff, SimpleSpellSystem.doGenosOvercharge);
    
    Globals.genericSpellMap.set(Id.tatsumakiCompress, SimpleSpellSystem.doTatsumakiCompress);
    Globals.genericSpellMap.set(Id.tatsumakiLift, SimpleSpellSystem.doTatsumakiLift);
    Globals.genericSpellMap.set(Id.tatsumakiTornado, SimpleSpellSystem.doTatsumakiTornado);
    Globals.genericSpellMap.set(Id.tatsumakiVector, SimpleSpellSystem.doTatsumakiVector);
    Globals.genericSpellMap.set(Id.tatsumakiGiantSpear, SimpleSpellSystem.doTatsumakiGiantSpear);
    
    Globals.genericSpellMap.set(Id.whisTemporalDoOver, SimpleSpellSystem.doWhisTemporalDoOver);
    Globals.genericSpellMap.set(Id.whisAngelicShield, SimpleSpellSystem.doWhisAngelicShield);
    Globals.genericSpellMap.set(Id.whisTemporalWarp, SimpleSpellSystem.doWhisTemporalWarp);

    Globals.genericSpellMap.set(Id.beerusCataclysmicOrb, SimpleSpellSystem.doBeerusCataclysmicOrb);
    Globals.genericSpellMap.set(Id.beerusSphereOfDestruction, SimpleSpellSystem.doBeerusSphereOfDestruction);
    Globals.genericSpellMap.set(Id.beerusAuraOfDestruction, SimpleSpellSystem.doBeerusAuraOfDestruction);
    Globals.genericSpellMap.set(Id.beerusGodWrath, SimpleSpellSystem.doBeerusGodWrath);
    Globals.genericSpellMap.set(Id.beerusFoodSushi, SimpleSpellSystem.doBeerusSushi);
    Globals.genericSpellMap.set(Id.beerusFoodRamen, SimpleSpellSystem.doBeerusRamen);

    Globals.genericSpellMap.set(Id.granolahEnergyVolley, SimpleSpellSystem.doGranolahEnergyVolley);
    Globals.genericSpellMap.set(Id.granolahFinalShot, SimpleSpellSystem.doGranolahFinalShot);
    
    Globals.genericSpellMap.set(Id.gojoUnlimitedVoid, SimpleSpellSystem.doGojoUnlimitedVoid);
    Globals.genericSpellMap.set(Id.gojoSixEyesOn, SimpleSpellSystem.doGojoSixEyesOn);
    Globals.genericSpellMap.set(Id.gojoSixEyesOff, SimpleSpellSystem.doGojoSixEyesOff);
    Globals.genericSpellMap.set(Id.gojoTeleport, SimpleSpellSystem.doGojoTeleport);

    // Globals.genericSpellMap.set(Id.cheongMyeongSwordOfSixElements, SimpleSpellSystem.doCheongMyeongSwordOfSixElements);
    Globals.genericSpellMap.set(Id.cheongMyeongFlutteringShadowPetals, SimpleSpellSystem.doCheongMyeongFlutteringShadowPetals);
    Globals.genericSpellMap.set(Id.cheongMyeongPlumBlossomTempest, SimpleSpellSystem.doCheongMyeongPlumBlossomTempest);
    Globals.genericSpellMap.set(Id.cheongMyeongPlumBlossomFlow, SimpleSpellSystem.doCheongMyeongPlumBlossomFlow);
    Globals.genericSpellMap.set(Id.cheongMyeongScatteredBlossomfall, SimpleSpellSystem.doCheongMyeongScatteredBlossomfall);
    
    Globals.genericSpellMap.set(Id.aggronorAvatar, SimpleSpellSystem.doAggronorAvatar);
    
    Globals.genericSpellMap.set(Id.farmerHonestShot, SimpleSpellSystem.doFarmerHonestShot);
    
    Globals.genericSpellMap.set(Id.getiStarItemReplicator, SimpleSpellSystem.doGetiStarItemReplicator);

    Globals.genericSpellMap.set(Id.itemSacredWaterAbility, SimpleSpellSystem.doAinzResistance);
    Globals.genericSpellMap.set(Id.itemCellMaxWings, SimpleSpellSystem.doCellMaxWings);
    Globals.genericSpellMap.set(Id.itemMajinBuuFat, SimpleSpellSystem.doMajinBuuFat);
    Globals.genericSpellMap.set(Id.itemSuper17Generator, SimpleSpellSystem.doSuper17Generator);

    // Globals.genericSpellMap.set(Id.schalaPray, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaMagicSeal2, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate, SimpleSpellSystem.doSchalaLinkChannels);
    // Globals.genericSpellMap.set(Id.schalaSkygate2, SimpleSpellSystem.doSchalaLinkChannels);
    
    TriggerAddAction(gg_trg_Farmer_Eat_Food, () => {
      const item = GetManipulatedItem();
      const itemTypeId = GetItemTypeId(item);
      if (
        itemTypeId == ItemConstants.Farming.RICE
        || itemTypeId == ItemConstants.Farming.RICE_SNOW
      ) {
        SimpleSpellSystem.doFarmerEatRice(Id.plantRice);
      } else if (
        itemTypeId == ItemConstants.Farming.WHEAT
        || itemTypeId == ItemConstants.Farming.TEGRIDY_WHEAT
      ) {
        SimpleSpellSystem.doFarmerEatWheat(Id.plantWheat);
      } else if (
        itemTypeId == ItemConstants.Farming.CORN
        || itemTypeId == ItemConstants.Farming.SUPER_CORN
      ) {
        SimpleSpellSystem.doFarmerEatCorn(Id.plantCorn);
      }

    });
    
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

    Globals.linkedSpellsMap.set(Id.fleshAttack, SimpleSpellSystem.linkBuuFleshCD);
    Globals.linkedSpellsMap.set(Id.fleshAttackAbsorbTarget, SimpleSpellSystem.linkBuuFleshCD);

    Globals.linkedSpellsMap.set(Id.beerusFoodSushi, SimpleSpellSystem.linkBeerusFoodCD);
    Globals.linkedSpellsMap.set(Id.beerusFoodPizza, SimpleSpellSystem.linkBeerusFoodCD);
    Globals.linkedSpellsMap.set(Id.beerusFoodRamen, SimpleSpellSystem.linkBeerusFoodCD);
    Globals.linkedSpellsMap.set(Id.beerusFoodIceCream, SimpleSpellSystem.linkBeerusFoodCD);
    Globals.linkedSpellsMap.set(Id.beerusFoodTakoyaki, SimpleSpellSystem.linkBeerusFoodCD);
    Globals.linkedSpellsMap.set(Id.beerusFoodPudding, SimpleSpellSystem.linkBeerusFoodCD);

    // Globals.genericSpellEndMap.set(Id.vegetaHakai, endVegetaHakai);
    // Globals.genericSpellFinishMap.set(Id.vegetaHakai, endVegetaHakai);

    // Globals.genericSpellEndMap.set(Id.toppoHakai, endVegetaHakai);
    // Globals.genericSpellFinishMap.set(Id.toppoHakai, endVegetaHakai);
  }

  export function addToTatsumakiMovementGroup(
    unit: unit,
    speed: number,
    bonusSpeedRatio: number,
    ang: number,
  ) {
    const beamSpeedKey = StringHash("tatsumaki_beam_speed");
    const beamSpeedRatioKey = StringHash("tatsumaki_beam_speed_ratio");
    const beamAngleKey = StringHash("tatsumaki_beam_ang");
    const unitId = GetHandleId(unit);
    SaveReal(Globals.tatsumakiHashtable, unitId, beamSpeedKey, speed);
    SaveReal(Globals.tatsumakiHashtable, unitId, beamSpeedRatioKey, bonusSpeedRatio);
    SaveReal(Globals.tatsumakiHashtable, unitId, beamAngleKey, ang);
    GroupAddUnit(Globals.tatsumakiBeamGroup, unit);
  }

  export function setupTatsumakiMovementTimer() {
    // required to prevnt overwriting Globals.tmpVector
    // when used by doTatsumakiTornado
    const vec1 = new Vector2D();
    const vec2 = new Vector2D();

    const beamFrictionPct = 0.94;
    const beamFrictionFlat = 0.1;

    const beamSpeedKey = StringHash("tatsumaki_beam_speed");
    const beamSpeedRatioKey = StringHash("tatsumaki_beam_speed_ratio");
    const beamAngleKey = StringHash("tatsumaki_beam_ang");

    TimerStart(CreateTimer(), 0.03, true, () => {
      ForGroup(Globals.tatsumakiBeamGroup, () => {
        const unit = GetEnumUnit();
        const unitId = GetHandleId(unit);
        const speed = LoadReal(Globals.tatsumakiHashtable, unitId, beamSpeedKey);
        const speedRatio = LoadReal(Globals.tatsumakiHashtable, unitId, beamSpeedRatioKey);
        const ang = LoadReal(Globals.tatsumakiHashtable, unitId, beamAngleKey);
  
        if (
          GetUnitTypeId(unit) == 0
          || !UnitHelper.isUnitAlive(unit) 
          || speed < 1
        ) {
          FlushChildHashtable(Globals.tatsumakiHashtable, unitId);
          GroupRemoveUnit(Globals.tatsumakiBeamGroup, unit);
          return;
        }
        SimpleSpellSystem.doTatsumakiMoveBeam(
          unit, 
          speed, speedRatio, 
          ang, 
          vec1, 
          vec2,
          Globals.tmpUnitGroup3
        );
        const newSpeed = (speed - beamFrictionFlat) * beamFrictionPct;
        SaveReal(Globals.tatsumakiHashtable, unitId, beamSpeedKey, newSpeed);
      });
    });
  }

  export function gojoKeyCallback(player: player, ki: KeyInput) {
    // on key press, mark q/w for activation
    if (!ki.isDown) return;
    if (ki.oskey != OSKEY_Q && ki.oskey != OSKEY_W) return;

    const playerId = GetPlayerId(player);
    const customPlayer = Globals.customPlayers[playerId];
    for (const customHero of customPlayer.allHeroes) {
      if (!IsUnitSelected(customHero.unit, player)) continue;
      if (
        ki.oskey == OSKEY_Q 
        && GetUnitAbilityLevel(customHero.unit, Id.gojoBluePassive) > 0
      ) {
        const casterId = GetHandleId(customHero.unit);
        SaveBoolean(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_q_press"), true
        );
        SaveReal(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_q_x"), Globals.customPlayers[playerId].mouseData.x
        );
        SaveReal(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_q_y"), Globals.customPlayers[playerId].mouseData.y
        );
      } else if (
        ki.oskey == OSKEY_W 
        && GetUnitAbilityLevel(customHero.unit, Id.gojoRedPassive) > 0
      ) {
        const casterId = GetHandleId(customHero.unit);
        SaveBoolean(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_w_press"), true
        );
        SaveReal(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_w_x"), Globals.customPlayers[playerId].mouseData.x
        );
        SaveReal(Globals.genericSpellHashtable, casterId, 
          StringHash("gojo_w_y"), Globals.customPlayers[playerId].mouseData.y
        );
      }
    }
  }

  export function DDSAggronorDamageDeal(dmg: DDSData) {
    if (
      dmg.sourceTypeId != Id.aggronor
      || dmg.dmg <= 0
    ) return;

    if (IsUnitType(dmg.target, UNIT_TYPE_HERO) && dmg.isAttack) {
      if (
        GetUnitAbilityLevel(dmg.source, Id.aggronorDwarvenStrengthPassive) > 0
        && (
          IsUnitType(dmg.target, UNIT_TYPE_STUNNED)
          || GetUnitAbilityLevel(dmg.target, Buffs.STUNNED) > 0
        )
      ) {
        const cd = BlzGetUnitAbilityCooldownRemaining(dmg.source, Id.aggronorDwarvenStrengthActive);
        dmg.setDamage(dmg.dmg + (GetUnitState(dmg.source, UNIT_STATE_LIFE) * cd * 0.0002));
      }

      if (
        GetUnitAbilityLevel(dmg.source, Id.aggronorStormlord) > 0
        && LoadReal(udg_StatMultHashtable, dmg.sourceHandleId, 9) > 0
      ) {
        doAggronorChainLightning(dmg.source, dmg.target, 2);
      }
    }
  }

  export function DDSAggronorDamageBlock(dmg: DDSData) {
    if (
      dmg.targetTypeId != Id.aggronor
      || dmg.dmg <= 0
    ) return;

    // dwarven strength
    if (
      IsUnitType(dmg.source, UNIT_TYPE_HERO)
      && GetUnitAbilityLevel(dmg.target, Id.aggronorDwarvenStrengthPassive) > 0
    ) {
      const cd = BlzGetUnitAbilityCooldownRemaining(dmg.target, Id.aggronorDwarvenStrengthActive);
      if (cd == 0) {
        SetPlayerAbilityAvailable(dmg.targetPlayer, Id.aggronorDwarvenStrengthActive, true);
        SetPlayerAbilityAvailable(dmg.targetPlayer, Id.aggronorDwarvenStrengthPassive, false);
      }
      BlzStartUnitAbilityCooldown(dmg.target, Id.aggronorDwarvenStrengthActive, Math.min(250, cd+1));
      dmg.setDamage(dmg.dmg * (1 - (cd+1) * 0.001));
    }

    const aggronorLightningPlateTicksKey = StringHash("aggronor_lightning_plate_ticks");
    const plateTicks = LoadInteger(Globals.genericDDSHashtable, dmg.targetHandleId, aggronorLightningPlateTicksKey);
    if (plateTicks > 0) {
      const aggronorLightningPlateHpKey = StringHash("aggronor_lightning_plate_hp");
      const shieldHp = LoadReal(Globals.genericDDSHashtable, dmg.targetHandleId, aggronorLightningPlateHpKey);
      
      if (plateTicks < 166) {
        SaveReal(Globals.genericDDSHashtable, 
          dmg.targetHandleId, aggronorLightningPlateHpKey, 
          shieldHp + 1.5 * dmg.dmg
        );
      } else if (shieldHp > 0) {
        // negate dmg
        if (dmg.dmg <= shieldHp) {
          const newHp = Math.max(shieldHp - dmg.dmg, 0);
          SaveReal(Globals.genericDDSHashtable, dmg.targetHandleId, aggronorLightningPlateHpKey, newHp);
          dmg.setDamage(Constants.MIN_DDS_DMG_AFTER_SHIELD);
        } else {
          SaveReal(Globals.genericDDSHashtable, dmg.targetHandleId, aggronorLightningPlateHpKey, 0);
          dmg.setDamage(dmg.dmg - shieldHp);
        }
      }
    }
  }

  export function DDSWhisDamageBlock(dmg: DDSData) {
    const shieldHpKey = StringHash("whis_e_hp");
    const shieldHp = LoadReal(Globals.genericDDSHashtable, dmg.targetHandleId, shieldHpKey);
    if (shieldHp <= 0) return;

    if (dmg.dmg <= shieldHp) {
      SaveReal(Globals.genericDDSHashtable, dmg.targetHandleId, shieldHpKey, shieldHp - dmg.dmg);
      dmg.setDamage(Constants.MIN_DDS_DMG_AFTER_SHIELD);
    } else {
      SaveReal(Globals.genericDDSHashtable, dmg.targetHandleId, shieldHpKey, 0);
      dmg.setDamage(dmg.dmg - shieldHp);
    }
  }
  
  export function DDSWhisDoOver(dmg: DDSData) {
    const healActiveKey = StringHash("whis_w_heal_active");
    if (!LoadBoolean(Globals.genericDDSHashtable, dmg.targetHandleId, healActiveKey)) return;

    const healKey = StringHash("whis_w_heal");
    const healAmt = LoadReal(Globals.genericDDSHashtable, dmg.targetHandleId, healKey);
    SaveReal(Globals.genericDDSHashtable, dmg.targetHandleId, healKey, healAmt + dmg.dmg * 0.5);
  }

  export function doBeerusCataclysmicOrbKick(
    caster: unit,
    beam: unit,
  ) {
    const timerDDSKey = StringHash("beerus_q_timer_dds");
    const motionTimerKey = StringHash("beerus_q_motion");
    const motionAngleKey = StringHash("beerus_q_motion_ang");

    const beamId = GetHandleId(beam);
    const timerId = LoadInteger(Globals.genericDDSHashtable, beamId, timerDDSKey);
    SaveBoolean(Globals.genericSpellHashtable, timerId, motionTimerKey, true);

    // note: cannot allow possibility for beerus to adjust tmpVector
    // prior to triggering this
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setUnit(beam);
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    SaveReal(Globals.genericSpellHashtable, timerId, motionAngleKey, ang);
    IssueImmediateOrderById(caster, OrderIds.STOP);

    if (GetUnitTypeId(caster) == Id.beerus) {
      const rng = Math.random() * 100;
      if (rng < 20) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/Grunt1.mp3", 600);
      } else if (rng < 40) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/Grunt2.mp3", 193);
      } else if (rng < 60) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/Grunt3.mp3", 262);
      } else if (rng < 75) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/This1.mp3", 931);
      } else if (rng < 90) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/This2.mp3", 568);
      } else if (rng < 95) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/This3.mp3", 762);
      } else {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Beerus/OnTheHouse.mp3", 1240);
      }
    }
  }

  export function DDSBeerusCataclysmicOrb(dmg: DDSData) {
    if (
      dmg.targetTypeId != Id.beerusCataclysmicOrbUnitId
      || dmg.targetPlayer != dmg.sourcePlayer
    ) return;
    doBeerusCataclysmicOrbKick(dmg.source, dmg.target);
    dmg.setDamage(1);
  }

  export function DDSGojoBlackFlash(dmg: DDSData) {
    if (
      dmg.sourceTypeId != Id.gojo
      || !UnitHelper.isUnitRealHero(dmg.source)
      || !dmg.isAttack
    ) return;
    const gojoBlackFlashTargetKey = StringHash("gojo_black_flash_target");
    const gojoBlackFlashTicksKey = StringHash("gojo_black_flash_ticks");
    SaveUnitHandle(Globals.genericSpellHashtable, dmg.sourceHandleId, 
      gojoBlackFlashTargetKey, dmg.target);
    SaveInteger(Globals.genericSpellHashtable, dmg.sourceHandleId, 
      gojoBlackFlashTicksKey, 1);
  }

  export function DDSCheongMyeong(dmg: DDSData) {
    if (
      BlzGetEventIsAttack()
      && GetUnitAbilityLevel(dmg.source, Id.cheongMyeongCritPassive) > 0
      && UnitHelper.isUnitRealHero(dmg.source)
      // && UnitHelper.isUnitRealHero(target)
    ) {

      // for mana gain
      if (dmg.dmg > 0 && IsUnitType(dmg.target, UNIT_TYPE_HERO)) {
        SetUnitState(dmg.source, UNIT_STATE_MANA, 
          dmg.dmg + GetUnitState(dmg.source, UNIT_STATE_MANA)
        );
      }

      // for scattered blossomfall
      if (GetUnitAbilityLevel(dmg.source, Id.cheongMyeongScatteredBlossomfall) > 0) {
        const casterId = GetHandleId(dmg.source);
        const cheongBlossomfallInUseKey = StringHash("cheong_blossomfall_in_use");
        const cheongBlossomfallHitsKey = StringHash("cheong_blossomfall_hits");

        const numHits = LoadInteger(Globals.genericSpellHashtable, casterId, cheongBlossomfallHitsKey);
        if (numHits > 0) {
          SaveInteger(Globals.genericSpellHashtable, casterId, cheongBlossomfallHitsKey, numHits+1);
        }
        SaveBoolean(Globals.genericSpellHashtable, casterId, cheongBlossomfallInUseKey, false);
      }
    }

    if (
      GetUnitAbilityLevel(dmg.target, Id.cheongMyeongReturnPassive) == 0
      || !UnitHelper.isUnitRealHero(dmg.target)
    ) {
      return;
    }

    // unstuck check
    if (dmg.source == dmg.target) return;

    const hp = GetUnitState(dmg.target, UNIT_STATE_LIFE);
    if (dmg.dmg + 1 < hp) return;

    const cd = BlzGetUnitAbilityCooldownRemaining(dmg.target, Id.cheongMyeongReturnActive);
    if (cd != 0) return;

    dmg.setDamage(0);

    startCooldown(dmg.target, Id.cheongMyeongReturnActive);

    const manaToHealRatio = 0.33;
    const enemyHealPct = 0.5;
    const currentMana = GetUnitState(dmg.target, UNIT_STATE_MANA);
    const heal = manaToHealRatio * currentMana;
    SetUnitState(dmg.target, UNIT_STATE_LIFE, heal);
    SetUnitState(dmg.target, UNIT_STATE_MANA, currentMana - heal);

    const player = GetOwningPlayer(dmg.target);
    SetPlayerAbilityAvailable(player, Id.cheongMyeongReturnActive, true);
    SetPlayerAbilityAvailable(player, Id.cheongMyeongReturnPassive, false);

    const sfx = AddSpecialEffect(
      "AuraSakura.mdl",
      GetUnitX(dmg.target), GetUnitY(dmg.target)
    );

    PauseManager.getInstance().pause(dmg.target, true);
    SetUnitAnimationByIndex(dmg.target, 6);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 3, false, () => {
      if (UnitHelper.isUnitAlive(dmg.source)) {
        SetUnitState(dmg.source, UNIT_STATE_LIFE, 
          enemyHealPct * heal + GetUnitState(dmg.source, UNIT_STATE_LIFE)
        );
        const sfx3 = AddSpecialEffect(
          "Abilities/Spells/Human/Resurrect/ResurrectTarget.mdl",
          GetUnitX(dmg.source), GetUnitY(dmg.source)
        );
        BlzSetSpecialEffectScale(sfx3, 2.0);
        DestroyEffect(sfx3);
      }

      const sfx2 = AddSpecialEffect(
        "Abilities/Spells/Human/Resurrect/ResurrectTarget.mdl",
        GetUnitX(dmg.target), GetUnitY(dmg.target)
      );
      BlzSetSpecialEffectScale(sfx2, 2.0);
      DestroyEffect(sfx2);

      DestroyEffect(sfx);
      ResetUnitAnimation(dmg.target);
      PauseManager.getInstance().unpause(dmg.target, true);
      TimerManager.getInstance().recycle(timer);
    });
  }
  
  export function doGokuKaiokenOn(spellId: number) {
    const hpCost = 0.015;
    const spellAmp = 0.1;

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);

    const key = StringHash(I2S(spellId) + "kaioken"); 
    const val = LoadInteger(Globals.genericSpellHashtable, casterId, key);

    if (val == 0) {
      const player = GetOwningPlayer(caster);
      const playerId = GetPlayerId(player);

      SaveInteger(Globals.genericSpellHashtable, casterId, key, 1);

      UnitAddAbility(caster, Id.gokuKaiokenOff);
      UnitAddAbility(caster, Id.gokuKaiokenPassive);
      BlzStartUnitAbilityCooldown(caster, Id.gokuKaiokenOff, 5);
      BlzUnitHideAbility(caster, Id.gokuKaiokenOn, true);
      BlzUnitHideAbility(caster, Id.gokuKaiokenPassive, true);
      BlzUnitHideAbility(caster, Id.gokuKaiokenOff, false);

      const ch = Globals.customPlayers[playerId].getCustomHero(caster);
      if (ch) ch.addSpellPower(spellAmp);

      const sfx = AddSpecialEffectTarget("AuraKaox10.mdl", caster, "origin");

      TimerStart(CreateTimer(), 0.03, true, () => {
        const val2 = LoadInteger(Globals.genericSpellHashtable, casterId, key);
        if (
          UnitHelper.isUnitDead(caster) 
          || GetUnitLifePercent(caster) < 1
          || val2 == 2
        ) {
          SaveInteger(Globals.genericSpellHashtable, casterId, key, 0);
          // hiding kaioken off doesnt seem to work
          UnitRemoveAbility(caster, Id.gokuKaiokenOff);
          UnitRemoveAbility(caster, Id.gokuKaiokenPassive);
          BlzStartUnitAbilityCooldown(caster, Id.gokuKaiokenOn, 5);
          BlzUnitHideAbility(caster, Id.gokuKaiokenOn, false);
          if (ch) ch.removeSpellPower(spellAmp);
          DestroyEffect(sfx);
          DestroyTimer(GetExpiredTimer());
        }
        UnitHelper.payHPPercentCost(caster, hpCost * 0.03, UNIT_STATE_MAX_LIFE);
      });
    }
  }

  export function doGokuKaiokenOff(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);

    const key = StringHash(I2S(Id.gokuKaiokenOn) + "kaioken"); 
    SaveInteger(Globals.genericSpellHashtable, casterId, key, 2);
  }

  export function doGokuLimitBreakerSpellPower(spellId: number) {
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(unit);
    if (!ch) return;

    let spellAmp = 0;
    const playerAllies = GetPlayersAllies(player);
    ForForce(playerAllies, () => {
      const p = GetEnumPlayer();
      const pId = GetPlayerId(p);
      if (
        p != player 
        && pId >= 0 
        && pId < Constants.maxActivePlayers
        && IsPlayerSlotState(p, PLAYER_SLOT_STATE_PLAYING)
        && GetPlayerController(p) == MAP_CONTROL_USER
      ) {
        spellAmp += 0.03;
      }
    });
    DestroyForce(playerAllies);

    ch.addSpellPower(spellAmp);
    TimerStart(CreateTimer(), 30.0, false, () => {
      ch.removeSpellPower(spellAmp);
      DestroyTimer(GetExpiredTimer());
    });
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
    const playerId = GetPlayerId(player);
    const damagedGroup = CreateGroup();

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

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

      if (
        ticks < channelTick
        && (
          !ch.isChanneling()
          || ch.channelAbilityId != spellId
          || UnitHelper.isUnitDead(caster)
        )
      ) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  // export function endVegetaHakai(spellId: number) {
  //   const caster = GetTriggerUnit();
  //   const casterId = GetHandleId(caster);
  //   const hakaiKey = StringHash(I2S(spellId) + "hakai_channel_end"); 
  //   SaveInteger(Globals.genericSpellHashtable, casterId, hakaiKey, 2);
  // }

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

          const pitch = (
            startingAngle - startingPitch + yawModifier *  time * anglesPerTick
          ) * CoordMath.degreesToRadians;

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
    const unit = GetTriggerUnit();
    DoJirenGlare(spellId, unit);
  }

  export function DoJirenGlare(spellId: number, unit: unit) {
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

    const unitId = GetHandleId(unit);
    SaveInteger(Globals.genericSpellHashtable, unitId, 0, spellId);
    
    let effect: effect;
    if (spellId == Id.hirudegarnDarkEyes) {
      effect = AddSpecialEffectTarget("MagusDarkMist.mdl", unit, "head");
      // BlzSetSpecialEffectScale(effect, 2.0);
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      effect = AddSpecialEffectTarget("AuraKaox10.mdl", unit, "origin");
    } else if (spellId == Id.minatoSecondStep) {
      effect = AddSpecialEffectTarget("Rasengan4.mdl", unit, "right hand");
    } else {
      // if (
      //   spellId == Id.glare 
      //   || spellId == Id.glare2 
      //   || spellId == Id.gokuInstantTransmission 
      //   || spellId == Id.beerusCounter
      // )
      effect = AddSpecialEffectTarget("AuraJirenCounter2.mdl", unit, "origin");
      // BlzSetSpecialEffectScale(effect, 1.5);
    }
    SaveEffectHandle(Globals.genericSpellHashtable, unitId, 1, effect);
    SaveInteger(Globals.genericSpellHashtable, unitId, 2, GetUnitAbilityLevel(unit, spellId));
    
    Globals.DDSAddUnit(unit);
    
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

  export function DDSJirenGlare(dmg: DDSData) {
    if (
      !UnitHelper.isUnitAlive(dmg.target)
      || !IsUnitType(dmg.source, UNIT_TYPE_HERO)
      || dmg.dmg <= 1
    ) return;

    const target = dmg.target;
    const source = dmg.source;
    const targetId = dmg.targetHandleId;

    const spellId = LoadInteger(Globals.genericSpellHashtable, targetId, 0);
    if (
      spellId == 0 
      || (
        spellId != Id.glare
        && spellId != Id.glare2
        && spellId != Id.hirudegarnDarkEyes
        && spellId != Id.shalltearNegativeImpactShield
        && spellId != Id.minatoSecondStep
        && spellId != Id.gokuInstantTransmission
        && spellId != Id.beerusCounter
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
    const gokuITPunishDamageMult = 0.1;

    SaveInteger(Globals.genericSpellHashtable, targetId, 0, 0);

    const player = GetOwningPlayer(target);
    Globals.ddsVector.setPos(GetUnitX(target), GetUnitY(target));
    Globals.ddsVector2.setPos(GetUnitX(source), GetUnitY(source));

    if (spellId == Id.shalltearNegativeImpactShield) {
      if (CoordMath.distance(Globals.ddsVector, Globals.ddsVector2) > maxNegativeImpactShieldDistance) return;
    } else if (spellId == Id.minatoSecondStep) {
      if (CoordMath.distance(Globals.ddsVector, Globals.ddsVector2) > maxMinatoSecondStepDistance) return;
    } else {
      if (CoordMath.distance(Globals.ddsVector, Globals.ddsVector2) > maxGlareDistance) return;
    }

    SetUnitX(target, Globals.ddsVector2.x);
    SetUnitY(target, Globals.ddsVector2.y);
    
    if (spellId != Id.gokuInstantTransmission) {
      const castDummy = CreateUnit(
        player, 
        Constants.dummyCasterId, 
        Globals.ddsVector2.x, Globals.ddsVector2.y, 
        0
      );
      UnitAddAbility(castDummy, DebuffAbilities.STUN_ONE_SECOND);
      IssueTargetOrderById(castDummy, OrderIds.THUNDERBOLT, source);
      RemoveUnit(castDummy);
    }

    const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(target);
    let spellPower = customHero ? customHero.spellPower : 1.0;

    let punishMult = glarePunishDamageMult;
    if (spellId == Id.hirudegarnDarkEyes || spellId == Id.shalltearNegativeImpactShield) {
      punishMult = darkEyesPunishDamageMult;
    } else if (spellId == Id.minatoSecondStep) {
      punishMult = minatoPunishDamageMult;
    } else if (spellId == Id.gokuInstantTransmission) {
      punishMult = gokuITPunishDamageMult;
    }

    let damageMult = glareDamageMult;
    if (spellId == Id.glare2) {
      damageMult = glare2DamageMult;
    } else if (spellId == Id.shalltearNegativeImpactShield) {
      damageMult = negativeImpactShieldDamageMult;
    } else if (spellId == Id.minatoSecondStep) {
      damageMult = minatoSecondStepDamageMult;
    } else if (spellId == Id.gokuInstantTransmission || spellId == Id.beerusCounter) {
      damageMult = 0;
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

      minatoKunaiCreateVec(target, Globals.ddsVector2);
      
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
        Globals.ddsVector2.setUnit(target);
        AOEDamage.genericDealAOEDamage(
          Globals.ddsUnitGroup, 
          target,
          Globals.ddsVector2.x, Globals.ddsVector2.y,
          300,
          abilityLevel,
          spellPower,
          damageMult,
          1.0,
          bj_HEROSTAT_INT
        );
        const sfx1 = AddSpecialEffect("RasenganBomb2.mdl",
          Globals.ddsVector2.x, Globals.ddsVector2.y
        );
        const sfx2 = AddSpecialEffect("RasenganEffect4.mdl",
          Globals.ddsVector2.x, Globals.ddsVector2.y
        );
        const sfx3 = AddSpecialEffect("RasenganBlast.mdl",
          Globals.ddsVector2.x, Globals.ddsVector2.y
        );
        
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
    
    if (spellId == Id.shalltearNegativeImpactShield) {
      DestroyEffect(
        AddSpecialEffect(
          "PurpleBigExplosion.mdl",
          Globals.ddsVector2.x, Globals.ddsVector2.y
        )
      );
    } else if (spellId == Id.minatoSecondStep) {
      DestroyEffect(AddSpecialEffect("RasenganWhiteShockwave.mdl",Globals.ddsVector2.x, Globals.ddsVector2.y));
    } else if (spellId == Id.gokuInstantTransmission) {
      
    } else {
      DestroyEffect(
        AddSpecialEffect("Slam.mdl", Globals.ddsVector2.x, Globals.ddsVector2.y)
      );
    }
    
    if (targetId == Id.jiren) {
      if (Math.random() * 100 < 5) {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenOmaeWaMouShindeiru.mp3", 3317);
      } else {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/JirenGlare2.mp3", 1018);
      }
    }

    if (targetId == Id.beerus) {
      if (Math.random() * 100 < 50) {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/Beerus/Counter1.mp3", 1073);
      } else {
        SoundHelper.playSoundOnUnit(target, "Audio/Voice/Beerus/Counter2.mp3", 672);
      }
    }

    if (spellId != Id.minatoSecondStep) {
      SoundHelper.playSoundOnUnit(target, "Audio/Effects/Zanzo.mp3", 1149);
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, targetId, 1);
      if (sfx) DestroyEffect(sfx);
    }
  }

  export function DDSLinkFusionDamage(dmg: DDSData) {
    const pairUnit = LoadUnitHandle(Globals.genericDDSHashtable, dmg.targetHandleId, FusionUnit.FUSION_PAIR_UNIT_KEY);
    if (pairUnit == null) return;
    const pairUnitId = GetHandleId(pairUnit);
    const targetSide = LoadInteger(Globals.genericSpellHashtable, dmg.targetHandleId, FusionUnit.FUSION_SIDE_KEY);
    const pairSide = LoadInteger(Globals.genericSpellHashtable, pairUnitId, FusionUnit.FUSION_SIDE_KEY);
    
    if (targetSide == 1) {
      // target is right side
      if (dmg.damageType != DAMAGE_TYPE_UNKNOWN) {
        // the dmg isnt pair-link damage, reduce it to 0
        dmg.setDamage(0);
      }
    }
    if (pairSide == 1) {
      // deal dmg to the left pair i.e. dmg the right side
      if (GetUnitState(dmg.target, UNIT_STATE_LIFE) - dmg.dmg < 1) {
        SetUnitState(pairUnit, UNIT_STATE_LIFE, 1);
        UnitDamageTarget(
          dmg.source, pairUnit, dmg.dmg, dmg.isAttack, false,
          ATTACK_TYPE_HERO, DAMAGE_TYPE_UNKNOWN,
          WEAPON_TYPE_WHOKNOWS
        );
      } else {
        UnitDamageTarget(
          dmg.source, pairUnit, dmg.dmg, dmg.isAttack, false,
          ATTACK_TYPE_HERO, DAMAGE_TYPE_UNKNOWN,
          WEAPON_TYPE_WHOKNOWS
        );
      }
    }
  }
  
  export function DDSDPSCheck(dmg: DDSData) {
    if (
      UnitHelper.isUnitDead(dmg.target)
      || !IsUnitType(dmg.source, UNIT_TYPE_HERO)
      || !IsUnitType(dmg.target, UNIT_TYPE_HERO)
      || dmg.dmg <= 0
    ) return;

    const target = dmg.target
    const damage = dmg.dmg;

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
    const newDmg = dmgTotal + damage;
    SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total"), newDmg);
    SaveReal(Globals.genericDDSHashtable, targetId, StringHash("dds_dps_total_prev"), dmgTotal);
    SetTextTagTextBJ(texttag, R2S(newDmg), 10);
  }

  export function DDSLogDamage(dmg: DDSData) {
    if (
      dmg.dmg == 0
      || dmg.sourcePlayer == dmg.targetPlayer
    ) return;

    const srcPlayerId = GetPlayerId(dmg.sourcePlayer);
    const targetPlayerId = GetPlayerId(dmg.targetPlayer);

    if (srcPlayerId >= Constants.maxActivePlayers) return;
    if (
      targetPlayerId >= Constants.maxActivePlayers
      && targetPlayerId != Constants.sagaPlayerId
    ) return;

    if (!UnitHelper.isUnitRealHero(dmg.target)) return;

    // player damage dealt
    // player damage recv
    // saga damage dealt
    if (targetPlayerId == Constants.sagaPlayerId) {
      SaveReal(Globals.genericDDSHashtable, srcPlayerId, DDS.PLAYER_DMG_SEND_SAGA_KEY, 
        dmg.dmg + LoadReal(Globals.genericDDSHashtable, srcPlayerId, DDS.PLAYER_DMG_SEND_SAGA_KEY)
      );
    } else {
      SaveReal(Globals.genericDDSHashtable, srcPlayerId, DDS.PLAYER_DMG_SEND_KEY, 
        dmg.dmg + LoadReal(Globals.genericDDSHashtable, srcPlayerId, DDS.PLAYER_DMG_SEND_KEY)
      );
      SaveReal(Globals.genericDDSHashtable, targetPlayerId, DDS.PLAYER_DMG_RECV_KEY, 
        dmg.dmg+ LoadReal(Globals.genericDDSHashtable, targetPlayerId, DDS.PLAYER_DMG_RECV_KEY)
      );
    }
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

  export function doSchalaTeleportation(spellId: number) {
    SchalaTeleportation(
      spellId, 
      GetTriggerUnit(), 
      GetSpellTargetX(), GetSpellTargetY(),
      spellId == Id.schalaTeleportation ? 33 : 16,
      166
    );
  }

  export function SchalaTeleportation(
    spellId: number,
    caster: unit,
    x: number,
    y: number,
    tpDelayTicks: number,
    tpDurationTicks: number,
  ) {
    const isSchalaTP = (
      spellId == Id.schalaTeleportation 
      || spellId == Id.schalaTeleportation2 
    );
    const schalaTpAOE = 600;
    const schalaTpMaxDist = 6000;
    const maxIntervalDist = 128;

    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const tpUnit = CreateUnit(
      player, 
      Constants.dummyBeamUnitId, 
      GetUnitX(caster), 
      GetUnitY(caster),
      0
    );
    ShowUnit(tpUnit, false);
    SetUnitInvulnerable(tpUnit, true);
    
    const casterX = GetUnitX(caster);
    const casterY = GetUnitY(caster);
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(x, y);
    const direction = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    const maxDist = Math.min(
      4000, 
      Math.max(1500, CoordMath.distance(Globals.tmpVector, Globals.tmpVector2))
    );
    Globals.tmpVector2.polarProjectCoords(
      Globals.tmpVector, direction, maxDist
    );

    let beamSpeed = maxDist / Math.max(1, tpDelayTicks);
    beamSpeed = Math.min(maxDist, beamSpeed * 2);
    const sfxCast = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      casterX, casterY
    );
    BlzSetSpecialEffectScale(sfxCast, 3.0);
    const sfxBeam = AddSpecialEffect(
      "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", 
      casterX, casterY
    );
    BlzSetSpecialEffectScale(sfxBeam, 3.0);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    let tick = 0;
    const tpTimer = TimerManager.getInstance().get();
    TimerStart(tpTimer, 0.03, true, () => {
      if (tick > tpDurationTicks) {
        RemoveUnit(tpUnit);
        DestroyEffect(sfxCast);
        DestroyEffect(sfxBeam);
        TimerManager.getInstance().recycle(tpTimer);
        return;
      }

      Globals.tmpVector.setUnit(tpUnit);
      Globals.tmpVector2.setPos(x, y);
      const distToTarget = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
      if (distToTarget > 0 && tick < tpDelayTicks) {
        const minDist = Math.min(distToTarget, beamSpeed);
        for (let i = 0; i <= minDist; i += maxIntervalDist) {
          Globals.tmpVector.polarProjectCoords(Globals.tmpVector, 
            direction, Math.min(minDist, maxIntervalDist)
          );
          PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(tpUnit, Globals.tmpVector);
          Globals.tmpVector.setUnit(tpUnit);
        }
        BlzSetSpecialEffectX(sfxBeam, GetUnitX(tpUnit));
        BlzSetSpecialEffectY(sfxBeam, GetUnitY(tpUnit));
      }

      if (tick >= tpDelayTicks) {
        Globals.tmpVector.setPos(casterX, casterY);
        Globals.tmpVector2.setUnit(tpUnit);

        GroupEnumUnitsInRange(Globals.tmpUnitGroup, 
          Globals.tmpVector.x, Globals.tmpVector.y, 
          schalaTpAOE, null
        );
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (
            IsUnitAlly(unit, player)
            && !Globals.barrierBlockUnits.has(unit)
            && UnitHelper.isUnitTargetableForPlayer(unit, player, true) 
            && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
            && (
              !isSchalaTP
              || GetUnitTypeId(unit) != Id.schala
            )
          ) {
            Globals.tmpVector3.setUnit(unit);
            const distance = CoordMath.distance(Globals.tmpVector3, Globals.tmpVector);
            if (CoordMath.distance(Globals.tmpVector3, Globals.tmpVector2) < schalaTpMaxDist) {                  
              Globals.tmpVector3.polarProjectCoords(
                Globals.tmpVector2, 
                CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector3), 
                distance
              );
              PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(unit, Globals.tmpVector3);
              DestroyEffect(
                AddSpecialEffect(
                  "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportCaster.mdl", 
                  Globals.tmpVector3.x, Globals.tmpVector3.y
                )
              );

              if (
                UnitHelper.isUnitRealHero(unit)
                && GetPlayerController(GetOwningPlayer(unit)) == MAP_CONTROL_USER
              ) {
                SetCameraPositionForPlayer(
                  GetOwningPlayer(unit), 
                  Globals.tmpVector3.x, Globals.tmpVector3.y
                );
              }
            }
          }
        });
      }
      
      // hack to check channel
      if (isSchalaTP) {
        if (!ch.isChanneling()) {
          tick += tpDelayTicks;
        }
      }
      ++tick;
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
        SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
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
    const caster = GetTriggerUnit();
    const x = GetUnitX(caster);
    const y = GetUnitY(caster);
    FarmingManager.getInstance().plantCropFromSpell(caster, spellId, x, y);
    
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
    const hookBreakDist = hookMaxDist * 1.5;
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
    createGateTeleporter(spellId, GetTriggerUnit(), GetSpellTargetX(), GetSpellTargetY());
  }

  export function createGateTeleporter(spellId: number, caster: unit, x: number, y: number) {
    const moveDurationTicks = 16;
    const schalaTpEndTick = 333;
    const tpAOE = 400;
    const tpMaxDist = 6000;
    const excludeTicks = 100;
    const tpRegisterKey = StringHash(I2S(spellId) + "gate_tp_count");
    const tpTimeKey = StringHash(I2S(spellId) + "gate_tp_exclude_time");

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
    const targetPos = new Vector2D(x, y);
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
        if (BlzGroupGetSize(excludeGroup) > 0) {
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
        !UnitHelper.isUnitAlive(caster)
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
    const valhallaHeal = 0.3;
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

  export function doShalltearDrainingLance(spellId: number) {
    const drainPct = 0.05;

    const caster = GetTriggerUnit();
    const target = GetSpellTargetUnit();
    const player = GetOwningPlayer(caster);
    
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Undead\\VampiricAura\\VampiricAuraTarget.mdl",
        caster, "origin"
      )
    );

    const drainAmount = drainPct * GetUnitState(target, UNIT_STATE_MAX_LIFE);
    UnitDamageTarget(
      caster, 
      target,
      drainAmount,
      false, false,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    );
    SetUnitState(
      caster, 
      UNIT_STATE_LIFE, 
      GetUnitState(caster, UNIT_STATE_LIFE) + drainAmount
    );
    
    const castDummy = CreateUnit(
      player, 
      Constants.dummyCasterId, 
      GetUnitX(caster), GetUnitY(caster), 
      0
    );
    UnitAddAbility(castDummy, DebuffAbilities.SLOW_GENERIC_25_PCT_5S);
    IssueTargetOrderById(castDummy, OrderIds.SLOW, target);
    RemoveUnit(castDummy);
  }

  export function doShalltearBloodFrenzyOn(spellId: number) {
    const mistDuration = 5.0;
    const caster = GetTriggerUnit();

    if (GetUnitAbilityLevel(caster, Id.shalltearBloodFrenzyOn) > 0) {
      const player = GetOwningPlayer(caster);
      UnitAddAbility(caster, Id.shalltearMistForm);
      UnitAddAbility(caster, Id.shalltearBloodFrenzyPassive);
      SetUnitAbilityLevel(caster, Id.shalltearMistForm, Math.floor(GetHeroLevel(caster) * 0.1));

      const lvl = Math.min(10, 1 + Math.floor((100 - GetUnitLifePercent(caster)) / 10));
      SetUnitAbilityLevel(caster, Id.shalltearBloodFrenzyPassive, lvl);
      BlzUnitHideAbility(caster, Id.shalltearBloodFrenzyPassive, true);

      SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOn, false);
      SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOff, false);
      SetPlayerAbilityAvailable(player, Id.shalltearMistForm, true);

      TimerStart(CreateTimer(), mistDuration, false, () => {
        if (GetUnitAbilityLevel(caster, Id.shalltearBloodFrenzyPassive) > 0) {
          SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOn, false);
          SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOff, true);
          SetPlayerAbilityAvailable(player, Id.shalltearMistForm, false);
          UnitAddAbility(caster, Id.shalltearBloodFrenzyOff);
        }
        DestroyTimer(GetExpiredTimer());
      });
    }
  }
  
  export function doShalltearBloodFrenzyOff(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOn, true);
    SetPlayerAbilityAvailable(player, Id.shalltearBloodFrenzyOff, false);
    SetPlayerAbilityAvailable(player, Id.shalltearMistForm, false);
    UnitRemoveAbility(caster, Id.shalltearBloodFrenzyPassive);
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
    const caster = GetTriggerUnit();
    doUltimateChargeUnit(caster, 0.04, 0.01);
  }

  export function doUltimateChargeUnit(caster: unit, mpPct: number, hpPct: number) {
    const tickRate = 0.03;
    const endTick = 2000;
    const minHPTick = 7 * 33;

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

    const playerId = GetPlayerId(GetOwningPlayer(caster));
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);

    const tpTimer = TimerManager.getInstance().get();
    TimerStart(tpTimer, tickRate, true, () => {
      if (tick > endTick || !UnitHelper.isUnitAlive(caster)) {
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

      if (tick > minHPTick && hpPct > 0) {
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
      // if (GetUnitCurrentOrder(caster) != OrderIds.PHASE_SHIFT_OFF) {
      //   tick += endTick;
      // }
      if (tick > 1 && !ch.isChanneling()) {
        tick += endTick;
      }
      ++tick;
    });
  }

  export function doMinatoHiraishinNoJutsu(spellId: number) {
    const maxCastDistance = 1100;
    const maxTravelDistance = 1200;
    const spCost = 5;
    let searchAOE = maxTravelDistance;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());

    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxCastDistance);

    let closestUnit = caster;
    let minDistance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

    const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
    
    if (!Globals.barrierBlockUnits.has(caster) && customHero.getCurrentSP() >= spCost) {
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
      customHero.setCurrentSP(customHero.getCurrentSP() - spCost);
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
    const maxDistance = 1000;
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
        !UnitHelper.isUnitAlive(beam) 
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
    const dmgMult = BASE_DMG.KAME_DPS * 5;

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
    const dmgMult = BASE_DMG.KAME_DPS * 2.5 * tickRate;
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
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      GetUnitX(caster), GetUnitY(caster), reverseLotusAOE, null
    );
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

    const numTargets = BlzGroupGetSize(targetGroup);

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
      if (!UnitHelper.isUnitAlive(caster)) {
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
    const kunaiHpMult = BASE_DMG.KAME_DPS * 0.3;

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
      GetUnitAbilityLevel(caster, Id.minatoKunai), 
      kunaiHpMult, caster, bj_HEROSTAT_INT
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

      if (!UnitHelper.isUnitAlive(caster)) {
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
    const detonationDmgMult = BASE_DMG.KAME_DPS * 18;
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

      if (!UnitHelper.isUnitAlive(beam)) {
        ticks = endTick;
      }
      ticks++;
    });
  }

  export function doGenosOvercharge(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const casterId = GetHandleId(caster);

    if (spellId == Id.genosOverchargeOn) {
      SetPlayerAbilityAvailable(player, Id.genosOverchargeOff, true);
      SetPlayerAbilityAvailable(player, Id.genosOverchargeOn, false);
      UnitAddAbility(caster, Id.genosOverchargeOff);
      UnitAddAbility(caster, Id.genosOverchargeFlag);
      BlzStartUnitAbilityCooldown(caster, Id.genosOverchargeOff, 3);

      if (Math.random() * 100 < 50) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Genos/Overcharge2.mp3", 1500);
      } else {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Genos/Overcharge3.mp3", 1000);
      }
    } else if (spellId == Id.genosOverchargeOff) {
      SetPlayerAbilityAvailable(player, Id.genosOverchargeOff, false);
      SetPlayerAbilityAvailable(player, Id.genosOverchargeOn, true);
      UnitRemoveAbility(caster, Id.genosOverchargeFlag);

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
        if (IsUnitType(unit, UNIT_TYPE_STRUCTURE)) return;
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
        if (IsUnitType(target, UNIT_TYPE_STRUCTURE)) return;
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

          // SimpleSpellSystem.doTatsumakiMoveBeam(
          //   target, projectionDistance, bonusSpeedRatio, projectionAngle,
          //   Globals.tmpVector, Globals.tmpVector2,
          //   Globals.tmpUnitGroup3
          // );
          SimpleSpellSystem.addToTatsumakiMovementGroup(
            target, projectionDistance, bonusSpeedRatio, projectionAngle
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
    MoveLocation(Globals.tmpLoc, targetX, targetY);

    const abil = BlzGetUnitAbility(caster, Id.tatsumakiVector);

    let sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfxKey);
    const vectorState = LoadInteger(Globals.genericSpellHashtable, casterId, vectorKey);
    const sfxZHeight = GetLocationZ(Globals.tmpLoc);
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
      BlzSetSpecialEffectZ(sfx, sfxZHeight + sfxHeight);
      // sfx1 marker
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx1Key);
      BlzSetSpecialEffectScale(sfx, sfxMarkerSize);
      BlzSetSpecialEffectX(sfx, targetX);
      BlzSetSpecialEffectY(sfx, targetY);
      BlzSetSpecialEffectZ(sfx, sfxZHeight + sfxHeight);
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
      BlzSetSpecialEffectZ(sfx, sfxZHeight + sfxHeight);
      BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
      BlzSetSpecialEffectPitch(sfx, 90 * CoordMath.degreesToRadians);
      // sfx2
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, casterId, vectorSfx2Key);
      BlzSetSpecialEffectX(sfx, Globals.tmpVector2.x);
      BlzSetSpecialEffectY(sfx, Globals.tmpVector2.y);
      BlzSetSpecialEffectZ(sfx, sfxZHeight + sfxHeight);
      BlzSetSpecialEffectScale(sfx, sfxMarkerSize);

      UnitHelper.payMPPercentCost(caster, vectorManaCostPct - 0.01, UNIT_STATE_MAX_MANA);

      const rng = Math.random() * 100;
      if (rng < 35) { 
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/Disgust.mp3", 2000);
      } else if (rng < 70) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/OutOfMyWay.mp3", 1100);
      } else if (rng < 90) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Tatsumaki/GoOnHome.mp3", 1100);
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

      ForGroup(fuseGroup, () => {
        const unit = GetEnumUnit();
        if (IsUnitType(unit, UNIT_TYPE_STRUCTURE)) return;
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


  export function doWhisTemporalDoOver(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();

    if (!UnitHelper.isUnitRealHero(target)) {
      DisplayTimedTextToPlayer(player, 0, 0, 3, "|cffff2222Invalid Target.|r");
      BlzStartUnitAbilityCooldown(caster, spellId, 1);
      return;
    }

    Globals.DDSAddUnit(target);

    const timer = TimerManager.getInstance().get();
    const timerId = GetHandleId(timer);
    const ticksKey = StringHash("whis_w_ticks");
    const targetKey = StringHash("whis_w_target");
    const xKey = StringHash("whis_w_x");
    const yKey = StringHash("whis_w_y");
    const sfxKey = StringHash("whis_w_sfx");

    const healActiveKey = StringHash("whis_w_heal_active");
    const healKey = StringHash("whis_w_heal");
    const targetId = GetHandleId(target);
    const x = GetUnitX(target);
    const y = GetUnitY(target);

    SaveInteger(Globals.genericSpellHashtable, timerId, ticksKey, 1);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, targetKey, target);
    SaveReal(Globals.genericSpellHashtable, timerId, xKey, x);
    SaveReal(Globals.genericSpellHashtable, timerId, yKey, y);
    const sfx = AddSpecialEffect("MagicTimerCircle.mdl", x, y);
    BlzSetSpecialEffectScale(sfx, 2.0);
    BlzSetSpecialEffectHeight(sfx, BlzGetUnitZ(target) + 150);
    BlzSetSpecialEffectTimeScale(sfx, 0.5);
    SaveEffectHandle(
      Globals.genericSpellHashtable, timerId, sfxKey, 
      sfx
    );
    
    SaveBoolean(Globals.genericDDSHashtable, targetId, healActiveKey, true);
    SaveReal(Globals.genericDDSHashtable, targetId, healKey, 0);

    TimerStart(timer, 0.03, true, temporalDoOverHook);
  }

  export function temporalDoOverHook() {
    const delayTick = 100;
    const healTicks = 133;
    const healEndTick = delayTick + healTicks;
    const maxDist = 5000;

    const ticksKey = StringHash("whis_w_ticks");
    const targetKey = StringHash("whis_w_target");
    const healActiveKey = StringHash("whis_w_heal_active");
    const healKey = StringHash("whis_w_heal");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const ticks = LoadInteger(Globals.genericSpellHashtable, timerId, ticksKey);
    const target = LoadUnitHandle(Globals.genericSpellHashtable, timerId, targetKey);
    const targetId = GetHandleId(target);

    if (ticks < delayTick) {
      // the dds trigger will sum the amount to heal
      if (ticks % 33 == 0) {
        const sfx = AddSpecialEffect("DTBlueNoRingWhite.mdl", GetUnitX(target), GetUnitY(target));
        DestroyEffect(sfx);
      }
    } else if (ticks < healEndTick) {

      if (ticks == delayTick) {
        SaveBoolean(Globals.genericDDSHashtable, targetId, healActiveKey, false);

        const sfxKey = StringHash("whis_w_sfx");
        const sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, sfxKey);
        DestroyEffect(sfx);

        const xKey = StringHash("whis_w_x");
        const yKey = StringHash("whis_w_y");
        const oldX = LoadReal(Globals.genericSpellHashtable, timerId, xKey);
        const oldY = LoadReal(Globals.genericSpellHashtable, timerId, yKey);
        
        Globals.tmpVector.setPos(oldX, oldY);
        Globals.tmpVector2.setUnit(target);
        if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) < maxDist) {
          SetUnitX(target, oldX);
          SetUnitY(target, oldY);
        }

        SaveEffectHandle(
          Globals.genericSpellHashtable, timerId, sfxKey,
          AddSpecialEffectTarget(
            "Abilities/Spells/NightElf/Rejuvenation/RejuvenationTarget.mdl", 
            target, "origin"
          )
        );
      }
      
      // start healing
      const heal = LoadReal(Globals.genericDDSHashtable, targetId, healKey);
      SetUnitState(
        target, UNIT_STATE_LIFE, 
        GetUnitState(target, UNIT_STATE_LIFE)
        + Math.max(1, heal / healTicks)
      );
    }

    // end
    if (ticks >= healEndTick || !UnitHelper.isUnitAlive(target)) {

      const sfxKey = StringHash("whis_w_sfx");
      const sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, sfxKey);
      DestroyEffect(sfx);

      SaveBoolean(Globals.genericDDSHashtable, targetId, healActiveKey, false);
      SaveReal(Globals.genericDDSHashtable, targetId, healKey, 0);

      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    }

    SaveInteger(Globals.genericSpellHashtable, timerId, ticksKey, ticks + 1);
  }

  export function doWhisAngelicShield(spellId: number) {
    const shieldHpMult = BASE_DMG.KAME_DPS * 10;
    const maxHpPctPerLevel = 0.015;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const target = GetSpellTargetUnit();

    if (!UnitHelper.isUnitRealHero(target)) {
      DisplayTimedTextToPlayer(player, 0, 0, 3, "|cffff2222Invalid Target.|r");
      BlzStartUnitAbilityCooldown(caster, spellId, 1);
      return;
    }
    
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    const timer = TimerManager.getInstance().get();
    const timerId = GetHandleId(timer);
    const ticksKey = StringHash("whis_e_ticks");
    const casterKey = StringHash("whis_e_caster");
    const targetKey = StringHash("whis_e_target");
    const sfxKey = StringHash("whis_e_sfx");
    const texttagKey = StringHash("whis_e_tt");
    
    // DDS
    const shieldHpKey = StringHash("whis_e_hp");
    const targetId = GetHandleId(target);
    const abilLvl = GetUnitAbilityLevel(caster, spellId);
    const shieldHp = AOEDamage.calculateDamageRaw(
      caster, abilLvl,
      ch.spellPower, 
      shieldHpMult, 1.0, 
      bj_HEROSTAT_INT,
    ) + abilLvl * maxHpPctPerLevel * GetUnitState(target, UNIT_STATE_MAX_LIFE);
    SaveReal(Globals.genericDDSHashtable, targetId, shieldHpKey, shieldHp);
    
    // timer
    SaveInteger(Globals.genericSpellHashtable, timerId, ticksKey, 1);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, casterKey, caster);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, targetKey, target);
    SaveEffectHandle(Globals.genericSpellHashtable, timerId, sfxKey, 
      AddSpecialEffectTarget("WhisShield.mdl", target, "origin")
    );

    const texttag = CreateTextTag();
    SetTextTagPermanent(texttag, true);
    SetTextTagColor(texttag, 255, 255, 255, 100);
    SetTextTagVisibility(texttag, true);
    SetTextTagPos(texttag, GetUnitX(target), GetUnitY(target), 10);
    SetTextTagTextBJ(texttag, I2S(R2I(shieldHp)), 10);
    SaveTextTagHandle(Globals.genericSpellHashtable, timerId, texttagKey, texttag);

    TimerStart(timer, 0.03, true, angelicShieldHook);
  }
  
  export function angelicShieldHook() {
    const endTick = 200;
    const dmgAOE = 500;
    const shieldToDmgPct = 0.9;

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);
    
    const ticksKey = StringHash("whis_e_ticks");
    const targetKey = StringHash("whis_e_target");
    const sfxKey = StringHash("whis_e_sfx");
    const texttagKey = StringHash("whis_e_tt");
    const shieldHpKey = StringHash("whis_e_hp");

    const ticks = LoadInteger(Globals.genericSpellHashtable, timerId, ticksKey);
    const target = LoadUnitHandle(Globals.genericSpellHashtable, timerId, targetKey);
    const texttag = LoadTextTagHandle(Globals.genericSpellHashtable, timerId, texttagKey);
    const x = GetUnitX(target);
    const y = GetUnitY(target);
    const targetId = GetHandleId(target);

    // shield hp from DDS hashtable
    const shieldHp = LoadReal(Globals.genericDDSHashtable, targetId, shieldHpKey);

    if (ticks < endTick) {
      SetTextTagPos(texttag, x, y, 10);
      SetTextTagTextBJ(texttag, I2S(R2I(shieldHp)), 10);
    }

    if (ticks >= endTick || !UnitHelper.isUnitAlive(target) || shieldHp <= 0) {
      if (shieldHp > 0) {
        const casterKey = StringHash("whis_e_caster");
        const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, casterKey);
        const casterPlayer = GetOwningPlayer(caster);

        // detonate the shield
        DestroyEffect(
          AddSpecialEffect("Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl", x, y)
        );
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, x, y, dmgAOE, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (UnitHelper.isUnitTargetableForPlayer(unit, casterPlayer)) {
            UnitDamageTarget(
              caster, unit, shieldHp * shieldToDmgPct, 
              false, false, 
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
              WEAPON_TYPE_WHOKNOWS
            );
          }
        });
      }
      SaveReal(Globals.genericDDSHashtable, targetId, shieldHpKey, 0);
      DestroyTextTag(texttag);
      DestroyEffect(LoadEffectHandle(Globals.genericSpellHashtable, timerId, sfxKey));
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    }

    SaveInteger(Globals.genericSpellHashtable, timerId, ticksKey, ticks + 1);
  }

  export function doWhisTemporalWarp(spellId: number) {
    const endTick = 66;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    let x = GetSpellTargetX();
    let y = GetSpellTargetY();

    const maxDist = 1500 + 500 * GetUnitAbilityLevel(caster, spellId);
    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(x, y);
    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxDist);
    x = Globals.tmpVector2.x;
    y = Globals.tmpVector2.y;
    
    const sfx = AddSpecialEffect(
      "WhisTeleport3.mdl",
      Globals.tmpVector.x, Globals.tmpVector.y
    );

    SetUnitTimeScale(caster, 0.5);

    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks >= endTick || ticks < 0) {
        SetUnitTimeScale(caster, 1.0);
        DestroyEffect(sfx);
        TimerManager.getInstance().recycle(timer);

        if (ticks > 0) {
          // createGateTeleporter(spellId, caster, x, y);
          SchalaTeleportation(spellId, caster, x, y, 2, 2);
        }
        return;
      }
      if (!ch.isChanneling() || ch.channelAbilityId != spellId) {
        ticks = -1;
        return;
      }
      BlzSetSpecialEffectScale(sfx, 1.0 + 2*ticks/endTick);
      ++ticks;
    });
  }

  export function beerusCreateOrb(
    caster: unit,
    targetX: number,
    targetY: number,
  ) {
    const tickRate = 0.03;
    const beamHpMult = BASE_DMG.KAME_DPS * 0.7;
    const beamDuration = 60.0;
    const maxDist = 300;

    const beamTimerKey = StringHash("beerus_q_beam");
    const beamCasterTimerKey = StringHash("beerus_q_caster");
    // const beamSfxTimerKey = StringHash("beerus_q_sfx");
    const timerDDSKey = StringHash("beerus_q_timer_dds");

    const player = GetOwningPlayer(caster);

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(targetX, targetY);
    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxDist);
    
    const beam = CreateUnit(
      player, 
      // Constants.dummyBeamUnitId, 
      Id.beerusCataclysmicOrbUnitId, 
      Globals.tmpVector2.x, Globals.tmpVector2.y, 0,
    );
    const beamId = GetHandleId(beam);
    BlzSetUnitName(beam, "Cataclysmic Orb");

    // const sfx = AddSpecialEffectTarget("CataclysmicOrb.mdl", beam, "origin");

    const maxHp = BeamComponent.calculateBeamHp(
      GetUnitAbilityLevel(caster, Id.beerusCataclysmicOrb), 
      beamHpMult, caster, bj_HEROSTAT_INT
    );

    BlzSetUnitMaxHP(beam, maxHp);
    SetUnitLifePercentBJ(beam, 100);
    SetUnitMoveSpeed(beam, 0);
    UnitRemoveAbility(beam, Id.attack);

    UnitApplyTimedLife(beam, Buffs.TIMED_LIFE, beamDuration);

    Globals.DDSAddUnit(beam);

    const timer = TimerManager.getInstance().get();
    const timerId = GetHandleId(timer);

    SaveUnitHandle(Globals.genericSpellHashtable, timerId, beamTimerKey, beam);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, beamCasterTimerKey, caster);
    // SaveEffectHandle(Globals.genericSpellHashtable, timerId, beamSfxTimerKey, sfx);
    SaveInteger(Globals.genericDDSHashtable, beamId, timerDDSKey, timerId);

    TimerStart(timer, tickRate, true, beerusCataclysmicOrbLoop);
  }

  export function beerusCataclysmicOrbLoop() {
    const beamSpeed = 50;
    const detonateAOE = 250;
    const dmgAOE = 350;
    const dmgDataMult = BASE_DMG.KAME_DPS * 3;
    const manaToDmgPct = 0.04;
    const nonHeroMaxHpPctDmg = 0.5;

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const beamTimerKey = StringHash("beerus_q_beam");
    const beamCasterTimerKey = StringHash("beerus_q_caster");
    // const beamSfxTimerKey = StringHash("beerus_q_sfx");
    const motionTimerKey = StringHash("beerus_q_motion");
    const motionAngleKey = StringHash("beerus_q_motion_ang");

    const beam = LoadUnitHandle(Globals.genericSpellHashtable, timerId, beamTimerKey);
    const beamId = GetHandleId(beam);
    const player = GetOwningPlayer(beam);
    const playerId = GetPlayerId(player);
    const x = GetUnitX(beam);
    const y = GetUnitY(beam);

    const inMotion = LoadBoolean(Globals.genericSpellHashtable, timerId, motionTimerKey);

    // move
    if (inMotion) {
      const angle = LoadReal(Globals.genericSpellHashtable, timerId, motionAngleKey);
      Globals.tmpVector.setUnit(beam);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, angle, beamSpeed);
      if (!PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector)) {
        SaveBoolean(Globals.genericSpellHashtable, timerId, motionTimerKey, false);
      }
    }
    
    // AOE detonate
    let doDeto = !UnitHelper.isUnitAlive(beam);
    if (!doDeto) {
      GroupEnumUnitsInRange(Globals.tmpUnitGroup, x, y, detonateAOE, null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (!UnitHelper.isUnitAlive(unit)) return;
        if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
          doDeto = true;
        } else if (
          unit != beam
          // && GetUnitTypeId(unit) == Constants.dummyBeamUnitId 
          && GetUnitTypeId(unit) == Id.beerusCataclysmicOrbUnitId 
          && GetUnitName(unit) == "Cataclysmic Orb"
        ) {
          doDeto = true;
        }
      });
    }
    
    if (doDeto) {
      const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, beamCasterTimerKey);
      const ch = Globals.customPlayers[playerId].getCustomHero(caster);

      const dmg = AOEDamage.calculateDamageRaw(
        caster,
        GetUnitAbilityLevel(caster, Id.beerusCataclysmicOrb),
        ch ? ch.spellPower : 1.0,
        dmgDataMult,
        inMotion ? 2.0 : 1.0,
        bj_HEROSTAT_INT
      ) + GetUnitState(caster, UNIT_STATE_MANA) * manaToDmgPct;

      GroupEnumUnitsInRange(Globals.tmpUnitGroup, x, y, dmgAOE, null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
          UnitDamageTarget(
            caster, unit, 
            dmg + 
            (!IsUnitType(unit, UNIT_TYPE_HERO) ? 
              nonHeroMaxHpPctDmg * GetUnitState(unit, UNIT_STATE_MAX_LIFE) : 
              0
            ), 
            false, false,
            ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
            WEAPON_TYPE_WHOKNOWS
          );
        }
      });

      // const sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, beamSfxTimerKey);
      // if (sfx) DestroyEffect(sfx);
      const sfx2 = AddSpecialEffect("NewDirtEXNofire.mdl", x, y);
      BlzSetSpecialEffectScale(sfx2, 1.5);
      BlzSetSpecialEffectTimeScale(sfx2, 1.5);
      DestroyEffect(sfx2);

      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      FlushChildHashtable(Globals.genericDDSHashtable, beamId);
      RemoveUnit(beam);
      TimerManager.getInstance().recycle(timer);
      return;
    }
  }

  export function doBeerusCataclysmicOrb(spellId: number) {
    const mpCostPct = 0.04;

    const caster = GetTriggerUnit();

    UnitHelper.payMPPercentCost(caster, mpCostPct, UNIT_STATE_MAX_MANA);

    beerusCreateOrb(caster, GetSpellTargetX(), GetSpellTargetY());
  }

  export function doBeerusSphereOfDestruction(spellId: number) {
    const mpCostPct = 0.15;

    const caster = GetTriggerUnit();

    UnitHelper.payMPPercentCost(caster, mpCostPct, UNIT_STATE_MAX_MANA);
  }

  export function doBeerusAuraOfDestruction(spellId: number) {
    const mpCostPct = 0.1;
    const dmgAOE = 500;
    const mpDmgPct = 0.01 * 0.03;
    const endTick = 166;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);

    UnitHelper.payMPPercentCost(caster, mpCostPct, UNIT_STATE_MAX_MANA);

    let tick = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (tick < endTick) {
        // dmg
        const dmg = GetUnitState(caster, UNIT_STATE_MANA) * mpDmgPct;
        GroupEnumUnitsInRange(Globals.tmpUnitGroup, GetUnitX(caster), GetUnitY(caster), dmgAOE, null);
        ForGroup(Globals.tmpUnitGroup, () => {
          const unit = GetEnumUnit();
          if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
            UnitDamageTarget(
              caster, unit, dmg, 
              false, false, 
              ATTACK_TYPE_HERO, 
              DAMAGE_TYPE_NORMAL, 
              WEAPON_TYPE_WHOKNOWS
            );
          }
        });
      }
      ++tick;
    });
  }

  export function doBeerusGodWrath(spellId: number) {
    const mpCostPct = 0.2;
    const spellAmpPerMpPct = 0.003;
    const height = 200;
    const heightRate = height / 0.5;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    UnitHelper.payMPPercentCost(caster, mpCostPct, UNIT_STATE_MAX_MANA);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    UnitHelper.giveUnitFlying(caster);
    SetUnitFlyHeight(caster, height, heightRate);

    let spellAmp = GetUnitManaPercent(caster) * spellAmpPerMpPct;
    ch.addSpellPower(spellAmp);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ch.isChanneling() && ch.channelAbilityId == spellId) {
        ch.removeSpellPower(spellAmp);
        spellAmp = GetUnitManaPercent(caster) * spellAmpPerMpPct;
        ch.addSpellPower(spellAmp);
      } else {
        ch.removeSpellPower(spellAmp);
        SetUnitFlyHeight(caster, 0, 0);
        TimerManager.getInstance().recycle(timer);
        return;
      }
    });
  }

  export function doBeerusSushi(spellId: number) {
    const spPct = 0.15;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    ch.setCurrentSP(Math.ceil(ch.getCurrentSP() + ch.getMaxSP() * spPct));

    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Undead/DarkRitual/DarkRitualTarget.mdl", 
        GetUnitX(caster), GetUnitY(caster)
      )
    );
  }

  export function doBeerusRamen(spellId: number) {
    const hpPct = 0.15;
    const mpPct = 0.15;

    const caster = GetTriggerUnit();

    UnitHelper.payHPPercentCost(caster, -hpPct, UNIT_STATE_MAX_LIFE);
    UnitHelper.payMPPercentCost(caster, -mpPct, UNIT_STATE_MAX_MANA);

    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Human/HolyBolt/HolyBoltSpecialArt.mdl", 
        GetUnitX(caster), GetUnitY(caster)
      )
    );
  }

  export function doGranolahEnergyVolley(spellId: number) {
    const height = 600;
    const heightRate = height / 0.25;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    UnitHelper.giveUnitFlying(caster);
    SetUnitFlyHeight(caster, height, heightRate);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (!ch.isChanneling() || ch.channelAbilityId != spellId) {
        SetUnitFlyHeight(caster, 0, 0);
        TimerManager.getInstance().recycle(timer);
        return;
      }
    });
  }

  export function doGranolahFinalShot(spellId: number) {
    UnitHelper.payHPPercentCost(GetTriggerUnit(), 0.1, UNIT_STATE_MAX_LIFE);
  }

  export function doGojoBlackFlash(spellId: number, caster: unit) {
    const dmgDataMult = BASE_DMG.KAME_DPS * 8;
    const mpHealPct = -1 * 0.2;
    const reqDelay = 7;

    const gojoBlackFlashTargetKey = StringHash("gojo_black_flash_target");
    const gojoBlackFlashTicksKey = StringHash("gojo_black_flash_ticks");

    const gojoUnlimitedVoidTicksKey = StringHash("gojo_r_ticks");
    const gojoUnlimitedVoidXKey = StringHash("gojo_r_x");
    const gojoUnlimitedVoidYKey = StringHash("gojo_r_y");

    // if damaged within 0.12s by an auto attack deal damage
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const abil = ch.getAbility(AbilityNames.Gojo.BLACK_FLASH);

    const isUnlimitedVoid = LoadInteger(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidTicksKey) > 0;

    const delay = LoadInteger(Globals.genericSpellHashtable, casterId, gojoBlackFlashTicksKey);
    if (
      !isUnlimitedVoid 
      && (delay == 0 || delay >= reqDelay)
    ) {
      TextTagHelper.showPlayerColorTextOnUnit("Miss!", playerId, caster);
      ch.setCurrentSP(ch.getCurrentSP() + Math.ceil(abil.costAmount / 2));
      return;
    }

    UnitHelper.payMPPercentCost(caster, mpHealPct, UNIT_STATE_MAX_MANA);

    const target = isUnlimitedVoid ? caster : LoadUnitHandle(
      Globals.genericSpellHashtable,
      casterId,
      gojoBlackFlashTargetKey
    );

    // check unlimited void
    if (isUnlimitedVoid) {
      const voidX = LoadReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidXKey);
      const voidY = LoadReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidYKey);
      Globals.tmpVector3.setPos(voidX, voidY);

      TextTagHelper.showPlayerColorTextOnUnit(
        "Unlimited Void: " + AbilityNames.Gojo.BLACK_FLASH, playerId, caster
      );
      AOEDamage.genericDealAOEDamage(
        Globals.tmpUnitGroup3, 
        caster,
        Globals.tmpVector3.x,
        Globals.tmpVector3.y,
        600, 
        10, ch.spellPower,
        dmgDataMult, 1.0, bj_HEROSTAT_INT,
      );

      SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlackFlash1.mp3", 887);
    } else {
      abil.resetCooldown();
      TextTagHelper.showPlayerColorTextOnUnit(
        AbilityNames.Gojo.BLACK_FLASH, playerId, caster
      );
      if (UnitHelper.isUnitTargetableForPlayer(target, player)) {
        AOEDamage.dealDamageRaw(
          caster, 10, ch.spellPower, 
          dmgDataMult, 1.0, bj_HEROSTAT_INT,
          target
        );
        Globals.tmpVector3.setUnit(target);
      }

      if (Math.random() * 100 < 50) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlackFlash2.mp3", 810);
      } else {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlackFlash3.mp3", 480);
      }
    }

    const sfx = AddSpecialEffect("GojoBlackFlash.mdl", 
      Globals.tmpVector3.x, Globals.tmpVector3.y
    );
    if (isUnlimitedVoid) {
      BlzSetSpecialEffectScale(sfx, 4.0);
    }
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.5, false, () => {
      DestroyEffect(sfx);
      TimerManager.getInstance().recycle(timer);
    });
  }

  export function doGojoLimitlessGuard(spellId: number, caster: unit) {
    const gojoLimitlessGuardTicksKey = StringHash("gojo_limitless_guard_ticks");

    const casterId = GetHandleId(caster);

    SaveInteger(Globals.genericSpellHashtable, casterId, gojoLimitlessGuardTicksKey, 1);
  }

  export function gojoIsPurpleCollision(
    unit: unit, 
    beam: unit,
    caster: unit, 
    player: player
  ) {
    return (
      GetUnitTypeId(unit) == Constants.dummyBeamUnitId
      && GetOwningPlayer(unit) == player
      && GetUnitAbilityLevel(caster, Id.gojoPurplePassive) > 0
      && BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoPurpleActive) == 0
      && (
        (
          GetUnitName(unit) == "Cursed Technique Lapse: Blue"
          && GetUnitName(beam) != "Cursed Technique Lapse: Blue"
        )
        || 
        (
          GetUnitName(unit) == "Cursed Technique Reversal: Red"
          && GetUnitName(beam) != "Cursed Technique Reversal: Red"
        )
      )
    );
  }

  export function gojoBlueChargeLoop() {
    const mpHealPct = -1 * 0.03 * 0.01;
    const blueMaxChargeTicks = 133;
    const minSfxAlpha = 100;

    const gojoBlueCasterTimerKey = StringHash("gojo_q_caster");
    const gojoBlueChargeTicksKey = StringHash("gojo_q_charge_ticks");
    const gojoBlueChargeFlagKey = StringHash("gojo_q_charge_flag");
    const gojoBlueCasterSfxKey = StringHash("gojo_q_caster_sfx");
    const gojoBlueTargetSfxKey = StringHash("gojo_q_target_sfx");
    const gojoBlueSoundKey = StringHash("gojo_q_sound");

    const gojoRedChargeTicksKey = StringHash("gojo_w_charge_ticks");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, 
      timerId, gojoBlueCasterTimerKey
    );
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const casterX = GetUnitX(caster);
    const casterY = GetUnitY(caster);

    let sfx = null;

    const blueChargeTicks = LoadInteger(Globals.genericSpellHashtable,
      casterId, gojoBlueChargeTicksKey
    );
    if (blueChargeTicks == 0) {
      if (LoadBoolean(Globals.genericSpellHashtable, 
        casterId, gojoBlueChargeFlagKey
      )) {
        sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
          casterId, gojoBlueCasterSfxKey
        );
        DestroyEffect(sfx);
        sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
          casterId, gojoBlueTargetSfxKey
        );
        DestroyEffect(sfx);
      }
      SaveBoolean(Globals.genericSpellHashtable, 
        casterId, gojoBlueChargeFlagKey, false
      );
      DestroyTimer(timer);
      return;
    }

    const redChargeTicks = LoadInteger(Globals.genericSpellHashtable, casterId, gojoRedChargeTicksKey);
    const isPurpleCharge = (redChargeTicks > 0
      && GetUnitAbilityLevel(caster, Id.gojoPurpleActive) > 0
      && BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoPurpleActive) == 0
    );

    Globals.tmpVector3.setPos(
      Globals.customPlayers[playerId].mouseData.x,
      Globals.customPlayers[playerId].mouseData.y
    );

    if (blueChargeTicks == 1) {
      SaveBoolean(Globals.genericSpellHashtable, 
        casterId, gojoBlueChargeFlagKey, true
      );

      sfx = AddSpecialEffect(
        "Soul Armor Azure.mdl",
        casterX, casterY,
      );
      BlzSetSpecialEffectScale(sfx, 4.0);
      BlzSetSpecialEffectColor(sfx, 125, 205, 255);
      SaveEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoBlueCasterSfxKey, sfx
      );

      const sfxName = player == GetLocalPlayer() ? 
        "Spell_Marker_Blue.mdl" 
        : "dummy.mdl"
      ;
      sfx = AddSpecialEffect(
        sfxName,
        Globals.tmpVector3.x,
        Globals.tmpVector3.y
      );
      BlzSetSpecialEffectScale(sfx, 2.0);
      SaveEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoBlueTargetSfxKey, sfx
      );

    } else {

      if (blueChargeTicks == gojoVoiceTick) {
        if (!isPurpleCharge) {
          if (Math.random() * 100 < 50) {
            SaveInteger(Globals.genericSpellHashtable, casterId, gojoBlueSoundKey, 1);
            SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueCharge1.mp3", 1003);
          } else {
            SaveInteger(Globals.genericSpellHashtable, casterId, gojoBlueSoundKey, 2);
            SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueCharge2.mp3", 1233);
          }
        } else {
          SoundHelper.playNSoundsWithDelay(
            caster,
            gojoPurpleSoundStrings, 
            gojoPurpleSoundDur,
            200,
          );
          SaveInteger(Globals.genericSpellHashtable, casterId, gojoBlueSoundKey, 3);
        }
      }

      sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoBlueCasterSfxKey
      );
      BlzSetSpecialEffectPosition(sfx, 
        casterX, casterY,
        GetLocationZ(Globals.tmpLoc) + 150,
      );

      MoveLocation(
        Globals.tmpLoc, 
        Globals.tmpVector3.x,
        Globals.tmpVector3.y,
      );
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoBlueTargetSfxKey
      );
      BlzSetSpecialEffectPosition(sfx, 
        Globals.tmpVector3.x,
        Globals.tmpVector3.y,
        GetLocationZ(Globals.tmpLoc) + 100,
      );

      // fully charged sfx
      if (blueChargeTicks == blueMaxChargeTicks-1) {
        const sfxName = player == GetLocalPlayer() ? 
          "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl" :
          "dummy.mdl"
        ;
        DestroyEffect(AddSpecialEffect(
          sfxName, 
          Globals.tmpVector3.x,
          Globals.tmpVector3.y,
        ));
        TextTagHelper.showPlayerColorTextOnUnit(
          "Maximum Cursed Energy Output: Blue", playerId, caster
        );
        if (!isPurpleCharge) {
          SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueChargeMax.mp3", 1245);
        }
      }
    }

    if (blueChargeTicks < blueMaxChargeTicks) {
      SaveInteger(Globals.genericSpellHashtable,
        casterId, gojoBlueChargeTicksKey, blueChargeTicks+1
      );
      BlzSetSpecialEffectAlpha(sfx, Math.ceil(
        minSfxAlpha + (255-minSfxAlpha) 
        * blueChargeTicks / blueMaxChargeTicks
      ));
    } else {
      UnitHelper.payMPPercentCost(caster, mpHealPct, UNIT_STATE_MAX_MANA);
    }

    AOEKnockback.genericDoKnockback(
      Globals.tmpUnitGroup,
      caster,
      casterX,
      casterY,
      400,
      180,
      blueChargeTicks <= blueMaxChargeTicks ? 5 : 15,
    );
  }

  export function gojoBlueBeamLoop() {
    const blueBonusDmgMult = 2;
    const blueAOE = 400;
    const blueBeamSpeed = 30;
    const blueKBRelativeSpeed = 15;
    const blueChargeToKBRatio = 0.5;
    // const blueBeamMaxMoveTicks = 40;
    const blueBeamMaxExistTicks = 166;
    const blueBeamHpMult = BASE_DMG.KAME_DPS * 0.8;
    const blueBeamDuration = 15;
    const blueMaxChargeTicks = 133;
    const sfxBaseHeight = 150;
    const beamMinHp = 150;
    
    const gojoBlueCasterTimerKey = StringHash("gojo_q_caster");
    const gojoBlueBeamSfxKey = StringHash("gojo_q_beam_sfx");
    const gojoBlueBeamSfx2Key = StringHash("gojo_q_beam_sfx_2");
    const gojoBlueBeamTicksKey = StringHash("gojo_q_beam_ticks");
    const gojoBlueShootTicksKey = StringHash("gojo_q_shoot_ticks");
    const gojoQXKey = StringHash("gojo_q_x");
    const gojoQYKey = StringHash("gojo_q_y");
    const gojoBlueBeamKey = StringHash("gojo_q_beam");
    const gojoBlueBeamHpKey = StringHash("gojo_q_beam_hp");
    const gojoBlueCollideKey = StringHash("gojo_q_collide");
    const gojoBlueDmgGroupKey = StringHash("gojo_q_dmg_group");
    const gojoBlueSoundKey = StringHash("gojo_q_sound");
    
    const gojoSixEyesActiveKey = StringHash("gojo_d_active");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, 
      timerId, gojoBlueCasterTimerKey
    );
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const heroLvl = GetHeroLevel(caster);
    const blueLvl = Math.min(10, 1 + heroLvl / 3);

    const blueBeamTicks = LoadInteger(Globals.genericSpellHashtable, 
      timerId, gojoBlueBeamTicksKey
    );
    SaveInteger(Globals.genericSpellHashtable,
      timerId, gojoBlueBeamTicksKey, blueBeamTicks + 1
    );
    const shootTicks = LoadInteger(Globals.genericSpellHashtable, timerId, gojoBlueShootTicksKey);
    const shootTicksRatio = (shootTicks / blueMaxChargeTicks);
    const bonusDmgMult = 1 + blueBonusDmgMult * shootTicksRatio;

    let hasCollided = LoadBoolean(Globals.genericSpellHashtable, timerId, gojoBlueCollideKey);
    const targetX = LoadReal(Globals.genericSpellHashtable, 
      hasCollided ? timerId : casterId, gojoQXKey
    );
    const targetY = LoadReal(Globals.genericSpellHashtable, 
      hasCollided ? timerId : casterId, gojoQYKey
    );
    const isSixEyes = LoadBoolean(Globals.genericSpellHashtable, 
      casterId, gojoSixEyesActiveKey
    );

    let beam = null;
    let dmgGroup = null;
    let oldHp = 0;
    let sfx = null;
    let sfx2 = null;
    let sfx3 = null;
    let hasMoved = false;
    if (blueBeamTicks == 0) {
      // position beam
      Globals.tmpVector.setUnit(caster);
      Globals.tmpVector2.setPos(targetX, targetY);
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, blueBeamSpeed * 2);

      beam = CreateUnit(
        player, 
        Constants.dummyBeamUnitId, 
        Globals.tmpVector.x, Globals.tmpVector.y, ang,
      );
      BlzSetUnitName(beam, "Cursed Technique Lapse: Blue");

      const maxHp = BeamComponent.calculateBeamHp(
        blueLvl, blueBeamHpMult, caster, bj_HEROSTAT_INT
      );
      BlzSetUnitMaxHP(beam, Math.max(beamMinHp, maxHp));
      SetUnitLifePercentBJ(beam, 100);
      SetUnitMoveSpeed(beam, 0);
      UnitRemoveAbility(beam, Id.attack);
      SaveUnitHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamKey, beam);
      oldHp = GetUnitState(beam, UNIT_STATE_LIFE);
      SaveReal(Globals.genericSpellHashtable, timerId, gojoBlueBeamHpKey, oldHp);

      sfx = AddSpecialEffect("Soul Armor Azure.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx, 4.0);
      BlzSetSpecialEffectTimeScale(sfx, 2.0);
      // BlzSetSpecialEffectColor(sfx, 125, 205, 255);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfxKey, sfx);
      
      sfx2 = AddSpecialEffect("SpiritBomb.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx2, 1.75);
      // BlzSetSpecialEffectTimeScale(sfx2, 2.0);
      BlzSetSpecialEffectColor(sfx2, 125, 205, 255);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfx2Key, sfx2);
      
      dmgGroup = CreateGroup();
      SaveGroupHandle(Globals.genericSpellHashtable, timerId, gojoBlueDmgGroupKey, dmgGroup);
      
      const blueFireSound = LoadInteger(Globals.genericSpellHashtable, casterId, gojoBlueSoundKey);
      if (blueFireSound == 0) {
        // didnt have time to charge
        SoundHelper.playTwoSoundsWithDelay(caster,
          "Audio/Voice/Gojo/BlueCharge1.mp3", 1003, 1.2,
          "Audio/Voice/Gojo/BlueFire1.mp3", 330
        );
      } else if (blueFireSound == 1) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueFire1.mp3", 330);
      } else if (blueFireSound == 2) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueFire2.mp3", 564);
      } else if (blueFireSound == 3) {
        // only reaches here if six eyes is off
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/BlueFire1.mp3", 330);
      }
      SaveInteger(Globals.genericSpellHashtable, casterId, gojoBlueSoundKey, 0);
    } else {
      beam = LoadUnitHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamKey);
      oldHp = LoadReal(Globals.genericSpellHashtable, timerId, gojoBlueBeamHpKey);
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfxKey);
      sfx2 = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfx2Key);
      dmgGroup = LoadGroupHandle(Globals.genericSpellHashtable, timerId, gojoBlueDmgGroupKey);
    }

    Globals.tmpVector.setUnit(beam);
    Globals.tmpVector2.setPos(targetX, targetY);
    const newHp = GetUnitState(beam, UNIT_STATE_LIFE);
    if (newHp >= oldHp) {
      const distToTarget = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
      if (distToTarget > 1) {
        const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
        Globals.tmpVector.polarProjectCoords(
          Globals.tmpVector, ang, Math.min(distToTarget, blueBeamSpeed)
        );
        hasMoved = PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector);
      }
    }
    if (hasCollided && !isSixEyes) {
      // unstable collision
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector,
        Math.random() * 360, 0.4 * Math.random() * blueBeamSpeed
      );
      PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector);
      hasMoved = false;
    }
    SaveReal(Globals.genericSpellHashtable, timerId, gojoBlueBeamHpKey, newHp);

    Globals.tmpVector.setUnit(beam);
    BlzSetSpecialEffectPosition(
      sfx, Globals.tmpVector.x, Globals.tmpVector.y, 
      sfxBaseHeight + BlzGetUnitZ(beam) + GetUnitFlyHeight(beam)
    );
    BlzSetSpecialEffectPosition(
      sfx2, Globals.tmpVector.x, Globals.tmpVector.y, 
      sfxBaseHeight + BlzGetUnitZ(beam) + GetUnitFlyHeight(beam)
    );

    const pullSpeedRatio = (1-blueChargeToKBRatio) + blueChargeToKBRatio * shootTicksRatio;
    const pullSpeed = hasCollided ? 
      gojoPurpleKBRelativeSpeed : 
      (hasMoved ?
        blueKBRelativeSpeed * pullSpeedRatio + blueBeamSpeed :
        blueKBRelativeSpeed * pullSpeedRatio
      )
    ;
    

    if (!hasCollided) {
      // suck enemies in
      AOEKnockback.genericDoKnockback(
        Globals.tmpUnitGroup,
        caster,
        Globals.tmpVector.x,
        Globals.tmpVector.y,
        blueAOE,
        180,
        pullSpeed
      );
  
      const burstDmg = AOEDamage.calculateDamageRaw(
        caster,
        blueLvl,
        ch.spellPower,
        gojoBlueBurstDmgDataMult,
        bonusDmgMult,
        bj_HEROSTAT_INT,
      );
      const dpsDmg = AOEDamage.calculateDamageRaw(
        caster,
        blueLvl,
        ch.spellPower,
        gojoBlueDPSDmgDataMult,
        bonusDmgMult,
        bj_HEROSTAT_INT,
      );

      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (unit == beam) return;
        if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
          if (!IsUnitInGroup(unit, dmgGroup)) {
            // burst dmg
            UnitDamageTarget(
              caster, unit, burstDmg, false, false,
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
              WEAPON_TYPE_WHOKNOWS,
            );
            GroupAddUnit(dmgGroup, unit);
          } else {
            // dps
            UnitDamageTarget(
              caster, unit, dpsDmg, false, false,
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
              WEAPON_TYPE_WHOKNOWS,
            );
          }
        }
        
        if (!hasCollided && gojoIsPurpleCollision(unit, beam, caster, player)) {
          hasCollided = true;
          SaveBoolean(Globals.genericSpellHashtable, timerId, gojoBlueCollideKey, true);
          // send special signal to red that it has collided
          SaveBoolean(Globals.genericSpellHashtable, casterId, gojoBlueCollideKey, true);
          // fix target loc
          SaveReal(Globals.genericSpellHashtable, timerId, gojoQXKey, GetUnitX(beam));
          SaveReal(Globals.genericSpellHashtable, timerId, gojoQYKey, GetUnitY(beam));
          // allow burst damage again
          GroupClear(dmgGroup);
          // hakai properties
          SetUnitInvulnerable(beam, true);
          // force earlier end
          SaveInteger(Globals.genericSpellHashtable,
            timerId, gojoBlueBeamTicksKey, 
            Math.max(
              blueBeamTicks, 
              blueBeamMaxExistTicks - gojoPurpleBeamExistTicks
            )
          );

          TextTagHelper.showPlayerColorTextOnUnit(
            isSixEyes ? 
              "Hollow Technique: Purple" :
              "Hollow Technique: Purple (Unstable)"
            , playerId, beam
          );
          
          sfx3 = AddSpecialEffect("Flamestrike Mystic II.mdl", 
            Globals.tmpVector.x, Globals.tmpVector.y,
          );
          BlzSetSpecialEffectScale(sfx3, 2.5);
          DestroyEffect(sfx3);
          
          DestroyEffect(sfx);
          sfx = AddSpecialEffect("Void Disc.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx, 2.0);
          BlzSetSpecialEffectTimeScale(sfx, 2.5);
          SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfxKey, sfx);
        
          DestroyEffect(sfx2);
          sfx2 = AddSpecialEffect("GojoHollowPurple.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
          BlzSetSpecialEffectScale(sfx2, 4);
          BlzSetSpecialEffectTimeScale(sfx2, 1.5);
          SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoBlueBeamSfx2Key, sfx2);
          
          SetPlayerAbilityAvailable(player, Id.gojoPurpleActive, true);
          SetPlayerAbilityAvailable(player, Id.gojoPurplePassive, false);
          startCooldown(caster, Id.gojoPurpleActive);

          SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/Purple1.mp3", 1638);
        }
      });
    }

    // clash with red then convert blue into dealing purple dps, also stop moving
    if (hasCollided) {
      AOEKnockback.genericDoKnockback(
        Globals.tmpUnitGroup,
        caster,
        Globals.tmpVector.x,
        Globals.tmpVector.y,
        gojoPurpleAOE,
        180,
        pullSpeed
      );
      
      const dmgMult = isSixEyes ? 
        bonusDmgMult * gojoPurpleBlueDmgMult : 
        bonusDmgMult * gojoPurpleBlueLesserDmgMult
      ;

      // deal blue dmg + hakai
      const burstDmg = AOEDamage.calculateDamageRaw(
        caster,
        10,
        ch.spellPower,
        gojoBlueBurstDmgDataMult,
        dmgMult,
        bj_HEROSTAT_INT,
      );
      const dpsDmg = AOEDamage.calculateDamageRaw(
        caster,
        10,
        ch.spellPower,
        gojoBlueDPSDmgDataMult + gojoRedDPSDmgDataMult,
        dmgMult,
        bj_HEROSTAT_INT,
      );

      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
          if (UnitHelper.isUnitHakaiInstantDestroyable(unit, player)) {
            UnitHelper.dealHakaiDamage(caster, unit);
            if (GetUnitTypeId(unit) == Constants.dummyBeamUnitId) {
              const dmgSfx = AddSpecialEffect(
                "PurpleSlam.mdl", GetUnitX(unit), GetUnitY(unit)
              );
              BlzSetSpecialEffectScale(dmgSfx, 2.0);
              DestroyEffect(dmgSfx);
            }
            return;
          }

          if (!IsUnitInGroup(unit, dmgGroup)) {
            // burst dmg
            UnitDamageTarget(
              caster, unit, burstDmg, false, false,
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
              WEAPON_TYPE_WHOKNOWS,
            );
            GroupAddUnit(dmgGroup, unit);
          } else {
            // dps
            UnitDamageTarget(
              caster, unit, dpsDmg, false, false,
              ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
              WEAPON_TYPE_WHOKNOWS,
            );
          }
        }
      });

      if (blueBeamTicks % 8 == 0) {
        DestroyEffect(AddSpecialEffect(
          "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl",
          Globals.tmpVector.x, Globals.tmpVector.y,
        ));
        DestroyEffect(AddSpecialEffect(
          "GEHLightningOrb.mdl",
          Globals.tmpVector.x, Globals.tmpVector.y,
        ));
      }

      if (!isSixEyes) {
        UnitHelper.payMPPercentCost(
          caster, gojoPurpleLesserMPCostPct, UNIT_STATE_MAX_MANA
        );
      }
    }

    if (
      !UnitHelper.isUnitAlive(beam) 
      || blueBeamTicks >= blueBeamMaxExistTicks
    ) {
      sfx3 = AddSpecialEffect(
        hasCollided ? 
          "Flamestrike Dark Void II.mdl" : 
          "Flamestrike Mystic II.mdl", 
        Globals.tmpVector.x, Globals.tmpVector.y,
      );
      BlzSetSpecialEffectScale(sfx3, 2.5);
      DestroyEffect(sfx3);

      if (hasCollided) {
        sfx3 = AddSpecialEffect("SuperLightningBall.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfx3, 3.0);
        BlzSetSpecialEffectTimeScale(sfx3, 2.0);
        DestroyEffect(sfx3);
      }

      RemoveUnit(beam);
      DestroyEffect(sfx);
      DestroyEffect(sfx2);
      DestroyGroup(dmgGroup);
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      DestroyTimer(timer);
      return;
    }
  }
  
  export function gojoRedChargeLoop() {
    const hpHealPct = -1 * 0.03 * 0.01;
    const redMaxChargeTicks = 133;
    const minSfxAlpha = 100;

    const gojoRedCasterTimerKey = StringHash("gojo_w_caster");
    const gojoRedChargeTicksKey = StringHash("gojo_w_charge_ticks");
    const gojoRedChargeFlagKey = StringHash("gojo_w_charge_flag");
    const gojoRedCasterSfxKey = StringHash("gojo_w_caster_sfx");
    const gojoRedTargetSfxKey = StringHash("gojo_w_target_sfx");
    const gojoRedSoundKey = StringHash("gojo_w_sound");

    const gojoBlueChargeTicksKey = StringHash("gojo_q_charge_ticks");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, 
      timerId, gojoRedCasterTimerKey
    );
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const casterX = GetUnitX(caster);
    const casterY = GetUnitY(caster);

    let sfx = null;

    const redChargeTicks = LoadInteger(Globals.genericSpellHashtable,
      casterId, gojoRedChargeTicksKey
    );
    if (redChargeTicks == 0) {
      if (LoadBoolean(Globals.genericSpellHashtable, 
        casterId, gojoRedChargeFlagKey
      )) {
        sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
          casterId, gojoRedCasterSfxKey
        );
        BlzSetSpecialEffectScale(sfx, 0.01);
        DestroyEffect(sfx);
        sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
          casterId, gojoRedTargetSfxKey
        );
        DestroyEffect(sfx);
      }
      SaveBoolean(Globals.genericSpellHashtable, 
        casterId, gojoRedChargeFlagKey, false
      );

      DestroyTimer(timer);
      return;
    }

    const blueChargeTicks = LoadInteger(Globals.genericSpellHashtable, casterId, gojoBlueChargeTicksKey);
    const isPurpleCharge = (blueChargeTicks > 0
      && GetUnitAbilityLevel(caster, Id.gojoPurpleActive) > 0
      && BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoPurpleActive) == 0
    );

    Globals.tmpVector3.setPos(
      Globals.customPlayers[playerId].mouseData.x,
      Globals.customPlayers[playerId].mouseData.y
    );

    if (redChargeTicks == 1) {
      SaveBoolean(Globals.genericSpellHashtable, 
        casterId, gojoRedChargeFlagKey, true
      );

      sfx = AddSpecialEffect(
        "GranRayFXbyDeckai.mdl",
        casterX, casterY,
      );
      BlzSetSpecialEffectScale(sfx, 1.5);
      BlzSetSpecialEffectColor(sfx, 255, 255, 255);
      SaveEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoRedCasterSfxKey, sfx
      );

      const sfxName = player == GetLocalPlayer() ? 
        "Spell_Marker_Red.mdl" 
        : "dummy.mdl"
      ;
      sfx = AddSpecialEffect(
        sfxName,
        Globals.tmpVector3.x,
        Globals.tmpVector3.y
      );
      BlzSetSpecialEffectScale(sfx, 2.0);
      SaveEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoRedTargetSfxKey, sfx
      );

    } else {
      if (redChargeTicks == gojoVoiceTick) {
        if (isPurpleCharge) {
          // purple dont say anything, blue will
          SaveInteger(Globals.genericSpellHashtable, casterId, gojoRedSoundKey, 3);
        } else {
          if (Math.random() * 100 < 33) {
            SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedCharge1.mp3", 1267);
            SaveInteger(Globals.genericSpellHashtable, casterId, gojoRedSoundKey, 1);
          } else {
            SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedCharge2.mp3", 1015);
            SaveInteger(Globals.genericSpellHashtable, casterId, gojoRedSoundKey, 2);
          }
        }
      }

      sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoRedCasterSfxKey
      );
      BlzSetSpecialEffectPosition(sfx, 
        casterX, casterY,
        GetLocationZ(Globals.tmpLoc) + 150,
      );

      MoveLocation(
        Globals.tmpLoc, 
        Globals.tmpVector3.x,
        Globals.tmpVector3.y,
      );
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, 
        casterId, gojoRedTargetSfxKey
      );
      BlzSetSpecialEffectPosition(sfx, 
        Globals.tmpVector3.x,
        Globals.tmpVector3.y,
        GetLocationZ(Globals.tmpLoc) + 100,
      );

      // fully charged sfx
      if (redChargeTicks == redMaxChargeTicks-1) {
        const sfxName = player == GetLocalPlayer() ? 
          "Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl" :
          "dummy.mdl"
        ;
        DestroyEffect(AddSpecialEffect(
          sfxName, 
          Globals.tmpVector3.x,
          Globals.tmpVector3.y,
        ));
        TextTagHelper.showPlayerColorTextOnUnit(
          "Maximum Cursed Energy Reversal: Red", playerId, caster
        );

        if (!isPurpleCharge) {
          SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedOutOfTheWay.mp3", 625);
        }
      }
    }

    if (redChargeTicks < redMaxChargeTicks) {
      SaveInteger(Globals.genericSpellHashtable,
        casterId, gojoRedChargeTicksKey, redChargeTicks+1
      );
      BlzSetSpecialEffectAlpha(sfx, Math.ceil(
        minSfxAlpha + (255-minSfxAlpha) 
        * redChargeTicks / redMaxChargeTicks
      ));
    } else {
      UnitHelper.payHPPercentCost(caster, hpHealPct, UNIT_STATE_MAX_LIFE);
    }

    AOEKnockback.genericDoKnockback(
      Globals.tmpUnitGroup,
      caster,
      casterX,
      casterY,
      400,
      0,
      redChargeTicks <= redMaxChargeTicks ? 5 : 15,
    );
  }

  export function gojoRedBeamLoop() {
    const redBonusDmgMult = 2;
    const dmgAOE = 375;
    const kbAOE = 250;
    const redBeamSpeed = 35;
    const redKBRelativeSpeed = 15;
    const redKBDetoSpeed = 250;
    // const redBeamMaxMoveTicks = 40;
    const redBeamSpawnTick = 16;
    const redBeamMaxExistTicks = 66 + redBeamSpawnTick;
    const redBeamHpMult = BASE_DMG.KAME_DPS * 1.1;
    const redMaxChargeTicks = 133;
    const sfxBaseHeight = 150;
    const beamMinHp = 1000;
    
    const gojoRedCasterTimerKey = StringHash("gojo_w_caster");
    const gojoRedBeamSfxKey = StringHash("gojo_w_beam_sfx");
    const gojoRedBeamSfx2Key = StringHash("gojo_w_beam_sfx_2");
    const gojoRedBeamTicksKey = StringHash("gojo_w_beam_ticks");
    const gojoRedShootTicksKey = StringHash("gojo_w_shoot_ticks");
    const gojoQXKey = StringHash("gojo_w_x");
    const gojoQYKey = StringHash("gojo_w_y");
    const gojoRedBeamKey = StringHash("gojo_w_beam");
    const gojoRedBeamHpKey = StringHash("gojo_w_beam_hp");
    const gojoRedCollideKey = StringHash("gojo_w_collide");
    const gojoRedDmgGroupKey = StringHash("gojo_w_dmg_group");
    const gojoRedSoundKey = StringHash("gojo_w_sound");
    
    const gojoBlueCollideKey = StringHash("gojo_q_collide");

    const gojoSixEyesActiveKey = StringHash("gojo_d_active");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, 
      timerId, gojoRedCasterTimerKey
    );
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const heroLvl = GetHeroLevel(caster);
    const abilLvl = Math.min(10, 1 + (heroLvl - 25) / 3);

    let sfx = null;
    let sfx2 = null;

    let redBeamTicks = LoadInteger(Globals.genericSpellHashtable, 
      timerId, gojoRedBeamTicksKey
    );
    SaveInteger(Globals.genericSpellHashtable,
      timerId, gojoRedBeamTicksKey, redBeamTicks + 1
    );

    const shootTicks = LoadInteger(Globals.genericSpellHashtable, timerId, gojoRedShootTicksKey);
    const bonusDmgMult = 1 + redBonusDmgMult * (shootTicks / redMaxChargeTicks);

    const targetX = LoadReal(Globals.genericSpellHashtable, casterId, gojoQXKey);
    const targetY = LoadReal(Globals.genericSpellHashtable, casterId, gojoQYKey);

    const isSixEyes = LoadBoolean(Globals.genericSpellHashtable, 
      casterId, gojoSixEyesActiveKey
    );

    const hasCollided = LoadBoolean(Globals.genericSpellHashtable, timerId, gojoRedCollideKey);
    let beam = null;
    let dmgGroup = null;
    let oldHp = 0;
    let hasMoved = false;

    // delay beam spawning in
    if (redBeamTicks == 0) {
      Globals.tmpVector.setUnit(caster);
      Globals.tmpVector2.setPos(targetX, targetY);
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(
        Globals.tmpVector, ang, redBeamSpeed * 2
      );
      sfx = AddSpecialEffect("Flamestrike I.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx, 2); 
      BlzSetSpecialEffectTimeScale(sfx, 1.2);
      BlzSetSpecialEffectHeight(sfx, BlzGetUnitZ(caster) + GetUnitFlyHeight(caster) + 125);
      BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
      BlzSetSpecialEffectPitch(sfx, 90 * CoordMath.degreesToRadians);
      DestroyEffect(sfx);

      const redFireSound = LoadInteger(Globals.genericSpellHashtable, casterId, gojoRedSoundKey);
      if (redFireSound == 0) {
        // didnt have time to charge
        SoundHelper.playTwoSoundsWithDelay(caster,
          "Audio/Voice/Gojo/RedCharge2.mp3", 1015, 1.2,
          "Audio/Voice/Gojo/RedFire2.mp3", 329
        );
      } if (redFireSound == 1) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedFire1.mp3", 415);
      } else if (redFireSound == 2) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedFire2.mp3", 329);
      } else if (redFireSound == 3) {
        // only reaches here if six eyes is off
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/RedFire2.mp3", 329);
      }
      SaveInteger(Globals.genericSpellHashtable, casterId, gojoRedSoundKey, 0);
    }
    if (redBeamTicks < redBeamSpawnTick) return;
    if (redBeamTicks == redBeamSpawnTick) {
      // position beam
      Globals.tmpVector.setUnit(caster);
      Globals.tmpVector2.setPos(targetX, targetY);
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, redBeamSpeed * 2);

      beam = CreateUnit(
        player, 
        Constants.dummyBeamUnitId, 
        Globals.tmpVector.x, Globals.tmpVector.y, ang,
      );
      BlzSetUnitName(beam, "Cursed Technique Reversal: Red");

      const maxHp = BeamComponent.calculateBeamHp(
        abilLvl, redBeamHpMult, caster, bj_HEROSTAT_INT
      );
      BlzSetUnitMaxHP(beam, Math.max(beamMinHp, maxHp));
      SetUnitLifePercentBJ(beam, 100);
      SetUnitMoveSpeed(beam, 0);
      UnitRemoveAbility(beam, Id.attack);
      SaveUnitHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamKey, beam);
      oldHp = GetUnitState(beam, UNIT_STATE_LIFE);
      SaveReal(Globals.genericSpellHashtable, timerId, gojoRedBeamHpKey, oldHp);

      sfx = AddSpecialEffect("Soul Armor Crimson.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectTimeScale(sfx, 2.0);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamSfxKey, sfx);

      sfx2 = AddSpecialEffect("SpiritBomb.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx2, 0.4);
      BlzSetSpecialEffectColor(sfx2, 255, 55, 55);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamSfx2Key, sfx2);
      
      dmgGroup = CreateGroup();
      SaveGroupHandle(Globals.genericSpellHashtable, timerId, gojoRedDmgGroupKey, dmgGroup);
    } else {
      beam = LoadUnitHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamKey);
      oldHp = LoadReal(Globals.genericSpellHashtable, timerId, gojoRedBeamHpKey);
      sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamSfxKey);
      sfx2 = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoRedBeamSfx2Key);
      dmgGroup = LoadGroupHandle(Globals.genericSpellHashtable, timerId, gojoRedDmgGroupKey);
    }

    Globals.tmpVector.setUnit(beam);
    Globals.tmpVector2.setPos(targetX, targetY);
    const newHp = GetUnitState(beam, UNIT_STATE_LIFE);
    const distToTarget = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    if (newHp >= oldHp && distToTarget > 1) {
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(
        Globals.tmpVector, ang, Math.min(distToTarget, redBeamSpeed)
      );
      hasMoved = PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector);
    }
    SaveReal(Globals.genericSpellHashtable, timerId, gojoRedBeamHpKey, newHp);

    Globals.tmpVector.setUnit(beam);
    BlzSetSpecialEffectPosition(
      sfx, Globals.tmpVector.x, Globals.tmpVector.y, 
      sfxBaseHeight + BlzGetUnitZ(beam) + GetUnitFlyHeight(beam)
    );
    BlzSetSpecialEffectPosition(
      sfx2, Globals.tmpVector.x, Globals.tmpVector.y, 
      sfxBaseHeight + BlzGetUnitZ(beam) + GetUnitFlyHeight(beam)
    );

    if (redBeamTicks % 8 == 0) {
      DestroyEffect(AddSpecialEffect(
        "Abilities/Spells/Orc/WarStomp/WarStompCaster.mdl", 
        Globals.tmpVector.x, Globals.tmpVector.y,
      ));
    }

    // suck enemies in
    AOEKnockback.genericDoKnockback(
      Globals.tmpUnitGroup,
      caster,
      Globals.tmpVector.x,
      Globals.tmpVector.y,
      kbAOE,
      180,
      hasMoved ? redKBRelativeSpeed + redBeamSpeed : redKBRelativeSpeed
    );

    const dpsDmg = AOEDamage.calculateDamageRaw(
      caster,
      abilLvl,
      ch.spellPower,
      gojoRedDPSDmgDataMult,
      bonusDmgMult,
      bj_HEROSTAT_INT,
    );
    GroupEnumUnitsInRange(Globals.tmpUnitGroup, 
      Globals.tmpVector.x,
      Globals.tmpVector.y,
      dmgAOE,
      null
    );
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (beam == unit) return;
      if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
        UnitDamageTarget(
          caster, unit, dpsDmg,
          false, false,
          ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
          WEAPON_TYPE_WHOKNOWS
        );
      }
    });

    // blue collided
    const hasBlueCollided = LoadBoolean(Globals.genericSpellHashtable, casterId, gojoBlueCollideKey);
    if (!hasCollided && hasBlueCollided) {
      SaveBoolean(Globals.genericSpellHashtable, casterId, gojoBlueCollideKey, false);
      SaveBoolean(Globals.genericSpellHashtable, timerId, gojoRedCollideKey, true);
      SaveInteger(Globals.genericSpellHashtable,
        timerId, gojoRedBeamTicksKey, redBeamMaxExistTicks - 3
      );
    }

    if (!hasCollided && distToTarget <= redBeamSpeed) {
      // detonate
      redBeamTicks = redBeamMaxExistTicks;
    }

    if (
      !UnitHelper.isUnitAlive(beam) 
      || redBeamTicks >= redBeamMaxExistTicks
    ) {
      // dmg enemies
      AOEDamage.genericDealDamageToGroup(
        Globals.tmpUnitGroup,
        caster,
        abilLvl,
        ch.spellPower,
        gojoRedBurstDmgDataMult,
        hasCollided ? 
          (isSixEyes ? 
            bonusDmgMult * gojoPurpleRedDmgMult :
            bonusDmgMult * gojoPurpleRedLesserDmgMult
          ) :
          bonusDmgMult,
        bj_HEROSTAT_INT,
      );

      // knock enemies away
      if (!hasCollided) {
        AOEKnockback.genericDoKnockbackToGroup(
          Globals.tmpUnitGroup,
          caster,
          Globals.tmpVector.x,
          Globals.tmpVector.y,
          0,
          redKBDetoSpeed,
        );
      }

      if (hasCollided) {
        let sfxDeto = AddSpecialEffect("Flamestrike Dark Void II.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfxDeto, 2);
        BlzSetSpecialEffectTimeScale(sfxDeto, 1.2);
        DestroyEffect(sfxDeto);

        sfxDeto = AddSpecialEffect(
          "Abilities/Spells/Demon/DemonBoltImpact/DemonBoltImpact.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfxDeto, 3);
        DestroyEffect(sfxDeto);
      } else {
        let sfxDeto = AddSpecialEffect("Firaga.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfxDeto, 3.0);
        BlzSetSpecialEffectTimeScale(sfxDeto, 2.0);
        DestroyEffect(sfxDeto);

        sfxDeto = AddSpecialEffect("Firaga.mdl", 
          Globals.tmpVector.x, Globals.tmpVector.y,
        );
        BlzSetSpecialEffectScale(sfxDeto, 2.0);
        DestroyEffect(sfxDeto);
      }


      RemoveUnit(beam);
      DestroyEffect(sfx);
      DestroyEffect(sfx2);
      DestroyGroup(dmgGroup);
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      DestroyTimer(timer);
      return;
    }
  }
  
  export function gojoPurpleBeamLoop() {
    const blueMaxBonusDmgMult = 2;
    const redMaxBonusDmgMult = 2;
    const purpleKBDetoSpeed = 350;
    // const blueBeamMaxMoveTicks = 40;
    const blueBeamHpMult = BASE_DMG.KAME_DPS * 2.5;
    const maxChargeTicks = 133;
    const sfxBaseHeight = 150;
    const beamMinHp = 1000;
    
    const gojoPurpleCasterTimerKey = StringHash("gojo_e_caster");
    const gojoPurpleBeamSfxKey = StringHash("gojo_e_beam_sfx");
    const gojoPurpleBeamSfx2Key = StringHash("gojo_e_beam_sfx_2");
    const gojoPurpleBeamSfx3Key = StringHash("gojo_e_beam_sfx_3");
    const gojoPurpleBeamSfx4Key = StringHash("gojo_e_beam_sfx_4");
    const gojoPurpleBeamTicksKey = StringHash("gojo_e_beam_ticks");
    const gojoBlueShootTicksKey = StringHash("gojo_q_shoot_ticks");
    const gojoRedShootTicksKey = StringHash("gojo_w_shoot_ticks");
    const gojoEXKey = StringHash("gojo_e_x");
    const gojoEYKey = StringHash("gojo_e_y");
    const gojoPurpleBeamKey = StringHash("gojo_e_beam");
    const gojoPurpleBeamHpKey = StringHash("gojo_e_beam_hp");
    const gojoPurpleDmgGroupKey = StringHash("gojo_e_dmg_group");
    const gojoPurpleStuckKey = StringHash("gojo_e_stuck");
    
    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, 
      timerId, gojoPurpleCasterTimerKey
    );
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);

    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const abilLvl = 10;

    let beamTicks = LoadInteger(Globals.genericSpellHashtable, 
      timerId, gojoPurpleBeamTicksKey
    );
    SaveInteger(Globals.genericSpellHashtable,
      timerId, gojoPurpleBeamTicksKey, beamTicks + 1
    );
    const blueShootTicks = LoadInteger(Globals.genericSpellHashtable, timerId, gojoBlueShootTicksKey);
    const redShootTicks = LoadInteger(Globals.genericSpellHashtable, timerId, gojoRedShootTicksKey);
    const blueBonusDmgMult = gojoPurpleBlueDmgMult * (1 + 
      blueMaxBonusDmgMult * (blueShootTicks / maxChargeTicks)
    );
    const redBonusDmgMult = gojoPurpleRedDmgMult * (1 + 
      redMaxBonusDmgMult * (redShootTicks / maxChargeTicks)
    );

    // fixed targetX and targetY
    const targetX = LoadReal(Globals.genericSpellHashtable, timerId, gojoEXKey);
    const targetY = LoadReal(Globals.genericSpellHashtable, timerId, gojoEYKey);
    const isStuck = LoadBoolean(Globals.genericSpellHashtable, timerId, gojoPurpleStuckKey);

    let beam = null;
    let dmgGroup = null;
    let oldHp = 0;
    let sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfxKey);
    let sfx2 = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx2Key);
    let sfx3 = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx3Key);
    let sfx4 = LoadEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx4Key);
    let hasMoved = false;
    if (beamTicks == 0) {
      // position beam
      Globals.tmpVector.setUnit(caster);
      Globals.tmpVector2.setPos(targetX, targetY);
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, gojoPurpleBeamSpeed * 2);

      beam = CreateUnit(
        player, 
        Constants.dummyBeamUnitId, 
        Globals.tmpVector.x, Globals.tmpVector.y, ang,
      );
      BlzSetUnitName(beam, "Hollow Technique: Purple");

      const maxHp = BeamComponent.calculateBeamHp(
        abilLvl, blueBeamHpMult, caster, bj_HEROSTAT_INT
      );
      BlzSetUnitMaxHP(beam, Math.max(beamMinHp, maxHp));
      SetUnitLifePercentBJ(beam, 100);
      SetUnitMoveSpeed(beam, 0);
      UnitRemoveAbility(beam, Id.attack);
      SetUnitInvulnerable(beam, true);

      SaveUnitHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamKey, beam);
      oldHp = GetUnitState(beam, UNIT_STATE_LIFE);
      SaveReal(Globals.genericSpellHashtable, timerId, gojoPurpleBeamHpKey, oldHp);

      sfx = AddSpecialEffect("Void Disc.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx, 2.0);
      BlzSetSpecialEffectTimeScale(sfx, 2.5);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfxKey, sfx);

      sfx2 = AddSpecialEffect("SpiritBomb.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx2, 4.0);
      BlzSetSpecialEffectColor(sfx2, 255, 55, 255);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx2Key, sfx2);
      
      sfx3 = AddSpecialEffect("Radiance_Psionic.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx3, 8.0);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx3Key, sfx3);
      
      sfx4 = AddSpecialEffect("GojoHollowPurple.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
      BlzSetSpecialEffectScale(sfx4, 4);
      BlzSetSpecialEffectTimeScale(sfx4, 1.5);
      SaveEffectHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamSfx4Key, sfx4);
      
      dmgGroup = CreateGroup();
      SaveGroupHandle(Globals.genericSpellHashtable, timerId, gojoPurpleDmgGroupKey, dmgGroup);
      
      SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/Purple1.mp3", 1638);
    } else {
      beam = LoadUnitHandle(Globals.genericSpellHashtable, timerId, gojoPurpleBeamKey);
      oldHp = LoadReal(Globals.genericSpellHashtable, timerId, gojoPurpleBeamHpKey);
      dmgGroup = LoadGroupHandle(Globals.genericSpellHashtable, timerId, gojoPurpleDmgGroupKey);
    }
    const beamHeight = BlzGetUnitZ(beam) + GetUnitFlyHeight(beam);

    Globals.tmpVector.setUnit(beam);
    Globals.tmpVector2.setPos(targetX, targetY);
    const newHp = GetUnitState(beam, UNIT_STATE_LIFE);
    const distToTarget = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
    if (newHp >= oldHp && distToTarget > 1 && !isStuck) {
      const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
      Globals.tmpVector.polarProjectCoords(
        Globals.tmpVector, ang, Math.min(distToTarget, gojoPurpleBeamSpeed)
      );
      hasMoved = PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(beam, Globals.tmpVector);
    }
    SaveReal(Globals.genericSpellHashtable, timerId, gojoPurpleBeamHpKey, newHp);

    Globals.tmpVector.setUnit(beam);
    BlzSetSpecialEffectPosition(
      sfx, Globals.tmpVector.x, Globals.tmpVector.y, sfxBaseHeight + beamHeight
    );
    BlzSetSpecialEffectPosition(
      sfx2, Globals.tmpVector.x, Globals.tmpVector.y, sfxBaseHeight + beamHeight
    );
    BlzSetSpecialEffectPosition(
      sfx3, Globals.tmpVector.x, Globals.tmpVector.y, sfxBaseHeight + beamHeight
    );
    BlzSetSpecialEffectPosition(
      sfx4, Globals.tmpVector.x, Globals.tmpVector.y, sfxBaseHeight + beamHeight
    );

    if (beamTicks % 4 == 0) {
      let tmpSfx = AddSpecialEffect(
        "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl",
        Globals.tmpVector.x, Globals.tmpVector.y,
      );
      BlzSetSpecialEffectZ(tmpSfx, sfxBaseHeight + beamHeight);
      DestroyEffect(tmpSfx);
      
      tmpSfx = AddSpecialEffect(
        "GEHLightningOrb.mdl",
        Globals.tmpVector.x, Globals.tmpVector.y,
      );
      BlzSetSpecialEffectZ(tmpSfx, sfxBaseHeight + beamHeight);
      DestroyEffect(tmpSfx);
    }

    // suck enemies in
    AOEKnockback.genericDoKnockback(
      Globals.tmpUnitGroup,
      caster,
      Globals.tmpVector.x,
      Globals.tmpVector.y,
      gojoPurpleAOE,
      180,
      hasMoved ? 
        gojoPurpleKBRelativeSpeed + gojoPurpleBeamSpeed + 5: 
        gojoPurpleKBRelativeSpeed
    );

    // deal blue dmg + hakai
    // double the burst damage because normal blue can trigger twice
    const burstDmg = 2 * AOEDamage.calculateDamageRaw(
      caster,
      abilLvl,
      ch.spellPower,
      gojoBlueBurstDmgDataMult,
      blueBonusDmgMult,
      bj_HEROSTAT_INT,
    );
    const dpsDmg = AOEDamage.calculateDamageRaw(
      caster,
      abilLvl,
      ch.spellPower,
      gojoBlueDPSDmgDataMult + gojoRedDPSDmgDataMult,
      blueBonusDmgMult,
      bj_HEROSTAT_INT,
    );

    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
        if (UnitHelper.isUnitHakaiInstantDestroyable(unit, player)) {
          UnitHelper.dealHakaiDamage(caster, unit);
          if (GetUnitTypeId(unit) == Constants.dummyBeamUnitId) {
            const dmgSfx = AddSpecialEffect(
              "PurpleSlam.mdl", GetUnitX(unit), GetUnitY(unit)
            );
            BlzSetSpecialEffectScale(dmgSfx, 2.0);
            DestroyEffect(dmgSfx);
          }
          return;
        }

        if (!IsUnitInGroup(unit, dmgGroup)) {
          // burst dmg
          UnitDamageTarget(
            caster, unit, burstDmg, false, false,
            ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
            WEAPON_TYPE_WHOKNOWS,
          );
          GroupAddUnit(dmgGroup, unit);
        } else {
          // dps
          UnitDamageTarget(
            caster, unit, dpsDmg, false, false,
            ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
            WEAPON_TYPE_WHOKNOWS,
          );
        }
      }
    });

    if (!isStuck && distToTarget <= gojoPurpleBeamSpeed) {
      // lock into position
      // beamTicks = gojoPurpleBeamExistTicks;
      SaveBoolean(Globals.genericSpellHashtable, timerId, gojoPurpleStuckKey, true);
    }
    
    if (
      !UnitHelper.isUnitAlive(beam) 
      || beamTicks >= gojoPurpleBeamExistTicks
    ) {
      // dmg enemies
      AOEDamage.genericDealDamageToGroup(
        Globals.tmpUnitGroup,
        caster,
        abilLvl,
        ch.spellPower,
        gojoRedBurstDmgDataMult,
        redBonusDmgMult,
        bj_HEROSTAT_INT,
      );

      // knock enemies away
      AOEKnockback.genericDoKnockbackToGroup(
        Globals.tmpUnitGroup,
        caster,
        Globals.tmpVector.x,
        Globals.tmpVector.y,
        0,
        purpleKBDetoSpeed,
      );

      let sfxDeto = AddSpecialEffect("SuperLightningBall.mdl", 
        Globals.tmpVector.x, Globals.tmpVector.y,
      );
      BlzSetSpecialEffectScale(sfxDeto, 3.0);
      BlzSetSpecialEffectTimeScale(sfxDeto, 2.0);
      DestroyEffect(sfxDeto);

      sfxDeto = AddSpecialEffect("Flamestrike Dark Void II.mdl", 
        Globals.tmpVector.x, Globals.tmpVector.y,
      );
      BlzSetSpecialEffectScale(sfxDeto, 2);
      BlzSetSpecialEffectTimeScale(sfxDeto, 1.2);
      DestroyEffect(sfxDeto);

      RemoveUnit(beam);
      DestroyEffect(sfx);
      DestroyEffect(sfx2);
      DestroyEffect(sfx3);
      DestroyEffect(sfx4);
      DestroyGroup(dmgGroup);
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      DestroyTimer(timer);
      return;
    }
  }

  export function gojoUnlimitedVoidLoop() {
    const mpCostPct = 0.03 * 0.02;
    const dmgAOE = 600;
    const endTick = 266;

    const gojoUnlimitedVoidCasterKey = StringHash("gojo_r_caster");
    const gojoUnlimitedVoidTicksKey = StringHash("gojo_r_ticks");
    const gojoUnlimitedVoidXKey = StringHash("gojo_r_x");
    const gojoUnlimitedVoidYKey = StringHash("gojo_r_y");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, gojoUnlimitedVoidCasterKey);
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);

    const ticks = LoadInteger(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidTicksKey);

    if (
      ticks > endTick 
      || UnitHelper.isUnitHardStunned(caster)
      || !UnitHelper.isUnitAlive(caster)
    ) {
      const playerId = GetPlayerId(player);
      const ch = Globals.customPlayers[playerId].getCustomHero(caster);
      if (ch) {
        const abil = ch.getAbility(AbilityNames.Gojo.UNLIMITED_VOID);
        if (abil && abil.isInUse()) abil.endAbility();
      }

      SaveInteger(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidTicksKey, 0);
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    }

    const voidX = LoadReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidXKey);
    const voidY = LoadReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidYKey);

    let hasCaster = false;
    Globals.tmpVector.setPos(voidX, voidY);
    GroupEnumUnitsInRange(Globals.tmpUnitGroup,
      Globals.tmpVector.x,
      Globals.tmpVector.y,
      dmgAOE,
      null
    );
    const dmg = mpCostPct * GetUnitState(caster, UNIT_STATE_MANA);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(unit, player)) {
        UnitDamageTarget(
          caster, unit, dmg,
          false, false,
          ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL,
          WEAPON_TYPE_WHOKNOWS
        );
      }
      if (unit == caster) hasCaster = true;
    });
    UnitHelper.payMPPercentCost(caster, mpCostPct, UNIT_STATE_MANA);

    SaveInteger(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidTicksKey, 
      hasCaster ? ticks+1 : endTick+1
    );
  }
  
  export function doGojoUnlimitedVoid(spellId: number) {
    const gojoUnlimitedVoidCasterKey = StringHash("gojo_r_caster");
    const gojoUnlimitedVoidTicksKey = StringHash("gojo_r_ticks");
    const gojoUnlimitedVoidXKey = StringHash("gojo_r_x");
    const gojoUnlimitedVoidYKey = StringHash("gojo_r_y");

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const timer = TimerManager.getInstance().get(); 
    const timerId = GetHandleId(timer);

    SaveUnitHandle(Globals.genericSpellHashtable, timerId, gojoUnlimitedVoidCasterKey, caster);
    SaveInteger(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidTicksKey, 1);
    SaveReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidXKey, GetUnitX(caster));
    SaveReal(Globals.genericSpellHashtable, casterId, gojoUnlimitedVoidYKey, GetUnitY(caster));
    TimerStart(timer, 0.03, true, gojoUnlimitedVoidLoop);
  }

  export function doGojoSixEyesOn(spellId: number) {
    const caster = GetTriggerUnit();
    toggleSixEyes(caster, spellId);
  }

  export function doGojoSixEyesOff(spellId: number) {
    const caster = GetTriggerUnit();
    toggleSixEyes(caster, spellId);
  }

  export function gojoSixEyesManaDrainLoop() {
    const manaCostPct = 0.04;

    const gojoSixEyesActiveKey = StringHash("gojo_d_active");
    const gojoSixEyesCasterKey = StringHash("gojo_d_caster");
    
    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);
    
    const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, gojoSixEyesCasterKey);
    const casterId = GetHandleId(caster);
    const isActive = LoadBoolean(Globals.genericSpellHashtable, casterId, gojoSixEyesActiveKey);

    if (
      GetUnitManaPercent(caster) < 1 
      || !UnitHelper.isUnitAlive(caster)
      || !isActive
    ) {
      if (isActive) {
        toggleSixEyes(caster, Id.gojoSixEyesOff);
      }
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    } else {
      UnitHelper.payMPPercentCost(caster, manaCostPct * 0.03, UNIT_STATE_MAX_MANA);
    }
  }

  export function toggleSixEyes(caster: unit, spellId: number) {
    const gojoSixEyesActiveKey = StringHash("gojo_d_active");
    const gojoSixEyesCasterKey = StringHash("gojo_d_caster");

    const player = GetOwningPlayer(caster);

    if (GetUnitAbilityLevel(caster, Id.gojoSixEyesOff) == 0) {
      UnitAddAbility(caster, Id.gojoSixEyesOff);
    }

    const casterId = GetHandleId(caster);
    if (spellId == Id.gojoSixEyesOn && GetUnitManaPercent(caster) > 4) {
      AddUnitAnimationProperties(caster, "alternate", false);
      UnitAddAbility(caster, Id.gojoSixEyesTrueSight);

      SetPlayerAbilityAvailable(player, Id.gojoUnlimitedVoid, true);
      SetPlayerAbilityAvailable(player, Id.gojoSixEyesOn, false);
      SetPlayerAbilityAvailable(player, Id.gojoSixEyesOff, true);

      BlzStartUnitAbilityCooldown(caster, Id.gojoSixEyesOff, 5);
      
      // drain mana
      const timer = TimerManager.getInstance().get();
      const timerId = GetHandleId(timer);
      SaveBoolean(Globals.genericSpellHashtable, casterId, gojoSixEyesActiveKey, true);
      SaveUnitHandle(Globals.genericSpellHashtable, timerId, gojoSixEyesCasterKey, caster);
      TimerStart(timer, 0.03, true, gojoSixEyesManaDrainLoop);

      // force lower cds if above
      let lowerCd = getCooldownDefault(caster, Id.gojoBlueActive);
      if (BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoBlueActive) > lowerCd) {
        BlzStartUnitAbilityCooldown(caster, Id.gojoBlueActive, lowerCd);
      }
      if (GetUnitTypeId(caster) == Id.gojo) {
        lowerCd = getCooldownDefault(caster, Id.gojoRedActive);
        if (BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoRedActive) > lowerCd) {
          BlzStartUnitAbilityCooldown(caster, Id.gojoRedActive, lowerCd);
        }
        lowerCd = getCooldownDefault(caster, Id.gojoPurpleActive);
        if (BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoPurpleActive) > lowerCd) {
          BlzStartUnitAbilityCooldown(caster, Id.gojoPurpleActive, lowerCd);
        }
        lowerCd = getCooldownDefault(caster, Id.gojoTeleport);
        if (BlzGetUnitAbilityCooldownRemaining(caster, Id.gojoTeleport) > lowerCd) {
          BlzStartUnitAbilityCooldown(caster, Id.gojoTeleport, lowerCd);
        }
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/SixEyes1.mp3", 918);
      }
    } else {
      AddUnitAnimationProperties(caster, "alternate", true);
      UnitRemoveAbility(caster, Id.gojoSixEyesTrueSight);

      SetPlayerAbilityAvailable(player, Id.gojoUnlimitedVoid, false);
      SetPlayerAbilityAvailable(player, Id.gojoSixEyesOn, true);
      SetPlayerAbilityAvailable(player, Id.gojoSixEyesOff, false);

      BlzStartUnitAbilityCooldown(caster, Id.gojoSixEyesOn, 5);

      const playerId = GetPlayerId(player);
      const ch = Globals.customPlayers[playerId].getCustomHero(caster);
      if (ch.isChanneling()) IssueImmediateOrderById(caster, OrderIds.STOP);

      SaveBoolean(Globals.genericSpellHashtable, casterId, gojoSixEyesActiveKey, false);

      if (GetUnitTypeId(caster) == Id.gojo) {
        SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Gojo/SixEyes2.mp3", 1061);
      }
    }
  }

  export function doGojoTeleport(spellId: number) {
    const speed = 100;
    const aoe = 500;
    const manaCostPct = 0.01;
    const maxDist = 1400;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);

    if (Globals.barrierBlockUnits.has(caster)) {
      BlzStartUnitAbilityCooldown(caster, spellId, 5);
      return;
    }
    
    const targetX = GetSpellTargetX();
    const targetY = GetSpellTargetY();

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(targetX, targetY);
    CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, maxDist);
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    let distance = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

    GroupEnumUnitsInRange(Globals.tmpUnitGroup, 
      Globals.tmpVector.x, Globals.tmpVector.y, aoe, null
    );

    let distTravelled = 0;
    Globals.tmpVector3.setVector(Globals.tmpVector);
    while (distance > 16 && PathingCheck.isGroundWalkable(Globals.tmpVector3)) {
      const adjSpeed = Math.min(speed, distance);
      Globals.tmpVector3.polarProjectCoords(
        Globals.tmpVector3, ang, adjSpeed
      );
      distTravelled += adjSpeed;
      distance = CoordMath.distance(Globals.tmpVector3, Globals.tmpVector2);
    }

    UnitHelper.payMPPercentCost(
      caster, manaCostPct * distTravelled / speed, UNIT_STATE_MANA
    );

    // teleport
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (
        IsUnitAlly(unit, player) 
        && UnitHelper.isUnitTargetableForPlayer(unit, player, true)
        && !IsUnitType(unit, UNIT_TYPE_STRUCTURE)
        && !Globals.barrierBlockUnits.has(unit)
      ) {
        Globals.tmpVector2.setUnit(unit);
        const teleportDist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
        const teleportAng = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
        
        DestroyEffect(
          AddSpecialEffect("BlackBlink.mdl", Globals.tmpVector2.x, Globals.tmpVector2.y)
        );

        Globals.tmpVector2.setVector(Globals.tmpVector3);
        Globals.tmpVector2.polarProjectCoords(Globals.tmpVector2, teleportAng, teleportDist);
        PathingCheck.moveGroundUnitToCoord(unit, Globals.tmpVector2);

      }
    });

    const sfx1 = AddSpecialEffect("Abilities/Spells/Human/Polymorph/PolyMorphDoneGround.mdl", 
      Globals.tmpVector.x, Globals.tmpVector.y
    );
    DestroyEffect(sfx1);
    const sfx2 = AddSpecialEffect("Abilities/Spells/Human/Polymorph/PolyMorphDoneGround.mdl",
      Globals.tmpVector3.x, Globals.tmpVector3.y
    );
    DestroyEffect(sfx2);
    // const timer = TimerManager.getInstance().get();
    // TimerStart(timer, 0.5, false, () => {
    //   TimerManager.getInstance().recycle(timer);
    // });
  }

  export function getCheungMyeongSpellLevel(spellId: number, caster: unit) {
    return Math.min(10, 1 + Math.floor(GetHeroLevel(caster) / 9));
  }

  export function cheungMyeongOnCast(spellId: number, caster: unit) {
    // const basicManaCostPct = 0.05;
    // const specialManaCostPct = 0.25;
    // const basicManaCostPct = -0.1;
    // const specialManaCostPct = -0.2;

    if (spellId == Id.cheongMyeongScatteredBlossomfall) return;

    const cheongMyeongComboKey = StringHash("cheong_combo");
    const cheongMyeongComboLockKey = StringHash("cheong_combo_lock");

    const isBasic = (
      spellId == Id.cheongMyeongSwordOfSixElements
      || spellId == Id.cheongMyeongFallingPetalSword
      || spellId == Id.cheongMyeongFlutteringShadowPetals
    );

    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    // UnitHelper.payMPPercentCost(
    //   caster, 
    //   isBasic ? basicManaCostPct : specialManaCostPct, 
    //   UNIT_STATE_MAX_MANA
    // );

    if (!isBasic) {
      SetPlayerAbilityAvailable(player, spellId, false);
      SaveBoolean(Globals.genericSpellHashtable, casterId, cheongMyeongComboLockKey, false);
      return;
    }
    if (LoadBoolean(Globals.genericSpellHashtable, casterId, cheongMyeongComboLockKey)) return;

    const spellVal = spellId == Id.cheongMyeongSwordOfSixElements ? 
      1 : (spellId == Id.cheongMyeongFallingPetalSword ?
      2 : 3
    );

    const comboVal = LoadInteger(Globals.genericSpellHashtable, casterId, cheongMyeongComboKey);
    if (comboVal % 10 != spellVal ) {
      const finalVal = spellVal + 10 * comboVal;
      const isAddSpecial = finalVal >= 10;
      SaveInteger(Globals.genericSpellHashtable, 
        casterId, cheongMyeongComboKey, 
        isAddSpecial ? 0 : finalVal
      );
      if (isAddSpecial) {
        SetPlayerAbilityAvailable(player, Id.cheongMyeongPlumBlossomCleave, finalVal == 12);
        SetPlayerAbilityAvailable(player, Id.cheongMyeongPlumBlossomTempest, finalVal == 13);
        SetPlayerAbilityAvailable(player, Id.cheongMyeongCelestialFallingPetals, finalVal == 21);
        SetPlayerAbilityAvailable(player, Id.cheongMyeongPlumBlossomPalisade, finalVal == 23);
        SetPlayerAbilityAvailable(player, Id.cheongMyeongPlumBlossomFlow, finalVal == 31);
        SetPlayerAbilityAvailable(player, Id.cheongMyeongPlumBlossomCloudburst, finalVal == 32);
        SaveBoolean(Globals.genericSpellHashtable, casterId, cheongMyeongComboLockKey, true);
      }
    }
  }
  
  export function cheongMyeongSakuraSlash(
    caster: unit, 
    x: number, y: number,
    spellId: number,
    maxDist: number,
    dmgDataMult: number,
    stunDuration: number,
  ) {
    const dmgAOE = 150;
    const speed = 100;
    const sfxHeight = 100;

    if (Globals.barrierBlockUnits.has(caster)) {
      BlzStartUnitAbilityCooldown(caster, spellId, 1);
      return;
    }

    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(x, y);
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    const dist = Math.min(
      maxDist,
      Math.max(
        speed,
        CoordMath.distance(Globals.tmpVector, Globals.tmpVector2)
      )
    );
    Globals.tmpVector3.polarProjectCoords(
      Globals.tmpVector, ang, dist * 0.5
    );

    let sfx = AddSpecialEffect("SakuraSlash.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectScale(sfx, dist * 0.002);
    BlzSetSpecialEffectTimeScale(sfx, 0.75);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    MoveLocation(Globals.tmpLoc, Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectZ(sfx, GetLocationZ(Globals.tmpLoc) + sfxHeight);
    DestroyEffect(sfx);

    const dmg = AOEDamage.calculateDamageRaw(
      caster, getCheungMyeongSpellLevel(spellId, caster), ch.spellPower,
      dmgDataMult, 1, bj_HEROSTAT_INT
    );

    const dummyCaster = stunDuration > 0 ? 
      UnitHelper.createDummyCasterStun(player, x, y, stunDuration) :
      null
    ;
    if (stunDuration > 0) {
      UnitApplyTimedLife(dummyCaster, Buffs.TIMED_LIFE, 1);
    }

    Globals.tmpVector3.setVector(Globals.tmpVector);
    GroupClear(Globals.tmpUnitGroup);
    GroupClear(Globals.tmpUnitGroup2);
    for (let i = 0; i < dist + speed; i += speed) {
      if (!PathingCheck.isGroundWalkable(Globals.tmpVector3)) break;

      sfx = AddSpecialEffect("BlossomsMissile.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
      MoveLocation(Globals.tmpLoc, Globals.tmpVector3.x, Globals.tmpVector3.y);
      BlzSetSpecialEffectZ(sfx, GetLocationZ(Globals.tmpLoc) + sfxHeight);
      DestroyEffect(sfx);

      GroupEnumUnitsInRange(Globals.tmpUnitGroup2, 
        Globals.tmpVector3.x, Globals.tmpVector3.y, dmgAOE, null
      );
      ForGroup(Globals.tmpUnitGroup2, () => {
        const unit = GetEnumUnit();
        if (
          !IsUnitInGroup(unit, Globals.tmpUnitGroup)
          && UnitHelper.isUnitTargetableForPlayer(unit, player)
        ) {
          UnitDamageTarget(
            caster, unit, dmg, 
            false, false, 
            ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WHOKNOWS
          );
          GroupAddUnit(Globals.tmpUnitGroup, unit);
          if (stunDuration > 0 && IsUnitType(unit, UNIT_TYPE_HERO)) {
            IssueTargetOrderById(dummyCaster, OrderIds.THUNDERBOLT, unit);
          }
        }
      });

      const newDist = CoordMath.distance(Globals.tmpVector3, Globals.tmpVector2);
      if (newDist < 1) break;
      Globals.tmpVector3.polarProjectCoords(
        Globals.tmpVector3, ang, Math.min(speed, newDist)
      );
    }
    
    PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector3);

    if (stunDuration > 0) {
      RemoveUnit(dummyCaster);
    }
  }

  // export function doCheongMyeongSwordOfSixElements(spellId: number) {
  //   const dmgDataMult = BASE_DMG.KAME_DPS * 2;
  //   const maxDist = 300;

  //   const caster = GetTriggerUnit();
  //   const spellX = GetSpellTargetX();
  //   const spellY = GetSpellTargetY();

  //   const timer = TimerManager.getInstance().get();
  //   TimerStart(timer, 0.25, false, () => {
  //     cheongMyeongSakuraSlash(
  //       caster, 
  //       spellX, spellY,
  //       spellId,
  //       maxDist,
  //       dmgDataMult, 0,
  //     );
  //     TimerManager.getInstance().recycle(timer);
  //   });
  // }

  export function doCheongMyeongFlutteringShadowPetals(spellId: number) {
    const dmgDataMult = BASE_DMG.KAME_DPS * 3;
    const maxDist = 600;
    cheongMyeongSakuraSlash(
      GetTriggerUnit(), 
      GetSpellTargetX(), GetSpellTargetY(),
      spellId,
      maxDist,
      dmgDataMult, 0,
    );
  }

  export function doCheongMyeongPlumBlossomFlow(spellId: number) {
    const dmgDataMult = BASE_DMG.KAME_DPS * 12;
    const maxDist = 1200;
    cheongMyeongSakuraSlash(
      GetTriggerUnit(), 
      GetSpellTargetX(), GetSpellTargetY(),
      spellId,
      maxDist,
      dmgDataMult, 1,
    );
  }
  
  export function doCheongMyeongPlumBlossomTempest(spellId: number) {
    const maxDist = 1280;
    const sfxHeight = 100;

    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    const cheongTempestCasterKey = StringHash("cheong_tempest_caster");
    const cheongTempestRepeatKey = StringHash("cheong_tempest_repeat");
    const cheongTempestX1Key = StringHash("cheong_tempest_x1");
    const cheongTempestY1Key = StringHash("cheong_tempest_y1");
    const cheongTempestX2Key = StringHash("cheong_tempest_x2");
    const cheongTempestY2Key = StringHash("cheong_tempest_y2");
    const cheongTempestSfxKey = StringHash("cheong_tempest_sfx");

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, ang, maxDist);

    // create a line
    Globals.tmpVector3.polarProjectCoords(Globals.tmpVector, ang, maxDist * 0.5);
    let sfx = AddSpecialEffect("SakuraSlash.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectScale(sfx, maxDist * 0.002);
    BlzSetSpecialEffectTimeScale(sfx, 0.2);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    MoveLocation(Globals.tmpLoc, Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectZ(sfx, GetLocationZ(Globals.tmpLoc) + sfxHeight);

    // wait
    const timer = TimerManager.getInstance().get();
    const timerId = GetHandleId(timer);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, cheongTempestCasterKey, caster);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongTempestRepeatKey, 1);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestX1Key, Globals.tmpVector.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestY1Key, Globals.tmpVector.y);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestX2Key, Globals.tmpVector2.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestY2Key, Globals.tmpVector2.y);
    SaveEffectHandle(Globals.genericSpellHashtable, timerId, cheongTempestSfxKey, sfx);
    TimerStart(timer, 1.0, false, cheongMyeongTempestLoop);
  }

  export function cheongMyeongTempestLoop() {
    const dmgDataMult = BASE_DMG.KAME_DPS * 10;
    const dmgAOE = 256;
    const speed = 100;
    const maxDist = 1280;
    const sfxHeight = 100;

    const cheongTempestCasterKey = StringHash("cheong_tempest_caster");
    const cheongTempestRepeatKey = StringHash("cheong_tempest_repeat");
    const cheongTempestX1Key = StringHash("cheong_tempest_x1");
    const cheongTempestY1Key = StringHash("cheong_tempest_y1");
    const cheongTempestX2Key = StringHash("cheong_tempest_x2");
    const cheongTempestY2Key = StringHash("cheong_tempest_y2");
    const cheongTempestSfxKey = StringHash("cheong_tempest_sfx");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, cheongTempestCasterKey);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    Globals.tmpVector.setPos(
      LoadReal(Globals.genericSpellHashtable, timerId, cheongTempestX1Key),
      LoadReal(Globals.genericSpellHashtable, timerId, cheongTempestY1Key)
    );
    Globals.tmpVector2.setPos(
      LoadReal(Globals.genericSpellHashtable, timerId, cheongTempestX2Key),
      LoadReal(Globals.genericSpellHashtable, timerId, cheongTempestY2Key)
    );
    let sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, cheongTempestSfxKey);
    DestroyEffect(sfx);
    
    const ang = CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector2);
    const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);

    sfx = AddSpecialEffect("SakuraLineBeam.mdl", Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    DestroyEffect(sfx);

    GroupClear(Globals.tmpUnitGroup);
    GroupClear(Globals.tmpUnitGroup2);

    const spellLevel = getCheungMyeongSpellLevel(Id.cheongMyeongPlumBlossomTempest, caster);

    Globals.tmpVector3.setVector(Globals.tmpVector);
    for (let i = 0; i < dist; i += speed) {
      AOEDamage.genericDealAOEDamageExclude(
        Globals.tmpUnitGroup, Globals.tmpUnitGroup2,
        caster,
        Globals.tmpVector3.x, Globals.tmpVector3.y,
        dmgAOE, spellLevel, ch.spellPower,
        dmgDataMult, 1.0, bj_HEROSTAT_INT
      );
      Globals.tmpVector3.polarProjectCoords(Globals.tmpVector3, ang, speed);
    }

    const repeat = LoadInteger(Globals.genericSpellHashtable, timerId, cheongTempestRepeatKey);
    if (repeat <= 0) {
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    }

    Globals.tmpVector.polarProjectCoords(Globals.tmpVector, ang, maxDist * 0.5);
    Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, ang, maxDist);
    Globals.tmpVector3.polarProjectCoords(Globals.tmpVector, ang, maxDist * 0.5);

    sfx = AddSpecialEffect("SakuraSlash.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectScale(sfx, maxDist * 0.002);
    BlzSetSpecialEffectTimeScale(sfx, 0.4);
    BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
    MoveLocation(Globals.tmpLoc, Globals.tmpVector3.x, Globals.tmpVector3.y);
    BlzSetSpecialEffectZ(sfx, GetLocationZ(Globals.tmpLoc) + sfxHeight);

    SaveInteger(Globals.genericSpellHashtable, timerId, cheongTempestRepeatKey, repeat-1);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestX1Key, Globals.tmpVector.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestY1Key, Globals.tmpVector.y);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestX2Key, Globals.tmpVector2.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongTempestY2Key, Globals.tmpVector2.y);
    SaveEffectHandle(Globals.genericSpellHashtable, timerId, cheongTempestSfxKey, sfx);

    TimerStart(timer, 0.5, false, cheongMyeongTempestLoop);
  }

  export function doCheongMyeongScatteredBlossomfall(spellId: number) {
    const minAttacks = 8;
    const maxAttacks = 24;
    const manaPctPerAttack = 2;
    const manaCostPct = 1.0;

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    if (!ch) return;

    const cheongBlossomfallInUseKey = StringHash("cheong_blossomfall_in_use");
    const cheongBlossomfallHitsKey = StringHash("cheong_blossomfall_hits");
    const cheongBlossomfallCasterKey = StringHash("cheong_blossomfall_caster");
    const cheongBlossomfallRepeatKey = StringHash("cheong_blossomfall_repeat");
    const cheongBlossomfallTicksKey = StringHash("cheong_blossomfall_ticks");
    const cheongBlossomfallAttackTickKey = StringHash("cheong_blossomfall_attack_tick");
    const cheongBlossomfallX1Key = StringHash("cheong_blossomfall_x1");
    const cheongBlossomfallY1Key = StringHash("cheong_blossomfall_y1");
    const cheongBlossomfallX2Key = StringHash("cheong_blossomfall_x2");
    const cheongBlossomfallY2Key = StringHash("cheong_blossomfall_y2");
    const cheongBlossomfallGroupKey = StringHash("cheong_blossomfall_group");
    const cheongBlossomfallSfxKey = StringHash("cheong_blossomfall_sfx");
    const cheongBlossomfallSfxTrailKey = StringHash("cheong_blossomfall_sfx_trail");

    const numAttacks = Math.min(maxAttacks, 
      minAttacks + Math.floor(GetUnitManaPercent(caster) / manaPctPerAttack)
    );
    TextTagHelper.showPlayerColorTextOnUnit(
      "Scattered Blossomfall " + I2S(numAttacks),
      playerId, caster,
    );
    UnitHelper.payMPPercentCost(caster, manaCostPct, UNIT_STATE_MANA);

    Globals.tmpVector.setUnit(caster);
    Globals.tmpVector2.setPos(GetSpellTargetX(), GetSpellTargetY());

    const sfx = AddSpecialEffect("AuraSakura.mdl", Globals.tmpVector2.x, Globals.tmpVector2.y);
    const sfxTrail = AddSpecialEffect(
      "Abilities/Weapons/PhoenixMissile/Phoenix_Missile_mini.mdl", 
      Globals.tmpVector.x, Globals.tmpVector.y
    );
    BlzSetSpecialEffectScale(sfxTrail, 3.0);
    BlzSetSpecialEffectColor(sfxTrail, 255, 175, 235);

    const sfx2 = AddSpecialEffect(
      "DTBlueNoRingWhite.mdl", 
      Globals.tmpVector.x, Globals.tmpVector.y
    );
    BlzSetSpecialEffectScale(sfx2, 3.0);
    BlzSetSpecialEffectColor(sfx2, 255, 125, 215);
    DestroyEffect(sfx2);

    SaveBoolean(Globals.genericSpellHashtable, casterId, cheongBlossomfallInUseKey, false);
    SaveInteger(Globals.genericSpellHashtable, casterId, cheongBlossomfallHitsKey, 1);

    const timer = TimerManager.getInstance().get();
    const timerId = GetHandleId(timer);
    SaveUnitHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallCasterKey, caster);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallRepeatKey, numAttacks);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallTicksKey, 1);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallAttackTickKey, 0);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX1Key, Globals.tmpVector.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY1Key, Globals.tmpVector.y);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX2Key, Globals.tmpVector2.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY2Key, Globals.tmpVector2.y);
    SaveGroupHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallGroupKey, CreateGroup());
    SaveEffectHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallSfxKey, sfx);
    SaveEffectHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallSfxTrailKey, sfxTrail);
    TimerStart(timer, 0.03, true, cheongMyeongBlossomfallLoop);
  }

  export function cheongMyeongBlossomfallLoop() {
    const startTick = 33;
    const maxTicks = 133;
    const jumpDist = 64;
    const jumpTickDelay = 9;
    const aoe = 800;
    const sfxHeight = 100;

    const cheongBlossomfallInUseKey = StringHash("cheong_blossomfall_in_use");
    const cheongBlossomfallHitsKey = StringHash("cheong_blossomfall_hits");
    const cheongBlossomfallCasterKey = StringHash("cheong_blossomfall_caster");
    const cheongBlossomfallRepeatKey = StringHash("cheong_blossomfall_repeat");
    const cheongBlossomfallTicksKey = StringHash("cheong_blossomfall_ticks");
    const cheongBlossomfallAttackTickKey = StringHash("cheong_blossomfall_attack_tick");
    const cheongBlossomfallX1Key = StringHash("cheong_blossomfall_x1");
    const cheongBlossomfallY1Key = StringHash("cheong_blossomfall_y1");
    const cheongBlossomfallX2Key = StringHash("cheong_blossomfall_x2");
    const cheongBlossomfallY2Key = StringHash("cheong_blossomfall_y2");
    const cheongBlossomfallGroupKey = StringHash("cheong_blossomfall_group");
    const cheongBlossomfallSfxKey = StringHash("cheong_blossomfall_sfx");
    const cheongBlossomfallSfxTrailKey = StringHash("cheong_blossomfall_sfx_trail");

    const timer = GetExpiredTimer();
    const timerId = GetHandleId(timer);

    const caster = LoadUnitHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallCasterKey);
    const casterId = GetHandleId(caster);
    const player = GetOwningPlayer(caster);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(caster);
    const repeat = LoadInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallRepeatKey);
    const ticks = LoadInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallTicksKey);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallTicksKey, ticks+1);
    const attackTick = LoadInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallAttackTickKey);
    Globals.tmpVector.setPos(
      LoadReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX1Key),
      LoadReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY1Key)
    );
    Globals.tmpVector2.setPos(
      LoadReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX2Key),
      LoadReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY2Key)
    );
    const group = LoadGroupHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallGroupKey);
    let sfx = LoadEffectHandle(Globals.genericSpellHashtable, timerId, cheongBlossomfallSfxKey);
    const sfxTrail = LoadEffectHandle(Globals.genericSpellHashtable, 
      timerId, cheongBlossomfallSfxTrailKey
    );

    if (
      repeat <= 0 
      || ticks >= maxTicks
      || UnitHelper.isUnitDead(caster)
    ) {
      SetUnitInvulnerable(caster, false);
      BlzSetUnitAttackCooldown(caster, 1.8, 0);
      SetUnitTimeScale(caster, 1.0);
      SetUnitPathing(caster, true);
      BlzSetUnitWeaponRealField(caster, UNIT_WEAPON_RF_ATTACK_DAMAGE_POINT, 0, 0.25);
      ShowUnitShow(caster);
      SelectUnitForPlayerSingle(caster, player);
      // UnitAddAbility(caster, Id.move);
      DestroyGroup(group);
      if (sfx) DestroyEffect(sfx);
      if (sfxTrail) DestroyEffect(sfxTrail);
      SaveBoolean(Globals.genericSpellHashtable, casterId, cheongBlossomfallInUseKey, false);
      SaveInteger(Globals.genericSpellHashtable, casterId, cheongBlossomfallHitsKey, 0);
      FlushChildHashtable(Globals.genericSpellHashtable, timerId);
      TimerManager.getInstance().recycle(timer);
      return;
    }

    Globals.tmpVector.setUnit(caster);
    MoveLocation(Globals.tmpLoc, Globals.tmpVector.x, Globals.tmpVector.y);
    BlzSetSpecialEffectPosition(sfxTrail, 
      Globals.tmpVector.x, Globals.tmpVector.y, 
      GetLocationZ(Globals.tmpLoc) + sfxHeight
    );
    
    if (
      ticks < startTick
      || (
        LoadBoolean(Globals.genericSpellHashtable, casterId, cheongBlossomfallInUseKey)
        && ticks - attackTick < jumpTickDelay
      )
    ) {
      return;
    }

    if (ticks == startTick) {
      const dummyUnit = CreateUnit(
        player, Constants.dummyCasterId,
        Globals.tmpVector.x, Globals.tmpVector.y, 0
      );
      UnitAddAbility(dummyUnit, DebuffAbilities.CHEONG_MYEONG_SCATTERED_BLOSSOMFALL_DMG_DEBUFF);
      IssueTargetOrderById(dummyUnit, OrderIds.INNER_FIRE, caster);
      RemoveUnit(dummyUnit);

      DestroyEffect(sfx);
      SetUnitInvulnerable(caster, true);
      BlzSetUnitAttackCooldown(caster, 0.25, 0);
      SetUnitTimeScale(caster, 5.0);
      SetUnitPathing(caster, false);
      BlzSetUnitWeaponRealField(caster, UNIT_WEAPON_RF_ATTACK_DAMAGE_POINT, 0, 0);
      ShowUnitHide(caster);
      PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector2);
      Globals.tmpVector.setUnit(caster);
    }

    let target = null;
    let closestDist = 99999;
    GroupEnumUnitsInRange(group, 
      Globals.tmpVector.x,
      Globals.tmpVector.y,
      aoe,
      null
    );
    ForGroup(group, () => {
      const unit = GetEnumUnit();
      if (
        UnitHelper.isUnitTargetableForPlayer(unit, player)
        && IsUnitType(unit, UNIT_TYPE_HERO)
      ) {
        Globals.tmpVector3.setUnit(unit);
        const newDist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector3);
        if (newDist < closestDist) {
          target = unit;
          closestDist = newDist;
        }
      }
    });

    if (target != null) {
      Globals.tmpVector3.setUnit(target);
      const ang = Math.random() * 360;
      Globals.tmpVector3.polarProjectCoords(Globals.tmpVector3, ang, jumpDist);
      if (PathingCheck.moveGroundUnitToCoord(caster, Globals.tmpVector3)) {
        IssueTargetOrderById(caster, OrderIds.ATTACK, target);
        Globals.tmpVector.setUnit(caster);
        BlzSetUnitFacingEx(caster, 
          CoordMath.angleBetweenCoords(Globals.tmpVector, Globals.tmpVector3)
        );
        SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallAttackTickKey, ticks);
        SaveBoolean(Globals.genericSpellHashtable, casterId, cheongBlossomfallInUseKey, true);
      }

      sfx = AddSpecialEffect("SakuraSlash.mdl", Globals.tmpVector3.x, Globals.tmpVector3.y);
      BlzSetSpecialEffectYaw(sfx, ang * CoordMath.degreesToRadians);
      DestroyEffect(sfx);
    }

    Globals.tmpVector2.setUnit(caster);
    SaveInteger(Globals.genericSpellHashtable, timerId, cheongBlossomfallRepeatKey, target == null ? 0 : repeat-1);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX1Key, Globals.tmpVector.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY1Key, Globals.tmpVector.y);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallX2Key, Globals.tmpVector2.x);
    SaveReal(Globals.genericSpellHashtable, timerId, cheongBlossomfallY2Key, Globals.tmpVector2.y);
  }

  export function doCheongMyeongEquilibriumOfSix(caster: unit) {
    const tickRate = 0.1;
    const mpPct = 0.1;
    const endTick = 40;

    UnitRemoveBuffs(caster, false, true);

    PauseManager.getInstance().pause(caster, false);
    SetUnitAnimationByIndex(caster, 5);
    
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, tickRate, true, () => {
      if (
        ticks > endTick 
        || !UnitHelper.isUnitAlive(caster)
      ) {
        PauseManager.getInstance().unpause(caster, false);
        ResetUnitAnimation(caster);
        TimerManager.getInstance().recycle(timer);
        return;
      }
      
      const maxMp = GetUnitState(caster, UNIT_STATE_MAX_MANA);
      const currentMp = GetUnitState(caster, UNIT_STATE_MANA);
      const agi = GetHeroAgi(caster, true);
      const int = GetHeroInt(caster, true);
      const mpRegen = (agi / Math.max(1, int)) * mpPct * maxMp * tickRate;
      SetUnitState(caster, UNIT_STATE_MANA, Math.min(maxMp, currentMp + mpRegen));

      if (ticks % 16 == 0) {
        Globals.tmpVector.setUnit(caster);
        DestroyEffect(AddSpecialEffect(
          "Abilities/Spells/Undead/AbsorbMana/AbsorbManaBirthMissile.mdl",
          Globals.tmpVector.x, Globals.tmpVector.y
        ));
      }
      ticks++;
    });
  }

  export function getAggronorSpellLevel(spellId: number, caster: unit) {
    if (spellId == Id.aggronorLightningBashPassive) {
      return Math.min(10, 3 + GetHeroLevel(caster) * 0.11);
    }
    return Math.min(10, 1 + GetHeroLevel(caster) * 0.11);
  }

  export function doLightningBash(source: unit, target: unit) {
    if (BlzGetUnitAbilityCooldownRemaining(source, Id.aggronorLightningBashActive) > 0) return;

    const mpCostPct = 0.1;
    const player = GetOwningPlayer(source);

    const mp = GetUnitState(source, UNIT_STATE_MANA);
    const mpCost = mpCostPct * GetUnitState(source, UNIT_STATE_MAX_MANA);
    if (mp < mpCost) return;
    SetUnitState(source, UNIT_STATE_MANA, mp - mpCost);

    SetPlayerAbilityAvailable(player, Id.aggronorLightningBashActive, true);
    SetPlayerAbilityAvailable(player, Id.aggronorLightningBashPassive, false);
    startCooldown(source, Id.aggronorLightningBashActive);

    if (IsUnitType(target, UNIT_TYPE_HERO)) {
      const dummy = CreateUnit(player, Constants.dummyCasterId, Globals.tmpVector.x, Globals.tmpVector.y, 0);
      UnitApplyTimedLife(dummy, Buffs.TIMED_LIFE, 1.0);
      UnitAddAbility(dummy, DebuffAbilities.STUN_ONE_SECOND);
      IssueTargetOrderById(dummy, OrderIds.THUNDERBOLT, target);
  
      const sourceId = GetHandleId(source);
      SaveReal(udg_StatMultHashtable, sourceId, 47, 
        LoadReal(udg_StatMultHashtable, sourceId, 47) + 0.01
      );
    }

    doAggronorChainLightning(source, target, 5);
  }

  export function doAggronorChainLightning(source: unit, target: unit, dmgDataMult: number) {
    const dmgData = BASE_DMG.KAME_DPS * dmgDataMult;
    const maxTargets = 8;
    const dmgTickRate = 5;
    const bounceAOE = 800;
    const endTick = maxTargets * dmgTickRate;

    const player = GetOwningPlayer(source);
    const playerId = GetPlayerId(player);
    const ch = Globals.customPlayers[playerId].getCustomHero(source);

    const excludeGroup = CreateGroup();

    let prevTarget = source;
    let nextTarget = target;
    let lightning = null;
    let prevX = GetUnitX(source);
    let prevY = GetUnitY(source);
    let ticks = 0;
    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      if (ticks > endTick) {
        if (lightning != null) DestroyLightning(lightning);
        DestroyGroup(excludeGroup);
        TimerManager.getInstance().recycle(timer);
        return;
      }

      if (ticks % dmgTickRate == 0) {
        if (ticks > 0) DestroyLightning(lightning);

        // when not the first call
        if (prevTarget != source) {
          let minDist = 999999;
          Globals.tmpVector.setPos(prevX, prevY);
          GroupEnumUnitsInRange(Globals.tmpUnitGroup, 
            Globals.tmpVector.x, Globals.tmpVector.y, 
            bounceAOE, null
          );
          for (let i = 0; i < BlzGroupGetSize(Globals.tmpUnitGroup); ++i) {
            const unit = BlzGroupUnitAt(Globals.tmpUnitGroup, i);
            if (
              unit == null
              || !UnitHelper.isUnitTargetableForPlayer(unit, player)
              || IsUnitInGroup(unit, excludeGroup)
              || !UnitHelper.isUnitAlive(unit)
            ) continue;
            Globals.tmpVector2.setUnit(unit);
            const dist = CoordMath.distance(Globals.tmpVector, Globals.tmpVector2);
            if (dist < minDist) {
              nextTarget = unit;
              minDist = dist;
            }
          }
        }

        if (prevTarget == nextTarget) {
          ticks = endTick;
        } else if (prevTarget != nextTarget) {
          // new target found
          GroupAddUnit(excludeGroup, nextTarget);

          Globals.tmpVector.setUnit(prevTarget);
          Globals.tmpVector2.setUnit(nextTarget);
          CoordMath.extendToMaxDist(Globals.tmpVector, Globals.tmpVector2, bounceAOE);
  
          lightning = AddLightningEx(
            ticks == 0  ? "CLPB" : "CLSB", true, 
            prevX, prevY, 50 + BlzGetUnitZ(prevTarget) + GetUnitFlyHeight(prevTarget),
            Globals.tmpVector2.x, Globals.tmpVector2.y, 50 + BlzGetUnitZ(nextTarget) + GetUnitFlyHeight(nextTarget),
          );
          DestroyEffect(
            AddSpecialEffect("Abilities/Weapons/Bolt/BoltImpact.mdl", 
            Globals.tmpVector2.x, Globals.tmpVector2.y)
          );
          const dmg = AOEDamage.calculateDamageRaw(
            source,
            getAggronorSpellLevel(Id.aggronorLightningBashPassive, source),
            ch ? ch.spellPower : 1.0,
            dmgData,
            1.0,
            bj_HEROSTAT_INT
          );
          UnitDamageTarget(
            source, nextTarget, 
            dmg, 
            false, false, 
            ATTACK_TYPE_HERO, DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WHOKNOWS
          );
  
          // go find a new target
          prevTarget = nextTarget;
          prevX = GetUnitX(prevTarget);
          prevY = GetUnitY(prevTarget);
        }
      }

      ++ticks;
    });
  }
  
  export function doAggronorLightningPlate(spellId: number, caster: unit) {
    const endTick = 666;

    const aggronorLightningPlateTicksKey = StringHash("aggronor_lightning_plate_ticks");
    const aggronorLightningPlateHpKey = StringHash("aggronor_lightning_plate_hp");

    const casterId = GetHandleId(caster);
    let ticks = LoadInteger(Globals.genericDDSHashtable, casterId, aggronorLightningPlateTicksKey);
    SaveInteger(Globals.genericDDSHashtable, casterId, aggronorLightningPlateTicksKey, 1);
    if (ticks > 0) {
      return;
    }

    Globals.tmpVector.setUnit(caster);
    let sfx = AddSpecialEffectTarget("SuperLightningBall.mdl", caster, "origin");
    let texttag = CreateTextTag();
    SetTextTagVisibility(texttag, true);

    const timer = TimerManager.getInstance().get();
    TimerStart(timer, 0.03, true, () => {
      ticks = LoadInteger(Globals.genericDDSHashtable, casterId, aggronorLightningPlateTicksKey);
      if (ticks == 166) {
        DestroyEffect(sfx);
        sfx = AddSpecialEffectTarget("Ubershield White.mdl", caster, "chest");
      }
      if (ticks >= 166) {
        const hp = LoadReal(Globals.genericDDSHashtable, casterId, aggronorLightningPlateHpKey);
        if (hp > 0) {
          SetTextTagTextBJ(texttag, I2S(R2I(hp)), 10);
          SetTextTagPosUnit(texttag, caster, 10);
        } else {
          SetTextTagVisibility(texttag, false);
          ticks = endTick;
        }
      }
      if (ticks >= endTick || !UnitHelper.isUnitAlive(caster)) {
        DestroyEffect(sfx);
        DestroyTextTag(texttag);
        DestroyEffect(AddSpecialEffect("Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl", GetUnitX(caster), GetUnitY(caster)));
        SaveInteger(Globals.genericDDSHashtable, casterId, aggronorLightningPlateTicksKey, 0);
        SaveReal(Globals.genericDDSHashtable, casterId, aggronorLightningPlateHpKey, 0);
        TimerManager.getInstance().recycle(timer);
        return;
      }
      SaveInteger(Globals.genericDDSHashtable, casterId, aggronorLightningPlateTicksKey, ticks+1);
    });
  }

  export function doAggronorAvatar(spellId: number) {
    const hpHealPct = -1 * 0.1;
    const caster = GetTriggerUnit();
    UnitHelper.payHPPercentCost(caster, hpHealPct, UNIT_STATE_MAX_LIFE);
  }

  export function createTatsumakiRock(caster: unit, x: number, y: number) {
    const casterKey = StringHash("tatsumaki_caster");
    const dmgGroupKey = StringHash("tatsumaki_dmg_group");

    const beamDuration = 30;
    const beamHpMult = BASE_DMG.KAME_DPS * 1.0;
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
      GetUnitAbilityLevel(caster, Id.tatsumakiLift), 
      beamHpMult, caster, bj_HEROSTAT_INT
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
    const beamHpMult = BASE_DMG.KAME_DPS * 5.0;
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
      10, beamHpMult, caster, bj_HEROSTAT_INT
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
  
  export function doGetiStarItemReplicator(spellId: number) {
    const goldCost = 100000;
    const item = GetSpellTargetItem();
    if (!item) return;
    const itemId = GetItemTypeId(item);
    const unit = GetTriggerUnit();
    const player = GetOwningPlayer(unit);
    if (
      itemId == ItemConstants.CLEANSED_DRAGONBALL
      && itemId == ItemConstants.ZENO_BUTTON
      && itemId == ItemConstants.dragonBallItem
      && itemId == ItemConstants.KOTH.hamGenerator
      && itemId == ItemConstants.KOTH.bananaGenerator
      && itemId == ItemConstants.KOTH.senzuGenerator
      && itemId == ItemConstants.KOTH.miniSenzuGenerator
      && itemId == ItemConstants.chaosEmerald
      && itemId == ItemConstants.crystalCoconut
      && itemId == ItemConstants.sandbags[0]
    ) {
      DisplayTimedTextToPlayer(player, 0, 0, 5, "|cffff2222Invalid Item.|r");
      BlzStartUnitAbilityCooldown(unit, Id.getiStarItemReplicator, 1);
      return;
    }

    const gold = GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD);
    if (gold < goldCost) {
      DisplayTimedTextToPlayer(player, 0, 0, 5, "|cffff2222Insufficient gold.|r");
      BlzStartUnitAbilityCooldown(unit, Id.getiStarItemReplicator, 1);
      return;
    }

    SetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD, gold-goldCost);
    const x = GetUnitX(unit);
    const y = GetUnitY(unit);
    const dupeIt = CreateItem(itemId, x, y);
    if (GetItemCharges(item) > 0) {
      SetItemCharges(item, GetItemCharges(item));
    }
    UnitAddItem(unit, dupeIt);
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Items/TomeOfRetraining/TomeOfRetrainingCaster.mdl",
        x, y
      )
    );
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Other/Transmute/PileofGold.mdl",
        x, y
      )
    );
  }

  export function DDSFarmerDamageDeal(dmg: DDSData) {
    if (
      dmg.sourceTypeId != Id.farmerWithShotgun
      || dmg.dmg <= 0
    ) return;
    const farmerGunThumbDmgPct = 0.02;
    const farmerGunThumbCostPct = 0.04;
    const farmerGunThumbSpellAmp = 0.02;

    if (dmg.isAttack && IsUnitType(dmg.target, UNIT_TYPE_HERO)) {
      if (GetUnitAbilityLevel(dmg.source, Id.farmerHonestShotPassive) > 0) {
        const farmer = dmg.source;
        const timer = TimerManager.getInstance().get();
        TimerStart(timer, 0.03, false, () => {
          UnitRemoveAbility(farmer, Id.farmerHonestShotPassive);
          TimerManager.getInstance().recycle(timer);
        });
      }

      if (GetUnitAbilityLevel(dmg.source, Buffs.INNER_FIRE_FARMER_RICE_DMG_BUFF) > 0) {
        const farmer = dmg.source;
        const timer = TimerManager.getInstance().get();
        TimerStart(timer, 0.03, false, () => {
          UnitRemoveAbility(farmer, Buffs.INNER_FIRE_FARMER_RICE_DMG_BUFF);
          TimerManager.getInstance().recycle(timer);
        });
      }

      const timer = TimerManager.getInstance().get();
      const player = GetOwningPlayer(dmg.source);
      const playerId = GetPlayerId(player);
      const ch = Globals.customPlayers[playerId].getCustomHero(dmg.source);
      if (ch) {
        ch.addSpellPower(farmerGunThumbSpellAmp);
        TimerStart(timer, 5, false, () => {
          ch.removeSpellPower(farmerGunThumbSpellAmp);
          TimerManager.getInstance().recycle(timer);
        });
      }

      dmg.setDamage(dmg.dmg + 
        farmerGunThumbDmgPct 
        * GetUnitState(dmg.source, UNIT_STATE_MANA)
        * (ch ? ch.spellPower : 1)
      );
      UnitHelper.payMPPercentCost(dmg.source, farmerGunThumbCostPct, UNIT_STATE_MANA);
    }
  }

  export function getFarmerSpellCropMult(unit: unit, spellId: number) {
    let targetItemCategory = 0;
    if (spellId == Id.farmerHaymaker) {
      targetItemCategory = 1;
    } else if (spellId == Id.farmerCornblast) {
      targetItemCategory = 2;
    } else if (spellId == Id.farmerSaiyanSlayingShot) {
      targetItemCategory = 3;
    }
    if (targetItemCategory == 0) return 1;

    const multPerCrop = 0.001;
    let result = 1;
    for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
      const it = UnitItemInSlot(unit, i);
      const itemTypeId = GetItemTypeId(it);

      if (targetItemCategory == 1) {
        if (
          itemTypeId == ItemConstants.Farming.WHEAT 
          || itemTypeId == ItemConstants.Farming.TEGRIDY_WHEAT
        ) {
          result += multPerCrop * GetItemCharges(it);
        }
      } else if (targetItemCategory == 2) {
        if (
          itemTypeId == ItemConstants.Farming.CORN 
          || itemTypeId == ItemConstants.Farming.SUPER_CORN
        ) {
          result += multPerCrop * GetItemCharges(it);
        }
      } else if (targetItemCategory == 3) {
        if (
          itemTypeId == ItemConstants.Farming.RICE 
          || itemTypeId == ItemConstants.Farming.RICE_SNOW
        ) {
          result += multPerCrop * GetItemCharges(it);
        }
      }
    }
    return result;
  }

  export function doFarmerReload(spellId: number, caster: unit) {
    const manaCostPct = -0.3;
    UnitHelper.payMPPercentCost(caster, manaCostPct, UNIT_STATE_MAX_MANA);
    SoundHelper.playSoundOnUnit(caster, "Audio/Voice/Farmer/Reload.mp3", 522);
  }

  export function doFarmerHonestShot(spellId: number) {
    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    // const farmerHonestShotKey = StringHash("farmer_r_active");
    // SaveInteger(Globals.genericSpellHashtable, casterId, farmerHonestShotKey, 1);
    UnitAddAbility(caster, Id.farmerHonestShotPassive);
  }

  export function doFarmerEatRice(spellId: number) {
    const caster = GetTriggerUnit();
    if (GetUnitAbilityLevel(caster, Id.plantWheat) == 0) return;
    // const farmerRiceShotKey = StringHash("farmer_rice_active");
    // const casterId = GetHandleId(caster);
    // SaveInteger(Globals.genericSpellHashtable, casterId, farmerRiceShotKey, 1);
    const player = GetOwningPlayer(caster);
    Globals.tmpVector.setUnit(caster);
    const dummyUnit = CreateUnit(
      player, Constants.dummyCasterId,
      Globals.tmpVector.x, Globals.tmpVector.y, 0
    );
    UnitAddAbility(dummyUnit, DebuffAbilities.FARMER_RICE_DMG_BUFF);
    IssueTargetOrderById(dummyUnit, OrderIds.INNER_FIRE, caster);
    RemoveUnit(dummyUnit);
  }

  export function doFarmerEatWheat(spellId: number) {
    const caster = GetTriggerUnit();
    if (GetUnitAbilityLevel(caster, Id.plantWheat) == 0) return;
    const player = GetOwningPlayer(caster);
    Globals.tmpVector.setUnit(caster);
    const dummyUnit = CreateUnit(
      player, Constants.dummyCasterId,
      Globals.tmpVector.x, Globals.tmpVector.y, 0
    );
    UnitAddAbility(dummyUnit, DebuffAbilities.FARMER_WHEAT_ARMOR_BUFF);
    IssueTargetOrderById(dummyUnit, OrderIds.INNER_FIRE, caster);
    RemoveUnit(dummyUnit);
    udg_StatMultUnit = caster;
    TriggerExecute(gg_trg_Base_Armor_Set);
  }

  export function doFarmerEatCorn(spellId: number) {
    const caster = GetTriggerUnit();
    if (GetUnitAbilityLevel(caster, Id.plantWheat) == 0) return;
    const player = GetOwningPlayer(caster);
    Globals.tmpVector.setUnit(caster);
    const dummyUnit = CreateUnit(
      player, Constants.dummyCasterId,
      Globals.tmpVector.x, Globals.tmpVector.y, 0
    );
    UnitAddAbility(dummyUnit, DebuffAbilities.FARMER_CORN_REGEN_BUFF);
    IssueTargetOrderById(dummyUnit, OrderIds.INNER_FIRE, caster);
    RemoveUnit(dummyUnit);
  }

  export function doCellMaxWings(spellId: number) {
    const caster = GetTriggerUnit();
    const player = GetOwningPlayer(caster);
    const boostGroup = CreateGroup();
    const maxTick = 333;
    const lastDebuffTick = 166;
    const boostAOE = 500;
    const boostSpellPower = -0.2;
    
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

      
      if (!UnitHelper.isUnitAlive(caster)) {
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

  export function startCooldown(unit: unit, spellId: number) {
    BlzStartUnitAbilityCooldown(
      unit, spellId, 
      getCooldownDefault(unit, spellId)
    );
  }

  export function getCooldownDefault(unit: unit, spellId: number) {
    return getCooldown(unit, spellId, 
      BlzGetUnitAbilityCooldown(unit, spellId, GetUnitAbilityLevel(unit, spellId)-1)
    );
  }

  export function getCooldown(unit: unit, spellId: number, startCd: number) {
    const player = GetOwningPlayer(unit);

    let newCd = startCd;

    // if (spellId == Id.tatsumakiVector) {
    //   if (LoadInteger(Globals.genericSpellHashtable, unitId, StringHash("tatsumaki_vector")) == 0) {
    //     // newCd = 3.0
    //   }
    // }

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
    if (GetUnitAbilityLevel(unit, Id.beerusFuryCDRFlag) > 0) {
      newCd *= 0.9;
    }
    if (GetUnitAbilityLevel(unit, Id.beerusIceCreamCDRFlag) > 0) {
      newCd *= 0.9;
    }
    if (GetUnitAbilityLevel(unit, Id.gojoSixEyesTrueSight) > 0) {
      newCd *= 0.5;
    }
    if (GetUnitAbilityLevel(unit, Id.cheongMyeongReturnPassive) > 0) {
      newCd *= 0.8;
    }

    if (UnitHasItemOfTypeBJ(unit, ItemConstants.SagaDrops.SPARE_PARTS)) {
      newCd *= 0.9;
    }
    return newCd;
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

      let newCd = getCooldown(
        unit, spellId, 
        BlzGetUnitAbilityCooldownRemaining(unit, spellId)
      );

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

  export function linkBeerusFoodCD(unit: unit, cd: number) {
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodSushi, cd);
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodPizza, cd);
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodRamen, cd);
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodIceCream, cd);
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodTakoyaki, cd);
    BlzStartUnitAbilityCooldown(unit, Id.beerusFoodPudding, cd);
  }

}