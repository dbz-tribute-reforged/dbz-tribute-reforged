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
        }
        customHero.useAbility(name, abilityInput);
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
  currentHp: string, 
  maxHp: string, 
  currentMp: string,
  maxMp: string,
  currentSp: string,
  maxSp: string,
  percentSp: number,
  level: string,
  percentXp: number,
) {
  BlzFrameSetValue(BlzGetFrameByName("MyHPBar", 0), GetUnitLifePercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyMPBar", 0), GetUnitManaPercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MySPBar", 0), percentSp);
  BlzFrameSetValue(BlzGetFrameByName("MyLevelBar", 0), percentXp);
  BlzFrameSetText(BlzGetFrameByName("MyHPBarText", 0), currentHp + " / " + maxHp);
  BlzFrameSetText(BlzGetFrameByName("MyMPBarText", 0), currentMp + " / " + maxMp);
  BlzFrameSetText(BlzGetFrameByName("MySPBarText", 0), currentSp + " / " + maxSp);
  BlzFrameSetText(BlzGetFrameByName("MyLevelBarText", 0), "LVL: " + level);
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
  
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    Globals.customPlayers.push(new CustomPlayer(
      i,
      GetPlayerName(Player(i)),
    ));
  }

  // need better way to add heroes of player to their hero list
  const addHeroToPlayer = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
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

  TimerStart(CreateTimer(), 1, true, () => {
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
    const unitTypeId = GetUnitTypeId(GetTriggerUnit());
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
            customHero.useAbility(
              spellName,
              new CustomAbilityInput(
                customHero,
                player,
                abilityLevel,
                Globals.customPlayers[playerId].orderPoint,
                Globals.customPlayers[playerId].mouseData,
                Globals.customPlayers[playerId].lastCastPoint.clone(),
                spellTargetUnit,
                GetSpellTargetUnit(),
                damageMult
              ),
            );
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
        const currentHp = I2S(Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_LIFE))));
        const maxHp = I2S(BlzGetUnitMaxHP(unit));
        const currentMp = I2S(Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_MANA))));
        const maxMp = I2S(BlzGetUnitMaxMana(unit));
        let currentSp = "0";
        let maxSp = "0";
        let percentSp = 0;

        let percentXp = 0;
        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          const currentLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit));
          const nextLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit) + 1);
          const currentXp = GetHeroXP(unit) - currentLevelXp;
          const maxXp = nextLevelXp - currentLevelXp;
          percentXp = Math.min(100, 100 * currentXp / Math.max(1, maxXp));
          const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
          if (customHero) {
            currentSp = I2S(R2I(customHero.getCurrentSP()));
            maxSp = I2S(R2I(customHero.getMaxSP()));
            percentSp = 100 * (customHero.getCurrentSP() / Math.max(1.0, customHero.getMaxSP()));
          }
        }
        const level = I2S(GetUnitLevel(unit));

        // update stats
        let nameString = "";
        const armrString = "|cffffff20ARMR:|n" + R2SW(BlzGetUnitArmor(unit), 2, 2) + "|r";
        const msString = "|cff808080MS:|n" + R2SW(GetUnitMoveSpeed(unit), 2, 2) + "|r";
        let strength = "|cffff2020STR:|n";
        let agility = "|cff20ff20AGI:|n";
        let intelligence = "|cff20ffffINT:|n";

        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          // strength += I2S(GetHeroStr(unit, true));
          // agility += I2S(GetHeroAgi(unit, true));
          // intelligence += I2S(GetHeroInt(unit, true));
          strength += convertIntToCommaString(GetHeroStr(unit, true));
          agility += convertIntToCommaString(GetHeroAgi(unit, true));
          intelligence += convertIntToCommaString(GetHeroInt(unit, true));
          nameString += GetHeroProperName(unit);
        } else {
          strength += "0";
          agility += "0";
          intelligence += "0";
          nameString += GetUnitName(unit);
        }
        strength += "|r";
        agility += "|r";
        intelligence += "|r";

        const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
        const inventoryCover = BlzGetFrameByName("SimpleInventoryCover", 0);
        const inventoryCoverTexture = BlzGetFrameByName("SimpleInventoryCoverTexture", 0);

        if (GetPlayerId(GetLocalPlayer()) == playerId) {
          updateSelectedUnitBars(unit, currentHp, maxHp, currentMp, maxMp, currentSp, maxSp, percentSp, level, percentXp);
          BlzFrameSetText(BlzGetFrameByName("unitNameText", 0), nameString);
          BlzFrameSetText(BlzGetFrameByName("heroArmorText", 0), armrString);
          BlzFrameSetText(BlzGetFrameByName("heroBaseMSText", 0), msString);
          BlzFrameSetText(BlzGetFrameByName("heroStatStrengthText", 0), strength);
          BlzFrameSetText(BlzGetFrameByName("heroStatAgilityText", 0), agility);
          BlzFrameSetText(BlzGetFrameByName("heroStatIntelligenceText", 0), intelligence);
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
              cdText = R2SW(abilityCd,2,2) + "s";
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
    const deadPlayer = GetOwningPlayer(GetDyingUnit());
    const deadPlayerId = GetPlayerId(deadPlayer);
    const killPlayer = GetOwningPlayer(GetKillingUnit());
    const killPlayerId = GetPlayerId(killPlayer);

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
      IsUnitType(GetDyingUnit(), UNIT_TYPE_HERO)
    ) {
      deadName = Colorizer.getPlayerColorText(deadPlayerId) + GetHeroProperName(GetDyingUnit()) + "|r";
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
      DisplayTimedTextToForce(
        GetPlayersAll(), 
        8,
        killerName + 
        " has killed " + 
        deadName
      );
      PingMinimapForForceEx(
        bj_FORCE_ALL_PLAYERS, 
        GetUnitX(GetDyingUnit()), 
        GetUnitY(GetDyingUnit()), 
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
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 
      10, 
      "|cffff2020Zanzo Dash Toggle Disabled|r"
    );
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

  TriggerRegisterAnyUnitEventBJ(Globals.genericSpellTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TimerStart(CreateTimer(), 3, false, () => {
    SetupBraveSwordAttack();
    SetupDragonFistSfx();
    SetupGinyuChangeNow();
    SetupGinyuTelekinesis();
    SetupGuldoTimeStop();
    SetupOmegaShenronShadowFist();
    SetupKrillinSenzuThrow();
    SetupJirenGlare();

    SetupCero();
    SetupBankai();

    SetupDartSpells();
    SetupMadnessDebuff();

    SetupAylaCharm();
    SetupMagusDarkMatter();

    // SetupAylaTripleKick(, Globals.customPlayers);
    SetupJungleRushBananaFallout();
    SetupBarrelCannon();
    
    SetupHirudegarnSkinChange();
    SetupVegetaFightingSpirit();

    SetupSchalaTeleportation();

    SetupYamchaCombos();

    SetupSkurvyPlunder();
    SetupSkurvyMirror();

    SetupSonicAbilities();
    
    SetupTreeOfMightSapling();

    SetupMysteryCapsuleBox();
    SetupItemSplitter();

    SetupCustomAbilityRefresh();
    SoundHelper.SetupSpellSoundEffects();
    DestroyTimer(GetExpiredTimer());
  });
}

export function SetupBraveSwordAttack() {
  // 0 : target x
  // 1 : target y
  const casterPos: Vector2D = new Vector2D(0, 0);
  const tmpPos: Vector2D = new Vector2D(0, 0);
  const dummyStunOrder = OrderIds.THUNDERBOLT;
  const tickRate = 0.02;
  const jumpDuration = 40;
  const jumpHeight = 900;
  const jumpMoveDistance = 30;
  const jumpSpeedModifier = 0.0015;
  const jumpSpeedModifierMax = 1.33;
  const jumpSpeedModifierMin = 0.15;
  const braveSwordAOE = 400;
  const braveSwordDamageMult = BASE_DMG.DFIST_EXPLOSION * 1.3;
  const braveSwordManaBurnMult = 0.01;
  const maxManaCostMult = 0.2;

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.braveSwordAttack) {
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
  });
}

export function SetupDragonFistSfx() {
  const sfxHeadModel = "DragonHead2.mdl";
  const sfxSpiralModel = "DragonSegment2.mdl";

  const sfxShadowHeadModel = "RedDragonHead.mdl";
  const sfxShadowSpiralModel = "RedDragonSegment.mdl";

  const sfxDinoTail = "DinoTail.mdl";
  const sfxDinoTailSpiral = "DinoSegment.mdl";

  TriggerAddAction(Globals.genericSpellTrigger, () => {
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
          DoDragonFistSFX(caster, sfxDinoTail, sfxDinoTailSpiral);
          break;
        
        case Id.shadowFist:
          DoDragonFistSFX(caster, sfxShadowHeadModel, sfxShadowSpiralModel);
          break;

        case Id.dragonFist:
        case Id.superDragonFist:
        default:
          DoDragonFistSFX(caster, sfxHeadModel, sfxSpiralModel);
          break;
      }
    }
  });
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

export function SetupGinyuChangeNow() {
  const changeNow = FourCC("A0PN");

  // for (let i = 0; i < Constants.maxActivePlayers; ++i) {
  //   TriggerRegisterPlayerUnitEventSimple(trigger, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT);
  // }
  TriggerAddAction(Globals.genericSpellTrigger, () => {
    if (GetSpellAbilityId() == changeNow) {
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
  });
}

export function SetupGinyuTelekinesis() {
  const ignoreItem = FourCC("wtlg");
  const telekinesisDuration = 30;
  const telekinesisSpeed = 50;
  const telekinesisPlayerSpeedModifier = 0.5;
  const telekinesisAOE = 400;
  const telekinesisMinDistance = 300;
  const telekinesisRect = Rect(0, 0, 800, 800);

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.ginyuTelekinesis) {
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

    return false;
  });
}

export function SetupGuldoTimeStop() {
  const originalBAT: number = 1.8;
  const timeStopBAT: number = 0.4;

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.guldoTimeStop) {
      const caster = GetTriggerUnit();
      BlzSetUnitAttackCooldown(caster, timeStopBAT, 0);

      TimerStart(CreateTimer(), 2.0, false, () => {
        BlzSetUnitAttackCooldown(caster, originalBAT, 0);
        DestroyTimer(GetExpiredTimer());
      });
    }
  });
  
}

export function SetupOmegaShenronShadowFist() {
  const shadowFistId = Id.shadowFist;
  const shadowFistAOE = 350;
  const shadowFistDuration = 48;
  const tickRate = 0.03;
  const maxDragonBallsToSteal = 1;
  const maxSizedDragonBallStackToSteal = 7;
  const targetGroup = CreateGroup();

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == shadowFistId) {
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
  });
}


export function SetupKrillinSenzuThrow() {
  const senzuThrowDuration = 40;
  const senzuThrowSpeed = 49;
  const senzuThrowStealMinDuration = 10;
  const senzuThrowStealAOE = 300;
  const senzuItemId = FourCC("I000");
  const beanStealUnits = CreateGroup();
  
  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.senzuThrow) {
      const caster = GetTriggerUnit();
      const casterPlayer = GetTriggerPlayer();
      // const casterPlayerId = GetPlayerId(casterPlayer);
      const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
      const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
      const senzuItem = CreateItem(senzuItemId, casterPos.x, casterPos.y);
      const direction = CoordMath.angleBetweenCoords(casterPos, targetPos);
      moveItemAndDoPickup(
        senzuItem,
        senzuThrowSpeed,
        direction,
        senzuThrowDuration,
        senzuThrowStealMinDuration,
        senzuThrowStealAOE,
        beanStealUnits
      );
    }
  });
}

export function moveItemAndDoPickup(
  movedItem: item,
  itemMS: number,
  direction: number,
  duration: number,
  minDuration: number,
  stealAOE: number,
  stealGroup: group
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
        && doAOEItemPickup(movedItem, newPos, stealAOE, stealGroup)
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
  unitGroup: group,
) {
  let result = false;

  GroupEnumUnitsInRange(
    unitGroup, 
    pos.x, 
    pos.y, 
    stealAOE,
    null
  );

  ForGroup(unitGroup, () => {
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
  
  GroupClear(unitGroup);

  return result;
}


export function SetupJirenGlare() {
  /**
   * hashtable
   * 0: spellId, or 0 if not activated
   * 1: counter sfx
   * 2: ability level
   */

  const glareDuration = 2.5;
  const darkEyesDuration = 4.0;
  const maxGlareDistance = 2500;
  const glareDamageMult = BASE_DMG.DFIST_EXPLOSION * 0.5;
  const glare2DamageMult = BASE_DMG.DFIST_EXPLOSION * 0.7;
  const glare2StrDiffJirenBonus = 1.05;
  const glare2StrDiffMult = 1.1;
  const sourceLoc = new Vector2D(0,0);
  const targetLoc = new Vector2D(0,0);
  const glarePunishDamageMult = 0.15;
  const darkEyesPunishDamageMult = 0.25;
  
  const jirenGlareUnitGroup = CreateGroup();

  const glareActivateTrigger = CreateTrigger();

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.glare || spellId == Id.glare2 || spellId == Id.hirudegarnDarkEyes) {
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
      
      if (!IsUnitInGroup(unit, jirenGlareUnitGroup)) {
        GroupAddUnit(jirenGlareUnitGroup, unit);
        TriggerRegisterUnitEvent(glareActivateTrigger, unit, EVENT_UNIT_DAMAGED);
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
  });
  
  TriggerAddCondition(glareActivateTrigger, Condition(() => {
    const unit = BlzGetEventDamageTarget();
    const unitId = GetHandleId(unit);
    const spellId = LoadInteger(Globals.genericSpellHashtable, unitId, 0);
    const source = GetEventDamageSource();
    if (UnitHelper.isUnitAlive(unit) && spellId != 0 && IsUnitType(source, UNIT_TYPE_HERO)) {
      SaveInteger(Globals.genericSpellHashtable, unitId, 0, 0);

      const player = GetOwningPlayer(unit);
      targetLoc.setPos(GetUnitX(unit), GetUnitY(unit));
      sourceLoc.setPos(GetUnitX(source), GetUnitY(source));

      if (CoordMath.distance(targetLoc, sourceLoc) < maxGlareDistance) {
        SetUnitX(unit, sourceLoc.x);
        SetUnitY(unit, sourceLoc.y);
            
        const castDummy = CreateUnit(
          player, 
          Constants.dummyCasterId, 
          sourceLoc.x, sourceLoc.y, 
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
            sourceLoc.x, sourceLoc.y
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

export function SetupCero() {
  const casterLoc = new Vector2D(0,0);
  /**
   * 0: charge time (0-5s)
   */

  TriggerAddAction(Globals.genericSpellTrigger, () => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.ceroCharge) {
      const caster = GetTriggerUnit();
      const casterId = GetHandleId(caster);
      const player = GetOwningPlayer(caster);
      const playerId = GetPlayerId(player);
      const customHero = Globals.customPlayers[playerId].getCustomHero(caster);
      const chargeAbil = (customHero) ? customHero.getAbility(AbilityNames.Ichigo.CERO_CHARGE) : undefined;

      casterLoc.setPos(GetUnitX(caster), GetUnitY(caster));
      
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
          doCeroFire(caster, player, Globals.genericSpellHashtable);
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
      doCeroFire(caster, player, Globals.genericSpellHashtable);
    }
  });
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
            performGroundVortex(
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
      groundVortexDamageTarget(
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

// export function SetupAylaTripleKick(
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
  const beanStealUnits = CreateGroup();
  
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
          moveItemAndDoPickup(
            bananaItem,
            bananaThrowSpeed,
            direction + i * bananaThrowDirectionOffset,
            bananaThrowDuration,
            bananaThrowStealMinDuration,
            bananaThrowStealAOE,
            beanStealUnits
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