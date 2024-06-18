import { HeroSelectorManager } from "Core/HeroSelector/HeroSelectorManager";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { Constants, Globals, OrderIds } from "./Constants";
import { VisionHelper } from "./VisionHelper";
import { UnitHelper } from "./UnitHelper";

export class FBSimTestManager {
  private static instance: FBSimTestManager;

  protected freeModeTrig: trigger;
  protected patrolTPTrig: trigger;
  protected makeItemTrig: trigger;
  protected resetTrig: trigger;

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
        if (SubString(GetEventPlayerChatString(), 0, 10) == "-fbsimtest") {
          this.activate();
        } else {
          this.activateFreemode();
        }
      }
    });

    this.patrolTPTrig = CreateTrigger();
    this.makeItemTrig = CreateTrigger();
    this.resetTrig = CreateTrigger();
  }

  activate() {
    HeroSelectorManager.getInstance().enableFBSimTest(true);
    if (Globals.isFBSimTest) return;
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 
      15, 
      "-fbsimtest activated (ts)"
    );
    Globals.isFBSimTest = true;
    Globals.isFreemode = true
    VisionHelper.showFbArenaVision();

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

    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(this.makeItemTrig, player, "-item", false);
    }
    TriggerAddAction(this.makeItemTrig, () => {
      if (!Globals.isFBSimTest) return;
      const value = FourCC(SubString(GetEventPlayerChatString(), 6, 10));

      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsSelected(Globals.tmpUnitGroup, GetTriggerPlayer(), null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const target = GetEnumUnit();
        CreateItem(value, GetUnitX(target), GetUnitY(target));
      });
      GroupClear(Globals.tmpUnitGroup);
    });

    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(this.resetTrig, player, "-reset", false);
    }
    TriggerAddAction(this.resetTrig, () => {
      if (!Globals.isFBSimTest) return;
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      for (const customHero of Globals.customPlayers[playerId].allHeroes) {
        if (!customHero || !UnitHelper.isUnitAlive(customHero.unit)) continue;

        SetUnitLifePercentBJ(customHero.unit, 100);
        SetUnitManaPercentBJ(customHero.unit, 100);
        UnitResetCooldown(customHero.unit);
        customHero.setCurrentSP(customHero.getMaxSP());
        for (const [name, abil] of customHero.abilities.abilities) {
          if (abil) {
            abil.currentCd = 0;
          }
        }
      }
    });
  }

  activateFreemode() {
    Globals.isFreemode = !Globals.isFreemode;
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, 
      "-freemode " + (Globals.isFreemode ? "enabled" : "disabled")
    );
  }
}