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
let dualTechManager: DualTechManager;


function tsPostMain() {

  print(`Build: ${BUILD_DATE}`);
  print(`Typescript: v${TS_VERSION}`);
  print(`Transpiler: v${TSTL_VERSION}`);
  
  // preload custom abilities
  customAbilityManager = CustomAbilityManager.getInstance();

  setupHostPlayerTransfer();
  TimerStart(CreateTimer(), 0.03, false, () => {
    transferHostPlayer();
  });

  SetCreepCampFilterState(false);
  
  CustomUiTest();

  PathingCheck.Init();

  // delay init
  TimerStart(CreateTimer(), 0.05, false, () => {
    DestroyTimer(GetExpiredTimer());
    // initialize some systems
    CustomPlayerTest();
    SimpleSpellSystem.initialize();
    dualTechManager = DualTechManager.getInstance();
  })

  TimerStart(CreateTimer(), 0.1, false, () => {
    DestroyTimer(GetExpiredTimer());
    heroSelectorManager = HeroSelectorManager.getInstance();
  });


  TimerStart(CreateTimer(), 5, false, () => {
    itemAbilityManager = ItemAbilityManager.getInstance();
    itemStackingManager = ItemStackingManager.getInstance();
    farmingManager = FarmingManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 10, false, () => {
    // teamManager = TeamManager.getInstance();
    creepManager = CreepManager.getInstance();
    experienceManager = ExperienceManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  const checkUnit = CreateUnit(
    Player(PLAYER_NEUTRAL_PASSIVE), 
    Constants.gameStartIndicatorUnit,
    DragonBallsConstants.shenronWaitingRoom.x, DragonBallsConstants.shenronWaitingRoom.y, 0
  );
  TimerStart(CreateTimer(), 1, true, () => {
    if (UnitHelper.isUnitDead(checkUnit) || GetUnitTypeId(checkUnit) == 0) {
      // anything that happens after hero picking is done, should be placed here
      Globals.isMainGameStarted = true;
      sagaManager = SagaManager.getInstance();
      tournamentManager = TournamentManager.getInstance().setupStandardTournaments();
      dragonBallsManager = DragonBallsManager.getInstance();
      creepManager.setupCreepResearchUpgrade();
      DestroyTimer(GetExpiredTimer());
    }
  });

  TimerStart(CreateTimer(), 15, false, () => {
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 30, false, () => {
    itemCleanupManager = ItemCleanupManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });

  CameraZoom.onInit();
}

function playLobbyMusic() {
  // PlayMusic("Audio\\Music\\DBSuperOp2.mp3");
  PlayMusic("Audio\\Music\\GatoSong.mp3");
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsPostMain);
addScriptHook(W3TS_HOOK.CONFIG_AFTER, playLobbyMusic);