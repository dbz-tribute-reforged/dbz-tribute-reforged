import { Vector2D } from "Common/Vector2D";

// maybe put all the tournament data into a config file
export module TournamentData {
  export const tournamentSpawn1: Vector2D = new Vector2D(503, 29700);
  export const tournamentSpawn2: Vector2D = new Vector2D(-4000, 25100);
  export const tournamentWaitRoom1: Vector2D = new Vector2D(3639, 30584);
  export const tournamentWaitRoom2: Vector2D = new Vector2D(3639, 25734);
  export const tournamentBottomLeft: Vector2D = new Vector2D(-5610, 23068);
  export const tournamentTopRight: Vector2D = new Vector2D(2100, 31300);
  export const tournamentRect: rect = Rect(
    tournamentBottomLeft.x, 
    tournamentBottomLeft.y,
    tournamentTopRight.x,
    tournamentTopRight.y
  );
  export const budokaiArenaBottomLeft: Vector2D = new Vector2D(12930, 19964);
  export const budokaiArenaTopRight: Vector2D = new Vector2D(16737, 23848);
  export const budokaiSpawn1: Vector2D = new Vector2D(13778, 20747);
  export const budokaiSpawn2: Vector2D = new Vector2D(15775, 22690);
  export const finalBattleDetector: Vector2D = new Vector2D(11020, 22858);
  export const finalBattleName: string = "Final Battle";
  export const finalBattleTime: number = 36 * 60;
  export const finalBattleInterval: number = 5;
  export const finalBattleDelay: number = 115;
  export const finalBattleLobbyWait: number = 30;
  export const finalBattleSpell: number = FourCC("A0LT");
  export const finalBattleOrder: number = String2OrderIdBJ("thunderclap");
  export const budokaiName: string = "Tournament";
  export const budokaiEnterCommand: string = "-enter";
  export const budokaiShowBracketCommand: string = "-bracket";
  export const budokaiStartTime1: number = 3 * 60;
  export const budokaiStartTime2: number = 13 * 60;
  export const budokaiStartTime3: number = 23 * 60;
  export const budokaiDelay: number = 45;
  export const budokaiCounter: number = 23;
  export const budokaiMatchDelay: number = 6;
  export const budokaiMatchTimeLimit: number = 2 * 60;
  export const budokaiMatchTimeLimitName: string = "Remaining Time";
  export const budokaiMaxContestantsPerMatch: number = 2;
  export const budokaiTpSfx: string = "BlackBlink.mdl";
  export const seedingNone: number = 0;
  export const seedingRandom: number = 1;
  export const trophyItem: number = FourCC("I01H");
}