import { LibraryLoader } from 'war3-library-loader';
import { CustomUiTest } from './CustomUI/CustomUITest';
import { CustomPlayerTest } from 'CustomPlayer/CustomPlayerTest';
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

let sagaManager: SagaManager;
let creepManager: CreepManager;
let itemStackingManager: ItemStackingManager;
let tournamentManager: TournamentManager;
let experienceManager: ExperienceManager;
let dragonBallsManager: DragonBallsManager;
let itemCleanupManager: ItemCleanupManager;

function tsMain() {
  // const unit = new Unit(MapPlayer.fromIndex(0), FourCC('H05D'), 0, 0, 0);
  // unit.name = "TypeScript!";

  // setup logger
  Logger.doLogVerbose = false;
  Logger.doLogDebug = false;
  TimerStart(CreateTimer(), 5.0, false, () => {
    // DisplayTextToPlayer(GetLocalPlayer(), 0.0, 0.0, "Host detected=" + GetPlayerName(HostDetectSystem.GetHost()))
    DestroyTimer(GetExpiredTimer());
  })

  SetCreepCampFilterState(false);

  // delay init
  TimerStart(CreateTimer(), 3, false, () => {
    // initialize some systems
    PathingCheck.Init();
    
    CustomUiTest();
    CustomPlayerTest();
    DestroyTimer(GetExpiredTimer());
  });

  TimerStart(CreateTimer(), 5, false, () => {
    sagaManager = SagaManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 10, false, () => {
    creepManager = CreepManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 15, false, () => {
    tournamentManager = TournamentManager.getInstance();
    experienceManager = ExperienceManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });

  TimerStart(CreateTimer(), 20, false, () => {
    itemStackingManager = ItemStackingManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  })

  TimerStart(CreateTimer(), 30, false, () => {
    dragonBallsManager = DragonBallsManager.getInstance();
    itemCleanupManager = ItemCleanupManager.getInstance();
    DestroyTimer(GetExpiredTimer());
  });
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