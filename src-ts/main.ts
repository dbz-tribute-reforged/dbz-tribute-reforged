import { MapPlayer, Unit } from 'w3ts';
import { LibraryLoader } from 'war3-library-loader';
import { CustomUiTest } from './CustomUI/CustomUITest';
import { CustomPlayerTest } from 'CustomPlayer/CustomPlayerTest';
import { PathingCheck } from 'Common/PathingCheck';

function tsMain() {
  const unit = new Unit(MapPlayer.fromIndex(0), FourCC('H05D'), 0, 0, 0);
  unit.name = "TypeScript!";


  PathingCheck.Init();
  
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