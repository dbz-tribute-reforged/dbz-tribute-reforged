import { Hooks } from "Libs/TreeLib/Hooks";
import { Tournament, TournamentState } from "./Tournament";
import { FinalBattle } from "./FinalBattle";
import { Logger } from "Libs/TreeLib/Logger";
import { Constants } from "Common/Constants";

export class TournamentManager {
  private static instance: TournamentManager;

  protected tournaments: Map<string, Tournament>;
  protected currentTournament: Tournament | null;

  constructor (
  ) {
    this.tournaments = new Map();
    this.currentTournament = null;
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new TournamentManager();
      Hooks.set("TournamentManager", this.instance);
    }
    return this.instance;
  }

  public initialize(): this {
    const finalBattle = new FinalBattle();
    this.tournaments.set(finalBattle.name, finalBattle);

    // move all of this somewhere else probably ...
    // NOTE: wait till 70s have elapsed
    // then create a visible timer for 30mins 
    // that shows how long before final battle will start()
    // if another tournament is going wait another 15misn to start() fb
    // final battle then delays for another 120s
    const finalBattleTrig = CreateTrigger();
    TriggerRegisterTimerEvent(finalBattleTrig, 70, false);
    TriggerAddAction(finalBattleTrig, () => {
      const finalBattleTimer = CreateTimer();
      TimerStart(finalBattleTimer, Constants.finalBattleTime, true, () => {
        TournamentManager.getInstance().startTournament(Constants.finalBattleName);
        const currentTournament = TournamentManager.getInstance().currentTournament;
        if (currentTournament && currentTournament.name == Constants.finalBattleName) {
          DestroyTimerDialog(finalBattleTimerDialog);
          DestroyTimer(finalBattleTimer);
        } else {
          Logger.LogDebug("Another tournament is active...");
        }
      })
      const finalBattleTimerDialog = CreateTimerDialog(finalBattleTimer);
      TimerDialogSetTitle(finalBattleTimerDialog, Constants.finalBattleName);
      TimerDialogDisplay(finalBattleTimerDialog, true);
    });

    return this;
  }
  
  public startTournament(name: string) {
    const newTournament = this.tournaments.get(name);
    if (newTournament) {
      if (
        !this.currentTournament || 
        this.currentTournament.state == TournamentState.Completed
      ) {
        newTournament.start();
        this.currentTournament = newTournament;
      } else {
        Logger.LogDebug("Could not start " + newTournament.name + ", as tournament ring is already in use.");
      }
    }
  }
}