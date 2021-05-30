import { FrameHelper } from "Common/FrameHelper";
import { Globals, Constants } from "Common/Constants";

// hides the standard ui
// shows LHS hero bar buttons
// minimap + minimap buttons
// chat msgs, game msgs
// hides first 5 command buttons
// sets parent of inventory to parent of bottom right command buttons
export function setupCustomUI(player: player) {
	const playerId = GetPlayerId(player);
	if (!Globals.canUseCustomUi) {
		DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, 
			"|cffff2020Post-pick phase: Custom UI has been disabled. Too slow!"
		);
	} else if (
		!Globals.customPlayers[playerId].usingCustomUI && 
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
		Globals.customPlayers[playerId].usingCustomUI = true;

		const grandpa = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0);
		const worldFrame = BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0);
		const rm = BlzGetFrameByName("ConsoleUIBackdrop", 0);

		const upperBar = BlzGetFrameByName("UpperButtonBarFrame", 0);
		const resourceBar = BlzGetFrameByName("ResourceBarFrame", 0);

		const abilityButtonHotbar = BlzGetFrameByName("abilityButtonHotBar", 0);
    const levelBar = BlzGetFrameByName("MyLevelBar", 0);
		
		const hpBar = BlzGetFrameByName("MyHPBar", 0);
		const mpBar = BlzGetFrameByName("MyMPBar", 0);
		const spBar = BlzGetFrameByName("MySPBar", 0);

		const heroBarButtons = BlzGetOriginFrame(ORIGIN_FRAME_HERO_BAR, 0);
		
		const minimap = BlzGetOriginFrame(ORIGIN_FRAME_MINIMAP, 0);
    const minimapButtonBar = BlzGetFrameByName("MinimapButtonBar", 0);
		const minimapParent = BlzFrameGetParent(minimap);
		const minimapButtons: framehandle[] = [];
		// for (let i = 0; i < 5; ++i) {
		// 	minimapButtons.push(BlzGetOriginFrame(ORIGIN_FRAME_MINIMAP_BUTTON, i));
		// }
    const minimapSignalButton = BlzGetFrameByName("MinimapSignalButton", 0);
    const minimapTerrainButton = BlzGetFrameByName("MiniMapTerrainButton", 0);
    const minimapAllyButton = BlzGetFrameByName("MiniMapAllyButton", 0);
    const minimapCreepButton = BlzGetFrameByName("MiniMapCreepButton", 0);
    const formationButton = BlzGetFrameByName("FormationButton", 0);
    minimapButtons.push(
      minimapSignalButton,
      minimapTerrainButton,
      minimapAllyButton,
      minimapCreepButton,
    );


		const chatMsg = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0);
		const gameMsg = BlzGetOriginFrame(ORIGIN_FRAME_UNIT_MSG, 0);

		const heroPortrait = BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0);
		const unitPanel = BlzGetFrameByName("SimpleInfoPanelUnitDetail", 0);
		const unitPanelParent = BlzFrameGetParent(unitPanel);
		
		const inventoryCover = BlzGetFrameByName("SimpleInventoryCover", 0);
		const inventoryCoverTexture = BlzGetFrameByName("SimpleInventoryCoverTexture", 0);

		const inventoryParent = BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, 0));
		const inventoryBar = BlzFrameGetParent(BlzGetFrameByName("SimpleInventoryBar", 0));
    const inventoryLabel = BlzGetFrameByName("InventoryText", 0);
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
    const item1Button = inventoryButtons[0];
    const item2Button = inventoryButtons[1];
    const item3Button = inventoryButtons[2];
    const item4Button = inventoryButtons[3];
    const item5Button = inventoryButtons[4];
    const item6Button = inventoryButtons[5];

		const commandCardParent = BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, 0));
		const commandCardButtons: framehandle[] = [];
		for (let i = 0; i < 12; ++i) {
			commandCardButtons.push(BlzGetFrameByName("CommandButton_".concat(I2S(i)), 0));
		}
    const qButton = commandCardButtons[8];
    const wButton = commandCardButtons[9];
    const eButton = commandCardButtons[10];
    const rButton = commandCardButtons[11];
    const dButton = commandCardButtons[5];
    const fButton = commandCardButtons[6];
    const oButton = commandCardButtons[7];
    const pButton = commandCardButtons[4];
    const mButton = commandCardButtons[0];
    const sButton = commandCardButtons[1];
    const hButton = commandCardButtons[2];
    const aButton = commandCardButtons[3];

		const buffBarLabel = BlzGetOriginFrame(ORIGIN_FRAME_UNIT_PANEL_BUFF_BAR_LABEL, 0);
		const buffBar = BlzGetOriginFrame(ORIGIN_FRAME_UNIT_PANEL_BUFF_BAR, 0);
		const buffBarParent = BlzFrameGetParent(buffBar);
		
		const customNameLabel = BlzGetFrameByName("unitNameText", 0);
		const customStrengthLabel = BlzGetFrameByName("heroStatStrengthText", 0);
		const customAgilityLabel = BlzGetFrameByName("heroStatAgilityText", 0);
		const customIntelligenceLabel = BlzGetFrameByName("heroStatIntelligenceText", 0);
		const customArmrLabel = BlzGetFrameByName("heroArmorText", 0);
		const customBaseMSLabel = BlzGetFrameByName("heroBaseMSText", 0);

    // const heroNameLabel = BlzGetFrameByName("SimpleNameValue", 0);
    // const heroLevelBar = BlzGetFrameByName("SimpleHeroLevelBar", 0);
    // const heroClassLabel = BlzGetFrameByName("SimpleClassValue", 0);
    // const heroStrengthLabel = BlzGetFrameByName("InfoPanelIconHeroStrengthLabel", 6);
    // const heroStrengthValue = BlzGetFrameByName("InfoPanelIconHeroStrengthValue", 6);
    // const heroAgilityLabel = BlzGetFrameByName("InfoPanelIconHeroAgilityLabel", 6);
    // const heroAgilityValue = BlzGetFrameByName("InfoPanelIconHeroAgilityValue", 6);
    // const heroIntelligenceLabel = BlzGetFrameByName("InfoPanelIconHeroIntellectLabel", 6);
    // const heroIntelligenceValue = BlzGetFrameByName("InfoPanelIconHeroIntellectValue", 6);
    // const heroInfoPanelIconHeroIcon = BlzGetFrameByName("InfoPanelIconHeroIcon", 6);
    // const heroSimpleInfoPanelIconHero = BlzGetFrameByName("SimpleInfoPanelIconHero", 6);
    // const heroSimpleInfoPanelIconHeroText = BlzGetFrameByName("SimpleInfoPanelIconHeroText", 6);

    const simpleInfoPanelItemDetail = BlzGetFrameByName("SimpleInfoPanelItemDetail", 3);
    const simpleItemNameValue = BlzGetFrameByName("SimpleItemNameValue", 3);
    const simpleItemDescriptionValue = BlzGetFrameByName("SimpleItemDescriptionValue", 3);
    
    ClearSelectionForPlayer(player);
		if (GetLocalPlayer() == player) {
			BlzHideOriginFrames(true);
      BlzEnableUIAutoPosition(false);
			BlzFrameSetAllPoints(worldFrame, grandpa);
			// let frame = BlzGetFrameByName("ConsoleUI", 0);
			// BlzFrameSetAllPoints(frame, grandpa);
			// BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, -1, -1);
			BlzFrameSetVisible(rm, false);

			BlzFrameSetVisible(upperBar, true);
			BlzFrameSetVisible(resourceBar, true);

			BlzFrameClearAllPoints(hpBar);
			BlzFrameSetPoint(hpBar, FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, 0, 0.114); // old 0.02
			BlzFrameClearAllPoints(mpBar);
			BlzFrameSetPoint(mpBar, FRAMEPOINT_TOP, hpBar, FRAMEPOINT_BOTTOM, 0, 0.00);
			BlzFrameClearAllPoints(spBar);
			BlzFrameSetPoint(spBar, FRAMEPOINT_TOP, mpBar, FRAMEPOINT_BOTTOM, 0, 0.00);
      
			commandCardButtons.forEach((button) => {
				BlzFrameClearAllPoints(button);
				BlzFrameSetSize(button, Constants.uiButtonSize, Constants.uiButtonSize);
			});

      // q
      BlzFrameSetPoint(qButton, FRAMEPOINT_TOPLEFT, spBar, FRAMEPOINT_BOTTOMLEFT, Constants.uiXButtonSpacing, -Constants.uiYButtonSpacing);
      // w e r
      for (let i = 9; i < 12; ++i) {
        const prevButton = commandCardButtons[i-1];
        const button = commandCardButtons[i];
        BlzFrameSetPoint(button, FRAMEPOINT_LEFT, prevButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);
      }
      // d f
      BlzFrameSetPoint(dButton, FRAMEPOINT_LEFT, rButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);
      BlzFrameSetPoint(fButton, FRAMEPOINT_LEFT, dButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);


      // put msha below of qwer
      // m
      BlzFrameSetPoint(mButton, FRAMEPOINT_TOP, qButton, FRAMEPOINT_BOTTOM, 0, -Constants.uiYButtonSpacing);
      // s h a
      for (let i = 1; i < 4; ++i) {
        const prevButton = commandCardButtons[i-1];
        const button = commandCardButtons[i];
        BlzFrameSetPoint(button, FRAMEPOINT_LEFT, prevButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);
      }
      // p o
      BlzFrameSetPoint(pButton, FRAMEPOINT_LEFT, aButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);
      BlzFrameSetPoint(oButton, FRAMEPOINT_LEFT, pButton, FRAMEPOINT_RIGHT, Constants.uiXButtonSpacing, 0);

      // 
			BlzFrameSetVisible(heroBarButtons, true);

			BlzFrameSetVisible(minimapButtonBar, true);
			BlzFrameSetVisible(minimapParent, true);
			BlzFrameSetVisible(minimap, true);
      FrameHelper.clearFrameAndSetPoint(minimap, FRAMEPOINT_BOTTOMLEFT, grandpa, FRAMEPOINT_BOTTOMLEFT, 0.0025, 0.0025);
      FrameHelper.clearFrameAndSetPoint(minimapButtonBar, FRAMEPOINT_TOPLEFT, minimap, FRAMEPOINT_TOPRIGHT, 0, 0);
      minimapButtons.forEach((button) => {
        BlzFrameSetSize(button, 0.015, 0.015);
      });
      FrameHelper.clearFrameAndSetPoint(minimapSignalButton, FRAMEPOINT_TOPLEFT, minimap, FRAMEPOINT_TOPRIGHT, 0.002, -0.0025);
      FrameHelper.clearFrameAndSetPoint(minimapTerrainButton, FRAMEPOINT_TOP, minimapSignalButton, FRAMEPOINT_BOTTOM, 0, -0.0025);
      FrameHelper.clearFrameAndSetPoint(minimapAllyButton, FRAMEPOINT_TOP, minimapTerrainButton, FRAMEPOINT_BOTTOM, 0, -0.0025);
      FrameHelper.clearFrameAndSetPoint(minimapCreepButton, FRAMEPOINT_TOP, minimapAllyButton, FRAMEPOINT_BOTTOM, 0, -0.0025);
      
      BlzFrameSetSize(formationButton, 0.015, 0.015);
      FrameHelper.clearFrameAndSetPoint(formationButton, FRAMEPOINT_TOP, minimapCreepButton, FRAMEPOINT_BOTTOM, 0, -0.0025);


			BlzFrameSetVisible(chatMsg, true);
			BlzFrameSetVisible(gameMsg, true);
			BlzFrameSetPoint(gameMsg, FRAMEPOINT_BOTTOMLEFT, grandpa, FRAMEPOINT_BOTTOMLEFT, -0.1, 0.22);
			// still too short for most hs
			// BlzFrameSetPoint(gameMsg, FRAMEPOINT_TOPRIGHT, grandpa, FRAMEPOINT_BOTTOMLEFT, 0.6, 0.3);

			FrameHelper.clearFrameAndSetPoint(heroPortrait, FRAMEPOINT_TOPRIGHT, hpBar, FRAMEPOINT_BOTTOMLEFT, 0.05, 0.012);

      // adjust level bar above hero portrait
      FrameHelper.clearFrameAndSetPoint(levelBar, FRAMEPOINT_BOTTOMLEFT, heroPortrait, FRAMEPOINT_BOTTOMLEFT, -0.11, 0);
      BlzFrameSetSize(levelBar, 0.09, 0.015);

      // ability hotbar below portrait + lvl bar
			BlzFrameClearAllPoints(abilityButtonHotbar);
			BlzFrameSetPoint(
				abilityButtonHotbar, 
				FRAMEPOINT_TOPLEFT, 
				levelBar, 
				FRAMEPOINT_BOTTOMLEFT, 
				-Constants.uiXButtonSpacing - 0.04, -5*Constants.uiYButtonSpacing
			);

			// buff bar doenst seem to work..., crashes the game unless simple info unit panel is enabled
			BlzFrameSetParent(buffBar, hpBar);
			BlzFrameClearAllPoints(buffBar);
			BlzFrameClearAllPoints(buffBarLabel);
			BlzFrameSetVisible(buffBarParent, true);
			BlzFrameSetVisible(buffBar, true);
			BlzFrameSetPoint(buffBar, FRAMEPOINT_BOTTOMLEFT, hpBar, FRAMEPOINT_TOPLEFT, 0, 0.0);
      BlzFrameSetPoint(buffBarLabel, FRAMEPOINT_BOTTOMLEFT, buffBar, FRAMEPOINT_TOPLEFT, 0 , 0);

      // enabled to show other unit-based related panel info
			BlzFrameSetVisible(unitPanelParent, true);
			BlzFrameSetVisible(unitPanel, true);

      // hide hero name
      // BlzFrameSetVisible(heroNameLabel, false);
      // BlzFrameSetVisible(heroLevelBar, false);
      // BlzFrameSetVisible(heroClassLabel, false);

      // BlzFrameGetParent(heroStrengthLabel);
      // BlzFrameSetParent(heroStrengthLabel, hpBar);
      // // BlzFrameSetVisible(heroStrengthLabel, true);
      // BlzFrameClearAllPoints(heroStrengthLabel);
      // BlzFrameSetAbsPoint(heroStrengthLabel, FRAMEPOINT_CENTER, 0.4, 0.4);

      // BlzFrameSetParent(heroStrengthValue, hpBar);
      // // BlzFrameSetVisible(heroStrengthValue, true);
      // BlzFrameClearAllPoints(heroStrengthValue);
      // BlzFrameSetAbsPoint(heroStrengthValue, FRAMEPOINT_CENTER, 0.4, 0.4);

      // BlzFrameSetParent(heroAgilityLabel, hpBar);
      // BlzFrameSetParent(heroAgilityValue, hpBar);
      // BlzFrameSetVisible(heroAgilityLabel, true);
      // BlzFrameSetVisible(heroAgilityValue, true);
      // BlzFrameClearAllPoints(heroAgilityLabel);
      // BlzFrameClearAllPoints(heroAgilityValue);
      // BlzFrameSetAbsPoint(heroAgilityLabel, FRAMEPOINT_CENTER, 0.8, 0.085);
      // BlzFrameSetAbsPoint(heroAgilityValue, FRAMEPOINT_CENTER, 0.86, 0.085);

      // BlzFrameSetParent(heroIntelligenceLabel, hpBar);
      // BlzFrameSetParent(heroIntelligenceValue, hpBar);
      // BlzFrameSetVisible(heroIntelligenceLabel, true);
      // BlzFrameSetVisible(heroIntelligenceValue, true);
      // BlzFrameClearAllPoints(heroIntelligenceLabel);
      // BlzFrameClearAllPoints(heroIntelligenceValue);
      // BlzFrameSetAbsPoint(heroIntelligenceLabel, FRAMEPOINT_CENTER, 0.8, 0.07);
      // BlzFrameSetAbsPoint(heroIntelligenceValue, FRAMEPOINT_CENTER, 0.86, 0.07);

      // const heroLevelBar = BlzGetFrameByName("SimpleHeroLevelBar", 0);
      // const heroClassLabel = BlzGetFrameByName("SimpleClassValue", 0);
      // const heroStrengthLabel = BlzGetFrameByName("InfoPanelIconHeroStrengthLabel", 6);
      // const heroStrengthValue = BlzGetFrameByName("InfoPanelIconHeroStrengthValue", 6);
      // const heroAgilityLabel = BlzGetFrameByName("InfoPanelIconHeroAgilityLabel", 6);
      // const heroAgilityValue = BlzGetFrameByName("InfoPanelIconHeroAgilityValue", 6);
      // const heroIntelligenceLabel = BlzGetFrameByName("InfoPanelIconHeroIntellectLabel", 6);
      // const heroIntelligenceValue = BlzGetFrameByName("InfoPanelIconHeroIntellectValue", 6);
      // const heroInfoPanelIconHeroIcon = BlzGetFrameByName("InfoPanelIconHeroIcon", 6);
      // const heroSimpleInfoPanelIconHero = BlzGetFrameByName("SimpleInfoPanelIconHero", 6);
      // const heroSimpleInfoPanelIconHeroText = BlzGetFrameByName("SimpleInfoPanelIconHeroText", 6);

      BlzFrameSetAlpha(inventoryCover, 0);
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
			// FrameHelper.setFramesVisibility(inventoryFrames, true);


      // adjust inventory label and inventory buttons
      BlzFrameClearAllPoints(inventoryLabel);
      BlzFrameSetPoint(inventoryLabel, FRAMEPOINT_LEFT, hpBar, FRAMEPOINT_RIGHT, 0.012, 0.01);
      
      inventoryButtons.forEach((button) => {
        BlzFrameSetVisible(button, true);
        BlzFrameClearAllPoints(button);
      });
      BlzFrameSetPoint(item1Button, FRAMEPOINT_TOPLEFT, inventoryLabel, FRAMEPOINT_BOTTOMLEFT, 0, -0.01);
      BlzFrameSetPoint(item3Button, FRAMEPOINT_TOP, item1Button, FRAMEPOINT_BOTTOM, 0, -1*Constants.uiYButtonSpacing);
      BlzFrameSetPoint(item5Button, FRAMEPOINT_TOP, item3Button, FRAMEPOINT_BOTTOM, 0, -1*Constants.uiYButtonSpacing);

      BlzFrameSetPoint(item2Button, FRAMEPOINT_LEFT, item1Button, FRAMEPOINT_RIGHT, 2*Constants.uiXButtonSpacing, 0);
      BlzFrameSetPoint(item4Button, FRAMEPOINT_TOP, item2Button, FRAMEPOINT_BOTTOM, 0, -1*Constants.uiYButtonSpacing);
      BlzFrameSetPoint(item6Button, FRAMEPOINT_TOP, item4Button, FRAMEPOINT_BOTTOM, 0, -1*Constants.uiYButtonSpacing);
			

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

      // adjust hero label above hero portrait
			BlzFrameSetVisible(customNameLabel, true);
      BlzFrameClearAllPoints(customNameLabel);
      FrameHelper.clearFrameAndSetPoint(customNameLabel, FRAMEPOINT_BOTTOMLEFT, heroPortrait, FRAMEPOINT_TOPLEFT, -0.11, 0.005);

			// heroStatsUI.setRenderVisible(true);

			BlzFrameSetVisible(customStrengthLabel, true);
			BlzFrameSetVisible(customAgilityLabel, true);
			BlzFrameSetVisible(customIntelligenceLabel, true);
			BlzFrameSetVisible(customArmrLabel, true);
			BlzFrameSetVisible(customBaseMSLabel, true);

      BlzFrameClearAllPoints(customStrengthLabel);
      BlzFrameClearAllPoints(customAgilityLabel);
      BlzFrameClearAllPoints(customIntelligenceLabel);
      BlzFrameClearAllPoints(customArmrLabel);
      BlzFrameClearAllPoints(customBaseMSLabel);
      
      const customLabelStartY = 0.125;
      BlzFrameSetAbsPoint(customStrengthLabel, FRAMEPOINT_CENTER, 0.624, customLabelStartY);
      BlzFrameSetAbsPoint(customAgilityLabel, FRAMEPOINT_CENTER, 0.624, customLabelStartY-0.025);
      BlzFrameSetAbsPoint(customIntelligenceLabel, FRAMEPOINT_CENTER, 0.624, customLabelStartY-0.05);
      BlzFrameSetAbsPoint(customArmrLabel, FRAMEPOINT_CENTER, 0.624, customLabelStartY-0.075);
      BlzFrameSetAbsPoint(customBaseMSLabel, FRAMEPOINT_CENTER, 0.624, customLabelStartY-0.1);
      // BlzFrameSetPoint(customStrengthLabel, FRAMEPOINT_BOTTOMLEFT, buffBarLabel, FRAMEPOINT_TOPLEFT, 0.0, 0.003);
      // BlzFrameSetPoint(customAgilityLabel, FRAMEPOINT_BOTTOMLEFT, buffBarLabel, FRAMEPOINT_TOPLEFT, 0.04, 0.003);
      // BlzFrameSetPoint(customIntelligenceLabel, FRAMEPOINT_BOTTOMLEFT, buffBarLabel, FRAMEPOINT_TOPLEFT, 0.08, 0.003);
		}
	}
}