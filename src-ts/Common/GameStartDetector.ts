import { Constants } from "./Constants";
import { Hooks } from "Libs/TreeLib/Hooks";
import { UnitHelper } from "./UnitHelper";

export class GameStartDetector {
  private static instance: GameStartDetector;

  private checkUnit: unit;

  constructor(

  ) {
    this.checkUnit = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE), 
      Constants.gameStartIndicatorUnit,
      0, 22000, 0
    );
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new GameStartDetector();
      Hooks.set("GameStartChecker", this.instance);
    }
    return this.instance;
  }

  initialize() {
     
  }

  hasStarted(): boolean {
    if (UnitHelper.isUnitDead(this.checkUnit) || GetUnitTypeId(this.checkUnit) == 0) {
      return true;
    }
    return false;
  }
}