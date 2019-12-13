import { MapPlayer, Unit } from 'w3ts';
import { LibraryLoader } from 'war3-library-loader';
import { CustomUiTest } from './CustomUI/CustomUITest';
import { CustomPlayerTest } from 'CustomPlayer/CustomPlayerTest';
import { PathingCheck } from 'Common/PathingCheck';
import { SagaManager } from 'Core/SagaSystem/SagaManager';
import { Logger } from 'Libs/TreeLib/Logger';
import { CreepManager } from 'Core/CreepSystem/CreepManager';
import { TournamentManager, TournamentNames } from 'Core/TournamentSystem/TournamentManager';

let sagaManager: SagaManager;
let creepManager: CreepManager;
let tournamentManager: TournamentManager;

function tsMain() {
  // const unit = new Unit(MapPlayer.fromIndex(0), FourCC('H05D'), 0, 0, 0);
  // unit.name = "TypeScript!";

  // setup logger
  Logger.doLogVerbose = false;
  Logger.doLogDebug = true;

  // initialize some systems
  PathingCheck.Init();
  sagaManager = SagaManager.getInstance();

  creepManager = CreepManager.getInstance();

  tournamentManager = TournamentManager.getInstance();

  TimerStart(CreateTimer(), 60, false, () => {
    Logger.LogDebug("Final Battle starting now!");
    tournamentManager.startTournament(TournamentNames.FinalBattle);
    DestroyTimer(GetExpiredTimer());
  });
  
  CustomUiTest();
  CustomPlayerTest();
}

// Configure libraries
//setIsDestructableTreeConfig({ HARVESTER_UNIT_ID: FourCC("opeo") });


// Handle initialization 
function libLoaderLog(libName: string, success: boolean, message: string) {
  print(`Initializing "${libName}": ${success ? 'Success' : 'Failure'}, "${message}"`);
}

LibraryLoader.logFunction = libLoaderLog;
ceres.addHook("main::after", () => LibraryLoader.runInitializers());
ceres.addHook("main::after", () => tsMain());