import { Vector2D } from "Common/Vector2D";

export module DragonBallsConstants {
  export const numDragonBalls: number = 7;
  export const dragonBallItem: number = FourCC("I01V");
  export const dragonBallsCollectedItem: number = FourCC("I01U");
  export const summonShenronAbility: number = FourCC("A04X");
  export const radarItem: number = FourCC("I02A");
  export const radarAbility: number = FourCC("A03K");
  export const shenronUnitDummy: number = FourCC("z001");
  export const shenronUnit: number = FourCC("z001");
  // export const shenronUnit: number = FourCC("n03O");
  export const shenronWaitingRoom: Vector2D = new Vector2D(0, 22000);
  export const shenronVisionRadius: number = 600;
  export const shenronSfxInterval: number = 2;
  export const shenronDelay: number = 7.7;
  export const restoreDragonBallsTime: number = 120;
  export const wishImmortalityItem: number = FourCC("I042");
  export const wishImmortalityAbility: number = FourCC("A0M9");
  export const immortalDelay: number = 4.1;
  export const startingDBPos: Vector2D = new Vector2D(5000, 3500);
  export const dbSpawns: Vector2D[] = [
    new Vector2D(14000, 17000),
    new Vector2D(30500, 7700),
    new Vector2D(6000, 18000),
    new Vector2D(5000, 3500),
    new Vector2D(8200, -1500),
    new Vector2D(16512, 12267),
    new Vector2D(29300, -4500),
    new Vector2D(-4600, 3200),
    new Vector2D(2500, 10300),
    new Vector2D(13775, 9720),
    new Vector2D(11890, -2650),
    new Vector2D(8500, -5870),
    new Vector2D(16000, 2500),
    new Vector2D(13000, 17730),
    new Vector2D(23000, 8300),
    new Vector2D(2500, -7250),
    new Vector2D(-5500, -6000),
    new Vector2D(21156, 380),
    new Vector2D(23700, 15600),
    new Vector2D(4741, -861),
    new Vector2D(17000, 7500),
    new Vector2D(8433, 10206),
    new Vector2D(20000, 16000),
    new Vector2D(28100, 11100),
    new Vector2D(-4000, 5800),
    new Vector2D(18500, -3600),
    new Vector2D(4800, 7600),
    new Vector2D(16200, -6500),
    new Vector2D(1000, 14400),
    new Vector2D(10450, 4000),
    new Vector2D(5788, 15164),
    new Vector2D(27050, 1900),
  ];
}