import { LibraryLoader } from 'war3-library-loader';
import { CustomUiTest } from './CustomUI/CustomUITest';
import { CustomPlayerTest, setupHostPlayerTransfer, transferHostPlayer } from 'CustomPlayer/CustomPlayerTest';
import { PathingCheck } from 'Common/PathingCheck';
import { SagaManager } from 'Core/SagaSystem/SagaManager';
import { Logger } from 'Libs/TreeLib/Logger';
import { CreepManager } from 'Core/CreepSystem/CreepManager';
import { TournamentManager } from 'Core/TournamentSystem/TournamentManager';
import { HostDetectSystem } from 'Core/HostDetectSystem/HostDetectSystem'
import { ExperienceManager } from 'Core/ExperienceSystem/ExpierenceManager';
import { CameraZoom } from 'Common/CameraZoom';
import { DragonBallsManager } from 'Core/DragonBallsSystem/DragonBallsManager';
import { ItemStackingManager } from 'Core/ItemStackingSystem/ItemStackingManager';
import { ItemCleanupManager } from 'Core/ItemCleanupSystem/ItemCleanupManager';
import { ItemAbilityManager } from 'Core/ItemAbilitySystem/ItemAbilityManager';
import { TeamManager } from 'Core/TeamSystem/TeamManager';
import { Constants } from 'Common/Constants';
import { UnitHelper } from 'Common/UnitHelper';
import { CustomAbilityManager } from 'CustomAbility/CustomAbilityManager';
import { DragonBallsConstants } from 'Core/DragonBallsSystem/DragonBallsConstants';
import { FusionManager } from 'Core/FusionSystem/FusionManager';

let sagaManager: SagaManager;
let itemAbilityManager: ItemAbilityManager;
let fusionManager: FusionManager;
let creepManager: CreepManager;
let teamManager: TeamManager;
let itemStackingManager: ItemStackingManager;
let tournamentManager: TournamentManager;
let experienceManager: ExperienceManager;
let dragonBallsManager: DragonBallsManager;
let itemCleanupManager: ItemCleanupManager;
let customAbilityManager: CustomAbilityManager;

function tsMain() {

  // preload (temp) test
  Preload("DragonHead2.mdl");
  Preload("DragonSegment2.mdl");
  Preload("DragonTail.mdl");
  Preload("Conflagrate.mdl");

  // setup logger
  Logger.doLogVerbose = false;
  Logger.doLogDebug = false;
  
  // preload custom abilities
  customAbilityManager = CustomAbilityManager.getInstance();

  setupHostPlayerTransfer();
  TimerStart(CreateTimer(), 0.03, false, () => {
    transferHostPlayer();
  });

  // TimerStart(CreateTimer(), 5.0, false, () => {
  //   // DisplayTextToPlayer(GetLocalPlayer(), 0.0, 0.0, "Host detected=" + GetPlayerName(HostDetectSystem.GetHost()))
  //   DestroyTimer(GetExpiredTimer());
  // })

  SetCreepCampFilterState(false);

  // delay init
  TimerStart(CreateTimer(), 0.3, false, () => {
    // initialize some systems
    PathingCheck.Init();
    
    CustomUiTest();
    CustomPlayerTest();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 5, false, () => {
    itemAbilityManager = ItemAbilityManager.getInstance();
    fusionManager = FusionManager.getInstance();
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
      sagaManager = SagaManager.getInstance();
      tournamentManager = TournamentManager.getInstance().setupStandardTournaments();
      dragonBallsManager = DragonBallsManager.getInstance();
      creepManager.setupCreepResearchUpgrade();
      DestroyTimer(GetExpiredTimer());
    }
  });

  TimerStart(CreateTimer(), 15, false, () => {
    itemStackingManager = ItemStackingManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 30, false, () => {
    itemCleanupManager = ItemCleanupManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });
}

function playLobbyMusic() {
  PlayMusic("Audio\\Music\\DBSuperOp2.mp3");
}

// Configure libraries
//setIsDestructableTreeConfig({ HARVESTER_UNIT_ID: FourCC("opeo") });

// Handle initialization 
function libLoaderLog(libName: string, success: boolean, message: string) {
  print(`Initializing "${libName}": ${success ? 'Success' : 'Failure'}, "${message}"`);
}

LibraryLoader.logFunction = libLoaderLog;
// ceres.addHook("main::before", () => HostDetectSystem.onInit());
ceres.addHook("main::after", () => LibraryLoader.runInitializers());
ceres.addHook("main::after", () => tsMain());
ceres.addHook("main::after", () => CameraZoom.onInit());
ceres.addHook("config::after", () => playLobbyMusic());