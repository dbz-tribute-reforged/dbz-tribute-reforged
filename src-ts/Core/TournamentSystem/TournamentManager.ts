import { Hooks } from "Libs/TreeLib/Hooks";
import { Tournament, TournamentState } from "./Tournament";
import { FinalBattle } from "./FinalBattle";
import { Logger } from "Libs/TreeLib/Logger";

export enum TournamentNames {
  FinalBattle = "Final Battle",
}

export class TournamentManager {
  private static instance: TournamentManager;

  protected tournaments: Map<string, Tournament>;
  protected currentTournament: Tournament | undefined;
  protected finalBattleTimer: timer;

  constructor (
  ) {
    this.tournaments = new Map();
    this.finalBattleTimer = CreateTimer();
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

    const testTrig = CreateTrigger();
    TriggerRegisterTimerEvent(testTrig, 45, false);
    TriggerAddAction(testTrig, () => {
      Logger.LogDebug("Attempting to start tournament " + TournamentNames.FinalBattle);
      TournamentManager.getInstance().startTournament(TournamentNames.FinalBattle);
    })

    return this;
  }

  public startTournament(name: TournamentNames) {
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