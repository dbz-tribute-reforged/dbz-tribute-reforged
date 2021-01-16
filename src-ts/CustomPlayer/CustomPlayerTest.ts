import { CustomPlayer } from "./CustomPlayer";
import { CustomHero } from "CustomHero/CustomHero";
import { Constants, Id } from "Common/Constants";
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
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { SoundHelper } from "Common/SoundHelper";

// global?
export const customPlayers: CustomPlayer[] = [];
export let hostPlayer: player = Player(0);

export function setupHostPlayerTransfer() {
  const hostPlayerTransfer = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerEventLeave(hostPlayerTransfer, Player(i));
  }
  TriggerAddAction(hostPlayerTransfer, () => {
    if (
      GetTriggerPlayer() == hostPlayer && 
      GetPlayerController(GetTriggerPlayer()) == MAP_CONTROL_USER
    ) {
      for (let i = 0; i < Constants.hostPlayerOrder.length; ++i) {
        if (
          IsPlayerSlotState(Player(i), PLAYER_SLOT_STATE_PLAYING) && 
          GetPlayerController(Player(i)) == MAP_CONTROL_USER && 
          Player(i) != hostPlayer
        ) {
          hostPlayer = Player(i);
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 
            15, 
            "Player " + (i+1).toString() + " is now the host"
          );
          break;
        }
      }
    }
  });
}

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
  //       customPlayers[playerId].mouseData.x = x;
  //       customPlayers[playerId].mouseData.y = y;
  //     }
  //   }
  // });


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
  addKeyEvent(abil0, OSKEY_Y, 0, true);
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
      const inventoryBar = BlzFrameGetParent(BlzGetFrameByName("SimpleInventoryBar", 0));
      // const inventoryFrames: framehandle[] = [];
      // inventoryFrames.push(BlzGetFrameByName("SimpleInventoryCover",0));
      // inventoryFrames.push(BlzGetFrameByName("SimpleInventoryBar",0));
      // inventoryFrames.push(BlzGetFrameByName("InventoryCoverTexture",0));
      // inventoryFrames.push(BlzGetFrameByName("InventoryText",0));

      const inventoryButtons: framehandle[] = [];
      for (let i = 0; i < 6; ++i) {
        // const frame = BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, i);
        // inventoryButtons.push(frame);
        inventoryButtons.push(BlzGetFrameByName("InventoryButton_".concat(I2S(i)), 0));
      }

      const commandCardParent = BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, 0));
      const commandCardBar = BlzFrameGetParent(BlzGetFrameByName("CommandBarFrame", 0));
      const commandCardButtons: framehandle[] = [];
      for (let i = 0; i < 12; ++i) {
        // commandCardButtons.push(BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, i));
        commandCardButtons.push(BlzGetFrameByName("CommandButton_".concat(I2S(i)), 0));
      }

      // const buffBar = BlzGetOriginFrame(ORIGIN_FRAME_UNIT_PANEL_BUFF_BAR, 0);
      // const buffBarParent = BlzFrameGetParent(buffBar);
      
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
          -0.002, 0.001
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
        BlzFrameSetPoint(gameMsg, FRAMEPOINT_BOTTOMLEFT, grandpa, FRAMEPOINT_BOTTOMLEFT, -0.1, 0.22);
        // still too short for most hs
        // BlzFrameSetPoint(gameMsg, FRAMEPOINT_TOPRIGHT, grandpa, FRAMEPOINT_BOTTOMLEFT, 0.6, 0.3);

        BlzFrameSetVisible(heroPortrait, true);
        BlzFrameClearAllPoints(heroPortrait);
        BlzFrameSetPoint(heroPortrait, FRAMEPOINT_BOTTOM, hpBar, FRAMEPOINT_TOP, -0.135, 0.003);
        BlzFrameSetSize(heroPortrait, 0.08, 0.08);

        // buff bar doenst seem to work...
        // BlzFrameSetVisible(buffBarParent, true);
        // BlzFrameSetVisible(buffBar, true);
        // BlzFrameClearAllPoints(buffBar);
        // BlzFrameSetAbsPoint(buffBar, FRAMEPOINT_CENTER, 0.4, 0.3);
        // BlzFrameSetPoint(buffBar, FRAMEPOINT_BOTTOMRIGHT, mpBar, FRAMEPOINT_BOTTOMLEFT, 0, 0);

        BlzFrameSetVisible(unitPanelParent, true);
        BlzFrameSetVisible(unitPanel, false);

        BlzFrameSetVisible(inventoryCover, false);
        // BlzFrameSetSize(inventoryCover, 0.001, 0.001);
        // BlzFrameSetPoint(
        //   inventoryCover, FRAMEPOINT_BOTTOMRIGHT,
        //   grandpa, FRAMEPOINT_BOTTOMRIGHT,
        //   -0.2, 0
        // );

        BlzFrameSetVisible(inventoryCoverTexture, false);
        // BlzFrameSetSize(inventoryCoverTexture, 0.0001, 0.0001);
        // BlzFrameSetPoint(
        //   inventoryCoverTexture, FRAMEPOINT_BOTTOMRIGHT,
        //   inventoryCover, FRAMEPOINT_BOTTOMRIGHT,
        //   0, 0
        // );
        
        BlzFrameSetParent(inventoryParent, commandCardParent);

        BlzFrameSetVisible(commandCardParent, true);
        BlzFrameSetVisible(inventoryParent, true);
        FrameHelper.setFramesVisibility(inventoryButtons, true);
        // FrameHelper.setFramesVisibility(inventoryFrames, true);
        

        // relocates the inventory buttons (but not the inventroy bar)
        // for (let i = 0; i < 3; ++i) {
        //   for (let j = 0; j < 2; ++j) {
        //     BlzFrameClearAllPoints(inventoryButtons[i*2+j]);
        //     BlzFrameSetAbsPoint(
        //       inventoryButtons[i*2+j], FRAMEPOINT_TOPLEFT,
        //       0.7+0.04*j, 0.12-0.04*i
        //     )
        //   }
        // }


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


  // swap players command
  const swapPlayersCommand = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(swapPlayersCommand, Player(i), "-swap", false);
  }
  TriggerAddAction(swapPlayersCommand, () => {
    if (GetTriggerPlayer() == hostPlayer) {
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
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerChatEvent(freeModeTrig, Player(i), "-freemode", true);
    TriggerRegisterPlayerChatEvent(freeModeTrig, Player(i), "-fbsimtest", true);
  }
  TriggerAddAction(freeModeTrig, () => {
    if (GetTriggerPlayer() == hostPlayer) {
      WinLossHelper.freeMode = true;
    }
  });

  // force final battle
  const forceFinalBattleTrig = CreateTrigger();
  TriggerRegisterPlayerChatEvent(forceFinalBattleTrig, Player(0), "-forcefinalbattletest", true);
  TriggerAddAction(forceFinalBattleTrig, () => {
    TournamentManager.getInstance().addFinalBattle();
    TimerStart(CreateTimer(), 5.0, false, () => {
      TournamentManager.getInstance().startTournament(Constants.finalBattleName);
      DestroyTimer(GetExpiredTimer());
    })
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

  TimerStart(CreateTimer(), 3, false, () => {
    SetupBraveSwordAttack(customPlayers);
    SetupDragonFistSfx(customPlayers);
    SetupGinyuChangeNow(customPlayers);
    SetupGinyuTelekinesis(customPlayers);
    SetupOmegaShenronShadowFist(customPlayers);
    SetupKrillinSenzuThrow(customPlayers);
    SetupJirenGlare(customPlayers);
    SetupCustomAbilityRefresh(customPlayers);
    SoundHelper.SetupSpellSoundEffects();
    DestroyTimer(GetExpiredTimer());
  });
}

export function SetupBraveSwordAttack(customPlayers: CustomPlayer[]) {
  const braveSwordAttackId = FourCC("A0IA");
  const herosSongDebuff = FourCC("B01H");
  const dummyStunSpell = FourCC('A0IY');
  const dummyStunOrder = 852095;
  const tickRate = 0.02;
  const jumpDuration = 40;
  const jumpHeight = 900;
  const jumpMoveDistance = 30;
  const jumpSpeedModifier = 0.0015;
  const jumpSpeedModifierMax = 1.33;
  const jumpSpeedModifierMin = 0.15;
  const braveSwordAOE = 400;
  const braveSwordDamageMult = 0.25 * 1.45;
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
        const moveAngle = CoordMath.angleBetweenCoords(casterPos, targetPos);
        let time = 0;
        // PauseUnit(caster, true);
        // SetUnitInvulnerable(caster, true);
        UnitHelper.giveUnitFlying(caster);

        TimerStart(CreateTimer(), tickRate, true, () => {
          casterPos.setPos(GetUnitX(caster), GetUnitY(caster));
          if (time > jumpDuration) {
            
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
                DAMAGE_TYPE_NORMAL, 
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

            const distanceToTarget = CoordMath.distance(casterPos, targetPos);

            let movePos = CoordMath.polarProjectCoords(
              casterPos, moveAngle, 
              Math.max(
                jumpSpeedModifierMin, 
                Math.min(
                  jumpSpeedModifierMax, 
                  distanceToTarget * jumpSpeedModifier
                )
              ) * jumpMoveDistance
            );

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
  const shadowFistId = FourCC("A0QL");
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
  const sfxHeadModel = "DragonHead2.mdl";
  const sfxAltSpiralModel = "RedDragonSegment.mdl";
  const sfxAltHeadModel = "RedDragonHead.mdl";
  
  const trigger = CreateTrigger();

  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == dragonFistId || spellId == superDragonFistId || spellId == shadowFistId) {
      const caster = GetTriggerUnit();
      let casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
      let oldPos = new Vector2D(casterPos.x, casterPos.y);

      // const targetPos = customPlayers[GetPlayerId(GetTriggerPlayer())].orderPoint;
      const sfxList: effect[] = [];
      let sfxIndex = 0;
      let sfxHead = GetLastCreatedEffectBJ();
      if (spellId == shadowFistId) {
        sfxHead = AddSpecialEffect(sfxAltHeadModel, casterPos.x, casterPos.y);
      } else {
        sfxHead = AddSpecialEffect(sfxHeadModel, casterPos.x, casterPos.y);
      }
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

            let sfx = GetLastCreatedEffectBJ();
            if (spellId == shadowFistId) {
              sfx = AddSpecialEffect(sfxAltSpiralModel, newPos.x, newPos.y);
            } else {
              sfx = AddSpecialEffect(sfxSpiralModel, newPos.x, newPos.y);
            }
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

export function SetupGinyuChangeNow(customPlayers: CustomPlayer[]) {
  const changeNow = FourCC("A0PN");

  const trigger = CreateTrigger();
  for (let i = 0; i < Constants.maxActivePlayers; ++i) {
    TriggerRegisterPlayerUnitEventSimple(trigger, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT);
  }
  TriggerAddCondition(trigger, Condition(() => {
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
      customPlayers[targetPlayerId].hasHero(targetUnit) && 
      GetSpellAbilityId() == changeNow &&
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
      const tmp = customPlayers[casterPlayerId].heroes;
      customPlayers[casterPlayerId].heroes = customPlayers[targetPlayerId].heroes;
      customPlayers[targetPlayerId].heroes = tmp;
      for (const hero of customPlayers[targetPlayerId].allHeroes) {
        if (IsUnitType(hero.unit, UNIT_TYPE_SUMMONED) && GetOwningPlayer(hero.unit) != targetPlayer) {
          SetUnitOwner(hero.unit, targetPlayer, true);
        }
      }
      for (const hero of customPlayers[casterPlayerId].allHeroes) {
        if (IsUnitType(hero.unit, UNIT_TYPE_SUMMONED) && GetOwningPlayer(hero.unit) != casterPlayer) {
          SetUnitOwner(hero.unit, casterPlayer, true);
        }
      }
    }
    return false;
  }));
}

export function SetupGinyuTelekinesis(customPlayers: CustomPlayer[]) {
  const ignoreItem = FourCC("wtlg");
  const telekinesisDuration = 30;
  const telekinesisSpeed = 50;
  const telekinesisPlayerSpeedModifier = 0.5;
  const telekinesisAOE = 400;
  const telekinesisMinDistance = 300;
  const telekinesisRect = Rect(0, 0, 800, 800);
  const telekinesis = FourCC("A0PR");

  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == telekinesis) {
      const caster = GetTriggerUnit();
      const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
      const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
      const newPos = new Vector2D();
      const player = GetTriggerPlayer();
      const itemsToMove: item[] = [];

      const unitsToMove = UnitHelper.getNearbyValidUnits(targetPos, telekinesisAOE, () => {
        const testUnit = GetFilterUnit();
        return (
          UnitHelper.isUnitTargetableForPlayer(testUnit, player) && 
          !IsUnitType(testUnit, UNIT_TYPE_ETHEREAL) && 
          !IsUnitType(testUnit, UNIT_TYPE_MAGIC_IMMUNE)
        )
      });

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
          });

          ++counter;
        }
      })

    }

    return false;
  }));
}

export function SetupOmegaShenronShadowFist(customPlayers: CustomPlayer[]) {
  const shadowFistId = FourCC("A0QL");
  const shadowFistAOE = 350;
  const shadowFistDuration = 48;
  const tickRate = 0.03;
  const dballItem = FourCC("I01V");
  const maxDragonBallsToSteal = 1;
  const maxSizedDragonBallStackToSteal = 7;

  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
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
          const targetGroup = UnitHelper.getNearbyValidUnits(
            targetPos, shadowFistAOE, 
            () => {
              return (
                UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player)
              );
            }
          )
          
          let stolenDragonBalls = 0;

          const casterDragonBallIndex = GetInventoryIndexOfItemTypeBJ(caster, dballItem)-1;
          const casterInventoryCount = UnitInventoryCount(caster);

          ForGroup(targetGroup, () => {
            if (totalStolenDragonBalls < maxDragonBallsToSteal) {
              const targetUnit = GetEnumUnit();
              const targetDragonBallIndex = GetInventoryIndexOfItemTypeBJ(targetUnit, dballItem)-1;

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
                    UnitAddItemById(caster, dballItem);
                    if (numCharges == 1) {
                      RemoveItem(stealItem);
                    }
                  } else {
                    // no dballs and no space
                    if (numCharges == 1) {
                      SetItemPosition(stealItem, targetPos.x, targetPos.y);
                    } else {
                      CreateItem(dballItem, targetPos.x, targetPos.y);
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
          DestroyGroup(targetGroup);
        }
      });
    }
    return false;
  }));

}


export function SetupKrillinSenzuThrow(customPlayers: CustomPlayer[]) {
  const senzuThrowDuration = 40;
  const senzuThrowSpeed = 49;
  const senzuThrowStealMinDuration = 10;
  const senzuThrowStealAOE = 300;
  const senzuItemId = FourCC("I000");
  const senzuThrowAbility = FourCC("A0RB");

  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == senzuThrowAbility) {
      const caster = GetTriggerUnit();
      const casterPlayer = GetTriggerPlayer();
      // const casterPlayerId = GetPlayerId(casterPlayer);
      const casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
      const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
      const newPos = new Vector2D(casterPos.x, casterPos.y);
      const senzuItem = CreateItem(senzuItemId, casterPos.x, casterPos.y);
      const direction = CoordMath.angleBetweenCoords(casterPos, targetPos);

      let counter: number = 0;
      TimerStart(CreateTimer(), 0.03, true, () => {
        if (
          counter >= senzuThrowDuration
        ) {
          DestroyTimer(GetExpiredTimer());
        } else {
          if (counter < senzuThrowDuration) {
            newPos.polarProjectCoords(
              newPos,
              direction,
              senzuThrowSpeed
            );

            if (PathingCheck.isGroundWalkable(newPos)) {
              SetItemPosition(senzuItem, newPos.x, newPos.y);
            } else {
              newPos.x = GetItemX(senzuItem);
              newPos.y = GetItemY(senzuItem);
            }
          }
          
          if (counter > senzuThrowStealMinDuration) {
            const beanStealUnits = UnitHelper.getNearbyValidUnits(newPos, senzuThrowStealAOE, () => {
              const testUnit = GetFilterUnit();
              const playerId = GetPlayerId(GetOwningPlayer(testUnit));
              return (
                IsUnitType(testUnit, UNIT_TYPE_HERO) && 
                playerId < Constants.maxActivePlayers &&
                !UnitHelper.isUnitDead(testUnit) &&
                !UnitHelper.isUnitStunned(testUnit) &&
                !IsUnitType(testUnit, UNIT_TYPE_ETHEREAL)
              )
            });
  
            ForGroup(beanStealUnits, () => {
              const targetUnit = GetEnumUnit();
              if (
                counter < senzuThrowDuration && 
                UnitInventoryCount(targetUnit) < UnitInventorySize(targetUnit)
              ) {
                UnitAddItem(targetUnit, senzuItem);
                counter = senzuThrowDuration;
              }
            });
            
            DestroyGroup(beanStealUnits);
          }

          ++counter;
        }
      });
    }

    return false;
  }));
}

export function SetupJirenGlare(customPlayers: CustomPlayer[]) {
  const dummyStunSpell = FourCC('A0IY');
  const dummyStunOrder = 852095;
  const glareDuration = 2.5;
  const maxGlareDistance = 2500;
  const glareDamageMult = 0.25 * 0.53;
  const glare2DamageMult = 0.25 * 0.75;
  const glare2StrDiffMult = 1.1;
  const sourceLoc = new Vector2D(0,0);
  const targetLoc = new Vector2D(0,0);
  const glarePunishDamageMult = 0.15;
  
  /**
   * 0: spellId, or 0 if not activated
   * 1: counter sfx
   * 2: ability level
   */
  const jirenGlareHashtable = InitHashtable();
  const jirenGlareUnitGroup = CreateGroup();

  const glareCastTrigger = CreateTrigger();
  const glareActivateTrigger = CreateTrigger();

  TriggerRegisterAnyUnitEventBJ(glareCastTrigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(glareCastTrigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == Id.glare || spellId == Id.glare2) {
      const unit = GetTriggerUnit();
      const unitId = GetHandleId(unit);
      SaveInteger(jirenGlareHashtable, unitId, 0, spellId);
      
      const effect = AddSpecialEffectTarget("AuraJirenCounter2.mdl", unit, "origin");
      BlzSetSpecialEffectScale(effect, 1.5);
      SaveEffectHandle(jirenGlareHashtable, unitId, 1, effect);
      SaveInteger(jirenGlareHashtable, unitId, 2, GetUnitAbilityLevel(unit, spellId));
      
      if (!IsUnitInGroup(unit, jirenGlareUnitGroup)) {
        GroupAddUnit(jirenGlareUnitGroup, unit);
        TriggerRegisterUnitEvent(glareActivateTrigger, unit, EVENT_UNIT_DAMAGED);
      }

      TimerStart(CreateTimer(), glareDuration, false, () => {
        DestroyTimer(GetExpiredTimer());
        SaveInteger(jirenGlareHashtable, unitId, 0, 0);
        DestroyEffect(LoadEffectHandle(jirenGlareHashtable, unitId, 1));
        SaveInteger(jirenGlareHashtable, unitId, 2, 0);
      });
    }
    return false;
  }));
  
  TriggerAddCondition(glareActivateTrigger, Condition(() => {
    const unit = BlzGetEventDamageTarget();
    const unitId = GetHandleId(unit);
    const spellId = LoadInteger(jirenGlareHashtable, unitId, 0);
    const source = GetEventDamageSource();
    if (UnitHelper.isUnitAlive(unit) && spellId != 0 && IsUnitType(source, UNIT_TYPE_HERO)) {
      SaveInteger(jirenGlareHashtable, unitId, 0, 0);

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
        UnitAddAbility(castDummy, dummyStunSpell);

        const customHero = customPlayers[GetPlayerId(player)].getCustomHero(unit);
        let spellPower = 1.0;
        if (customHero) {
          spellPower = customHero.spellPower;
        }

        const punishDamage = GetEventDamage() * glarePunishDamageMult;

        let damageMult = 1.0;
        if (spellId == Id.glare) {
          damageMult = glareDamageMult;
        } else if (spellId == Id.glare2) {
          damageMult = glare2DamageMult;
        }

        let damageBase = CustomAbility.BASE_DAMAGE + GetHeroStr(unit, true);
        if (spellId == Id.glare2) {
          damageBase += Math.max(0, glare2StrDiffMult * GetHeroStr(unit, true) - GetHeroStr(source, true));
        }

        const abilityLevel = LoadInteger(jirenGlareHashtable, unitId, 2);
        const damage = (
          (abilityLevel * spellPower * damageMult * damageBase) +
          punishDamage
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

        IssueTargetOrderById(castDummy, dummyStunOrder, source);
        
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

export function SetupCustomAbilityRefresh(customPlayers: CustomPlayer[]) {
  const ginyuPoseUltimate = FourCC("A0PS");
  const yamchaSparking = FourCC("A0SB");

  // reset cd of custom abilities
  const trigger = CreateTrigger();
  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == yamchaSparking || spellId == ginyuPoseUltimate) {
      const caster = GetTriggerUnit();
      const player = GetOwningPlayer(caster);
      const playerId = GetPlayerId(player);
      for (const customHero of customPlayers[playerId].allHeroes) {
        if (customHero.unit == caster) {
          for (const [name, abil] of customHero.abilities.abilities) {
            if (abil) {
              abil.currentCd = 0;
              if (abil.currentTick > 0) {
                abil.currentTick = abil.duration;
              }
            }
          }
        }
      }
    }
    return false;
  }));
}
