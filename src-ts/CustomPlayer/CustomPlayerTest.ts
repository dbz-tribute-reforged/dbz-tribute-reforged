import { CustomPlayer } from "./CustomPlayer";
import { CustomHero } from "CustomHero/CustomHero";
import { Constants } from "Common/Constants";
import { ToolTipOrganizer } from "Common/ToolTipOrganizer";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { TextTagHelper } from "Common/TextTagHelper";
import { Colorizer } from "Common/Colorizer";
import { WinLossHelper } from "Common/WinLossHelper";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { FrameHelper } from "Common/FrameHelper";
import { ExperienceManager } from "Core/ExperienceSystem/ExpierenceManager";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

// global?
export const customPlayers: CustomPlayer[] = [];

export function addAbilityAction(abilityTrigger: trigger, name: string) {
  TriggerAddAction(abilityTrigger, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    // NOTE: do not use GetUnitsSelectedAll(GetTriggerPlayer())
    // it will cause weird selection bugs during multiplayer
    // that is not normally testable via singleplayer

    // const customHero = customPlayers[playerId].getCurrentlySelectedCustomHero();
    for (const customHero of customPlayers[playerId].allHeroes) {
      if (customHero && IsUnitSelected(customHero.unit, player)) {
        const abilityInput = new CustomAbilityInput(
          customHero,
          player,
          1,
          customPlayers[playerId].orderPoint,
          customPlayers[playerId].mouseData,
          customPlayers[playerId].lastCastPoint.clone(),
          customPlayers[playerId].targetUnit,
          customPlayers[playerId].lastCastUnit,
        );

        if (customHero.canCastAbility(name, abilityInput)) {
          // show custom ability name on activation, if castable
          TextTagHelper.showPlayerColorTextOnUnit(name, playerId, customHero.unit);
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
  level: string,
  percentXp: number,
) {
  BlzFrameSetValue(BlzGetFrameByName("MyHPBar", 0), GetUnitLifePercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyMPBar", 0), GetUnitManaPercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyLevelBar", 0), percentXp);
  BlzFrameSetText(BlzGetFrameByName("MyHPBarText", 0), currentHp + " / " + maxHp);
  BlzFrameSetText(BlzGetFrameByName("MyMPBarText", 0), currentMp + " / " + maxMp);
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
  
  // customPlayers = [];
  
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    customPlayers.push(new CustomPlayer(
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
    const addedHero = GetTriggerUnit();
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    customPlayers[playerId].addHero(addedHero);
    customPlayers[playerId].selectedUnit = GetTriggerUnit();

    for (let i = 0 ; i < Constants.maxSubAbilities; ++i) {
      let customHero = customPlayers[playerId].getLastSelectedOwnedCustomHero();
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
    for (const customPlayer of customPlayers) {
      customPlayer.cleanupRemovedHeroes();
    }
  });

  

  // update mouse positions for now
  // might be a bit laggy?
  const updatePlayerMouseData = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerMouseEventBJ(updatePlayerMouseData, Player(i), bj_MOUSEEVENTTYPE_MOVE);
	}
	TriggerAddAction(updatePlayerMouseData, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
      const x = BlzGetTriggerPlayerMouseX();
      const y = BlzGetTriggerPlayerMouseY();
      if (x != 0 && y != 0) {
        customPlayers[playerId].mouseData.x = x;
        customPlayers[playerId].mouseData.y = y;
      }
    }
  });


  const updatePlayerOrderPoint = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerUnitEventSimple(updatePlayerOrderPoint, Player(i), EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
  }
  TriggerAddCondition(updatePlayerOrderPoint, Condition(() => {
    const unitTypeId = GetUnitTypeId(GetTriggerUnit());
    if (
      GetPlayerSlotState(GetTriggerPlayer()) == PLAYER_SLOT_STATE_PLAYING &&
      unitTypeId != Constants.dummyBeamUnitId && 
      unitTypeId != Constants.dummyCasterId
    ) {
      const x = GetOrderPointX();
      const y = GetOrderPointY();
      if (x != 0 && y != 0) {
        const playerId = GetPlayerId(GetTriggerPlayer());
        customPlayers[playerId].orderPoint.x = x;
        customPlayers[playerId].orderPoint.y = y;
      }
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
      customPlayers[playerId].targetUnit = GetOrderTargetUnit();
      customPlayers[playerId].orderPoint.x = GetUnitX(customPlayers[playerId].targetUnit);
      customPlayers[playerId].orderPoint.y = GetUnitY(customPlayers[playerId].targetUnit);
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
      customPlayers[playerId].lastCastPoint.x = GetSpellTargetX();
      customPlayers[playerId].lastCastPoint.y = GetSpellTargetY();
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
      customPlayers[playerId].lastCastUnit = GetSpellTargetUnit();
  
      if (IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO)) {
        // show ability name on activation
        TextTagHelper.showPlayerColorTextOnUnit(
          GetAbilityName(abilityId), 
          playerId, 
          GetTriggerUnit()
        );
      }
  
      const spellName = abilityCodesToNames.get(abilityId);
  
      if (spellName) { 
        const caster = GetTriggerUnit();
        const abilityLevel = GetUnitAbilityLevel(caster, abilityId);
        customPlayers[playerId].selectedUnit = caster;
        let spellTargetUnit = undefined;
        if (GetSpellTargetUnit()) {
          customPlayers[playerId].targetUnit = GetSpellTargetUnit();
          spellTargetUnit = customPlayers[playerId].targetUnit;
        }
        const customHero = customPlayers[playerId].getCurrentlySelectedCustomHero();
        if (customHero) {
          // temp fix for double ss rage trigger
          if (spellName != AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE || GetUnitTypeId(customHero.unit) != FourCC("H08I")) {
            customHero.useAbility(
              spellName,
              new CustomAbilityInput(
                customHero,
                player,
                abilityLevel,
                customPlayers[playerId].orderPoint,
                customPlayers[playerId].mouseData,
                customPlayers[playerId].lastCastPoint.clone(),
                spellTargetUnit,
                GetSpellTargetUnit(),
              ),
            );
          }
        }
      }
    }
    return false;
  }));

  
  // zanzo activation trigger
  // tied to z for now
  const abil0 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil0, BlzGetFrameByName("abilityButton0", 0), FRAMEEVENT_CONTROL_CLICK);
  // replace key events with more organized method of key reading
  addKeyEvent(abil0, OSKEY_Z, 0, true);
  addAbilityAction(abil0, AbilityNames.BasicAbility.ZANZO_DASH);

  const abil1 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil1, BlzGetFrameByName("abilityButton1", 1), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil1, OSKEY_X, 0, true);
  addAbilityAction(abil1, AbilityNames.BasicAbility.GUARD);

  const abil2 = CreateTrigger();
  BlzTriggerRegisterFrameEvent(abil2, BlzGetFrameByName("abilityButton2", 2), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(abil2, OSKEY_C, 0, true);
  addAbilityAction(abil2, AbilityNames.BasicAbility.MAX_POWER);
  
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


  // UI info for selected unit
	TimerStart(CreateTimer(), 0.03, true, () => {
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      let playerId = i;
      let unit = customPlayers[playerId].selectedUnit;

      if (unit) {
        // make sure strings dont desync
        const currentHp = I2S(Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_LIFE))));
        const maxHp = I2S(BlzGetUnitMaxHP(unit));
        const currentMp = I2S(Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_MANA))));
        const maxMp = I2S(BlzGetUnitMaxMana(unit));
        let percentXp = 0;
        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          const currentLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit));
          const nextLevelXp = ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(unit) + 1);
          const currentXp = GetHeroXP(unit) - currentLevelXp;
          const maxXp = nextLevelXp - currentLevelXp;
          percentXp = Math.min(100, 100 * currentXp / Math.max(1, maxXp))
        }
        const level = I2S(GetUnitLevel(unit));

        // update stats
        let strength = "|cffff2020STR:|n";
        let agility = "|cff20ff20AGI:|n";
        let intelligence = "|cff20ffffINT:|n";

        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          strength += I2S(GetHeroStr(unit, true));
          agility += I2S(GetHeroAgi(unit, true));
          intelligence += I2S(GetHeroInt(unit, true));
        } else {
          strength += "0";
          agility += "0";
          intelligence += "0";
        }
        strength += "|r";
        agility += "|r";
        intelligence += "|r";

        const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
        const inventoryCover = BlzGetFrameByName("SimpleInventoryCover", 0);
        const inventoryCoverTexture = BlzGetFrameByName("SimpleInventoryCoverTexture", 0);

        if (GetPlayerId(GetLocalPlayer()) == playerId) {
          updateSelectedUnitBars(unit, currentHp, maxHp, currentMp, maxMp, level, percentXp);
          BlzFrameSetText(BlzGetFrameByName("heroStatStrengthText", 0), strength);
          BlzFrameSetText(BlzGetFrameByName("heroStatAgilityText", 0), agility);
          BlzFrameSetText(BlzGetFrameByName("heroStatIntelligenceText", 0), intelligence);
          if (customPlayers[playerId].usingCustomUI) {
            BlzFrameSetVisible(unitPanel, false);
            BlzFrameSetVisible(inventoryCover, false);
            BlzFrameSetVisible(inventoryCoverTexture, false);
          }
        }
      }

      // make sure strings dont desync
      let ownedHero = customPlayers[playerId].getLastSelectedOwnedCustomHero();
      if (ownedHero) {
        for (let j = 0; j < Constants.maxSubAbilities; ++j) {
          let heroAbility = ownedHero.getAbilityByIndex(j);
          if (heroAbility) {
            let cdText = "";
            let abilityCd = heroAbility.currentCd;
            if (abilityCd > 0) {
              cdText = R2SW(abilityCd,2,2) + "s";
            }
            // BJDebugMsg(cdText);
            if (GetPlayerId(GetLocalPlayer()) == playerId) {
              // POSSIBLY LAGGY
              // might be a bit slow having to constantly update text and icon, but we'll see
              let cdValue = 100 * (1 - heroAbility.currentCd / heroAbility.maxCd);
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

  let canUseCustomUi = true;
	const hideTrig = CreateTrigger();
  // TriggerRegisterTimerEventSingle(hideTrig, 5.0);
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(hideTrig, Player(i), "-customui", true);
  }
	TriggerAddAction(hideTrig, () => {
    const playerId = GetPlayerId(GetTriggerPlayer());
    if (!canUseCustomUi) {
      DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, 
        "|cffff2020Post-pick phase: Custom UI has been disabled. Too slow!"
      );
    } else if (
      !customPlayers[playerId].usingCustomUI && 
      IsPlayerSlotState(Player(playerId), PLAYER_SLOT_STATE_PLAYING) && 
      GetPlayerController(Player(playerId)) == MAP_CONTROL_USER
    ) {
      // BJDebugMsg("Enabling Custom UI for all players.");
      // for (let playerId = 0; playerId < Constants.maxActivePlayers; ++playerId) {
      //   if (
      //     !customPlayers[playerId].usingCustomUI && 
      //     IsPlayerSlotState(Player(playerId), PLAYER_SLOT_STATE_PLAYING) && 
      //     GetPlayerController(Player(playerId)) == MAP_CONTROL_USER
      //   ) {
      //     customPlayers[playerId].usingCustomUI = true;
      //   }
      // }
      customPlayers[playerId].usingCustomUI = true;

      const grandpa = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0);
      const worldFrame = BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0);
      const rm = BlzGetFrameByName("ConsoleUIBackdrop", 0);

      const upperBar = BlzGetFrameByName("UpperButtonBarFrame", 0);
      const resourceBar = BlzGetFrameByName("ResourceBarFrame", 0);

      const abilityButtonHotbar = BlzGetFrameByName("abilityButtonHotBar", 0);
      
      const hpBar = BlzGetFrameByName("MyHPBar", 0);
      const mpBar = BlzGetFrameByName("MyMPBar", 0);

      const heroBarButtons = BlzGetOriginFrame(ORIGIN_FRAME_HERO_BAR, 0);
      
      const minimap = BlzGetOriginFrame(ORIGIN_FRAME_MINIMAP, 0);
      const minimapParent = BlzFrameGetParent(minimap);
      const minimapButtons: framehandle[] = [];
      for (let i = 0; i < 5; ++i) {
        minimapButtons.push(BlzGetOriginFrame(ORIGIN_FRAME_MINIMAP_BUTTON, i));
      }

      const chatMsg = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0);
      const gameMsg = BlzGetOriginFrame(ORIGIN_FRAME_UNIT_MSG, 0);

      const heroPortrait = BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0);
      const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
      const unitPanelParent = BlzFrameGetParent(unitPanel);
      
      const inventoryCover = BlzGetFrameByName("SimpleInventoryCover", 0);
      const inventoryCoverTexture = BlzGetFrameByName("SimpleInventoryCoverTexture", 0);

      const inventoryParent = BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, 0));
      // const inventoryFrames: framehandle[] = [];
      // inventoryFrames.push(BlzGetFrameByName("SimpleInventoryCover",0));
      // inventoryFrames.push(BlzGetFrameByName("SimpleInventoryBar",0));
      // inventoryFrames.push(BlzGetFrameByName("InventoryCoverTexture",0));
      // inventoryFrames.push(BlzGetFrameByName("InventoryText",0));

      const inventoryButtons: framehandle[] = [];
      for (let i = 0; i < 6; ++i) {
        const frame = BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, i);
        inventoryButtons.push(frame);
        // inventoryFrames.push(frame);
      }

      const commandCardParent = BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, 0));
      const commandCardButtons: framehandle[] = [];
      for (let i = 0; i < 12; ++i) {
        commandCardButtons.push(BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, i));
      }
      
      const customStrengthLabel = BlzGetFrameByName("heroStatStrengthText", 0);
      const customAgilityLabel = BlzGetFrameByName("heroStatAgilityText", 0);
      const customIntelligenceLabel = BlzGetFrameByName("heroStatIntelligenceText", 0);

      if (GetLocalPlayer() == GetTriggerPlayer()) {
        BlzHideOriginFrames(true);
        BlzFrameSetAllPoints(worldFrame, grandpa);
        // let frame = BlzGetFrameByName("ConsoleUI", 0);
        // BlzFrameSetAllPoints(frame, grandpa);
        // BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, -1, -1);
        BlzFrameSetVisible(rm, false);

        BlzFrameSetVisible(upperBar, true);
        BlzFrameSetVisible(resourceBar, true);
        
        BlzFrameClearAllPoints(abilityButtonHotbar);
        BlzFrameSetPoint(
          abilityButtonHotbar, 
          FRAMEPOINT_BOTTOMRIGHT, 
          hpBar, 
          FRAMEPOINT_TOPRIGHT, 
          -0.008, 0.001
        );

        BlzFrameClearAllPoints(hpBar);
        BlzFrameSetPoint(hpBar, FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, 0, 0.02);
        BlzFrameClearAllPoints(mpBar);
        BlzFrameSetPoint(mpBar, FRAMEPOINT_TOP, hpBar, FRAMEPOINT_BOTTOM, 0, 0.00);
        
        BlzFrameSetVisible(heroBarButtons, true);

        BlzFrameSetVisible(minimapParent, true);
        BlzFrameSetVisible(minimap, true);
        // buttons still not showing up
        FrameHelper.setFramesVisibility(minimapButtons, true);

        BlzFrameSetVisible(chatMsg, true);
        BlzFrameSetVisible(gameMsg, true);

        BlzFrameSetVisible(heroPortrait, true);
        BlzFrameClearAllPoints(heroPortrait);
        BlzFrameSetPoint(heroPortrait, FRAMEPOINT_BOTTOM, hpBar, FRAMEPOINT_TOP, -0.135, 0.003);
        BlzFrameSetSize(heroPortrait, 0.08, 0.08);

        BlzFrameSetVisible(unitPanelParent, true);
        BlzFrameSetVisible(unitPanel, false);

        BlzFrameSetVisible(inventoryCover, false);
        BlzFrameSetVisible(inventoryCoverTexture, false);
        
        BlzFrameSetParent(inventoryParent, commandCardParent);

        BlzFrameSetVisible(commandCardParent, true);
        BlzFrameSetVisible(inventoryParent, true);
        FrameHelper.setFramesVisibility(inventoryButtons, true);
        // FrameHelper.setFramesVisibility(inventoryFrames, true);

        // heroStatsUI.setRenderVisible(true);
        BlzFrameSetVisible(customStrengthLabel, true);
        BlzFrameSetVisible(customAgilityLabel, true);
        BlzFrameSetVisible(customIntelligenceLabel, true);
      }
    }
  });
  
  // disable after pick phase
  TimerStart(CreateTimer(), 60, false, () => {
    canUseCustomUi = false;
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, 
    //   "|cffff2020Post-pick phase: Custom UI has been disabled. Too slow!"
    // );
    DestroyTimer(GetExpiredTimer());
  });

	const resetUnitPanelTrigger = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerChatEvent(resetUnitPanelTrigger, Player(i), "hideunitpanel", true);
	}
	TriggerAddAction(resetUnitPanelTrigger, () => {
		const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
		const unitPanelParent = BlzFrameGetParent(unitPanel);
		
		const toBeHidden: framehandle[] = [
			// BlzGetFrameByName("SimpleInfoPanelIconDamage", 0),
			// BlzGetFrameByName("SimpleInfoPanelIconDamage", 1),
			// BlzGetFrameByName("SimpleInfoPanelIconArmor", 2),
			// BlzGetFrameByName("SimpleInfoPanelIconRank", 3),
			// BlzGetFrameByName("SimpleInfoPanelIconFood", 4),
			// BlzGetFrameByName("SimpleInfoPanelIconGold", 5),
			// BlzGetFrameByName("InfoPanelIconHeroIcon", 6),
			// BlzGetFrameByName("SimpleInfoPanelIconAlly", 7),

			// BlzGetFrameByName("InfoPanelIconHeroStrengthLabel", 6),
			// BlzGetFrameByName("InfoPanelIconHeroStrengthValue", 6),
			// BlzGetFrameByName("InfoPanelIconHeroAgilityLabel", 6),
			// BlzGetFrameByName("InfoPanelIconHeroAgilityValue", 6),
			// BlzGetFrameByName("InfoPanelIconHeroIntellectLabel", 6),
			// BlzGetFrameByName("InfoPanelIconHeroIntellectValue", 6),
			// BlzGetFrameByName("SimpleInfoPanelIconHeroText", 6),
			// BlzGetFrameByName("SimpleInfoPanelIconHero", 6),
			BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0),
			BlzGetFrameByName("SimpleInventoryCover", 0),
			BlzGetFrameByName("SimpleInventoryCoverTexture", 0),
		]

		for (let i = 0; i < toBeHidden.length; ++i) {
			BJDebugMsg(i + ": " + toBeHidden[i]);
		}

		const player = GetTriggerPlayer();
		if (GetLocalPlayer() == player) {
			FrameHelper.setFramesVisibility(toBeHidden, false);
		}

  });



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

  BJDebugMsg("Num players detected: " + numActivePlayers);

  if (numActivePlayers == 1) {

    BJDebugMsg("Special Single Player Commands -level -mega -cd");

    const megaLvl = CreateTrigger();
    TriggerRegisterPlayerChatEvent(megaLvl, Player(0), "-mega", true);
    TriggerAddAction(megaLvl, () => {
      const group = GetUnitsOfPlayerMatching(
        GetTriggerPlayer(), 
        Condition(() => {
          return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO);
        })
      )

      ForGroup(group, () => {
        SetHeroLevel(GetEnumUnit(), 900, false);
        ModifyHeroSkillPoints(GetEnumUnit(), bj_MODIFYMETHOD_ADD, 500);
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
  
    // reset cd of custom ability
    const cdTrig = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerChatEvent(cdTrig, Player(i), "-cd", true);
    }
    TriggerAddAction(cdTrig, () => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      for (const customHero of customPlayers[playerId].allHeroes) {
        if (customHero) {
          UnitResetCooldown(customHero.unit);
          for (const [name, abil] of customHero.abilities.abilities) {
            if (abil) {
              abil.currentCd = 0;
            }
          }
        }
      }
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
  
    // force budokai
    const forceBudokaiTrig = CreateTrigger();
    TriggerRegisterPlayerChatEvent(forceBudokaiTrig, Player(0), "-forcebudokaitest", true);
    TriggerAddAction(forceBudokaiTrig, () => {
      TournamentManager.getInstance().startTournament(Constants.budokaiName);
    });

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
  });

  // rename trig
  const nameTrig = CreateTrigger();
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerChatEvent(nameTrig, Player(i), "-name", false);
  }
  TriggerAddAction(nameTrig, () => {
    const player = GetTriggerPlayer();
    const newName = SubString(GetEventPlayerChatString(), 6, 20);
    if (newName.length > 1) {
      SetPlayerName(player, newName);
    }
  });

  // freemode
  const freeModeTrig = CreateTrigger();
  // for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
  //   TriggerRegisterPlayerChatEvent(nameTrig, Player(i), "-name", false);
  // }
  TriggerRegisterPlayerChatEvent(freeModeTrig, Player(0), "-freemode", true);
  TriggerRegisterPlayerChatEvent(freeModeTrig, Player(0), "-fbsimtest", true);
  TriggerAddAction(freeModeTrig, () => {
    WinLossHelper.freeMode = true;
  });

  // force final battle
  const forceFinalBattleTrig = CreateTrigger();
  TriggerRegisterPlayerChatEvent(forceFinalBattleTrig, Player(0), "-forcefinalbattletest", true);
  TriggerAddAction(forceFinalBattleTrig, () => {
    TournamentManager.getInstance().startTournament(Constants.finalBattleName);
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

  SetupBraveSwordAttack(customPlayers);
  SetupDragonFistSfx(customPlayers);
  SetupSpellSoundEffects();
}

export function SetupBraveSwordAttack(customPlayers: CustomPlayer[]) {
  const braveSwordAttackId = FourCC("A0IA");
  const herosSongDebuff = FourCC("B01H");
  const dummyStunSpell = FourCC('A0IY');
  const dummyStunOrder = 852095;
  const tickRate = 0.02;
  const jumpDuration = 40;
  const jumpHeight = 900;
  const jumpMoveDistance = 26;
  const braveSwordAOE = 400;
  const braveSwordMaxRange = 1100;
  const braveSwordDamageMult = 0.4;
  const braveSwordManaBurnMult = 0.01;

  const trigger = CreateTrigger();

  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == braveSwordAttackId) {
      const caster = GetTriggerUnit();
      const abilityLevel = GetUnitAbilityLevel(caster, spellId);
      const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
      const player = GetTriggerPlayer();

      const targetGroup = UnitHelper.getNearbyValidUnits(
        targetPos, braveSwordAOE, 
        () => {
          return (
            UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player) && 
            GetUnitAbilityLevel(GetFilterUnit(), herosSongDebuff) > 0
          );
        }
      )
      
      if (CountUnitsInGroup(targetGroup) > 0) {
        let casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
        let time = 0;
        // PauseUnit(caster, true);
        // SetUnitInvulnerable(caster, true);
        UnitHelper.giveUnitFlying(caster);

        TimerStart(CreateTimer(), tickRate, true, () => {
          casterPos.x = GetUnitX(caster);
          casterPos.y = GetUnitY(caster);
          const distanceToTarget = CoordMath.distance(casterPos, targetPos);
          if (
            distanceToTarget > braveSwordMaxRange ||
            time > jumpDuration ||
            BlzIsUnitInvulnerable(caster)
          ) {
            
            const castDummy = CreateUnit(
              player, 
              Constants.dummyCasterId, 
              casterPos.x, casterPos.y, 
              0
            );
            UnitAddAbility(castDummy, dummyStunSpell);

            // PauseUnit(caster, false);
            // SetUnitInvulnerable(caster, false);
            const damageGroup = UnitHelper.getNearbyValidUnits(
              casterPos, braveSwordAOE, 
              () => {
                return (
                  UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player)
                );
              }
            );

            let spellPower = 1.0;
            const customHero = customPlayers[GetPlayerId(player)].getCustomHero(caster);
            if (customHero) {
              spellPower = customHero.spellPower;
            }
            const damage = abilityLevel * spellPower * braveSwordDamageMult * (
              CustomAbility.BASE_DAMAGE + 
              GetHeroAgi(caster, true)
            );
            const manaBurn = damage * braveSwordManaBurnMult * abilityLevel;

            ForGroup(damageGroup, () => {
              const damagedUnit = GetEnumUnit();
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
                DAMAGE_TYPE_UNKNOWN, 
                WEAPON_TYPE_WHOKNOWS
              );

              if (IsUnitType(damagedUnit, UNIT_TYPE_HERO)) {
                IssueTargetOrderById(castDummy, dummyStunOrder, damagedUnit);
              }
            });

            DestroyGroup(damageGroup);

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

            const moveAngle = CoordMath.angleBetweenCoords(casterPos, targetPos);
            let movePos;
            if (distanceToTarget < jumpMoveDistance) {
              movePos = CoordMath.polarProjectCoords(casterPos, moveAngle, distanceToTarget);
            } else {
              movePos = CoordMath.polarProjectCoords(casterPos, moveAngle, jumpMoveDistance);
            }

            PathingCheck.moveGroundUnitToCoord(caster, movePos);
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
    return false;
  }));
}

export function SetupDragonFistSfx(customPlayers: CustomPlayer[]) {
  const dragonFistId = FourCC("A00U");
  const superDragonFistId = FourCC("A0P0");
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
  const sfxSpiralModel = "DragonSegment2.mdl";
  
  const trigger = CreateTrigger();

  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == dragonFistId || spellId == superDragonFistId) {
      const caster = GetTriggerUnit();
      let casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
      let oldPos = new Vector2D(casterPos.x, casterPos.y);

      // const targetPos = customPlayers[GetPlayerId(GetTriggerPlayer())].orderPoint;
      const sfxList: effect[] = [];
      let sfxIndex = 0;
      const sfxHead = AddSpecialEffect("DragonHead2.mdl", casterPos.x, casterPos.y);
      BlzSetSpecialEffectScale(sfxHead, sfxHeadScale);
      BlzSetSpecialEffectColor(sfxHead, sfxRed, sfxGreen, sfxBlue);
      sfxList.push(sfxHead);  
      ++sfxIndex;

      let duration = baseDuration;

      let time = 0; 
      TimerStart(CreateTimer(), tickRate, true, () => {
        oldPos.x = casterPos.x;
        oldPos.y = casterPos.y;
        casterPos.x = GetUnitX(caster);
        casterPos.y = GetUnitY(caster);
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

            const currentPos = CoordMath.polarProjectCoords(
              oldPos, 
              facingAngle, 
              (i+1) * distanceTravelled / updatesThisTick
            );
            const newPos = CoordMath.polarProjectCoords(
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

            const sfx = AddSpecialEffect(sfxSpiralModel, newPos.x, newPos.y);
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
    return false;
  }));
}

export function playSoundOnUnit(target: unit, soundFile: string, duration: number) {
  udg_TempSound = CreateSound(soundFile, false, true, false, 1, 1, "SpellsEAX")
	SetSoundDuration(udg_TempSound, duration)
	SetSoundChannel(udg_TempSound, 0)
	SetSoundVolume(udg_TempSound, 127)
	SetSoundPitch(udg_TempSound, 1.0)
	SetSoundDistances(udg_TempSound, 600.0, 10000.0)
	SetSoundDistanceCutoff(udg_TempSound, 4500.0)
	SetSoundConeAngles(udg_TempSound, 0.0, 0.0, 127)
	SetSoundConeOrientation(udg_TempSound, 0.0, 0.0, 0.0)
	PlaySoundOnUnitBJ(udg_TempSound, 100, target)
	KillSoundWhenDone(udg_TempSound)
}

export function SetupSpellSoundEffects() {
  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const unit = GetTriggerUnit();
    const spellId = GetSpellAbilityId();
    playUnitSpellSound(unit, spellId);
    return false;
  }));
}

export module Id {
  export const android17dbs = FourCC("H08Z");
  export const powerBlitz = FourCC("A09O");
  export const powerBlitzBarrage = FourCC("A0MW");
  export const androidBarrier = FourCC("A0LB");
  export const superElectricStrike = FourCC("A0MV");

  export const bardock = FourCC("H08M");
  export const riotJavelin = FourCC("A0LP");
  export const rebellionSpear = FourCC("A0LQ");

  export const buu = FourCC("O005");
  export const candyBeam = FourCC("A0EI");

  export const cellSBC = FourCC("A0C9");
  export const cellMasenko = FourCC("A0GD");

  export const metalCooler = FourCC("H01A");
  export const fourthCooler = FourCC("H042");
  export const fifthCooler = FourCC("H043");
  export const supernova = FourCC("A0C1");
  export const goldenSupernova = FourCC("A0L2");

  export const ft = FourCC("H009");
  export const ftss = FourCC("A0KT");
  export const finishBuster = FourCC("A02L");
  export const burningAttack = FourCC("A03I");

  export const goku = FourCC("H000");
  export const kamehameha = FourCC("A00R");
  export const dragonFist = FourCC("A00U");
  export const superDragonFist = FourCC("A0P0");
  export const solarFlare = FourCC("A0KO");

  export const gohan = FourCC("H00K");
  export const masenko = FourCC("A0H8");
  export const greatSaiyamanHasArrived = FourCC("A0L7");

  export const janemba = FourCC("H062");
  export const bunkaiTeleport = FourCC("A0O2");
  export const cosmicIllusion = FourCC("A0EU");

  export const kkr = FourCC("E01D");
  export const bellyArmor = FourCC("A0OT");
  export const krownToss = FourCC("A0IV");
  export const kharge = FourCC("A0IW");
  export const kannonblast = FourCC("A0OW");
  export const monkeySmasher = FourCC("A0IX");
  export const blasto = FourCC("A0OU");
  export const kingsThrone = FourCC("A0OV");

  export const nappa = FourCC("H08W");
  export const giantStorm = FourCC("A0MI");
  export const blazingStorm = FourCC("A0MJ");
  export const plantSaibamen = FourCC("A0MK");
  export const breakCannon = FourCC("A0ML");

  export const pan = FourCC("H08P");
  export const honeyBeeCostume = FourCC("A0LY");
  export const panKame = FourCC("A0LX");
  export const maidenBlast = FourCC("A0LU");
  export const reliableFriend = FourCC("A0LV");
  export const summonGiru = FourCC("A0LW");

  export const piccolo = FourCC("H00R");
  export const piccoloSBC = FourCC("A06F");
  export const piccoloCloneSBC = FourCC("A0ES");
  export const hellzoneGrenade = FourCC("A0LM");

  export const tapion = FourCC("E014");
  export const shiningSword = FourCC("A0IC");
  export const herosFlute = FourCC("A0IB");

  export const vegeta = FourCC("E003");
  export const galickGun = FourCC("A03N");
  export const bigBangAttack = FourCC("A0GO");
  export const finalFlash = FourCC("A01B");
  export const finalFlash2 = FourCC("A0L4");
  export const energyBlastVolley = FourCC("A0L3");

  export const videl = FourCC("H085");
  export const flyingKick = FourCC("A0JW");
}

export function playUnitSpellSound(unit: unit, spellId: number) {
  const unitId = GetUnitTypeId(unit);
  let rng = Math.random() * 100;

  if (spellId == Id.cosmicIllusion) {
    const nearbyNappa = CreateGroup();
    GroupEnumUnitsInRange(
      nearbyNappa,
      GetUnitX(unit), GetUnitY(unit), 
      2000,
      Condition(() => {
        return GetUnitTypeId(GetFilterUnit()) == Id.nappa;
      })
    )
    
    let keepSpeaking = true;
    ForGroup(nearbyNappa, () => {
      if (keepSpeaking && rng < 25) {
        keepSpeaking = false;
        playSoundOnUnit(GetEnumUnit(), "Audio/Effects/NappaWhereDidHeGo.mp3", 16512);
      } else {
        rng = Math.random() * 100;
      }
    });

    DestroyGroup(nearbyNappa);
  }


  switch (spellId) {
    // android 17 dbs
    case Id.powerBlitz:
    case Id.powerBlitzBarrage:
      if (unitId == Id.android17dbs) {
        playSoundOnUnit(unit, "Audio/Voice/Android17TakeThis.mp3", 984);
      }
      break;

    case Id.androidBarrier:
      if (unitId == Id.android17dbs) {
        playSoundOnUnit(unit, "Audio/Voice/Android17GetOutOfHere.mp3", 984);
      }
      break;

    case Id.superElectricStrike:
      if (unitId == Id.android17dbs) {
        playSoundOnUnit(unit, "Audio/Voice/Android17BeatYouLikeARug.mp3", 1608);
      }
      break;

    // bardock
    case Id.riotJavelin:
      if (unitId == Id.bardock) {
        playSoundOnUnit(unit, "Audio/Voice/BardockEverything.mp3", 1392);
      }
      break;

    case Id.rebellionSpear:
      if (unitId == Id.bardock) {
        playSoundOnUnit(unit, "Audio/Voice/BardockPerish.mp3", 1440);
      }
      break;

    // buu 
    case Id.candyBeam:
      if (unitId == Id.buu) {
        playSoundOnUnit(unit, "Audio/Voice/BuuCandyBeam.mp3", 1872);
      }
      playSoundOnUnit(unit, "Audio/Effects/CandyBeam.mp3", 1436);
      break;

    // cooler 
    case Id.supernova:
    case Id.goldenSupernova:
      if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
        playSoundOnUnit(unit, "Audio/Voice/CoolerSupernova.mp3", 1416);
      } else if (unitId == Id.metalCooler) {
        playSoundOnUnit(unit, "Audio/Voice/CoolerMetalSupernova.mp3", 1944);
      }
      break;
    
    // ft 
    case Id.ftss:
      playSoundOnUnit(unit, "Audio/Voice/FTSS.mp3", 1008);
      break;

    case Id.finishBuster:
      playSoundOnUnit(unit, "Audio/Effects/FinishBuster.mp3", 1593);
      break;

    case Id.burningAttack:
      if (unitId == Id.ft) {
        playSoundOnUnit(unit, "Audio/Voice/FTBurningAttack.mp3", 2952);
      }
      playSoundOnUnit(unit, "Audio/Effects/BurningAttack.mp3", 2136);
      break;
    
    // goku
    case Id.kamehameha:
      if (unitId == Id.goku) {
        playSoundOnUnit(unit, "Audio/Voice/GokuKamehameha.mp3", 2832);
      }
      playSoundOnUnit(unit, "Audio/Effects/Kamehameha.mp3", 3108);
      break;
      
    case Id.dragonFist:
    case Id.superDragonFist:
      if (unitId == Id.goku) {
        playSoundOnUnit(unit, "Audio/Voice/GokuDragonFist.mp3", 3552);
      }
      playSoundOnUnit(unit, "Audio/Effects/DragonFist.mp3", 5041);
      break;
    
    case Id.solarFlare:
      if (unitId == Id.goku) {
        playSoundOnUnit(unit, "Audio/Voice/GokuSolarFlare.mp3", 2976);
      }
      break;
    
    // gohan
    case Id.masenko:
    case Id.cellMasenko:
      playSoundOnUnit(unit, "Audio/Effects/Masenko.mp3", 1593);
      break;

    case Id.greatSaiyamanHasArrived:
      if (unitId == Id.gohan) {
        playSoundOnUnit(unit, "Audio/Voice/GohanGreatSaiyaman.mp3", 1896);
      }
      playSoundOnUnit(unit, "Audio/Effects/JusticePose.mp3", 1645);
      break;

    // janemba
    case Id.cosmicIllusion:
    case Id.bunkaiTeleport:
      playSoundOnUnit(unit, "Audio/Effects/JanembaSuperBunkai.mp3", 1985);
      break;
    
    // king k rool kkr
    case Id.bellyArmor:
      playSoundOnUnit(unit, "Audio/Effects/KKRBellyArmor.mp3", 552);
      break;

    case Id.krownToss:
      if (unitId == Id.kkr) {
        if (rng < 50) {
          playSoundOnUnit(unit, "Audio/Voice/KKRGrunt1.mp3", 432);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/KKRGrunt2.mp3", 384);
        }
      }
      break;

    case Id.kharge:
      if (unitId == Id.kkr) {
        playSoundOnUnit(unit, "Audio/Voice/KKRGrunt3.mp3", 792);
      }
      break;

    case Id.kannonblast:
      playSoundOnUnit(unit, "Audio/Effects/KKRKannonblast.mp3", 1440);
      break;

    case Id.monkeySmasher:
      if (unitId == Id.kkr) {
        playSoundOnUnit(unit, "Audio/Voice/KKRGrunt4.mp3", 480);
      }
      playSoundOnUnit(unit, "Audio/Voice/KKRKannonblast.mp3", 1440);
      break;
    
    case Id.kingsThrone:
      playSoundOnUnit(unit, "Audio/Effects/KKRThrone1.mp3", 2904);
      break;

    case Id.blasto:
      playSoundOnUnit(unit, "Audio/Effects/KKRBlasto.mp3", 4896);
      break;
    
    // nappa
    case Id.giantStorm:
      if (unitId == Id.nappa) {
        if (rng < 10) {
          playSoundOnUnit(unit, "Audio/Voice/NappaBlahBlahBlah.mp3", 5664);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/NappaDodgeBall.mp3", 1920);
        }
      }
      break;

    case Id.blazingStorm:
      if (unitId == Id.nappa) {
        if (rng < 10) {
          playSoundOnUnit(unit, "Audio/Voice/NappaBlazingStorm.mp3", 7488);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/NappaKapow.mp3", 7488);
        }
      }
      break;

    case Id.plantSaibamen:
      if (unitId == Id.nappa) {
        playSoundOnUnit(unit, "Audio/Voice/NappaUnitedWeStand.mp3", 5328);
      }
      break;
      
    case Id.breakCannon:
      if (unitId == Id.nappa) {
        if (rng < 10) {
          playSoundOnUnit(unit, "Audio/Voice/NappaSneeze.mp3", 1248);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/NappaBreakCannon.mp3", 1176);
        }
      }
      break;
    
    // pan
    case Id.honeyBeeCostume:
      if (unitId == Id.pan) {
        playSoundOnUnit(unit, "Audio/Voice/PanYouGottaSmile.mp3", 1824);
      }
      break;

    case Id.panKame:
      if (unitId == Id.pan) {
        playSoundOnUnit(unit, "Audio/Voice/PanKamehameha.mp3", 1296);
      }
      playSoundOnUnit(unit, "Audio/Effects/Kamehameha.mp3", 3108);
      break;

    case Id.maidenBlast:
      if (unitId == Id.pan) {
        playSoundOnUnit(unit, "Audio/Voice/PanCantStandYou.mp3", 1512);
      }
      break;

    case Id.reliableFriend:
      if (unitId == Id.pan) {
        playSoundOnUnit(unit, "Audio/Voice/PanTeachYouALesson.mp3", 1680);
      }
      break;

    case Id.summonGiru:
      if (unitId == Id.pan) {
        playSoundOnUnit(unit, "Audio/Voice/PanPrepareYourself.mp3", 1344);
      }
      break;

    // piccolo
    case Id.piccoloSBC:
    case Id.piccoloCloneSBC:
    case Id.cellSBC:
      if (unitId == Id.piccolo) {
        playSoundOnUnit(unit, "Audio/Voice/PiccoloSBC.mp3", 1776);
      }
      playSoundOnUnit(unit, "Audio/Effects/SBC.mp3", 2194);
      break;

    case Id.hellzoneGrenade:
      if (unitId == Id.piccolo) {
        playSoundOnUnit(unit, "Audio/Voice/PiccoloHellzoneGrenade.mp3", 1200);
      }
      break;

    // tapion
    case Id.shiningSword:
      playSoundOnUnit(unit, "Audio/Effects/ShiningSword.mp3", 1488);
      break;

    case Id.herosFlute:
      // playSoundOnUnit(unit, "Audio/Effects/HerosFlute.mp3", 11755);
      break;
    
    // vegeta
    case Id.galickGun:
      if (unitId == Id.vegeta) {
        playSoundOnUnit(unit, "Audio/Voice/VegetaGalickGun.mp3", 2352);
      }
      break;

    case Id.finalFlash:
    case Id.finalFlash2:
      if (unitId == Id.vegeta) {
        playSoundOnUnit(unit, "Audio/Voice/VegetaFinalFlash.mp3", 3408);
      }
      playSoundOnUnit(unit, "Audio/Effects/FinalFlash.mp3", 4205);
      break;

    case Id.bigBangAttack:
      if (unitId == Id.vegeta) {
        playSoundOnUnit(unit, "Audio/Voice/VegetaBigBangAttack.mp3", 3744);
      }
      break;

    case Id.energyBlastVolley:
      playSoundOnUnit(unit, "Audio/Effects/EnergyBlastVolley.mp3", 3134);
      break;
    
    // videl
    case Id.flyingKick:
      if (unitId == Id.videl) {
        if (rng < 25) {
          playSoundOnUnit(unit, "Audio/Voice/VidelHereICome.mp3", 705);
        } else if (rng < 50) {
          playSoundOnUnit(unit, "Audio/Voice/VidelOutOfMyWay.mp3", 705);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/VidelHyaa.mp3", 679);
        }
      }
      break;
  }
}