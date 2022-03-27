import { Constants } from "Common/Constants";

export class TeamManager {
  private static instance: TeamManager;

  protected swapCommandTrigger: trigger;

  public team1: Map<number, player>;
  public team2: Map<number, player>;

  constructor (
  ) {
    this.swapCommandTrigger = CreateTrigger();
    this.team1 = new Map();
    this.team2 = new Map();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new TeamManager();
    }
    return this.instance;
  }

  initialize() {
    // this.setupCreepAlliance();
    // this.setupTeams();
    // this.setupSwapCommand();
  }

  // setupCreepAlliance() {
  //   for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
  //     let player = Player(i);
  //     if (i == Constants.heavenHellCreepPlayerId) {
  //       SetPlayerAllianceStateBJ(player, Constants.sagaPlayer, bj_ALLIANCE_ALLIED);
  //       SetPlayerAllianceStateBJ(Constants.sagaPlayer, player, bj_ALLIANCE_ALLIED);
  //     } else {
  //       SetPlayerAllianceStateBJ(player, Constants.sagaPlayer, bj_ALLIANCE_ALLIED_VISION);
  //       SetPlayerAllianceStateBJ(Constants.sagaPlayer, player, bj_ALLIANCE_ALLIED_VISION);
  //       SetPlayerAllianceStateBJ(Constants.heavenHellCreepPlayer, player, bj_ALLIANCE_UNALLIED);
  //       SetPlayerAllianceStateBJ(player, Constants.heavenHellCreepPlayer, bj_ALLIANCE_UNALLIED);
  //       SetPlayerAllianceStateVisionBJ(Constants.heavenHellCreepPlayer, player, false);
  //       SetPlayerAllianceStateVisionBJ(player, Constants.heavenHellCreepPlayer, false);
  //       SetPlayerAllianceStateVisionBJ(Player(PLAYER_NEUTRAL_PASSIVE), player, false);
  //       SetPlayerAllianceStateVisionBJ(player, Player(PLAYER_NEUTRAL_PASSIVE), false);
  //     }
  //     for (let j = 0; j < Constants.maxPlayers; ++j) {
  //       const target = Player(j);
  //       if (i != j) {
  //         let allianceState = bj_ALLIANCE_ALLIED_VISION;
  //         if (j < Constants.maxActivePlayers) {
  //           allianceState = bj_ALLIANCE_UNALLIED;
  //         } else if (
  //           i == Constants.heavenHellCreepPlayerId || 
  //           j == Constants.heavenHellCreepPlayerId 
  //         ) {
  //           allianceState = bj_ALLIANCE_ALLIED;
  //         }
  //         SetPlayerAllianceStateBJ(player, target, allianceState);
  //         SetPlayerAllianceStateBJ(target, player, allianceState);
  //       }
  //     }
  //   }

  //   for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
  //     let player = Player(i);
  //     SetPlayerName(player, "Creeps");
  //     SetPlayerColorBJ(player, PLAYER_COLOR_COAL, false);
  //     if (i != Constants.heavenHellCreepPlayerId) {
  //       SetPlayerAllianceStateVisionBJ(Constants.heavenHellCreepPlayer, player, false);
  //       SetPlayerAllianceStateVisionBJ(player, Constants.heavenHellCreepPlayer, false);
  //     }
  //   }
  //   SetPlayerColorBJ(Constants.sagaPlayer, PLAYER_COLOR_MAROON, false);
  // }

  // setupTeams() {
  //   for (let i = 0; i < Constants.maxActivePlayers / 2; ++i) {
  //     this.team1.set(i, Player(i));
  //   }
  //   for (let i = Constants.maxActivePlayers / 2; i < Constants.maxActivePlayers; ++i) {
  //     this.team2.set(i, Player(i));
  //   }
  //   this.updateTeamAlliances();
  // }

  // updateTeamAlliances() {
  //   this.setAllianceTeamToTeam(this.team1.values(), this.team1.values(), bj_ALLIANCE_ALLIED_VISION);
  //   this.setAllianceTeamToTeam(this.team2.values(), this.team2.values(), bj_ALLIANCE_ALLIED_VISION);
  //   this.setAllianceTeamToTeam(this.team1.values(), this.team2.values(), bj_ALLIANCE_UNALLIED);
  // }

  // setAllianceTeamToTeam(
  //   team1: IterableIterator<player>, 
  //   team2: IterableIterator<player>,
  //   allianceState: number,
  // ) {
  //   for (const player1 of team1) {
  //     for (const player2 of team2) {
  //       if (player1 != player2) {
  //         SetPlayerAllianceStateBJ(player1, player2, allianceState);
  //         SetPlayerAllianceStateBJ(player2, player1, allianceState);
  //       }
  //     }
  //   }
  // }

  // setupSwapCommand() {
  //   TriggerRegisterPlayerChatEvent(
  //     this.swapCommandTrigger,
  //     Player(0),
  //     "-swap",
  //     false,
  //   );
  //   TriggerAddCondition(
  //     this.swapCommandTrigger,
  //     Condition(() => {
  //       const input = GetEventPlayerChatString();
  //       if (input.startsWith("-swap")) {
  //         const playerId = S2I(SubString(input, 6, 8)) - 1;
  //         let player = this.team1.get(playerId);
  //         if (player) {
  //           this.team2.set(playerId, player);
  //           this.team1.delete(playerId);
  //         } else {
  //           player = this.team2.get(playerId);
  //           if (player) {
  //             this.team1.set(playerId, player);
  //             this.team2.delete(playerId);
  //           }
  //         }
  //         this.updateTeamAlliances();
  //       }
  //       return false;
  //     })
  //   )
  // }
}