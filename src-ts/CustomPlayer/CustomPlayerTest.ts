import { CustomPlayer } from "./CustomPlayer";
import { CustomHero } from "CustomHero/CustomHero";
import { CustomAbilityData } from "CustomAbility/CustomAbilityData";

// global?
let customPlayers: CustomPlayer[];

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
		customPlayers[playerId].currentlySelectedUnit = GetTriggerUnit();
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
  // tied to shift+z for now
  const zanzoActivate = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(zanzoActivate, Player(i), OSKEY_Z, 1, true);
	}
  TriggerAddAction(zanzoActivate, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    const zanzoGroup = GetUnitsSelectedAll(GetTriggerPlayer());
    ForGroup(zanzoGroup, () => {
      const customHero = customPlayers[playerId].getCustomHero(GetEnumUnit());
      if (customHero) {
        customHero.useAbility(
          "Zanzo Dash",
          new CustomAbilityData(
            customHero,
            player,
            undefined,
            undefined,
            customPlayers[playerId].mouseData,
          ),
        );
      }
    })
  });

  // zanzo activation trigger
  // tied to shift+z for now
  const blueHurricaneActivate = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    BlzTriggerRegisterPlayerKeyEvent(blueHurricaneActivate, Player(i), OSKEY_B, 1, true);
	}
  TriggerAddAction(blueHurricaneActivate, () => {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    const zanzoGroup = GetUnitsSelectedAll(GetTriggerPlayer());
    ForGroup(zanzoGroup, () => {
      const customHero = customPlayers[playerId].getCustomHero(GetEnumUnit());
      if (customHero) {
        customHero.useAbility(
          "Blue Hurricane",
          new CustomAbilityData(
            customHero,
            player,
            undefined,
            undefined,
            undefined,
          ),
        );
      }
    })
  });
}