import { Hooks } from "Libs/TreeLib/Hooks";
import { Tournament, TournamentState } from "./Tournament";
import { FinalBattle } from "./FinalBattle";
import { Logger } from "Libs/TreeLib/Logger";
import { TournamentData } from "./TournamentData";
import { Constants } from "Common/Constants";
import { Budokai } from "./Budokai";


export class TournamentManager {
  
  private static instance: TournamentManager;

  protected tournaments: Map<string, Tournament>;
  protected currentTournament: Tournament | null;

  protected tournamentReviveTrig: trigger;

  constructor (
  ) {
    this.tournaments = new Map();
    this.currentTournament = null;
    this.tournamentReviveTrig = CreateTrigger();
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
    this.setupReviveTrigger();

    const finalBattle = new FinalBattle();
    this.tournaments.set(finalBattle.name, finalBattle);
    this.setupTimedStartFinalBattle();
    
    const budokai = new Budokai();
    this.tournaments.set(budokai.name, budokai);
    // timer to show how long before the tournament starts()
    this.startPreTournamentTimer(
      TournamentData.budokaiName,
      70,
      2*60,
      true,
    );


    return this;
  }

  protected setupReviveTrigger() {
    // tournament revive trigger
    // if you die in tournament, revive & move to lobby
    TriggerRegisterAnyUnitEventBJ(this.tournamentReviveTrig, EVENT_PLAYER_UNIT_DEATH);
    
    TriggerAddCondition(this.tournamentReviveTrig, Condition(()=> {
      const testUnit = GetFilterUnit();
      return (
        GetUnitX(testUnit) > TournamentData.tournmanetBottomLeft.x && 
        GetUnitY(testUnit) > TournamentData.tournmanetBottomLeft.y &&
        GetUnitX(testUnit) < TournamentData.tournmanetTopRight.x &&
        GetUnitY(testUnit) < TournamentData.tournmanetTopRight.y &&
        IsUnitType(testUnit, UNIT_TYPE_HERO) &&
        !IsUnitType(testUnit, UNIT_TYPE_SUMMONED)
      );
    }));

    TriggerAddAction(this.tournamentReviveTrig, () => {
      TimerStart(CreateTimer(), Constants.reviveDelay, false, () => {
        const deadHero = GetTriggerUnit();
        ReviveHero(
          deadHero, 
          TournamentData.tournamentWaitRoom1.x, 
          TournamentData.tournamentWaitRoom1.y, 
          false
        );
        SetUnitInvulnerable(deadHero, true);
        PauseUnit(deadHero, true);

        DestroyTimer(GetExpiredTimer());
      });
    });
  }

  protected setupTimedStartFinalBattle() {
    // move all of this somewhere else probably ...
    // and clean it up...
    // NOTE: wait till 25mins have elapsed
    // then create a visible timer for 5mins 
    // that shows how long before final battle will start()
    // if another tournament is going wait another 5 mins to start() fb
    // final battle then delays for another 120s after claiming use of the tournament ring
    const finalBattleTrig = CreateTrigger();
    TriggerRegisterTimerEvent(finalBattleTrig, 25*60, false);

    TriggerAddAction(finalBattleTrig, () => {
      const finalBattleTimer = CreateTimer();
      TimerStart(finalBattleTimer, TournamentData.finalBattleInterval, true, () => {
        TournamentManager.getInstance().startTournament(TournamentData.finalBattleName);
        const currentTournament = TournamentManager.getInstance().currentTournament;

        if (currentTournament && currentTournament.name == TournamentData.finalBattleName) {
          DestroyTimerDialog(finalBattleTimerDialog);
          DestroyTimer(finalBattleTimer);
          DestroyTrigger(finalBattleTrig);
        } else {
          Logger.LogDebug("Another tournament is active...");
        }
      })

      const finalBattleTimerDialog = CreateTimerDialog(finalBattleTimer);
      TimerDialogSetTitle(finalBattleTimerDialog, TournamentData.finalBattleName);
      TimerDialogDisplay(finalBattleTimerDialog, true);
    });
  }
  
  protected startPreTournamentTimer(
    tournamentName: string, 
    initialDelay: number, 
    timerDuration: number,
    timerRepeat: boolean,
  ) {
    const tournamentStartTrig = CreateTrigger();
    const tournamentIntervalTimer = CreateTimer();
    const tournamentTimerDialog = CreateTimerDialog(tournamentIntervalTimer);

    TriggerRegisterTimerEvent(tournamentStartTrig, initialDelay, false);

    TriggerAddAction(tournamentStartTrig, () => {
      TimerStart(tournamentIntervalTimer, timerDuration, timerRepeat, () => {
        TournamentManager.getInstance().startTournament(tournamentName);
        const currentTournament = TournamentManager.getInstance().currentTournament;

        if (currentTournament && currentTournament.name == tournamentName) {
          DestroyTimer(tournamentIntervalTimer);
          DestroyTimerDialog(tournamentTimerDialog);
          DestroyTrigger(tournamentStartTrig);
        } else {
          Logger.LogDebug("Another tournament is active...");
        }
      })

      TimerDialogSetTitle(tournamentTimerDialog, TournamentData.finalBattleName);
      TimerDialogDisplay(tournamentTimerDialog, true);
    });
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