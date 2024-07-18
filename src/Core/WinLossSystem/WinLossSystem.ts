import { Colorizer } from "Common/Colorizer";
import { Constants, Globals } from "Common/Constants";
import { DDS } from "Core/DDS/DDS";
import { PlayerProfile } from "Core/PlayerProfile/PlayerProfile";
import { TimerManager } from "Core/Utility/TimerManager";

export class WinLossSystem {
  public static WINNING_TEAM: number = 0;
  public static WIN_DELAY: number = 10;
  public static MAX_STUCK_TIME: number = 20;

  private static instance: WinLossSystem;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new WinLossSystem();
    }
    return this.instance;
  }

  public winTimer: timer = CreateTimer();
  public t1StuckTime: number = 0;
  public t2StuckTime: number = 0;

  constructor() {
    
  }

  start() {
    TimerStart(this.winTimer, 1, true, () => {
      this.checkWin();
    });
  }

  checkWin() {
    if (
      !Globals.isMainGameStarted 
      || Globals.isKOTH
      || Globals.isFreemode
      || udg_IsLeadingToFinalBattle
    ) return;
    
    // check all dead
    const t1Stuck = this.checkTeamAllDead(Constants.defaultTeam1);
    const t2Stuck = this.checkTeamAllDead(Constants.defaultTeam2);
    
    if (!t1Stuck) {
      if (this.t1StuckTime > 0) {
        this.t1StuckTime = 0;
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 2, 
          "|cffff2222Team 1 are safe.");
      }
    } else {
      if (this.t1StuckTime > WinLossSystem.MAX_STUCK_TIME) {
        this.forceTeamWin(Constants.team2Value);
      } else {
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 2,
          "|cffff2222Team 1 will lose in " 
          + I2S(WinLossSystem.MAX_STUCK_TIME - this.t1StuckTime) + " seconds|r"
        );
        ++this.t1StuckTime;
      }
    }

    if (!t2Stuck) {
      if (this.t2StuckTime > 0) {
        this.t2StuckTime = 0;
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 2, 
          "|cffff2222Team 2 are safe.");
      }
    } else {
      if (this.t2StuckTime > WinLossSystem.MAX_STUCK_TIME) {
        this.forceTeamWin(Constants.team1Value);
      } else {
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 2,
          "|cffff2222Team 2 will lose in " 
          + I2S(WinLossSystem.MAX_STUCK_TIME - this.t2StuckTime) + " seconds|r"
        );
        ++this.t2StuckTime;
      }
    }
  }

  checkTeamAllDead(team: player[]) {
    let allDead = true;
    for (const player of team) {
      if (
        GetPlayerSlotState(player) != PLAYER_SLOT_STATE_PLAYING
        || GetPlayerController(player) != MAP_CONTROL_USER
      ) {
        continue;
      }
      const playerId = GetPlayerId(player);
      const size = BlzGroupGetSize(udg_StatMultPlayerUnits[playerId]);
      for (let i = 0; i < size; ++i) {
        const unit = BlzGroupUnitAt(udg_StatMultPlayerUnits[playerId], i);
        if (unit == null) continue;
        const unitId = GetHandleId(unit);
        const deathState = LoadInteger(udg_HeroRespawnHashtable, unitId, 3);
        if (deathState == 0) {
          allDead = false;
          break;
        }
      }
    }
    return allDead;
  }

  hasWon() {
    return WinLossSystem.WINNING_TEAM != 0;
  }

  getWinner() {
    return WinLossSystem.WINNING_TEAM;
  }

  forceTeamWin(winTeam: number) {
    if (this.hasWon()) return;
    WinLossSystem.WINNING_TEAM = winTeam;

    let winningPlayers = Constants.defaultTeam1;
    let losingPlayers = Constants.defaultTeam2;
    if (winTeam == Constants.team2Value) {
      winningPlayers = Constants.defaultTeam2;
      losingPlayers = Constants.defaultTeam1;
    } 

    let winningPlayerNames: string = "";         
    for (const player of winningPlayers) {
      winningPlayerNames += Colorizer.getColoredPlayerName(player) + " ";
    }

    const delayTimer = TimerManager.getInstance().get();

    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 60, DDS.getInstance().getDamageDataStr());
    print("Saving game results...");

    TimerStart(delayTimer, 1.5, false, () => {
      if (!Globals.isFreemode) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, WinLossSystem.WIN_DELAY, 
          "Team " + winTeam + " have won! The game will end in " + WinLossSystem.WIN_DELAY + " seconds. " +
          "Congratulations to " + winningPlayerNames
        );
        const timer = TimerManager.getInstance().get();
        TimerStart(timer, WinLossSystem.WIN_DELAY, false, () => {
          for (const player of losingPlayers) {
            CustomDefeatBJ(player, "Defeat!");
          }
          for (const player of winningPlayers) {
            CustomVictoryBJ(player, true, true);
          }
          TimerManager.getInstance().recycle(timer);
        })
      } else {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, WinLossSystem.WIN_DELAY, 
          "Team " + winTeam + " have won! The game will continue as it is in free mode. " +
          "Congratulations to " + winningPlayerNames
        );
        for (let i = 0; i < Constants.maxActivePlayers; ++i) {
          GroupEnumUnitsOfPlayer(Globals.tmpUnitGroup, Player(i), null);
          ForGroup(Globals.tmpUnitGroup, () => {
            const teleportUnit = GetEnumUnit();
            if (IsUnitType(teleportUnit, UNIT_TYPE_HERO)) {
              SetUnitInvulnerable(teleportUnit, false);
              PauseUnit(teleportUnit, false);
              SetUnitX(teleportUnit, 0);
              SetUnitY(teleportUnit, 0);
            }
          });
          GroupClear(Globals.tmpUnitGroup);
        }
      }
    });
  }
}