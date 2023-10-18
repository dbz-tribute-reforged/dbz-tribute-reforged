import { Tournament, TournamentState } from "./Tournament";
import { FinalBattle } from "./FinalBattle";
import { TournamentData } from "./TournamentData";
import { Constants, Globals } from "Common/Constants";
import { Budokai } from "./Budokai";
import { UnitHelper } from "Common/UnitHelper";
import { KOTHTournament } from "./KOTHTournament";
import { AdvancedTournament } from "./AdvancedTournament";


export class TournamentManager {
  
  private static instance: TournamentManager;

  protected tournaments: Map<string, Tournament>;
  protected currentTournament: Tournament | null;

  protected isFbArenaVision: boolean = false;

  constructor (
  ) {
    this.tournaments = new Map();
    this.currentTournament = null;
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new TournamentManager();
    }
    return this.instance;
  }

  public initialize(): this {

    /*
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      FogModifierStart(
        CreateFogModifierRect(
          Player(i), 
          FOG_OF_WAR_VISIBLE, 
          TournamentData.tournamentRect, 
          true, false
        )
      );
    }
    */
    return this;
  }

  public setupStandardTournaments(): this {  let numActivePlayers = 0;
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      let player = Player(i);
      if (
        IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING) &&
        GetPlayerController(player) == MAP_CONTROL_USER && 
        GetPlayerController(player) != MAP_CONTROL_COMPUTER
      ) {
        ++numActivePlayers;
      }
    }
    if (numActivePlayers > 1) {
      this.addFinalBattle();
    } else {
      BJDebugMsg("|cffff2020Final battle disabled.|r");
    }

    const budokai = new Budokai();
    this.tournaments.set(budokai.name, budokai);

    if (!this.tournaments.has(Constants.KOTHName)) {
      this.startPreTournamentTimer(
        TournamentData.finalBattleName,
        TournamentData.finalBattleTime,
        TournamentData.finalBattleInterval,
        true,
      );

      this.startPreTournamentTimer(
        TournamentData.budokaiName,
        TournamentData.budokaiStartTime1,
        3,
        false,
      );
      this.startPreTournamentTimer(
        TournamentData.budokaiName,
        TournamentData.budokaiStartTime2,
        3,
        false,
      );
      this.startPreTournamentTimer(
        TournamentData.budokaiName,
        TournamentData.budokaiStartTime3,
        3,
        false,
      );
    }

    return this;
  }

  public addFinalBattle(toStartDelay?: number) {
    const finalBattle = new FinalBattle();
    if (toStartDelay) finalBattle.toStartDelay = toStartDelay;
    this.addTournament(finalBattle);
  }

  public addKOTH(p: number = TournamentData.kothPointsToWin) {
    const koth = new KOTHTournament();
    koth.setPointsToWin(p);
    this.addTournament(koth);
  }

  public addTournament(tournament: Tournament) {
    this.tournaments.set(tournament.name, tournament);
  }

  public removeTournament(name: string): boolean {
    if (this.tournaments.get(name)) {
      return this.tournaments.delete(name);
    }
    return false;
  }

  public isTournamentActive(name: string): boolean {
    if (this.currentTournament != null) {
      return this.currentTournament.name == name;
    }
    return false;
  }
  
  // timer to show how long before a given tournament starts()
  protected startPreTournamentTimer(
    tournamentName: string, 
    initialDelay: number, 
    timerDuration: number,
    timerRepeat: boolean,
  ) {
    const tournamentStartTrig = CreateTrigger();
    const tournamentIntervalTimer = CreateTimer();
    const tournamentTimerDialog = CreateTimerDialog(tournamentIntervalTimer);

    TimerStart(CreateTimer(), initialDelay, false, () => {
      if (
        tournamentName != TournamentData.finalBattleName
        || !Globals.isFBSimTest
      ) {
        TimerStart(tournamentIntervalTimer, timerDuration, timerRepeat, () => {
          TournamentManager.getInstance().startTournament(tournamentName);
          const currentTournament = TournamentManager.getInstance().currentTournament;
  
          if (currentTournament && currentTournament.name == tournamentName) {
            DestroyTimer(tournamentIntervalTimer);
            DestroyTimerDialog(tournamentTimerDialog);
            DestroyTrigger(tournamentStartTrig);
          } else {
            // Logger.LogDebug("Another tournament is active...");
          }
        });

        TimerDialogSetTitle(tournamentTimerDialog, tournamentName);
        TimerDialogDisplay(tournamentTimerDialog, true);
      }
      DestroyTimer(GetExpiredTimer());
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
        // DisplayTimedTextToForce(
        //   bj_FORCE_ALL_PLAYERS,
        //   5,
        //   "Could not start " + newTournament.name + ", as tournament ring is already in use."
        // )
      }
    } else {
      // print("Could not start " + name + ", as tournament does not exist (anymore)");
    }
  }
}