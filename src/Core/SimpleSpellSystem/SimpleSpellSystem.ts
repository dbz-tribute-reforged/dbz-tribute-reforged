import { Colorizer } from "Common/Colorizer";
import { BASE_DMG, Buffs, Constants, DebuffAbilities, Globals, Id, OrderIds } from "Common/Constants";
import { CoordMath } from "Common/CoordMath";
import { DamageData } from "Common/DamageData";
import { PathingCheck } from "Common/PathingCheck";
import { SoundHelper } from "Common/SoundHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { DragonBallsConstants } from "Core/DragonBallsSystem/DragonBallsConstants";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { CustomHero } from "CustomHero/CustomHero";

export module SimpleSpellSystem {

  export function initialize () {
    TriggerRegisterAnyUnitEventBJ(Globals.genericSpellTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
    TriggerAddAction(Globals.genericSpellTrigger, () => {
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

    Globals.genericSpellMap.set(Id.ceroCharge, SimpleSpellSystem.InitCero);
    Globals.genericSpellMap.set(Id.ceroFire, SimpleSpellSystem.InitCero);

    // SimpleSpellSystem.SetupBankai();

    // SimpleSpellSystem.SetupDartSpells();
    // SimpleSpellSystem.SetupMadnessDebuff();

    // SimpleSpellSystem.SetupAylaCharm();
    // SimpleSpellSystem.SetupMagusDarkMatter();

    // // SimpleSpellSystem.SetupAylaTripleKick(, Globals.customPlayers);
    // SimpleSpellSystem.SetupJungleRushBananaFallout();
    // SimpleSpellSystem.SetupBarrelCannon();
    
    // SimpleSpellSystem.SetupHirudegarnSkinChange();
    // SimpleSpellSystem.SetupVegetaFightingSpirit();

    // SimpleSpellSystem.SetupSchalaTeleportation();

    // SimpleSpellSystem.SetupYamchaCombos();

    // SimpleSpellSystem.SetupSkurvyPlunder();
    // SimpleSpellSystem.SetupSkurvyMirror();

    // SimpleSpellSystem.SetupSonicAbilities();
    // SimpleSpellSystem.SetupRoshiMafuba();

    // SimpleSpellSystem.SetupJacoAbilities();

    
    // add DDS stuff
    TriggerAddCondition(Globals.DDSTrigger, Condition(() => {
      const unit = BlzGetEventDamageTarget();
      const unitId = GetHandleId(unit);
      const spellId = LoadInteger(Globals.genericSpellHashtable, unitId, 0);
      const source = GetEventDamageSource();
      if (
        UnitHelper.isUnitAlive(unit) 
        && spellId != 0 
        && (
          spellId == Id.glare
          || spellId == Id.glare2
          || spellId == Id.hirudegarnDarkEyes
        )
        && IsUnitType(source, UNIT_TYPE_HERO)
      ) {
        const maxGlareDistance = 2500;
        const glareDamageMult = BASE_DMG.DFIST_EXPLOSION * 0.5;
        const glare2DamageMult = BASE_DMG.DFIST_EXPLOSION * 0.7;
        const glare2StrDiffJirenBonus = 1.05;
        const glare2StrDiffMult = 1.1;
        const glarePunishDamageMult = 0.15;
        const darkEyesPunishDamageMult = 0.25;

        SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);

        const player = GetOwningPlayer(unit);
        Globals.tmpVector.setPos(GetUnitX(unit), GetUnitY(unit));
        Globals.tmpVector2.setPos(GetUnitX(source), GetUnitY(source));

        if (CoordMath.distance(Globals.tmpVector, Globals.tmpVector2) < maxGlareDistance) {
          SetUnitX(unit, Globals.tmpVector2.x);
          SetUnitY(unit, Globals.tmpVector2.y);
              
          const castDummy = CreateUnit(
            player, 
            Constants.dummyCasterId, 
            Globals.tmpVector2.x, Globals.tmpVector2.y, 
            0
          );
          UnitAddAbility(castDummy, DebuffAbilities.STUN_ONE_SECOND);

          const customHero = Globals.customPlayers[GetPlayerId(player)].getCustomHero(unit);
          let spellPower = 1.0;
          if (customHero) {
            spellPower = customHero.spellPower;
          }

          let punishMult = glarePunishDamageMult;
          if (spellId == Id.hirudegarnDarkEyes) {
            punishMult = darkEyesPunishDamageMult;
          }

          let damageMult = glareDamageMult;
          if (spellId == Id.glare2) {
            damageMult = glare2DamageMult;
          }

          let damageBase = CustomAbility.BASE_DAMAGE + GetHeroStr(unit, true);
          if (spellId == Id.glare2) {
            damageBase += Math.max(0, glare2StrDiffMult * (glare2StrDiffJirenBonus * GetHeroStr(unit, true) - GetHeroStr(source, true)));
          }

          const abilityLevel = LoadInteger(Globals.genericSpellHashtable, unitId, 2);
          const damage = (
            (AOEDamage.getIntDamageMult(unit) * abilityLevel * spellPower * damageMult * damageBase) +
            GetEventDamage() * punishMult
          );

          UnitDamageTarget(
            unit,
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
          
          DestroyEffect(
            AddSpecialEffect(
              "Slam.mdl",
              Globals.tmpVector2.x, Globals.tmpVector2.y
            )
          );
          
          if (GetUnitTypeId(unit) == Id.jiren) {
            if (Math.random() * 100 < 5) {
              SoundHelper.playSoundOnUnit(unit, "Audio/Voice/JirenOmaeWaMouShindeiru.mp3", 3317);
            } else {
              SoundHelper.playSoundOnUnit(unit, "Audio/Voice/JirenGlare2.mp3", 1018);
            }
          }
          SoundHelper.playSoundOnUnit(unit, "Audio/Effects/Zanzo.mp3", 1149);
        }
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
    const braveSwordDamageMult = BASE_DMG.DFIST_EXPLOSION * 1.3;
    const braveSwordManaBurnMult = 0.01;
    const maxManaCostMult = 0.2;
    

    const caster = GetTriggerUnit();
    const casterId = GetHandleId(caster);
    const abilityLevel = GetUnitAbilityLevel(caster, spellId);
    const player = GetTriggerPlayer();

    tmpPos.setUnit(caster);
    SaveReal(Globals.genericSpellHashtable, casterId, 0, tmpPos.x);
    SaveReal(Globals.genericSpellHashtable, casterId, 1, tmpPos.y);

    const targetGroup = CreateGroup();

    GroupEnumUnitsInRange(
      targetGroup, 
      tmpPos.x, 
      tmpPos.y, 
      braveSwordAOE,
      null
    );
    
    let checkCount = 0;
    ForGroup(targetGroup, () => {
      const checkUnit = GetEnumUnit();
      if (
        UnitHelper.isUnitTargetableForPlayer(checkUnit, player) && 
        GetUnitAbilityLevel(checkUnit, Buffs.HEROS_SONG) > 0
      ) {
        ++checkCount;
      }
    });
    
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

      TimerStart(CreateTimer(), tickRate, true, () => {
        casterPos.setUnit(caster);
        if (time > jumpDuration) {
          
          const castDummy = CreateUnit(
            player, 
            Constants.dummyCasterId, 
            casterPos.x, casterPos.y, 
            0
          );
          UnitAddAbility(castDummy, DebuffAbilities.STUN_ONE_SECOND);

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
            GetHeroAgi(caster, true)
          );
          const manaBurn = damage * braveSwordManaBurnMult * abilityLevel;

          ForGroup(damageGroup, () => {
            const damagedUnit = GetEnumUnit();
            if (UnitHelper.isUnitTargetableForPlayer(damagedUnit, player)) {
              SetUnitState(
                damagedUnit, 
                UNIT_STATE_MANA, 
                Math.max(
                  0, 
                  GetUnitState(damagedUnit, UNIT_STATE_MANA) - manaBurn
                )
              );

              UnitDamageTarget(
                caster, 
                damagedUnit, 
                damage, 
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

          DestroyTimer(GetExpiredTimer());
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
      const playerForce = CreateForce();
      ForceAddPlayer(playerForce, player);
      DisplayTimedTextToForce(
        playerForce, 
        5, 
        "|cffff2020Error|r: No unit with |cffffff00Hero's Song|r in target area."
      );
      DestroyForce(playerForce);

      UnitRemoveAbility(caster, spellId);
      UnitAddAbility(caster, spellId);
      SetUnitAbilityLevel(caster, spellId, abilityLevel);
      UnitMakeAbilityPermanent(caster, true, spellId);
    }
    
    DestroyGroup(targetGroup);
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
    const targetGroup = CreateGroup();

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
          targetGroup, 
          targetPos.x, 
          targetPos.y, 
          shadowFistAOE,
          null
        );
        
        let stolenDragonBalls = 0;

        const casterDragonBallIndex = UnitHelper.getInventoryIndexOfItemType(caster, DragonBallsConstants.dragonBallItem);
        const casterInventoryCount = UnitInventoryCount(caster);

        ForGroup(targetGroup, () => {
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
        GroupClear(targetGroup);
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
    const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
    const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
    const senzuItem = CreateItem(senzuItemId, casterPos.x, casterPos.y);
    const direction = CoordMath.angleBetweenCoords(casterPos, targetPos);
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
    const newPos = new Vector2D(GetItemX(movedItem), GetItemY(movedItem));
    let counter: number = 0;
    TimerStart(CreateTimer(), 0.03, true, () => {
      if (
        counter >= duration
      ) {
        DestroyTimer(GetExpiredTimer());
      } else {
        if (counter < duration) {
          newPos.polarProjectCoords(
            newPos,
            direction,
            itemMS
          );

          if (PathingCheck.isGroundWalkable(newPos)) {
            SetItemPosition(movedItem, newPos.x, newPos.y);
          } else {
            newPos.x = GetItemX(movedItem);
            newPos.y = GetItemY(movedItem);
          }
        }
        
        if (
          counter > minDuration
          && SimpleSpellSystem.doAOEItemPickup(movedItem, newPos, stealAOE)
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

    const spellId = GetSpellAbilityId();
    const unit = GetTriggerUnit();
    const unitId = GetHandleId(unit);
    SaveInteger(Globals.genericSpellHashtable, unitId, 0, spellId);
    
    let effect: effect;
    if (spellId == Id.glare || spellId == Id.glare2) {
      effect = AddSpecialEffectTarget("AuraJirenCounter2.mdl", unit, "origin");
      // BlzSetSpecialEffectScale(effect, 1.5);
    } else {
      effect = AddSpecialEffectTarget("MagusDarkMist.mdl", unit, "head");
      // BlzSetSpecialEffectScale(effect, 2.0);
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
    }

    TimerStart(CreateTimer(), timerDuration, false, () => {
      DestroyTimer(GetExpiredTimer());
      SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);
      SaveInteger(Globals.genericSpellHashtable, unitId, 2, 0);
      DestroyEffect(LoadEffectHandle(Globals.genericSpellHashtable, unitId, 1));
    });
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

  export function SetupBankai() {

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.bankai || spellId == Id.bankaiFinal) {
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
    });
  }

  export function SetupDartSpells() {
    const dragoonTransformationBuff = FourCC("B049");
    const spellAmpBonus = 0.25;
    const duration = 10.0;

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.redEyedDragonSummoning) {
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
              GetUnitAbilityLevel(caster, dragoonTransformationBuff) == 0
            ) {
              customHero.removeSpellPower(spellAmpBonus);
              DestroyTimer(GetExpiredTimer());
            }
          });
        }
      } else if (spellId == Id.dragoonTransformation) {
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
                GetUnitAbilityLevel(caster, dragoonTransformationBuff) == 0
              ) {
                abil.setCd(0);
                abil.setCurrentTick(abil.getDuration());
                DestroyTimer(GetExpiredTimer());
              }
            });
          }
        }
      }
    });

  }

  export function SetupMadnessDebuff() {
    // 0: stacks
    const madnessHashtable = InitHashtable();
    const maxMadnessStacks = 7;
    const pos = new Vector2D();
    const madnessStunAbility = FourCC('A0I7');
    const madnessStunOrder = 852095;
    const madnessStunDamage = 0.1;
    const madnessCurseBuff = FourCC("B03X");
    const madnessCurseOrder = 852190;

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.madnessDebuffSlow) {
        const target = GetSpellTargetUnit();
        const targetId = GetHandleId(target);
        if (GetUnitAbilityLevel(target, madnessCurseBuff) == 0) {
          const stacks = 1+LoadInteger(madnessHashtable, targetId, 0);

          TextTagHelper.showPlayerColorTextOnUnit(
            I2S(stacks), 3, target, stacks + 8     
          );

          if (stacks >= maxMadnessStacks) {
            FlushChildHashtable(madnessHashtable, targetId);
            // stun.. n debuff 
            const caster = GetTriggerUnit();
            const casterPlayer = GetOwningPlayer(caster);
            pos.setUnit(caster);

            const castDummy = CreateUnit(
              casterPlayer, 
              Constants.dummyCasterId, 
              pos.x, pos.y, 
              0
            );
            UnitAddAbility(castDummy, Id.madnessDebuffCurse);
            UnitAddAbility(castDummy, madnessStunAbility);

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
            SaveInteger(madnessHashtable, targetId, 0, stacks);
          }
        }
      }
    });
  }

  export function SetupMagusDarkMatter() {
    const darkMatterDamage: DamageData = new DamageData(
      BASE_DMG.SPIRIT_BOMB_DPS * 0.1,
      bj_HEROSTAT_INT,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL, 
      WEAPON_TYPE_WHOKNOWS
    );
    const closenessDamageMult = 1.0;
    const durationDamageMult = 1.0;
    const aoe = 750;
    const angle = 75;
    const closenessAngle = 90 + 12;
    const distance = 40;
    const closenessDistanceMult = -0.25;
    const maxDuration = 66;
    const targetPos = new Vector2D();
    const tmpGroup = CreateGroup();
    
    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.magusDarkMatter) {
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
                targetPos,
                tmpGroup
              );
              ++currentTick;
            }
          });
        }
      }
    });
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
    targetPos: Vector2D,
    tmpGroup: group
  ) {
    GroupClear(tmpGroup);
    GroupEnumUnitsInRange(
      tmpGroup, 
      currentPos.x, 
      currentPos.y, 
      aoe,
      null
    );

    // this.currentCoord.setUnit(input.caster.unit);
    ForGroup(tmpGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, casterPlayer)) {

        targetPos.setUnit(target);
        const targetDistance = CoordMath.distance(currentPos, targetPos);

        // closenessRatio = 1 at 0 distance, 0 at max distance
        const closenessRatio = 1 - (targetDistance / Math.max(1, aoe));

        const projectionAngle = 
          angle + 
          (closenessAngle - angle) * closenessRatio + 
          CoordMath.angleBetweenCoords(currentPos, targetPos);
        
        const projectionDistance = 
          distance + 
          (closenessDistanceMult * distance) * closenessRatio;
        
        targetPos.polarProjectCoords(
          targetPos, 
          projectionAngle,
          projectionDistance
        );

        PathingCheck.moveGroundUnitToCoord(target, targetPos);
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

    GroupClear(tmpGroup);
  }


  export function SetupAylaCharm() {
    const charmDuration = 10.0;
    const maxHPReduction = 0.13;
    const allyHPModifier = 0.5;
    const stealThreshold = 0.5;

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.aylaCharm) {
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
    });

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



  export function SetupJungleRushBananaFallout() {
    const bananaThrowDuration = 24;
    const bananaThrowSpeed = 49;
    const bananaThrowStealMinDuration = 16;
    const bananaThrowStealAOE = 300;
    const bananaThrowAmount = 6;
    const bananaThrowDirectionOffset = 360 / Math.max(1, bananaThrowAmount);
    const bananaItemId = FourCC("I044");
    
    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.dkJungleRush) {
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
            const bananaItem = CreateItem(bananaItemId, GetUnitX(caster), GetUnitY(caster));
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
    });
  }


  export function SetupBarrelCannon() {
    const barrelDuration = 33 * 10;
    const barrelShootMinDuration = 33;
    const updateRate = 0.03;
    const turnRate = 9.0;
    const barrelAOE = 300;
    const barrelMoveSpeed = 50;
    const barrelMoveDuration = 24;
    const barrelMoveMinDuration = 12;
    const minOffsetDistance = 30;
    const casterPos: Vector2D = new Vector2D(0, 0);
    const tmpPos: Vector2D = new Vector2D(0, 0);
    const barrelMoveGroup = CreateGroup();
    const barrelMoveTrigger = CreateTrigger();

    // 0: timer
    // 1: direction (angle)
    // 2: prev x
    // 3: prev y
    const barrelMoveHashtable = InitHashtable();

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.dkBarrelCannon) {
        const caster = GetTriggerUnit();
        const casterId = GetHandleId(caster);
        const player = GetTriggerPlayer();

        casterPos.setUnit(caster);

        // create a barrel blast
        const barrelDummy = CreateUnit(
          player, 
          Constants.dummyCasterId, 
          casterPos.x, casterPos.y, 
          0
        );

        const newHP = 250 * GetHeroLevel(caster) + 1000;
        BlzSetUnitMaxHP(barrelDummy, newHP);
        ShowUnitHide(barrelDummy);

        const barrelSfx = AddSpecialEffect(
          "DKBarrelCannon.mdl",
          casterPos.x,
          casterPos.y
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
              const barrelMoveTime = LoadInteger(barrelMoveHashtable, unitId, 0);
              if (
                UnitHelper.isUnitAlive(unit)
                // && IsUnitType(unit, UNIT_TYPE_HERO)
                && UnitHelper.isUnitTargetableForPlayer(unit, player, true)
                && (
                  barrelMoveTime <= 0 ||
                  barrelMoveTime > barrelMoveMinDuration
                )
              ) {
                SaveInteger(barrelMoveHashtable, unitId, 0, 1);
                SaveReal(barrelMoveHashtable, unitId, 1, direction);
                SaveReal(barrelMoveHashtable, unitId, 2, GetUnitX(unit));
                SaveReal(barrelMoveHashtable, unitId, 3, GetUnitY(unit));
                GroupAddUnit(barrelMoveGroup, unit);
                EnableTrigger(barrelMoveTrigger);

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
    });

    TriggerRegisterTimerEventPeriodic(barrelMoveTrigger, 0.03);
    TriggerAddAction(barrelMoveTrigger, () => {
      ForGroup(barrelMoveGroup, () => {
        // move barrel
        const unit = GetEnumUnit();
        const unitId = GetHandleId(unit);
        const angle = LoadReal(barrelMoveHashtable, unitId, 1);
        const expectedX = LoadReal(barrelMoveHashtable, unitId, 2);
        const expectedY = LoadReal(barrelMoveHashtable, unitId, 3);

        tmpPos.setPos(expectedX, expectedY);
        casterPos.setUnit(unit);
        const offsetFromExpected = CoordMath.distance(casterPos, tmpPos);

        // normal direction movement
        casterPos.polarProjectCoords(casterPos, angle, barrelMoveSpeed);
        PathingCheck.moveGroundUnitToCoord(unit, casterPos);
        
        // if barrel strayed from expected path, attempt to move it back (up to a limit)
        if (offsetFromExpected >= minOffsetDistance) {
          tmpPos.polarProjectCoords(tmpPos, angle, barrelMoveSpeed);

          const reverseAngle = CoordMath.angleBetweenCoords(casterPos, tmpPos);
          casterPos.polarProjectCoords(
            casterPos, 
            reverseAngle, 
            Math.min(offsetFromExpected, minOffsetDistance)
          );
          PathingCheck.moveGroundUnitToCoord(unit, casterPos);
        }

        SaveReal(barrelMoveHashtable, unitId, 2, GetUnitX(unit));
        SaveReal(barrelMoveHashtable, unitId, 3, GetUnitY(unit));
        SetUnitFacingTimed(unit, angle, 0.03);

        const duration = LoadInteger(barrelMoveHashtable, unitId, 0);
        if (duration >= barrelMoveDuration) {
          FlushChildHashtable(barrelMoveHashtable, unitId);
          GroupRemoveUnit(barrelMoveGroup, unit);
        } else {
          SaveInteger(barrelMoveHashtable, unitId, 0, duration + 1);
        }
      });

      if (CountUnitsInGroup(barrelMoveGroup) == 0) {
        DisableTrigger(barrelMoveTrigger);
      }
    });
    DisableTrigger(barrelMoveTrigger);
  }


  export function SetupHirudegarnSkinChange() {
    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const unit = GetTriggerUnit();
      const unitId = GetUnitTypeId(unit);
      const player = GetOwningPlayer(unit);
      if (unitId == Id.hirudegarn) {
        const abilityId = GetSpellAbilityId();
        if (abilityId == Id.hirudegarnDarkMist) {


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
    });
  }


  export function SetupVegetaFightingSpirit() {
    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.vegetaFightingSpirit) {
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
    });
  }

  export function SetupSchalaTeleportation() {
    const schalaTpMoveDuration = 66;
    const schalaTpMoveDuration2 = 33;
    const schalaTpEndTick = 100;
    const schalaTpAOE = 600;
    const schalaTpMaxDist = 6000;

    const tmpPos = new Vector2D(0, 0);

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (
        spellId == Id.schalaTeleportation 
        || spellId == Id.schalaTeleportation2
      ) {
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
        let beamSpeed = Math.min(4000, Math.max(1500, CoordMath.distance(casterPos, targetPos)));
        if (spellId == Id.schalaTeleportation) {
          beamSpeed /= schalaTpMoveDuration;
        } else if (spellId == Id.schalaTeleportation2) {
          beamSpeed /= schalaTpMoveDuration2;
        }
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
        TimerStart(CreateTimer(), 0.03, true, () => {
          if (tick > schalaTpEndTick) {
            RemoveUnit(tpUnit);
            DestroyEffect(sfxCast);
            DestroyEffect(sfxBeam);
            DestroyTimer(GetExpiredTimer());
          } else {
            if (
              (
                spellId == Id.schalaTeleportation && 
                tick < schalaTpMoveDuration
              ) ||
              (
                spellId == Id.schalaTeleportation2 &&
                tick < schalaTpMoveDuration2
              )
            ) {
              targetPos.setPos(GetUnitX(tpUnit), GetUnitY(tpUnit));
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
                  IsUnitAlly(unit, player) &&
                  UnitHelper.isUnitTargetableForPlayer(unit, player, true) &&
                  GetUnitTypeId(unit) != Id.schala
                  // true
                ) {
                  tmpPos.setPos(GetUnitX(unit), GetUnitY(unit));
                  const distance = CoordMath.distance(tmpPos, casterPos);
                  if (CoordMath.distance(tmpPos, targetPos) < schalaTpMaxDist) {                  
                    tmpPos.polarProjectCoords(
                      targetPos, 
                      CoordMath.angleBetweenCoords(casterPos, tmpPos), 
                      distance
                    );
                    PathingCheck.moveFlyingUnitToCoordExcludingDeepWater(unit, tmpPos);
                    DestroyEffect(
                      AddSpecialEffect(
                        "Abilities\\Spells\\Human\\MassTeleport\\MassTeleportCaster.mdl", 
                        tmpPos.x, tmpPos.y
                      )
                    );

                    if (
                      IsUnitType(unit, UNIT_TYPE_HERO)
                      && !IsUnitType(unit, UNIT_TYPE_SUMMONED)
                      && GetPlayerController(GetOwningPlayer(unit)) == MAP_CONTROL_USER
                    ) {
                      SetCameraPositionForPlayer(GetOwningPlayer(unit), tmpPos.x, tmpPos.y);
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
    });

  }

  export function SetupYamchaCombos() {
    // globals hashtable
    // 0: 1st slot
    // 1: 2nd slot
    // 2: 3rd slot
    const yamchaComobCdInc = 0.2;
    const yamchaComobCdMax = 15;


    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (
        spellId == Id.yamchaRLightPunch 
        || spellId == Id.yamchaRMediumPunch
        || spellId == Id.yamchaRHeavyPunch
      ) {
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
              customHero,
              player,
              GetUnitAbilityLevel(unit, spellId),
              Globals.customPlayers[playerId].orderPoint,
              Globals.customPlayers[playerId].mouseData,
              Globals.customPlayers[playerId].orderPoint.clone(),
              undefined,
              undefined,
              dmgMult
            );

            if (customHero.canCastAbility(abilName, abilityInput)) {
              // apply cooldown penalty

              const abilNames = [];
              let numCd = 0;
              for (const customAbility of customHero.getCustomAbilities()) {
                if (
                  SubString(customAbility.getName(), 0, 7) == "YamchaR"
                  && customAbility.isOnCooldown()
                ) {
                  abilNames.push(customAbility.getName());
                  numCd++;
                }
              }

              for (const name of abilNames) {
                const customAbility = customHero.getAbility(name);
                if (customAbility) {
                  customAbility.setCd(
                    Math.min(
                      yamchaComobCdMax,
                      customAbility.getCurrentCd() + (yamchaComobCdInc * numCd)
                    )
                  );
                }
              }

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
    });

    // const resetAfterComboTrigger = CreateTrigger();
  }





  export function SetupSkurvyPlunder() {
    const plunderAOE = 350;
    const plunderDuration = 80; // RTT 
    const plunderSendOutDuration = 40;
    const plunderSpeed = 40;
    const plunderDamageMult = BASE_DMG.DFIST_EXPLOSION * 0.7;
    const plunderDamageMultPerItem = 0.2;
    const maxPlunderItems = 1;

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.skurvyPlunder) {
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

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.skurvyMirrorNeverLies) {
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
    });
  }

  export function SetupSonicAbilities() {
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

    
    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (
        spellId == Id.sonicSpin 
        || spellId == Id.sonicHomingAttack
        || spellId == Id.sonicSpinDash
        || spellId == Id.sonicLightSpeedDash
        || spellId == Id.sonicSuper
      ) {
        
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
    });

    
    // if unit picks up dragonball and is sonic, add chaos emerald
    ItemStackingManager.getInstance().addStackableItemType(ItemConstants.chaosEmerald, 7);
  }


  export function SetupRoshiMafuba() {
    const mafubaMaxHpMult = 0.05;
    const mafubaCurrentHpMult = 0.1;
    const mafubaSagaDmgMult = 0.25;

    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();
      if (spellId == Id.roshiMafuba) {
        // deal damage self
        const caster = GetTriggerUnit();
        const currentHp = GetUnitState(caster, UNIT_STATE_LIFE);
        const selfDmg = (
          mafubaMaxHpMult * GetUnitState(caster, UNIT_STATE_MAX_LIFE)
          + mafubaCurrentHpMult * currentHp
        );
        SetUnitState(caster, UNIT_STATE_LIFE, Math.max(1, currentHp - selfDmg));

      } else if (spellId == DebuffAbilities.MAFUBA_SEALED) {

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
              for (const ability of hero.abilities.getCustomAbilities()) {
                if (ability.isInUse()) {
                  CastTimeHelper.getInstance().forceEndActivatedAbility(ability);
                }
              }
            }
          }
        }
      }
    });
  }

  export function getJacoEliteBeamMult(unit: unit) {
    const eliteBeamMaxTicks = 166;
    const unitId = GetHandleId(unit);
    const isBonus = LoadInteger(Globals.genericSpellHashtable, unitId, 3) == 1;
    const chargeTicks = isBonus ? eliteBeamMaxTicks : LoadInteger(Globals.genericSpellHashtable, unitId, 1);
    let mult = 1 + chargeTicks / eliteBeamMaxTicks;
    if (isBonus) mult += 1;
    // print("ELITE BEAM MULT: ", mult, " BONUS:", isBonus);
    return mult;
  }

  export function SetupJacoAbilities() {
    // globals hashtable
    // 0: charge state (0 = base, 1 = charge, 2 = primed)
    // 1: charge ticks (0 - 166)
    // 2: charge bonus start point (prime around this time to receive full bonus)
    // 3: is charge bonused

    const eliteBeamPrimeStart = 99;
    const eliteBeamPrimeVariance = 1;
    const eliteBeamPrimeBonusLeeway = 33;

    const extinctionBombDelay = 5;
    const extinctionBombMaxDist = 600;
    const extinctionBombAOE = 500;
    const extinctionBombStrMult = 2;
    const extinctionBombHpMult = 0.75;


    TriggerAddAction(Globals.genericSpellTrigger, () => {
      const spellId = GetSpellAbilityId();

      if (
        spellId == Id.jacoEliteBeamCharge
        || spellId == Id.jacoEliteBeamPrime
        || spellId == Id.jacoEliteBeamFire
        || spellId == Id.jacoExtinctionBomb
        || spellId == Id.jacoElitePose
      ) {
        const unit = GetTriggerUnit();
        const unitId = GetHandleId(unit);
        const player = GetOwningPlayer(unit);
        if (spellId == Id.jacoEliteBeamCharge) {
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

        } else if (spellId == Id.jacoEliteBeamPrime) {
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
        } else if (spellId == Id.jacoEliteBeamFire) {
          // swap to charge
          SetPlayerAbilityAvailable(player, Id.jacoEliteBeamCharge, true);
          SetPlayerAbilityAvailable(player, Id.jacoEliteBeamPrime, false);
          SetPlayerAbilityAvailable(player, Id.jacoEliteBeamFire, false);
          SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);

        } else if (spellId == Id.jacoExtinctionBomb) {

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
          SetUnitMoveSpeed(bomb, 522);
          
          // blow it up in 5seconds
          let delay = extinctionBombDelay;
          let ttSize = math.max(5, 5 * (extinctionBombDelay + 1 - delay));
          TextTagHelper.showTempText(
            Colorizer.getPlayerColorText(playerId) + I2S(delay) + "!",
            GetUnitX(bomb), GetUnitY(bomb),
            ttSize, 1.5, 0.5
          );

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
                GetHeroStr(unit, true) * extinctionBombStrMult
                + extinctionBombHpMult * (GetUnitState(unit, UNIT_STATE_MAX_LIFE) - GetUnitState(unit, UNIT_STATE_LIFE))
              );
              ForGroup(Globals.tmpUnitGroup, () => {
                const damagedUnit = GetEnumUnit();
                if (
                  UnitHelper.isUnitTargetableForPlayer(damagedUnit, player)
                  || damagedUnit == unit
                ) {
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
        } else if (spellId == Id.jacoElitePose) {
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
      }
    });
  }


}