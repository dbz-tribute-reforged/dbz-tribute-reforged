import { CustomPlayer } from "./CustomPlayer";
import { CustomHero } from "CustomHero/CustomHero";
import { Constants, Id, Globals, BASE_DMG, DebuffAbilities, Buffs, OrderIds, CostType, Capsules } from "Common/Constants";
import { ToolTipOrganizer } from "Common/ToolTipOrganizer";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { TextTagHelper } from "Common/TextTagHelper";
import { Colorizer } from "Common/Colorizer";
import { WinLossHelper } from "Common/WinLossHelper";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { FrameHelper } from "Common/FrameHelper";
import { ExperienceManager } from "Core/ExperienceSystem/ExperienceManager";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { SoundHelper } from "Common/SoundHelper";
import { DamageData } from "Common/DamageData";
import { setupCustomUI } from "./SetupCustomUI";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";
import { SagaAIData } from "Core/SagaSystem/SagaAISystem/SagaAIData";
import { DragonBallsConstants } from "Core/DragonBallsSystem/DragonBallsConstants";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { HeroSelectorManager } from "Core/HeroSelector/HeroSelectorManager";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { DualTechManager } from "CustomAbility/DualTech/DualTechManager";

export function setupHostPlayerTransfer() {
  const hostPlayerTransfer = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerEventLeave(hostPlayerTransfer, Player(i));
  }
  TriggerAddAction(hostPlayerTransfer, () => {
    if (
      GetTriggerPlayer() == Globals.hostPlayer && 
      GetPlayerController(GetTriggerPlayer()) == MAP_CONTROL_USER
    ) {
      transferHostPlayer();
    }
  });
}

export function transferHostPlayer() {
  for (let i = 0; i < Constants.hostPlayerOrder.length; ++i) {
    const newHost = Player(Constants.hostPlayerOrder[i]);
    if (
      IsPlayerSlotState(newHost, PLAYER_SLOT_STATE_PLAYING) && 
      GetPlayerController(newHost) == MAP_CONTROL_USER && 
      newHost != Globals.hostPlayer
    ) {
      Globals.hostPlayer = newHost;
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 
        15, 
        "Player " + (Constants.hostPlayerOrder[i]+1).toString() + " is now the host"
      );
      break;
    }
  }
}

export function addAbilityAction(abilityTrigger: trigger, name: string) {
  TriggerAddAction(abilityTrigger, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    // NOTE: do not use GetUnitsSelectedAll(GetTriggerPlayer())
    // it will cause weird selection bugs during multiplayer
    // that is not normally testable via singleplayer

    // const customHero = Globals.customPlayers[playerId].getCurrentlySelectedCustomHero();
    for (const customHero of Globals.customPlayers[playerId].allHeroes) {
      if (customHero && IsUnitSelected(customHero.unit, player)) {
        const abilityInput = new CustomAbilityInput(
          0,
          customHero,
          player,
          1,
          Globals.customPlayers[playerId].orderPoint,
          Globals.customPlayers[playerId].mouseData,
          Globals.customPlayers[playerId].lastCastPoint.clone(),
          Globals.customPlayers[playerId].targetUnit,
          Globals.customPlayers[playerId].lastCastUnit,
        );

        if (customHero.canCastAbility(name, abilityInput)) {
          // show custom ability name on activation, if castable
          TextTagHelper.showPlayerColorTextOnUnit(name, playerId, customHero.unit);
          if (name == AbilityNames.BasicAbility.MAX_POWER) {
            SoundHelper.playSoundOnUnit(customHero.unit, "Audio/Effects/PowerUp3.mp3", 11598);
          }
          customHero.useAbility(name, abilityInput);
        }
      }
    }
  });
}

export function addKeyEvent(trigger: trigger, oskey: oskeytype, metaKey: number, keyDown: boolean) {
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(trigger, Player(i), oskey, metaKey, keyDown);
  }
}

export function setAbilityUIToAbility(
  hero: CustomHero, 
  index: number, 
  tooltipName: string,
  tooltipTitle: string,
  tooltipBody: string,
  iconEnabled: string,
  iconDisabled: string,
) {
  BlzFrameSetTexture(BlzGetFrameByName("MyAbilityIconBar", index), iconEnabled, 0, true);
  BlzFrameSetTexture(BlzGetFrameByName("MyAbilityIconBarBackground", index), iconDisabled, 0, true);
  BlzFrameSetText(BlzGetFrameByName("MyToolTipTextTitle", index), tooltipTitle);
  BlzFrameSetText(BlzGetFrameByName("MyToolTipTextValue", index), tooltipBody);
  ToolTipOrganizer.resizeToolTipHeightByValue(BlzGetFrameByName(tooltipName, index), tooltipBody);
}

export function updateHeroAbilityCD(heroAbility: CustomAbility, index: number, cdText: string, cdValue: number) {
  BlzFrameSetValue(BlzGetFrameByName("MyAbilityIconBar", index), cdValue);
  BlzFrameSetText(BlzGetFrameByName("MyAbilityIconBarText", index), cdText);
}

export function updateSelectedUnitBars(
  unit: unit,
  hpPct: string,
  mpPct: string,
  spPct: string,
  percentSp: number,
  spellPowerText: string,
) {
  BlzFrameSetValue(BlzGetFrameByName("MyHPBar", 0), GetUnitLifePercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyMPBar", 0), GetUnitManaPercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MySPBar", 0), percentSp);
  BlzFrameSetText(BlzGetFrameByName("MyHPBarText", 0), hpPct);
  BlzFrameSetText(BlzGetFrameByName("MyMPBarText", 0), mpPct);
  BlzFrameSetText(BlzGetFrameByName("MySPBarText", 0), spPct);
	BlzFrameSetText(BlzGetFrameByName("MySpellPowerBarText", 0), spellPowerText);
}

export function isValidOrderByPlayer(
  unit: unit,
  player: player,
): boolean {
  const unitTypeId = GetUnitTypeId(unit);
  return (
    GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING&&
    unitTypeId != Constants.dummyBeamUnitId && 
    unitTypeId != Constants.dummyCasterId
  );
}

export function CustomPlayerTest() {
  // Globals.customPlayers = [];

  const addHeroToPlayer = CreateTrigger();
	for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerSelectionEventBJ(addHeroToPlayer, Player(i), true);
  }
	TriggerAddAction(addHeroToPlayer, () => {
    const selectedUnit = GetTriggerUnit();
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    Globals.customPlayers[playerId].addHero(selectedUnit);
    Globals.customPlayers[playerId].addUnit(selectedUnit);
    Globals.customPlayers[playerId].selectedUnit = GetTriggerUnit();

    for (let i = 0 ; i < Constants.maxSubAbilities; ++i) {
      let customHero = Globals.customPlayers[playerId].getLastSelectedOwnedCustomHero();
      // prevent string table desyncs
      let tooltipName = "abilityButton" + i + "ToolTip";
      if (customHero) {
        let heroAbility = customHero.getAbilityByIndex(i);
        if (heroAbility) {
          let tooltipTitle = heroAbility.tooltip.title;
          let tooltipBody = heroAbility.tooltip.body;
          let iconEnabled = heroAbility.icon.enabled;
          let iconDisabled = heroAbility.icon.disabled;
          // BJDebugMsg(tooltipName + " " + tooltipTitle + " " + tooltipBody + " " + iconEnabled + " " + iconDisabled);
          
          // register abilities to UI frames
          if (GetTriggerPlayer() == GetLocalPlayer()) {
            setAbilityUIToAbility(
              customHero, 
              i, 
              tooltipName, 
              tooltipTitle, 
              tooltipBody, 
              iconEnabled, 
              iconDisabled
            );
          }
        }
      }
    }
  });
  
  TimerStart(CreateTimer(), 30.0, true, () => {
    for (const customPlayer of Globals.customPlayers) {
      customPlayer.cleanupRemovedHeroes();
    }
  });

  TimerStart(CreateTimer(), 10, true, () => {
    for (const customPlayer of Globals.customPlayers) {
      customPlayer.cleanupRemovedUnits();
    }
  });

  

  // // update mouse positions for now
  // // might be a bit laggy?
  // const updatePlayerMouseData = CreateTrigger();
	// for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
  //   TriggerRegisterPlayerMouseEventBJ(updatePlayerMouseData, Player(i), bj_MOUSEEVENTTYPE_MOVE);
	// }
	// TriggerAddAction(updatePlayerMouseData, () => {
  //   const player = GetTriggerPlayer();
  //   const playerId = GetPlayerId(player);
  //   if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
  //     const x = BlzGetTriggerPlayerMouseX();
  //     const y = BlzGetTriggerPlayerMouseY();
  //     if (x != 0 && y != 0) {
  //       Globals.customPlayers[playerId].mouseData.x = x;
  //       Globals.customPlayers[playerId].mouseData.y = y;
  //     }
  //   }
  // });


  const updatePlayerOrderPoint = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(updatePlayerOrderPoint, Player(i), EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
    TriggerRegisterPlayerUnitEventSimple(updatePlayerOrderPoint, Player(i), EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
  }
  TriggerAddCondition(updatePlayerOrderPoint, Condition(() => {
    const unit = GetTriggerUnit();
    if (!IsUnitType(unit, UNIT_TYPE_HERO)) return false;

    const unitTypeId = GetUnitTypeId(unit);
    const targetWidget = GetOrderTarget();
    if (
      GetPlayerSlotState(GetTriggerPlayer()) == PLAYER_SLOT_STATE_PLAYING &&
      unitTypeId != Constants.dummyBeamUnitId && 
      unitTypeId != Constants.dummyCasterId
    ) {
      const playerId = GetPlayerId(GetTriggerPlayer());
      Globals.customPlayers[playerId].lastOrderId = GetIssuedOrderId();
      if (targetWidget) {
        Globals.customPlayers[playerId].orderPoint.setWidget(targetWidget);
        Globals.customPlayers[playerId].orderWidget = targetWidget;
      } else {
        const x = GetOrderPointX();
        const y = GetOrderPointY();
        if (x != 0 && y != 0) {
          Globals.customPlayers[playerId].orderPoint.x = x;
          Globals.customPlayers[playerId].orderPoint.y = y;
          Globals.customPlayers[playerId].orderWidget = null;
        }
      }
    }
    if (unitTypeId == Id.skurvy) {
      skurvyMirrorProcessOrder();
    }
    return false;
  }));

  const updatePlayerTargetPoint = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(updatePlayerTargetPoint, Player(i), EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
  }
  TriggerAddCondition(updatePlayerTargetPoint, Condition(() => {
    if (isValidOrderByPlayer(GetTriggerUnit(), GetTriggerPlayer())) {
      const playerId = GetPlayerId(GetTriggerPlayer());
      Globals.customPlayers[playerId].targetUnit = GetOrderTargetUnit();
    }
    return false;
  }));

  const updatePlayerLastCastPoint = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(updatePlayerLastCastPoint, Player(i), EVENT_PLAYER_UNIT_SPELL_CAST);
  }
  TriggerAddCondition(updatePlayerLastCastPoint, Condition(() => {
    if (isValidOrderByPlayer(GetTriggerUnit(), GetTriggerPlayer())) {
      const playerId = GetPlayerId(GetTriggerPlayer());
      Globals.customPlayers[playerId].lastCastPoint.x = GetSpellTargetX();
      Globals.customPlayers[playerId].lastCastPoint.y = GetSpellTargetY();
    }
    return false;
  }));

  const linkNormalAbilityToCustomAbility = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(linkNormalAbilityToCustomAbility, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT);
  }
  TriggerAddCondition(linkNormalAbilityToCustomAbility, Condition(() => {
    if (isValidOrderByPlayer(GetTriggerUnit(), GetTriggerPlayer())) {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      const abilityId = GetSpellAbilityId();
      Globals.customPlayers[playerId].lastCastUnit = GetSpellTargetUnit();

      if (Globals.showAbilityFloatingText) {
        if (
          IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO)
          && abilityId != Id.yamchaRLightPunch
          && abilityId != Id.yamchaRMediumPunch 
          && abilityId != Id.yamchaRHeavyPunch
        ) {
          // show ability name on activation
          TextTagHelper.showPlayerColorTextOnUnit(
            GetAbilityName(abilityId), 
            playerId, 
            GetTriggerUnit()
          );
        }
      }
      
      if (abilityId == Id.ceroFire) return false;

      const spellName = abilityCodesToNames.get(abilityId);
 
      if (spellName) { 
        const caster = GetTriggerUnit();
        const abilityLevel = GetUnitAbilityLevel(caster, abilityId);
        Globals.customPlayers[playerId].selectedUnit = caster;
        let damageMult = 1.0;
        if (abilityId == Id.ftSwordOfHope) {
          damageMult *= getSwordOfHopeMult(player);
        }
        if (GetUnitTypeId(caster) == Id.shotoTodoroki) {
          damageMult *= getTodorokiMult(caster, abilityId);
        }
        if (abilityId == Id.jacoEliteBeamFire) {
          damageMult *= getJacoEliteBeamMult(caster);
        }


        let spellTargetUnit = undefined;
        if (GetSpellTargetUnit()) {
          Globals.customPlayers[playerId].targetUnit = GetSpellTargetUnit();
          spellTargetUnit = Globals.customPlayers[playerId].targetUnit;
        }
        const customHero = Globals.customPlayers[playerId].getCurrentlySelectedCustomHero();
        if (customHero) {
          // temp fix for double ss rage trigger
          if (
            spellName != AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE || 
            GetUnitTypeId(customHero.unit) != FourCC("H08I")
          ) {
            const input = new CustomAbilityInput(
              abilityId,
              customHero,
              player,
              abilityLevel,
              Globals.customPlayers[playerId].orderPoint,
              Globals.customPlayers[playerId].mouseData,
              Globals.customPlayers[playerId].lastCastPoint.clone(),
              spellTargetUnit,
              GetSpellTargetUnit(),
              damageMult
            );

            let do_abil = true;
            if (DualTechManager.getInstance().has(abilityId)) {
              do_abil = DualTechManager.getInstance().execute(abilityId, input);
            }
            if (do_abil) customHero.useAbility(spellName,input);
          }
        }
      }
    }
    return false;
  }));

  
  // stop replacement trigger
  const stopOrderTrigger = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(stopOrderTrigger, Player(i), OSKEY_S, 0, true);
  }
  TriggerAddAction(stopOrderTrigger, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    for (const unit of Globals.customPlayers[playerId].allUnits) {
      if (unit && IsUnitSelected(unit, player)) {
        IssueImmediateOrderById(unit, OrderIds.STOP);
      }
    }
    return false;
  });

  // hold replacement trigger
  const holdPositionOrderTrigger = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(holdPositionOrderTrigger, Player(i), OSKEY_H, 0, true);
  }
  TriggerAddAction(holdPositionOrderTrigger, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    for (const unit of Globals.customPlayers[playerId].allUnits) {
      if (unit && IsUnitSelected(unit, player)) {
        IssueImmediateOrderById(unit, OrderIds.HOLD_POSITION);
      }
    }
    return false;
  });

  // zanzo activation trigger
  // tied to z for now
  const abil0 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil0, BlzGetFrameByName("abilityButton0", 0), FRAMEEVENT_CONTROL_CLICK);
  // replace key events with more organized method of key reading
  addKeyEvent(abil0, OSKEY_Z, 0, true);
  addKeyEvent(abil0, OSKEY_Y, 0, true);
  addAbilityAction(abil0, AbilityNames.BasicAbility.ZANZO_DASH);
  addAbilityAction(abil0, AbilityNames.BasicAbility.ZANZOKEN);

  const abil1 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil1, BlzGetFrameByName("abilityButton1", 1), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil1, OSKEY_X, 0, true);
  addAbilityAction(abil1, AbilityNames.BasicAbility.GUARD);

  const abil2 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil2, BlzGetFrameByName("abilityButton2", 2), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil2, OSKEY_C, 0, true);
  addAbilityAction(abil2, AbilityNames.BasicAbility.MAX_POWER);
  addAbilityAction(abil2, AbilityNames.Cell.SUPER_CHARGE);

  const abil3 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil3, BlzGetFrameByName("abilityButton3", 3), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil3, OSKEY_V, 0, true);
  addAbilityAction(abil3, AbilityNames.BasicAbility.DEFLECT);
  addAbilityAction(abil3, AbilityNames.DonkeyKong.THRILLA_GORILLA); // hack to give DK Thrilla Gorilla
  

  /*

  const abil3 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil3, BlzGetFrameByName("abilityButton3", 3), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil3, OSKEY_Q, 0, true);
  addAbilityAction(abil3, AbilityNames.Bardock.FUTURE_SIGHT);

  const abil4 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil4, BlzGetFrameByName("abilityButton4", 4), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil4, OSKEY_W, 0, true);
  addAbilityAction(abil4, AbilityNames.Bardock.TYRANT_LANCER);

  const abil5 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil5, BlzGetFrameByName("abilityButton5", 5), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil5, OSKEY_E, 0, true);
  addAbilityAction(abil5, AbilityNames.Bardock.RIOT_JAVELIN);

  const abil6 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil6, BlzGetFrameByName("abilityButton6", 6), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil6, OSKEY_R, 0, true);
  addAbilityAction(abil6, AbilityNames.Bardock.REBELLION_SPEAR);

  const abil7 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil7, BlzGetFrameByName("abilityButton7", 7), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil7, OSKEY_D, 0, true);
  addAbilityAction(abil7, AbilityNames.Vegeta.ANGRY_SHOUT);

  const abil8 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil8, BlzGetFrameByName("abilityButton8", 8), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil8, OSKEY_F, 0, true);
  addAbilityAction(abil8, AbilityNames.Bardock.SAIYAN_SPIRIT);








  const abil9 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil9, BlzGetFrameByName("abilityButton9", 9), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil9, OSKEY_V, 0, true);
  addAbilityAction(abil9, "SS Rage");
  */
 
  // hack for qwertz keyboard integration
  // const alreadyQwertzed: boolean[] = [];
  // const zanzoToggleCommand = CreateTrigger();
  // for (let i = 0; i < Constants.maxActivePlayers; ++i) {
  //   TriggerRegisterPlayerChatEvent(zanzoToggleCommand, Player(i), "-qwertz", false);
  //   alreadyQwertzed[i] = false;
  // }

  // TriggerAddCondition(zanzoToggleCommand, Condition(() => {
  //   const player = GetTriggerPlayer();
  //   const playerId = GetPlayerId(player);
  //   if (!alreadyQwertzed[playerId]) {
  //     // addKeyEvent(abil0, OSKEY_Y, 0, true);
  //     BlzTriggerRegisterPlayerKeyEvent(abil0, player, OSKEY_Y, 0, true);
  //     alreadyQwertzed[playerId] = true;
  //   }
  //   return false;
  // }));


  // UI info for selected unit
	TimerStart(CreateTimer(), 0.03, true, () => {
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      let playerId = i;
      let unit = Globals.customPlayers[playerId].selectedUnit;

      if (unit) {
        // make sure strings dont desync
        const hpPctString = I2S(R2I(Math.ceil(GetUnitLifePercent(unit)*100)));
        const mpPctString = I2S(R2I(Math.ceil(GetUnitManaPercent(unit)*100)));

        let currentSp = "0";
        let maxSp = "0";
        let percentSp = 0;

        // let percentXp = 0;
        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          // const currentLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit));
          // const nextLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit) + 1);
          // const currentXp = GetHeroXP(unit) - currentLevelXp;
          // const maxXp = nextLevelXp - currentLevelXp;
          // percentXp = Math.min(100, 100 * currentXp / Math.max(1, maxXp));
          const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
          if (customHero) {
            currentSp = I2S(R2I(customHero.getCurrentSP()));
            maxSp = I2S(R2I(customHero.getMaxSP()));
            percentSp = 100 * (customHero.getCurrentSP() / Math.max(1.0, customHero.getMaxSP()));
          }
        }
        const spText = currentSp + "/" + maxSp;

        // // update stats
        // let nameString = "";
        // const armrString = "|cffffff20ARMR:|n" + R2SW(BlzGetUnitArmor(unit), 2, 2) + "|r";
        // const msString = "|cff808080MS:|n" + R2SW(GetUnitMoveSpeed(unit), 2, 2) + "|r";
        // let strength = "|cffff2020STR:|n";
        // let agility = "|cff20ff20AGI:|n";
        // let intelligence = "|cff20ffffINT:|n";

        // if (IsUnitType(unit, UNIT_TYPE_HERO)) {
        //   // strength += I2S(GetHeroStr(unit, true));
        //   // agility += I2S(GetHeroAgi(unit, true));
        //   // intelligence += I2S(GetHeroInt(unit, true));
        //   strength += convertIntToCommaString(GetHeroStr(unit, true));
        //   agility += convertIntToCommaString(GetHeroAgi(unit, true));
        //   intelligence += convertIntToCommaString(GetHeroInt(unit, true));
        //   nameString += GetHeroProperName(unit);
        // } else {
        //   strength += "0";
        //   agility += "0";
        //   intelligence += "0";
        //   nameString += GetUnitName(unit);
        // }
        // strength += "|r";
        // agility += "|r";
        // intelligence += "|r";

        let spellPowerText = "100%";
        const unitOwner = GetOwningPlayer(unit);
        const unitOwnerId = GetPlayerId(unitOwner);
        if (unitOwnerId < Constants.maxActivePlayers) {
          const customHero = Globals.customPlayers[unitOwnerId].getCustomHero(unit);
          if (customHero && customHero.spellPower != 1) {
            spellPowerText = I2S(R2I(Math.ceil(100 * customHero.spellPower))) + "%";
          }
        }

        const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
        const inventoryCover = BlzGetFrameByName("SimpleInventoryCover", 0);
        const inventoryCoverTexture = BlzGetFrameByName("SimpleInventoryCoverTexture", 0);

        if (GetPlayerId(GetLocalPlayer()) == playerId) {
          updateSelectedUnitBars(
            unit, 
            hpPctString,
            mpPctString,
            spText, percentSp, 
            spellPowerText,
          );
          // BlzFrameSetText(BlzGetFrameByName("unitNameText", 0), nameString);
          // BlzFrameSetText(BlzGetFrameByName("heroArmorText", 0), armrString);
          // BlzFrameSetText(BlzGetFrameByName("heroBaseMSText", 0), msString);
          // BlzFrameSetText(BlzGetFrameByName("heroStatStrengthText", 0), strength);
          // BlzFrameSetText(BlzGetFrameByName("heroStatAgilityText", 0), agility);
          // BlzFrameSetText(BlzGetFrameByName("heroStatIntelligenceText", 0), intelligence);
          if (Globals.customPlayers[playerId].usingCustomUI) {
            BlzFrameSetVisible(unitPanel, false);
            BlzFrameSetVisible(inventoryCover, false);
            BlzFrameSetVisible(inventoryCoverTexture, false);
          }
        }
      }

      // make sure strings dont desync
      let ownedHero = Globals.customPlayers[playerId].getLastSelectedOwnedCustomHero();
      if (ownedHero) {
        for (let j = 0; j < Constants.maxSubAbilities; ++j) {
          let heroAbility = ownedHero.getAbilityByIndex(j);
          if (heroAbility) {
            let cdText = "";
            let abilityCd = heroAbility.currentCd;
            if (abilityCd > 0) {
              cdText = R2SW(abilityCd,2,2);
            }

            let overwriteCd = (
              heroAbility.costType == CostType.SP 
              && heroAbility.costAmount > ownedHero.getCurrentSP()
            );
            // BJDebugMsg(cdText);
            if (GetPlayerId(GetLocalPlayer()) == playerId) {
              // POSSIBLY LAGGY
              // might be a bit slow having to constantly update text and icon, but we'll see
              let cdValue = 0;
              if (!overwriteCd) {
                cdValue = 100 * (1 - heroAbility.currentCd / heroAbility.maxCd);
              }
              updateHeroAbilityCD(heroAbility, j, cdText, cdValue);
            }
          }
        }
      }
    }
  });



  // ==== custom ui 2.0 ====
	// hides the standard ui
	// shows LHS hero bar buttons
	// minimap + minimap buttons
	// chat msgs, game msgs
	// hides first 5 command buttons
  // sets parent of inventory to parent of bottom right command buttons

	const hideTrig = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(hideTrig, Player(i), "-customui", false);
  }
	TriggerAddAction(hideTrig, () => {
    const str = GetEventPlayerChatString();
    const substr = SubString(str, 10, 11);
    const mode = S2I(substr);

    if (substr == "" || mode == 0) {
      setupCustomUI(GetTriggerPlayer(), 0);
    } else {
      setupCustomUI(GetTriggerPlayer(), mode);
    }
  });
 
  // TimerStart(CreateTimer(), 1.0, false, () => {  
  //   for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
  //     setupCustomUI(Player(i));
  //     DestroyTimer(GetExpiredTimer());
  //   }
  // });



  // ==== other player related triggers ====
  // player leaves game
  const leaveTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerEvent(leaveTrig, Player(i), EVENT_PLAYER_LEAVE);
  }
  TriggerAddAction(leaveTrig, () => {
    const leavePlayer = GetTriggerPlayer();
    DisplayTimedTextToForce(
      GetPlayersAll(), 
      15,
      Colorizer.getColoredPlayerName(leavePlayer) + 
      " has left the game."
    );
  })

  // player kills another player
  const killTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(killTrig, Player(i), EVENT_PLAYER_UNIT_DEATH);
  }
  TriggerRegisterPlayerUnitEventSimple(killTrig, Constants.sagaPlayer, EVENT_PLAYER_UNIT_DEATH);
  TriggerAddCondition(killTrig, Condition( () => {
    return (
      IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO) && 
     !IsUnitType(GetTriggerUnit(), UNIT_TYPE_SUMMONED)
    );
  }));
  TriggerAddAction(killTrig, () => {
    const deadUnit = GetDyingUnit();
    const deadPlayer = GetOwningPlayer(deadUnit);
    const deadPlayerId = GetPlayerId(deadPlayer);
    const killPlayer = GetOwningPlayer(GetKillingUnit());
    const killPlayerId = GetPlayerId(killPlayer);

    if (Globals.barrierBlockUnits.has(deadUnit)) {
      Globals.barrierBlockUnits.delete(deadUnit);
    }

    const deadId = GetUnitTypeId(deadUnit);
    if (deadId == Id.metalCoolerClone) return;

    let killerName = Colorizer.getColoredPlayerName(killPlayer);
    let deadName = Colorizer.getColoredPlayerName(deadPlayer);
    if (
      (killPlayer == Constants.sagaPlayer || killPlayerId >= Constants.maxActivePlayers) && 
      IsUnitType(GetKillingUnit(), UNIT_TYPE_HERO)
    ) {
      killerName = Colorizer.getPlayerColorText(killPlayerId) + GetHeroProperName(GetKillingUnit()) + "|r";
    }

    if (
      (deadPlayer == Constants.sagaPlayer || deadPlayerId >= Constants.maxActivePlayers) && 
      IsUnitType(deadUnit, UNIT_TYPE_HERO)
    ) {
      deadName = Colorizer.getPlayerColorText(deadPlayerId) + GetHeroProperName(deadUnit) + "|r";
    }

    if (
      killerName && deadName && 
      GetPlayerName(killPlayer).length > 1 &&
      GetPlayerName(deadPlayer).length > 1 &&
      killPlayerId >= 0 && (
        killPlayerId < Constants.maxPlayers ||
        killPlayer == Constants.sagaPlayer
      ) &&
      deadPlayerId >= 0 && deadPlayerId < Constants.maxActivePlayers
      // (
      //   killPlayer == Constants.sagaPlayer || 
      //   (killPlayerId >= 0 && killPlayerId < Constants.maxPlayers)
      // ) &&
      // deadPlayerId != Constants.heavenHellCreepPlayerId
    ) {
      if (killPlayerId >= 0 && killPlayerId < Constants.maxActivePlayers) {
        Globals.numPVPKills++;
      }
      DisplayTimedTextToForce(
        GetPlayersAll(), 
        8,
        killerName + 
        " has killed " + 
        deadName
      );
      PingMinimapForForceEx(
        bj_FORCE_ALL_PLAYERS, 
        GetUnitX(deadUnit), 
        GetUnitY(deadUnit), 
        3, bj_MINIMAPPINGSTYLE_ATTACK, 
        100, 0, 0
      );
    }
  })

  // clear text
  const clearTextTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerChatEvent(clearTextTrig, Player(i), "-clear", true);
  }
  TriggerAddAction(clearTextTrig, () => {
    if (GetLocalPlayer() == GetTriggerPlayer()) {
      ClearTextMessages();
    }
  });


  // swap players command
  const swapPlayersCommand = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(swapPlayersCommand, Player(i), "-swap", false);
  }
  TriggerAddAction(swapPlayersCommand, () => {
    if (GetTriggerPlayer() == Globals.hostPlayer) {
      const playerId = S2I(SubString(GetEventPlayerChatString(), 6, 8)) - 1;
      if (playerId >= 0 && playerId < bj_MAX_PLAYERS) {
        const targetPlayer = Player(playerId);
        let index = Constants.defaultTeam1.indexOf(targetPlayer);
        if (index > -1) {
          Constants.defaultTeam1.splice(index, 1);
          Constants.defaultTeam2.push(targetPlayer);
        } else {
          index = Constants.defaultTeam2.indexOf(targetPlayer);
          if (index > -1) {
            Constants.defaultTeam2.splice(index, 1);
            Constants.defaultTeam1.push(targetPlayer);
          }
        }
      }
    }
  });

  /*
  // revive heroes for free
  const revoiveSpam = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(revoiveSpam, EVENT_PLAYER_UNIT_DEATH);
  TriggerAddAction(revoiveSpam, () => {
    const dead = GetTriggerUnit();
    if (IsUnitType(dead, UNIT_TYPE_HERO) && !IsUnitType(dead, UNIT_TYPE_SUMMONED)) {
      TimerStart(CreateTimer(), 5.0, false, () => {
        const t = GetExpiredTimer();
        ReviveHero(dead, 64 + Math.random()*256, 64 + Math.random()*256, true);
        // BJDebugMsg("revoive spoim");
        SetUnitState(dead, UNIT_STATE_MANA, BlzGetUnitMaxMana(dead));
        SetUnitState(dead, UNIT_STATE_LIFE, BlzGetUnitMaxHP(dead));
        DestroyTimer(t);
      })
    }
  })
  */


  // special player commands + single player commands
  // force stats
  let numActivePlayers = 0;
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    let player = Player(i);
    if (
      IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING) &&
      GetPlayerController(player) == MAP_CONTROL_USER && 
      GetPlayerController(player) != MAP_CONTROL_COMPUTER
    ) {
      ++numActivePlayers;
    }
  }

  // BJDebugMsg("Num players detected: " + numActivePlayers);

  if (numActivePlayers == 1) {

    BJDebugMsg("Special Single Player Commands -level -mega -cd");

    Globals.isFBSimTest = true;
    Globals.isFreemode = true;

    const megaLvl = CreateTrigger();
    TriggerRegisterPlayerChatEvent(megaLvl, Player(0), "-mega", true);
    TriggerAddAction(megaLvl, () => {
      const group = GetUnitsOfPlayerAll(GetTriggerPlayer());

      ForGroup(group, () => {
        const megaUnit = GetEnumUnit();
        if (IsUnitType(megaUnit, UNIT_TYPE_HERO)) {
          SetHeroLevel(megaUnit, 900, false);
          ModifyHeroSkillPoints(megaUnit, bj_MODIFYMETHOD_ADD, 500);
        }
      });

      DestroyGroup(group);
    });

    const statsTrig = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(statsTrig, Player(i), "-setstats", false);
    }
    TriggerAddAction(statsTrig, () => {
      const value = S2I(SubString(GetEventPlayerChatString(), 10, 17));
      const group = GetUnitsSelectedAll(GetTriggerPlayer());
      ForGroup(group, () => {
        const target = GetEnumUnit();
        if (IsUnitType(target, UNIT_TYPE_HERO)) {
          SetHeroStr(target, value, true);
          SetHeroAgi(target, value, true);
          SetHeroInt(target, value, true);
        }
      });
      DestroyGroup(group);
    });

    const armrTrig = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(armrTrig, Player(i), "-armr", false);
    }
    TriggerAddAction(armrTrig, () => {
      const value = S2I(SubString(GetEventPlayerChatString(), 6, 12));
      const group = GetUnitsSelectedAll(GetTriggerPlayer());
      ForGroup(group, () => {
        const target = GetEnumUnit();
        BlzSetUnitArmor(target, value);
      });
      DestroyGroup(group);
    });
  
    const lvlTrig = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(lvlTrig, Player(i), "-level", false);
    }
    TriggerAddAction(lvlTrig, () => {
      const value = S2I(SubString(GetEventPlayerChatString(), 7, 11));
      const group = GetUnitsSelectedAll(GetTriggerPlayer());
      ForGroup(group, () => {
        const target = GetEnumUnit();
        if (IsUnitType(target, UNIT_TYPE_HERO)) {
          SetHeroLevel(target, value, false);
        }
      });
      DestroyGroup(group);
    });

    const xpRate = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(xpRate, Player(i), "-xpr", false);
    }
    TriggerAddAction(xpRate, () => {
      const value = S2R(SubString(GetEventPlayerChatString(), 5, 9));
      SetPlayerHandicapXP(GetTriggerPlayer(), value * 0.01);
      BJDebugMsg("XP Rate: " + GetPlayerHandicapXPBJ(GetTriggerPlayer()));
    });

    const tpTrig = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerUnitEventSimple(tpTrig, Player(i), EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
    };
    TriggerAddCondition(tpTrig, Condition(()=>{
      return GetIssuedOrderId() == String2OrderIdBJ("patrol");
    }));
    TriggerAddAction(tpTrig, () => {
      const unit = GetTriggerUnit();
      SetUnitX(unit, GetOrderPointX());
      SetUnitY(unit, GetOrderPointY());
    });

    // reveal map
    /*
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      FogModifierStart(CreateFogModifierRect(Player(i), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false));
    }
    */
    // SetPlayerAllianceStateBJ(Constants.sagaPlayer, udg_TempPlayer, bj_ALLIANCE_ALLIED_VISION)

    // force set unit skin
    const setUnitSkin = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(setUnitSkin, Player(i), "-skin", false);
    };
    TriggerAddAction(setUnitSkin, () => {
      const value = FourCC(SubString(GetEventPlayerChatString(), 6, 9));
      const group = GetUnitsSelectedAll(GetTriggerPlayer());
      ForGroup(group, () => {
        const target = GetEnumUnit();
        BlzSetUnitSkin(target, value);
      });
      DestroyGroup(group);
    });

    const makeItem = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(makeItem, Player(i), "-item", false);
    };
    TriggerAddAction(makeItem, () => {
      const value = FourCC(SubString(GetEventPlayerChatString(), 6, 9));
      const group = GetUnitsSelectedAll(GetTriggerPlayer());
      ForGroup(group, () => {
        const target = GetEnumUnit();
        CreateItem(value, GetUnitX(target), GetUnitY(target));
      });
      DestroyGroup(group);
    });
  }

  // ally/unally as necessary
  const allyTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerChatEvent(allyTrig, Player(i), "-ally", false);
  }
  TriggerAddCondition(allyTrig, Condition(() => {
    return (
      GetEventPlayerChatString().startsWith("-ally")
    )
  }));
  TriggerAddAction(allyTrig, () => {
    if (Globals.isFBSimTest) {
      const player = GetTriggerPlayer();
      const targetPlayerId = S2I(SubString(GetEventPlayerChatString(), 6, 8)) - 1;
      if (targetPlayerId >= 0 && targetPlayerId < bj_MAX_PLAYERS) {
        const targetPlayer = Player(targetPlayerId);
        SetPlayerAllianceStateBJ(player, targetPlayer, bj_ALLIANCE_ALLIED_VISION);
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 10, 
          Colorizer.getColoredPlayerName(player) + " |cff00ffffhas allied|r " + 
          Colorizer.getColoredPlayerName(targetPlayer)
        );
      }
    }
  });

  const unallyTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerChatEvent(unallyTrig, Player(i), "-unally", false);
  }
  TriggerAddCondition(unallyTrig, Condition(() => {
    return (
      GetEventPlayerChatString().startsWith("-unally")
    )
  }));
  TriggerAddAction(unallyTrig, () => {
    if (Globals.isFBSimTest) {
      const player = GetTriggerPlayer();
      const targetPlayerId = S2I(SubString(GetEventPlayerChatString(), 8, 10)) - 1;
      if (targetPlayerId >= 0 && targetPlayerId < bj_MAX_PLAYERS) {
        const targetPlayer = Player(targetPlayerId);
        SetPlayerAllianceStateBJ(player, targetPlayer, bj_ALLIANCE_UNALLIED);
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 10, 
          Colorizer.getColoredPlayerName(player) + " |cffff2020has unallied|r " + 
          Colorizer.getColoredPlayerName(targetPlayer)
        );
      }
    }
  });

  // rename trig
  const nameTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerChatEvent(nameTrig, Player(i), "-name", false);
  }
  TriggerAddAction(nameTrig, () => {
    if (Globals.isFBSimTest) {
      const player = GetTriggerPlayer();
      const newName = SubString(GetEventPlayerChatString(), 6, 20);
      if (newName.length > 1) {
        SetPlayerName(player, newName);
      }
    }
  });

  // freemode
  const freeModeTrig = CreateTrigger();
  // for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
  //   TriggerRegisterPlayerChatEvent(nameTrig, Player(i), "-name", false);
  // }
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(freeModeTrig, Player(i), "-freemode", true);
    TriggerRegisterPlayerChatEvent(freeModeTrig, Player(i), "-fbsimtest", true);
  }
  TriggerAddAction(freeModeTrig, () => {
    if (GetTriggerPlayer() == Globals.hostPlayer) {
      Globals.isFreemode = true;
      if (SubString(GetEventPlayerChatString(), 0, 10) == "-fbsimtest") {

        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          15, 
          "-fbsimtest activated (ts)"
        );
        Globals.isFBSimTest = true;
        HeroSelectorManager.getInstance().enableFBSimTest(true);
      }
    }
  });

  const toggleFloatingTextTrig = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(toggleFloatingTextTrig, Player(i), "-tft", true);
  }
  TriggerAddAction(toggleFloatingTextTrig, () => {
    if (GetTriggerPlayer() == Globals.hostPlayer) {
      if (Globals.showAbilityFloatingText) {
        Globals.showAbilityFloatingText = false;
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          5, 
          "|cffff2222Ability Floating Text Deactivated|r"
        );
      } else {
        Globals.showAbilityFloatingText = true;
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          5, 
          "|cff00ff00Ability Floating Text Activated|r"
        );
      }
    }
  });

  const nightmareTrigger = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(nightmareTrigger, Player(i), "-nm", true);
    TriggerRegisterPlayerChatEvent(nightmareTrigger, Player(i), "-nightmare", true);
  }
  TriggerAddAction(nightmareTrigger, () => {
    if (GetTriggerPlayer() == Globals.hostPlayer) {
      Globals.isNightmare = !Globals.isNightmare;

      if (Globals.isNightmare) {
        SagaAIData.DELAY_TO_INTERVALS = 6;
        SagaAIData.defaultActionInterval = 16;

        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          15, 
          "-nm true (ts)"
        );
      } else {
        SagaAIData.DELAY_TO_INTERVALS = 5;
        SagaAIData.defaultActionInterval = 25;
        
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          15, 
          "-nm false (ts)"
        );
      }
    }
  });

  const clownTrigger = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(clownTrigger, Player(i), "-clown", false);
  }
  TriggerAddAction(clownTrigger, () => {
    if (GetTriggerPlayer() == Globals.hostPlayer) {
      let clownStr = SubString(GetEventPlayerChatString(), 7, 9);
      if (clownStr == "") {
        clownStr = "75";
      }
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 
        15, 
        "-clown " + clownStr
      );
      Globals.clownValue = S2I(clownStr);
    }
  });

  const sagasTrigger = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(sagasTrigger, Player(i), "-saga", true);
  }
  TriggerAddAction(sagasTrigger, () => {
    if (
      !Globals.isMainGameStarted 
      && GetTriggerPlayer() == Globals.hostPlayer
    ) {
      if (Globals.sagaSystemMode == 0) {
        Globals.sagaSystemMode = 1;
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          5, 
          "Old sagas activated"
        );
      } else {
        Globals.sagaSystemMode = 0;
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, 
          5, 
          "Fast sagas activated"
        );
      }
    }
  });


  const zanzoToggleTrigger = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(zanzoToggleTrigger, Player(i), "-zanzo", true);
    TriggerRegisterPlayerChatEvent(zanzoToggleTrigger, Player(i), "-zd", true);
    TriggerRegisterPlayerChatEvent(zanzoToggleTrigger, Player(i), "-zz", true);
  }
  TriggerAddAction(zanzoToggleTrigger, () => {
    const playerId = GetPlayerId(GetTriggerPlayer());
    if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
      Globals.customPlayers[playerId].useZanzoDash = !Globals.customPlayers[playerId].useZanzoDash;

      if (Globals.customPlayers[playerId].useZanzoDash) {
        DisplayTimedTextToPlayer(GetTriggerPlayer(), 0, 0, 5, "|cffffcc00Zanzo Dash Enabled|r");
      } else {
        DisplayTimedTextToPlayer(GetTriggerPlayer(), 0, 0, 5, "|cffffcc00Zanzo Dash Disabled|r");
      }
    }
  });
  TimerStart(CreateTimer(), 15, false, () => {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 
      10, 
      "|cffffff00Last chance to change to zanzo dash! (Requires repick)|r"
    );
    DestroyTimer(GetExpiredTimer());
  });
  TimerStart(CreateTimer(), 60, false, () => {
    // DisplayTimedTextToForce(
    //   bj_FORCE_ALL_PLAYERS, 
    //   10, 
    //   "|cffff2020Zanzo Dash Toggle Disabled|r"
    // );
    DisableTrigger(zanzoToggleTrigger);
    DestroyTimer(GetExpiredTimer());
  });

  createCdTrigger();

  // force final battle
  const forceFinalBattleTrig = CreateTrigger();
  TriggerRegisterPlayerChatEvent(forceFinalBattleTrig, Player(0), "-forcefinalbattletest", true);
  TriggerAddAction(forceFinalBattleTrig, () => {
    if (Globals.isFBSimTest && Globals.isFreemode) {
      TournamentManager.getInstance().addFinalBattle();
      TimerStart(CreateTimer(), 5.0, false, () => {
        TournamentManager.getInstance().startTournament(Constants.finalBattleName);
        DestroyTimer(GetExpiredTimer());
      });
    }
  });

  // force budokai
  const forceBudokaiTrig = CreateTrigger();
  TriggerRegisterPlayerChatEvent(forceBudokaiTrig, Player(0), "-forcebudokaitest", true);
  TriggerAddAction(forceBudokaiTrig, () => {
    if (Globals.isFBSimTest && Globals.isFreemode) {
      TournamentManager.getInstance().startTournament(Constants.budokaiName);
    }
  });

  const memesOff = CreateTrigger();
  TriggerRegisterPlayerChatEvent(memesOff, Player(0), "-sagamemesoff", true);
  TriggerAddAction(memesOff, () => {
    Constants.jokeProbability = -1;
  });

  const memesOn = CreateTrigger();
  TriggerRegisterPlayerChatEvent(memesOn, Player(0), "-sagamemeson", false);
  TriggerAddCondition(memesOn, Condition(() => {
    return (
      GetEventPlayerChatString().startsWith("-sagamemeson")
    )
  }))
  TriggerAddAction(memesOn, () => {
    const input = GetEventPlayerChatString();
    if (input.length < 13) {
      Constants.jokeProbability = 0.03;
    } else {
      const probability = S2R(input.substr(14, 3));
      if (probability > 0) {
        Constants.jokeProbability = probability;
      } else {
        Constants.jokeProbability = 0.03;
      }
    }
  });
  
  // allow player to modify ui as they see fit
	// prints id of frame given by name
	const customUIPlayerSelectFrame = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(customUIPlayerSelectFrame, Player(i), "uipr", false);
	}
	TriggerAddAction(customUIPlayerSelectFrame, () => {
		FrameHelper.getFrameFromString(GetEventPlayerChatString(), 5, true);
	});

	// toggle ui on/off
	const customUIPlayerToggleFrame = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(customUIPlayerToggleFrame, Player(i), "uion", false);
		TriggerRegisterPlayerChatEvent(customUIPlayerToggleFrame, Player(i), "uiof", false);
	}
	TriggerAddAction(customUIPlayerToggleFrame, () => {
    const player = GetTriggerPlayer();
    const input = GetEventPlayerChatString();
		const frame = FrameHelper.getFrameFromString(input, 5, true);
		if (GetLocalPlayer() == player && frame) {
      if (input[3] == 'n') {
        BlzFrameSetEnable(frame, true);
      } else {
        BlzFrameSetEnable(frame, false);
      }
		}
	});

	// uimv x.xxx y.yyy cc name
	const customUIPlayerMoveFrame = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(customUIPlayerMoveFrame, Player(i), "uimv", false);
	}
	TriggerAddAction(customUIPlayerMoveFrame, () => {
		const player = GetTriggerPlayer();
		const input = GetEventPlayerChatString();
		const x = S2R(input.substring(5, 10));
		const y = S2R(input.substring(11, 16));
		const frame = FrameHelper.getFrameFromString(input, 17, true);
		if (GetLocalPlayer() == player && frame) {
      BlzFrameClearAllPoints(frame);
			BlzFrameSetAbsPoint(frame, FRAMEPOINT_CENTER, x, y);
		}
  });

	// uirs x.xxx y.yyy cc name
	const customUIPlayerResizeFrame = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(customUIPlayerResizeFrame, Player(i), "uirs", false);
	}
	TriggerAddAction(customUIPlayerResizeFrame, () => {
		const player = GetTriggerPlayer();
		const input = GetEventPlayerChatString();
		const x = S2R(input.substring(5, 10));
		const y = S2R(input.substring(11, 16));
		const frame = FrameHelper.getFrameFromString(input, 17, true);
		if (GetLocalPlayer() == player && frame) {
      BlzFrameSetSize(frame, x, y);
		}
  });


  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Consumables.BANANA, 3);
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Consumables.ROAST_HAM, 2);
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Consumables.KRABBY_PATTY, 2);
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.Consumables.SENZU_BEAN, 2);

  // if unit picks up dragonball and is sonic, add chaos emerald
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.chaosEmerald, 7);

  TimerStart(CreateTimer(), 3, false, () => {
    SetupTreeOfMightSapling();

    SetupMysteryCapsuleBox();
    SetupItemSplitter();
  });

  SetupCustomAbilityRefresh();
  SoundHelper.SetupSpellSoundEffects();
  DestroyTimer(GetExpiredTimer());
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



export function SetupTreeOfMightSapling() {
  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_USE_ITEM);

  TriggerAddCondition(trigger, Condition(() => {
    const item = GetManipulatedItem();
    if (GetItemTypeId(item) == ItemConstants.treeOfMightSapling) {
      const caster = GetManipulatingUnit();
      // plant
      RemoveItem(item);

      const x = GetUnitX(caster);
      const y = GetUnitY(caster)

      const sfx = AddSpecialEffect(
        "Doodads\\Ashenvale\\Structures\\Worldtree\\Worldtree.mdl",
        x, y
      );
      BlzSetSpecialEffectScale(sfx, 0.01);
      const sfx2 = AddSpecialEffect(
        "Abilities\\Spells\\Other\\Drain\\DrainTarget.mdl",
        x, y
      );
      
      // grow wait
      let counter = 0;
      TimerStart(CreateTimer(), 0.03, true, () => {
        if (counter > 1000) {
          // drop
          CreateItem(ItemConstants.treeOfMightFruit, x, y);
          const explodeSfx = AddSpecialEffect(
            "Objects\\Spawnmodels\\NightElf\\NECancelDeath\\NECancelDeath.mdl",
            x, y
          );
          BlzSetSpecialEffectScale(explodeSfx, 3);
          DestroyEffect(explodeSfx);
          DestroyEffect(sfx);
          DestroyEffect(sfx2);
          DestroyTimer(GetExpiredTimer());
          return;
        }

        BlzSetSpecialEffectScale(sfx, 0.01 + counter * 0.0003);

        if (counter % 100 == 0) {
          const sfxPeriodic = AddSpecialEffect(
            "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdll",
            x, y
          );
          BlzSetSpecialEffectScale(sfxPeriodic, 1 + counter * 0.003);
          DestroyEffect(sfxPeriodic);
        }

        ++counter;
      });

    }
    return false;
  }));
}

export function SetupMysteryCapsuleBox() {
  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (
      spellId == Capsules.saibamenSeeds
      || spellId == Capsules.wheeloResearch
      || spellId == Capsules.deadZone
      || spellId == Capsules.scouter2

      || spellId == Capsules.getiStarFragment
      || spellId == Capsules.dimensionSword
      || spellId == Capsules.braveSword
      || spellId == Capsules.timeRing

      || spellId == Capsules.battleArmor5
      || spellId == Capsules.treeOfMightSapling
      || spellId == Capsules.potaraEarring
    ) {
      const unit = GetTriggerUnit();
      const index = UnitHelper.getInventoryIndexOfItemType(unit, Capsules.itemMysterBox);
      if (index >= 0) {
        const mysteryBoxItem = UnitItemInSlot(unit, index);
        RemoveItem(mysteryBoxItem);
        const x = GetUnitX(unit);
        const y = GetUnitX(unit);
        let item: item | undefined;
        if (spellId == Capsules.saibamenSeeds) {
          item = CreateItem(ItemConstants.SagaDrops.SAIBAMEN_SEEDS, x, y);

        } else if (spellId == Capsules.wheeloResearch) {
          item = CreateItem(ItemConstants.SagaDrops.WHEELO_RESEARCH_1, x, y);

        } else if (spellId == Capsules.deadZone) {
          item = CreateItem(ItemConstants.SagaDrops.DEAD_ZONE_FRAGMENT, x, y);

        } else if (spellId == Capsules.scouter2) {
          item = CreateItem(ItemConstants.SagaDrops.SCOUTER_2, x, y);


        } else if (spellId == Capsules.getiStarFragment) {
          item = CreateItem(ItemConstants.SagaDrops.GETI_STAR_FRAGMENT, x, y);

        } else if (spellId == Capsules.dimensionSword) {
          item = CreateItem(ItemConstants.SagaDrops.DIMENSION_SWORD, x, y);

        } else if (spellId == Capsules.braveSword) {
          item = CreateItem(ItemConstants.SagaDrops.BRAVE_SWORD, x, y);

        } else if (spellId == Capsules.timeRing) {
          item = CreateItem(ItemConstants.SagaDrops.TIME_RING, x, y);

        } else if (spellId == Capsules.battleArmor5) {
          item = CreateItem(ItemConstants.SagaDrops.BATTLE_ARMOR_5, x, y);

        } else if (spellId == Capsules.treeOfMightSapling) {
          item = CreateItem(ItemConstants.SagaDrops.TREE_OF_MIGHT_SAPLING, x, y);

        } else if (spellId == Capsules.potaraEarring) {
          item = CreateItem(ItemConstants.potaraEarrings, x, y);
        }

        if (item) {
          UnitAddItem(unit, item);
        }
      }
    }
  });
}

export function SetupCustomAbilityRefresh() {
  const stamRestore = 20;


  // reset cd of custom abilities
  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.yamchaSparking || spellId == Id.ginyuPoseUltimate) {
      const caster = GetTriggerUnit();
      const player = GetOwningPlayer(caster);
      const playerId = GetPlayerId(player);
      for (const customHero of Globals.customPlayers[playerId].allHeroes) {
        if (customHero.unit == caster) {
          customHero.setCurrentSP(customHero.getCurrentSP() + stamRestore);
          for (const [name, abil] of customHero.abilities.abilities) {
            if (abil) {
              abil.resetCooldown();
              abil.endAbility();
              // abil.currentCd = 0;
              // if (abil.currentTick > 0) {
              //   abil.currentTick = abil.duration;
              // }
            }
          }
        }
      }
    }
  });
}

export function createCdTrigger() {
  // reset cd of custom ability
  const cdTrig = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(cdTrig, Player(i), "-cd", true);
  }
  TriggerAddAction(cdTrig, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    if (Globals.isFBSimTest) {
      for (const customHero of Globals.customPlayers[playerId].allHeroes) {
        if (customHero) {
          UnitResetCooldown(customHero.unit);
          customHero.setCurrentSP(customHero.getMaxSP());
          for (const [name, abil] of customHero.abilities.abilities) {
            if (abil) {
              abil.currentCd = 0;
            }
          }
        }
      }
    }
  });
}

export function convertIntToCommaString(n: number): string {
  // const result: string[] = [];
  // let tmp = n;
  // let divisor = 1000;

  // if (tmp < divisor) {
  //   result.push(I2S(tmp));
  // } else {
  //   while (Math.floor(tmp / divisor) > 0) {
  //     result.push(I2S(tmp % divisor).substr(0, 3));
  //     divisor *= 1000;
  //   }
  // }
  if (n < 1000) return n.toString();

  const parts: string[] = [];
  let str = n.toString();
  let i = 0;
  /**
   * 012 345 678
   * 123 456 789
   * 
   * 
   * 1 234
   */
  for (i = str.length-3; i >= 0; i -= 3) {
    parts.push(str.substr(i, 3));
  }

  if (i > -3) {
    parts.push(str.substr(0, i+3));
  }

  return parts.reverse().join(",");
}

export function getSwordOfHopeMult(player: player): number {
  let result = 1.0;
  const playerAllies = GetPlayersAllies(player);
  ForForce(playerAllies, () => {
    const p = GetEnumPlayer();
    const pId = GetPlayerId(p);
    if (p != player && pId >= 0 && pId < Constants.maxActivePlayers) {
      result += 0.2;
    }
  });
  DestroyForce(playerAllies);
  return result;
}

export function getTodorokiMult(unit: unit, abilityId: number) {
  const unitId = GetHandleId(unit);
  if (!HaveSavedReal(Globals.genericSpellHashtable, unitId, 0)) return 1.0;

  // globals hashtable
  // 0: heat
  // 1: heat state (1 = cooling down, 2 = heating up)

  const heat = LoadReal(Globals.genericSpellHashtable, unitId, 0);
  const heatMode = LoadInteger(Globals.genericSpellHashtable, unitId, 1);

  let result = 1.0; 
  if (
    abilityId == Id.shotoTodorokiGlacier
    || abilityId == Id.shotoTodorokiIcePath
    || abilityId == Id.shotoTodorokiHeavenPiercingIceWall
  ) {
    result += Math.max(0, (50 - heat) * 0.01);

    if (heatMode == 1) {
      result += 0.1;
    }
  }

  if (
    abilityId == Id.shotoTodorokiWallOfFlames
    || abilityId == Id.shotoTodorokiFlashfireFist
  ) {
    result += Math.max(0, (heat - 50) * 0.01);

    if (heatMode == 2) {
      result += 0.1;
    }
  }

  if (abilityId == Id.shotoTodorokiFlashfreezeHeatwave) {
    result *= (1 + Math.abs(heat - 50) * 0.01)

    if (heatMode > 0) {
      result += 0.1;
    }
  }
  
  // BJDebugMsg("todoroki Mult: " + R2S(result));
  return result;
}



export function SetupItemSplitter() {
  const itemSplitTrigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(itemSplitTrigger, Player(i), EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
  }

  TriggerAddCondition(itemSplitTrigger, Condition(() => {
    const orderId = GetIssuedOrderId();
    if (orderId >= OrderIds.MOVE_SLOT_1 && orderId <= OrderIds.MOVE_SLOT_6) {
      const unit = GetTriggerUnit();
      const item = GetOrderTargetItem();
      if (!UnitHasItem(unit, item)) {
        return false;
      }
      const itemSlot = orderId - OrderIds.MOVE_SLOT_1;
      const itemInSlot = UnitItemInSlot(unit, itemSlot);
      if (item == itemInSlot) {
        // split
        const charges = GetItemCharges(item);
        const loss = R2I(charges * 0.5);
        if (charges > 1 && loss > 0 && charges > loss) {
          SetItemCharges(item, charges - loss);
          const newItem = CreateItem(GetItemTypeId(item), GetUnitX(unit), GetUnitY(unit));
          if (IsItemInvulnerable(item)) {
            SetItemInvulnerable(newItem, true);
          }
          SetItemCharges(newItem, loss);
          ItemStackingManager.getInstance().disable();
          UnitAddItem(unit, newItem);
          ItemStackingManager.getInstance().enable();
        }
      } else if (GetItemTypeId(item) == GetItemTypeId(itemInSlot)) {
        // stack
        ItemStackingManager.getInstance().stackItemAutoMaxStacks(item, itemInSlot);
      }
    }
    return false;
  }));

  
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.SagaDrops.SAIBAMEN_SEEDS, 3);
  ItemStackingManager.getInstance().addStackableItemType(ItemConstants.SagaDrops.BEERUS_PUDDING, 4);
}