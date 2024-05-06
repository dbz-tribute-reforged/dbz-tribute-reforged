import { Vector2D } from "Common/Vector2D";

export module DragonBallsConstants {
  export const numDragonBalls: number = 7;
  export const dragonBallItem: number = FourCC("I01V");
  export const dragonBallsCollectedItem: number = FourCC("I01U");
  export const summonShenronAbility: number = FourCC("A04X");
  export const radarItem: number = FourCC("I02A");
  export const radarAbility: number = FourCC("A03K");
  export const shenronUnitDummy: number = FourCC("z000");
  export const shenronUnit: number = FourCC("z001");
  // export const shenronUnit: number = FourCC("n03O");
  export const shenronWaitingRoom: Vector2D = new Vector2D(10500, 22000);
  export const shenronVisionRadius: number = 800;
  export const shenronSfxInterval: number = 2;
  export const shenronDelay: number = 7.7;
  export const restoreDragonBallsTime: number = 180;
  export const wishImmortalityItem: number = FourCC("I042");
  export const wishImmortalityAbility: number = FourCC("A0M9");
  export const immortalDelay: number = 4.1;
  export const startingDBPos: Vector2D = new Vector2D(5000, 3500);
  export const dbSpawns: Vector2D[] = [
    new Vector2D(-10000, 10000),
    new Vector2D(2500, 10500),
    new Vector2D(19500, 10000),
    new Vector2D(24200, 1000),
    new Vector2D(22500, -4000),
    new Vector2D(14000, -7000),
    new Vector2D(5000, -7000),
    new Vector2D(-5000, -7000),
    new Vector2D(-7700, -15000),
    new Vector2D(-11000, 0),
    new Vector2D(1500, 1500),
    new Vector2D(-5500, 3000),
    new Vector2D(10000, 1000),
  ];
}