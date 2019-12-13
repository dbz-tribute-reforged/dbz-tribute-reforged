import { Vector2D } from "./Vector2D";

export module Constants {
  export const maxSubAbilities = 10;
  export const maxActivePlayers = 10;
  export const maxPlayers = 24;
  export const dummyCasterId = FourCC('h054');
  export const creepUpgradeDeathDelay = 10;
  export const creepRespawnReviveDelay = 55;
  export const creepUpgradeBuff: number = FourCC("BTLF");
  export const creepChainErrorMargin: number = 4;
  export const sagaPingInterval: number = 45;
  export const team1Value: number = 1;
  export const team2Value: number = 2;
  export const tournamentSpawn1: Vector2D = new Vector2D(22000, 23000);
  export const tournamentSpawn2: Vector2D = new Vector2D(17200, 18300);
  export const tournamentWaitRoom1: Vector2D = new Vector2D(23300, 23000);
  export const tournamentWaitRoom2: Vector2D = new Vector2D(23300, 18500);
  export const defaultTeam1: player[] = [Player(0), Player(1), Player(2), Player(3), Player(4)];
  export const defaultTeam2: player[] = [Player(5), Player(6), Player(7), Player(8), Player(9)];
  export const finalBattleTime: number = 60;
  export const finalBattleSpell: number = FourCC("A0LT");
  export const finalBattleOrder: number = String2OrderIdBJ("thunderclap");
  export const senzuBean: number = FourCC("I000");
}