import { Vector2D } from "Common/Vector2D";

// maybe put all the tournament data into a config file
export module TournamentData {
  export const tournamentSpawn1: Vector2D = new Vector2D(22000, 23000);
  export const tournamentSpawn2: Vector2D = new Vector2D(17200, 18300);
  export const tournamentWaitRoom1: Vector2D = new Vector2D(23300, 23000);
  export const tournamentWaitRoom2: Vector2D = new Vector2D(23300, 18500);
  export const tournmanetBottomLeft: Vector2D = new Vector2D(16666, 17750);
  export const tournmanetTopRight: Vector2D = new Vector2D(23848, 23848);
  export const finalBattleDetector: Vector2D = new Vector2D(-729, 22950);
  export const finalBattleName: string = "Final Battle";
  export const finalBattleInterval: number = 60 * 5;
  export const finalBattleDelay: number = 60 * 2;
  export const finalBattleLobbyWait: number = 15;
  export const finalBattleSpell: number = FourCC("A0LT");
  export const finalBattleOrder: number = String2OrderIdBJ("thunderclap");
  export const budokaiName: string = "Tournament";
  export const budokaiEnterCommand: string = "-enter";
  export const budokaiDelay: number = 60 * 2;
  export const budokaiCounter: number = 23;
  export const budokaiMatchDelay: number = 10;
  export const budokaiMaxContestantsPerMatch: number = 2;
  export const budokaiTpSfx: string = "BlackBlink.mdl";
  export const seedingNone: number = 0;
  export const seedingRandom: number = 1;
}