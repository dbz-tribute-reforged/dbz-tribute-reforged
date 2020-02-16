import { Hooks } from "Libs/TreeLib/Hooks";
import { Tournament, TournamentState } from "./Tournament";
import { FinalBattle } from "./FinalBattle";
import { Logger } from "Libs/TreeLib/Logger";
import { TournamentData } from "./TournamentData";
import { Constants } from "Common/Constants";
import { Budokai } from "./Budokai";
import { UnitHelper } from "Common/UnitHelper";


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

    const finalBattle = new FinalBattle();
    this.tournaments.set(finalBattle.name, finalBattle);
    // this.setupTimedStartFinalBattle();
    this.startPreTournamentTimer(
      TournamentData.finalBattleName,
      TournamentData.finalBattleTime,
      TournamentData.finalBattleInterval,
      true,
    );

    const budokai = new Budokai();
    this.tournaments.set(budokai.name, budokai);
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


    return this;
  }

  public removeTournament(name: string): boolean {
    if (this.tournaments.get(name)) {
      return this.tournaments.delete(name);
    }
    return false;
  }

  protected setupReviveTrigger() {
    // tournament revive trigger
    // if you die in tournament, revive & move to lobby
    TriggerRegisterAnyUnitEventBJ(this.tournamentReviveTrig, EVENT_PLAYER_UNIT_DEATH);
    TriggerAddAction(this.tournamentReviveTrig, () => {
      const deadHero = GetDyingUnit();
      const x = GetUnitX(deadHero);
      const y = GetUnitY(deadHero);
      if ( 
        (
          (
            x > TournamentData.tournamentBottomLeft.x &&
            y > TournamentData.tournamentBottomLeft.y && 
            x < TournamentData.tournamentTopRight.x &&
            y < TournamentData.tournamentTopRight.y
          ) || 
          (
            x > TournamentData.budokaiArenaBottomLeft.x &&
            y > TournamentData.budokaiArenaBottomLeft.y && 
            x < TournamentData.budokaiArenaTopRight.x &&
            y < TournamentData.budokaiArenaTopRight.y
          )
        )
        && 
        UnitHelper.isUnitTournamentViable(deadHero)
        &&
        GetOwningPlayer(deadHero) != Player(PLAYER_NEUTRAL_AGGRESSIVE)
      ) {
        // Logger.LogDebug("Reviving Dead Tournament Hero");
        TimerStart(CreateTimer(), Constants.reviveDelay, false, () => {
          if (UnitHelper.isUnitDead(deadHero)) {
            ReviveHero(
              deadHero, 
              TournamentData.tournamentWaitRoom1.x,
              TournamentData.tournamentWaitRoom1.y,
              false
            );

            SetUnitLifePercentBJ(deadHero, 100);
            SetUnitManaPercentBJ(deadHero, 100);

            SetUnitInvulnerable(deadHero, true);
            PauseUnit(deadHero, true);
          }

          DestroyTimer(GetExpiredTimer());
        });
      }
    });
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
          // Logger.LogDebug("Another tournament is active...");
        }
      })

      TimerDialogSetTitle(tournamentTimerDialog, tournamentName);
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
        // DisplayTimedTextToForce(
        //   bj_FORCE_ALL_PLAYERS,
        //   5,
        //   "Could not start " + newTournament.name + ", as tournament ring is already in use."
        // )
      }
    } else {
      Logger.LogDebug("Could not start " + name + ", as tournament does not exist (anymore)");
    }
  }
}