import { Constants } from "./Constants";
import { Colorizer } from "./Colorizer";

export module WinLossHelper {
  export const winDelay: number = 30;
  export const winTimer: timer = CreateTimer();
  export let winningTeam: number = 0;
  export let freeMode: boolean = false;

  export function forceTeamWin(winTeam: number) {
    if (
      WinLossHelper.winningTeam != Constants.team1Value &&
      WinLossHelper.winningTeam != Constants.team2Value
    ) {
      WinLossHelper.winningTeam = winTeam;

      let winningPlayers = Constants.defaultTeam1;
      let losingPlayers = Constants.defaultTeam2;
      if (winTeam == Constants.team2Value) {
        winningPlayers = Constants.defaultTeam2;
        losingPlayers = Constants.defaultTeam1;
      } 

      let winningPlayerNames: string = "";         
      for (const player of winningPlayers) {
        winningPlayerNames += (
          Colorizer.getPlayerColorText(GetConvertedPlayerId(player)) + 
          GetPlayerName(player) + "|r "
        );
      }

      if (!freeMode) {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, WinLossHelper.winDelay, 
          "Team " + winTeam + " have won! The game will end in " + WinLossHelper.winDelay + " seconds. " +
          "Congratulations to " + winningPlayerNames
        );

        TimerStart(WinLossHelper.winTimer, WinLossHelper.winDelay, false, () => {
          for (const player of losingPlayers) {
            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS, 15, 
              Colorizer.getPlayerColorText(GetConvertedPlayerId(player)) + 
              GetPlayerName(player) + "|r has lost."
            );
            CustomDefeatBJ(player, "Defeat!");
          }
          for (const player of winningPlayers) {
            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS, 15, 
              Colorizer.getPlayerColorText(GetConvertedPlayerId(player)) + 
              GetPlayerName(player) + "|r has won."
            );
            CustomVictoryBJ(player, true, true);
          }
        })
      } else {
        DisplayTimedTextToForce(
          bj_FORCE_ALL_PLAYERS, WinLossHelper.winDelay, 
          "Team " + winTeam + " have won! The game will continue as it is in free mode. " +
          "Congratulations to " + winningPlayerNames
        );
      }
    }
  }
}