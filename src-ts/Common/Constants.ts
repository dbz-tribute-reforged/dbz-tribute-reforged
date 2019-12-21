import { Vector2D } from "./Vector2D";

export module Constants {
  export const maxSubAbilities = 3;
  export const maxActivePlayers = 10;
  export const maxPlayers = 24;
  export const dummyCasterId = FourCC('h054');
  export const creepUpgradeDeathDelay = 10;
  export const creepRespawnReviveDelay = 55;
  export const creepUpgradeBuff: number = FourCC("BTLF");
  export const creepChainErrorMargin: number = 4;
  export const heavenHellCreepPlayerId: number = maxPlayers - 1;
  export const heavenHellCreepPlayer: player = Player(heavenHellCreepPlayerId);
  export const heavenHellBottomLeft: Vector2D = new Vector2D(
    -7000, 20000
  );
  export const heavenHellTopRight: Vector2D = new Vector2D(
    -1000, 24000
  );
  export const evilFightingSkills: number = FourCC("A03Z");
  export const sagaPingInterval: number = 45;
  export const sagaAggroInterval: number = 500;
  export const sagaMaxAcquisitionRange: number = 99999;
  export const senzuBean: number = FourCC("I000");
  export const reviveDelay: number = 5;
  export const team1Value: number = 1;
  export const team2Value: number = 2;
  export const defaultTeam1: player[] = [Player(0), Player(1), Player(2), Player(3), Player(4)];
  export const defaultTeam2: player[] = [Player(5), Player(6), Player(7), Player(8), Player(9)];
  export const creepPlayers: player[] = [
    Player(10), Player(11), Player(12), Player(13), Player(14), 
    Player(15), Player(16), Player(17), Player(18), Player(19), 
    Player(20), Player(21), Player(22), Player(23), 
    Player(PLAYER_NEUTRAL_AGGRESSIVE),
  ];
  export const maxHeroLevel: number = 1000;
  export const maxCreepLvl: number = 99;
  export const finalBattleName: string = "Final Battle";
  export const budokaiName: string = "Tournament";
}