import { HeroSelectorManager } from "Core/HeroSelector/HeroSelectorManager";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { Constants, Globals, OrderIds } from "./Constants";
import { VisionHelper } from "./VisionHelper";

export class FBSimTestManager {
  private static instance: FBSimTestManager;

  protected freeModeTrig: trigger;
  protected patrolTPTrig: trigger;
  protected makeItemTrig: trigger;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new FBSimTestManager();
    }
    return this.instance;
  }

  constructor () {
    this.initialize();
    this.freeModeTrig = CreateTrigger();
  }

  initialize() {
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(this.freeModeTrig, player, "-freemode", true);
      TriggerRegisterPlayerChatEvent(this.freeModeTrig, player, "-fbsimtest", true);
    }
    TriggerAddAction(this.freeModeTrig, () => {
      if (GetTriggerPlayer() == Globals.hostPlayer) {
        Globals.isFreemode = true;
        if (SubString(GetEventPlayerChatString(), 0, 10) == "-fbsimtest") {
          this.activate();
        }
      }
    });

    this.patrolTPTrig = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerUnitEventSimple(this.patrolTPTrig, player, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
    };
    TriggerAddCondition(this.patrolTPTrig, Condition(()=>{
      return Globals.isFBSimTest && GetIssuedOrderId() == OrderIds.PATROL;
    }));
    TriggerAddAction(this.patrolTPTrig, () => {
      const unit = GetTriggerUnit();
      SetUnitX(unit, GetOrderPointX());
      SetUnitY(unit, GetOrderPointY());
    });

    this.makeItemTrig = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(this.makeItemTrig, player, "-item", false);
    }
    TriggerAddAction(this.makeItemTrig, () => {
      const value = FourCC(SubString(GetEventPlayerChatString(), 6, 9));

      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsSelected(Globals.tmpUnitGroup, GetTriggerPlayer(), null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const target = GetEnumUnit();
        CreateItem(value, GetUnitX(target), GetUnitY(target));
      });
      GroupClear(Globals.tmpUnitGroup);
    });
  }

  activate() {
    if (Globals.isFBSimTest) return;
    
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 
      15, 
      "-fbsimtest activated (ts)"
    );
    Globals.isFBSimTest = true;
    Globals.isFreemode = true;
    VisionHelper.showFbArenaVision();
    HeroSelectorManager.getInstance().enableFBSimTest(true);
  }
}