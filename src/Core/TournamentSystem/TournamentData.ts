import { Vector2D } from "Common/Vector2D";

// maybe put all the tournament data into a config file
export module TournamentData {
  export const tournamentSpawn1: Vector2D = new Vector2D(1600, 27500);
  export const tournamentSpawn2: Vector2D = new Vector2D(-4900, 27500);
  export const tournamentWaitRoom1: Vector2D = new Vector2D(3648, 30584);
  export const tournamentWaitRoom2: Vector2D = new Vector2D(3648, 25734);
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
  export const budokaiArenaMidPoint: Vector2D = new Vector2D(14778, 21687);
  export const budokaiSpawn1: Vector2D = new Vector2D(13778, 20747);
  export const budokaiSpawn2: Vector2D = new Vector2D(15775, 22690);
  export const finalBattleDetector: Vector2D = new Vector2D(11020, 22858);
  export const finalBattleName: string = "Final Battle";
  export const finalBattleTime: number = 32 * 60;
  export const finalBattleInterval: number = 5;
  export const finalBattleDelay: number = 115;
  export const finalBattleLobbyWait: number = 30;
  export const finalBattleSpell: number = FourCC("A0LT");
  export const finalBattleOrder: number = String2OrderIdBJ("thunderclap");
  export const finalBattleBottomLeft: Vector2D = new Vector2D(-5664, 23392);
  export const finalBattleTopRight: Vector2D = new Vector2D(2336, 31392);
  export const finalBattleCenter: Vector2D = new Vector2D(-1664, 27392);
  export const budokaiName: string = "Tournament";
  export const budokaiEnterCommand: string = "-enter";
  export const budokaiEnterCommandShortcut: string = "-e";
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


  export const kothStatePreStart: number = 0;
  export const kothStateLobby: number = 1;
  export const kothStateArena: number = 2;
  export const kothStateArenaEnd: number = 3;
  export const kothStateFinished: number = 4;
  export const kothLobbyWaitFirst: number = 15;
  export const kothLobbyWait: number = 10;
  export const kothArenaTimeout: number = 240;
  export const kothArenaCamDelay1: number = 0.5;
  export const kothArenaCamDelay2: number = 1.0;
  export const kothCaptureUnlockTime = 15;
  export const kothCaptureRadius = 1408; // 11 squares
  export const kothCaptureExpBonusRatio = 0.1;
  export const kothCaptureWinCount = 25;
  export const kothPointsToWin = 12;
  export const kothPointsForAdv1 = 3;
  export const kothPointsForAdv2 = 5;
  export const kothLastUpgRound = 8;
  export const kothLvlsPerRound = 50;
  export const kothStatsPerRound = 15 * kothLvlsPerRound;

  // export const kothNamekCenter: Vector2D = new Vector2D(28928, 26496);
  export const kothNamekCenter: Vector2D = new Vector2D(24576, 29568);
  export const kothNamekSpawn1: Vector2D = new Vector2D(29184, 30720); // losing side
  export const kothNamekSpawn2: Vector2D = new Vector2D(19712, 25600); // winning side
  export const kothNamekBottomLeft: Vector2D = new Vector2D(19072, 24320);
  export const kothNamekTopRight: Vector2D = new Vector2D(32000, 31744);

  export const kothFutureCenter: Vector2D = new Vector2D(14208, 29824);
  export const kothFutureSpawn1: Vector2D = new Vector2D(16208, 29824); // losing side
  export const kothFutureSpawn2: Vector2D = new Vector2D(6400, 25600); // winning side
  export const kothFutureBottomLeft: Vector2D = new Vector2D(4992, 24320);
  export const kothFutureTopRight: Vector2D = new Vector2D(18688  , 31744);
}