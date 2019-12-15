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
  export const senzuBean: number = FourCC("I000");
  export const reviveDelay: number = 5;
  export const team1Value: number = 1;
  export const team2Value: number = 2;
  export const defaultTeam1: player[] = [Player(0), Player(1), Player(2), Player(3), Player(4)];
  export const defaultTeam2: player[] = [Player(5), Player(6), Player(7), Player(8), Player(9)];
  export const finalBattleName: string = "Final Battle";
  export const budokaiName: string = "Tournament";
}