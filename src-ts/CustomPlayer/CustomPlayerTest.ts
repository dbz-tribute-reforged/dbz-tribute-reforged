import { CustomPlayer } from "./CustomPlayer";
import { CustomHero } from "CustomHero/CustomHero";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { Constants } from "Common/Constants";
import { FrameHelper } from "Common/FrameHelper";
import { ToolTipOrganizer } from "Common/ToolTipOrganizer";

// global?
let customPlayers: CustomPlayer[];

export function addAbilityAction(abilityTrigger: trigger, name: string) {
  TriggerAddAction(abilityTrigger, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    const zanzoGroup = GetUnitsSelectedAll(GetTriggerPlayer());
    ForGroup(zanzoGroup, () => {
      const customHero = customPlayers[playerId].getCustomHero(GetEnumUnit());
      if (customHero) {
        customHero.useAbility(
          name,
          new CustomAbilityData(
            customHero,
            player,
            1,
            undefined,
            undefined,
            customPlayers[playerId].mouseData,
          ),
        );
      }
    })
    FrameHelper.loseFocusFromTriggeringFrame();
  });
}

export function addKeyEvent(trigger: trigger, oskey: oskeytype, metaKey: number, keyDown: boolean) {
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(trigger, Player(i), oskey, metaKey, keyDown);
  }
}

export function setAbilityUIToAbility(hero: CustomHero, index: number) {
  let heroAbility = hero.getAbilityByIndex(index);
  if (heroAbility) {
    BlzFrameSetTexture(BlzGetFrameByName("MyAbilityIconBar", index), heroAbility.icon.enabled, 0, true);
    BlzFrameSetTexture(BlzGetFrameByName("MyAbilityIconBarBackground", index), heroAbility.icon.disabled, 0, true);
    BlzFrameSetText(BlzGetFrameByName("MyToolTipTextTitle", index), heroAbility.tooltip.title);
    BlzFrameSetText(BlzGetFrameByName("MyToolTipTextValue", index), heroAbility.tooltip.body);
    ToolTipOrganizer.resizeToolTipHeightByValue(BlzGetFrameByName("abilityButton" + index + "ToolTip", index), heroAbility.tooltip.body);
  }
}

export function updateHeroAbilityCD(hero: CustomHero) {
  for (let i = 0; i < Constants.maxSubAbilities; ++i) {
    let heroAbility = hero.getAbilityByIndex(i);
    if (heroAbility) {
      BlzFrameSetValue(
        BlzGetFrameByName("MyAbilityIconBar", i), 
        100 * (1 - heroAbility.currentCd / heroAbility.maxCd)
      );
      let cdText = R2SW(heroAbility.currentCd,2,2) + "s"
      if (heroAbility.currentCd <= 0) {
        cdText = "";
      }
      BlzFrameSetText(BlzGetFrameByName("MyAbilityIconBarText", i), cdText);
    }
  }
}

export function updateSelectedUnitBars(unit: unit) {
  const currentHp = Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_LIFE)));
  const maxHp = I2S(BlzGetUnitMaxHP(unit));
  const currentMp = Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_MANA)));
  const maxMp = I2S(BlzGetUnitMaxMana(unit));
  const level = GetUnitLevel(unit);
  BlzFrameSetValue(BlzGetFrameByName("MyHPBar", 0), GetUnitLifePercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyMPBar", 0), GetUnitManaPercent(unit));
  BlzFrameSetValue(BlzGetFrameByName("MyLevelBar", 0), Math.min(100, Math.floor(level*0.2)));
  BlzFrameSetText(BlzGetFrameByName("MyHPBarText", 0), currentHp + " / " + maxHp);
  BlzFrameSetText(BlzGetFrameByName("MyMPBarText", 0), currentMp + " / " + maxMp);
  BlzFrameSetText(BlzGetFrameByName("MyLevelBarText", 0), "LVL: " + I2S(level));
}

export function CustomPlayerTest() {
  
  customPlayers = [];
  
  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    customPlayers[i] = new CustomPlayer(
      i,
      GetPlayerName(Player(i)),
    );
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

    if (GetTriggerPlayer() == GetLocalPlayer()) {
      // register abilities to UI frames
      let customHero = customPlayers[playerId].getLastSelectedOwnedCustomHero();
      if (customHero) {
        for (let i = 0 ; i < Constants.maxSubAbilities; ++i) {
          setAbilityUIToAbility(customHero, i);
        }
      }
    }
	});
  
  // update mouse positions for now
  // might be a bit laggy?
  const updatePlayerMouseData = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    TriggerRegisterPlayerMouseEventBJ(updatePlayerMouseData, Player(i), bj_MOUSEEVENTTYPE_MOVE);
    TriggerRegisterPlayerUnitEventSimple(updatePlayerMouseData, Player(i), EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
	}
	TriggerAddAction(updatePlayerMouseData, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
      const x = BlzGetTriggerPlayerMouseX();
      const y = BlzGetTriggerPlayerMouseY();
      if (x != 0 && y != 0) {
        customPlayers[playerId].mouseData.x = BlzGetTriggerPlayerMouseX();
        customPlayers[playerId].mouseData.y = BlzGetTriggerPlayerMouseY();
        /*
        BJDebugMsg(
          GetPlayerName(player) + " mouse : " + 
          R2SW(customPlayers[playerId].mouseData.x, 1, 1) + 
          " " + 
          R2SW(customPlayers[playerId].mouseData.y, 1, 1)
        )
        */
      }
    }
	});


  // zanzo activation trigger
  // tied to z for now
  const zanzoActivate = CreateTrigger();
  BlzTriggerRegisterFrameEvent(zanzoActivate, BlzGetFrameByName("abilityButton0", 0), FRAMEEVENT_CONTROL_CLICK);
  // replace key events with more organized method of key reading
  addKeyEvent(zanzoActivate, OSKEY_Z, 0, true);
  addAbilityAction(zanzoActivate, "Zanzo Dash");

  const blueHurricaneActivate = CreateTrigger();
  BlzTriggerRegisterFrameEvent(blueHurricaneActivate, BlzGetFrameByName("abilityButton1", 1), FRAMEEVENT_CONTROL_CLICK);
  addKeyEvent(blueHurricaneActivate, OSKEY_B, 0, true);
  addAbilityAction(blueHurricaneActivate, "Blue Hurricane");

  // update hp/mp bars for current custom player
	TimerStart(CreateTimer(), 0.03, true, () => {
    let playerId = GetPlayerId(GetLocalPlayer());
    let unit = customPlayers[playerId].selectedUnit;
    if (unit) {
      updateSelectedUnitBars(unit);
      // POSSIBLY LAGGY
      // might be a bit slow having to constantly update text and icon, but we'll see
      let ownedHero = customPlayers[playerId].getLastSelectedOwnedCustomHero();
      if (ownedHero) {
        updateHeroAbilityCD(ownedHero);
      }
    }
  });
}