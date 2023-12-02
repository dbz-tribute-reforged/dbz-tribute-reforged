import { Timer, Unit } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";

import { CustomUiTest } from './CustomUI/CustomUITest';
import { CustomPlayerTest, setupHostPlayerTransfer, transferHostPlayer } from 'CustomPlayer/CustomPlayerTest';
import { PathingCheck } from 'Common/PathingCheck';
import { SagaManager } from 'Core/SagaSystem/SagaManager';
import { CreepManager } from 'Core/CreepSystem/CreepManager';
import { TournamentManager } from 'Core/TournamentSystem/TournamentManager';
import { HostDetectSystem } from 'Core/HostDetectSystem/HostDetectSystem'
import { ExperienceManager } from 'Core/ExperienceSystem/ExperienceManager';
import { CameraZoom } from 'Common/CameraZoom';
import { DragonBallsManager } from 'Core/DragonBallsSystem/DragonBallsManager';
import { ItemStackingManager } from 'Core/ItemStackingSystem/ItemStackingManager';
import { ItemCleanupManager } from 'Core/ItemCleanupSystem/ItemCleanupManager';
import { ItemAbilityManager } from 'Core/ItemAbilitySystem/ItemAbilityManager';
import { TeamManager } from 'Core/TeamSystem/TeamManager';
import { Constants, Globals } from 'Common/Constants';
import { UnitHelper } from 'Common/UnitHelper';
import { CustomAbilityManager } from 'CustomAbility/CustomAbilityManager';
import { DragonBallsConstants } from 'Core/DragonBallsSystem/DragonBallsConstants';
import { FarmingManager } from 'Core/FarmingSystem/FarmingManager';
import { HeroSelectorManager } from "Core/HeroSelector/HeroSelectorManager";
import { SimpleSpellSystem } from "Core/SimpleSpellSystem/SimpleSpellSystem";
import { DualTechManager } from "CustomAbility/DualTech/DualTechManager";
import { TimerManager } from "Core/Utility/TimerManager";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { CustomPlayer } from "CustomPlayer/CustomPlayer";
import { KeyInputManager } from "Core/KeyInputSystem/KeyInputManager";
import { SmartPingManager } from "Core/SmartPingSystem/SmartPingManager";
import { FBSimTestManager } from "Common/FBSimTestManager";
import { PauseManager } from "Core/PauseSystem/PauseManager";
import { ItemShopManager } from "Core/ItemShop/ItemShopManager";
import { PreloadModels } from "Common/PreloadModels";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

let sagaManager: SagaManager;
let itemAbilityManager: ItemAbilityManager;
let creepManager: CreepManager;
let teamManager: TeamManager;
let itemStackingManager: ItemStackingManager;
let tournamentManager: TournamentManager;
let experienceManager: ExperienceManager;
let dragonBallsManager: DragonBallsManager;
let itemCleanupManager: ItemCleanupManager;
let customAbilityManager: CustomAbilityManager;
let farmingManager: FarmingManager;
let heroSelectorManager: HeroSelectorManager;
let itemShopManager: ItemShopManager;
let dualTechManager: DualTechManager;
let castTimeHelper: CastTimeHelper;
let timerManager: TimerManager;
let keyInputManager: KeyInputManager;
let smartPingManager: SmartPingManager;
let pauseManager: PauseManager;

const musicStr = (
  + "Audio/Music/SecretOfTheForest.mp3;"
  + "Audio/Music/CorridorsOfTime.mp3;"
  + "Audio/Music/SchalaTheme.mp3;"
  + "Audio/Music/TimesScar.mp3;"
  + "Audio/Music/OnTheBeachOfDreams.mp3"
);
const lobbyMusicStr = (
  "Audio/Music/GatoSong.mp3;"
);

function tsPostMain() {

  print(`Build: ${BUILD_DATE}`);
  print(`Typescript: v${TS_VERSION}`);
  print(`Transpiler: v${TSTL_VERSION}`);

  PlayMusic("Audio/Music/ChaLaHeadChaLaIntro.mp3");

  for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    Globals.customPlayers.push(new CustomPlayer(i));
  }
  
  // preload custom abilities
  PathingCheck.Init();
  customAbilityManager = CustomAbilityManager.getInstance();
  timerManager = TimerManager.getInstance();
  SetCreepCampFilterState(false);
  CustomUiTest();
  CameraZoom.onInit();
  PreloadModels.doPreload();

  setupHostPlayerTransfer();

  TimerStart(CreateTimer(), 0, false, () => {
    castTimeHelper = CastTimeHelper.getInstance();
    dualTechManager = DualTechManager.getInstance();  
    FBSimTestManager.getInstance().initialize();
    pauseManager = PauseManager.getInstance();
    SimpleSpellSystem.initialize();
    DestroyTimer(GetExpiredTimer());
  });

  TimerStart(CreateTimer(), 0.1, false, () => {
    transferHostPlayer();
    CustomPlayerTest();
    heroSelectorManager = HeroSelectorManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });

  // delay init
  TimerStart(CreateTimer(), 5, false, () => {
    // initialize some systems
    keyInputManager = KeyInputManager.getInstance();
    smartPingManager = SmartPingManager.getInstance();
    creepManager = CreepManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });

  TimerStart(CreateTimer(), 10, false, () => {
    itemAbilityManager = ItemAbilityManager.getInstance();
    itemStackingManager = ItemStackingManager.getInstance();
    itemCleanupManager = ItemCleanupManager.getInstance();
    farmingManager = FarmingManager.getInstance();
    itemShopManager = ItemShopManager.getInstance();
    experienceManager = ExperienceManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  const checkUnit = CreateUnit(
    Player(PLAYER_NEUTRAL_PASSIVE), 
    Constants.gameStartIndicatorUnit,
    DragonBallsConstants.shenronWaitingRoom.x, DragonBallsConstants.shenronWaitingRoom.y, 0
  );
  TimerStart(CreateTimer(), 1, true, () => {
    if (!UnitHelper.isUnitAlive(checkUnit) || GetUnitTypeId(checkUnit) == 0) {
      // anything that happens after hero picking is done, should be placed here
      Globals.isMainGameStarted = true;
      sagaManager = SagaManager.getInstance();
      tournamentManager = TournamentManager.getInstance().setupStandardTournaments();
      dragonBallsManager = DragonBallsManager.getInstance();
      creepManager.setupCreepResearchUpgrade();
      DestroyTimer(GetExpiredTimer());
    }
  });


  const musicDelayTimer = TimerManager.getInstance().get();
  TimerStart(musicDelayTimer, 25, false, () => {
    for (const cPlayer of Globals.customPlayers) {
      if (
        SubString(cPlayer.name, 0, 12) == "Local Player"
        // || SubString(cPlayer.name, 0, 11) == "randomkilla"
        // || SubString(cPlayer.name, 0, 5) == "Phone"
      ) {
        if (cPlayer.player == GetLocalPlayer()) {
          ClearMapMusic();
          StopMusic(false);
          PlayMusic(musicStr);
        }
      }
    }
    TimerManager.getInstance().recycle(musicDelayTimer);
  });
}

function playLobbyMusic() {
  // PlayMusic("Audio/Music/DBSuperOp2.mp3");
  // PlayMusic("Audio/Music/GatoSong.mp3");
  PlayMusic(lobbyMusicStr);
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsPostMain);
addScriptHook(W3TS_HOOK.CONFIG_AFTER, playLobbyMusic);