import { Vector2D } from "./Vector2D";

export module Constants {
  export const maxSubAbilities = 3;
  export const maxActivePlayers = 10;
  export const maxPlayers = 24;
  export const dummyBeamUnitId = FourCC("hpea");
  export const dummyCasterId = FourCC("h054");
  export const shortDisplayTextDuration = 5;
  export const mediumDisplayTextDuration = 10;
  export const longDisplayTextDuration = 15;
  export let jokeProbability = 0.03;
  export const sagaDisplayTextDuration = mediumDisplayTextDuration;
  export const sagaDisplayTextDelay = shortDisplayTextDuration;
  export const creepUpgradeDeathDelay = 10;
  export const creepRespawnReviveDelay = 55;
  export const creepUpgradeBuff: number = FourCC("BTLF");
  export const creepChainErrorMargin: number = 4;
  export const creepHeavenHellHeroRespawnDelay: number = 15;
  export const sagaPlayerId = PLAYER_NEUTRAL_AGGRESSIVE;
  export const sagaPlayer: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);
  export const heavenHellCreepPlayerId: number = maxPlayers - 1;
  export const heavenHellCreepPlayer: player = Player(heavenHellCreepPlayerId);
  export const heavenHellMaxHeroLevel: number = 10;
  export const heavenHellBottomLeft: Vector2D = new Vector2D(
    -7000, 20000
  );
  export const heavenHellTopRight: Vector2D = new Vector2D(
    6550, 24000
  );
  export const evilFightingSkills: number = FourCC("A03Z");
  export const sagaPingInterval: number = 30;
  export const sagaAggroInterval: number = 500;
  export const sagaMinAcquisitionRange: number = 2500;
  export const sagaMaxAcquisitionRange: number = 99999;
  export const reviveDelay: number = 5;
  // dont make team values 0
  export const invalidTeamValue: number = 0;
  export const team1Value: number = 1;
  export const team2Value: number = 2;
  export let defaultTeam1: player[] = [Player(0), Player(1), Player(2), Player(3), Player(4)];
  export let defaultTeam2: player[] = [Player(5), Player(6), Player(7), Player(8), Player(9)];
  export const creepPlayers: player[] = [
    Player(10), Player(11), Player(12), Player(13), Player(14), 
    Player(15), Player(16), Player(17), Player(18), Player(19), 
    Player(20), Player(21), Player(22), Player(23), 
    Player(PLAYER_NEUTRAL_AGGRESSIVE),
  ];
  export const maxHeroLevel: number = 1000;
  export const maxCreepLvl: number = 99;
  export const creepAggroRange: number = 900;
  export const finalBattleName: string = "Final Battle";
  export const budokaiName: string = "Tournament";
  export const locustAbility: number = FourCC("Aloc")
  export const shopSellItemAbility: number = FourCC("Asit");
  export const buffImmortal: number = FourCC("B01U");
  export const floatingTextVisionRange: number = 3000;
  export const beamSpawnOffset: number = 40;
  export const gameStartIndicatorUnit: number = FourCC("hkni");
  export const silenceBuff: number = FourCC("BNsi");
}