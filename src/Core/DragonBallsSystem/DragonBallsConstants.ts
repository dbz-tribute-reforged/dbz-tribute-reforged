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
  export const shenronWaitingRoom: Vector2D = new Vector2D(2500, 17700);
  export const shenronVisionRadius: number = 800;
  export const shenronSfxInterval: number = 2;
  export const shenronDelay: number = 7.7;
  export const restoreDragonBallsTime: number = 180;
  export const wishImmortalityItem: number = FourCC("I042");
  export const wishImmortalityAbility: number = FourCC("A0M9");
  export const immortalDelay: number = 4.1;
  export const startingDBPos: Vector2D = new Vector2D(5000, 3500);
  export const dbSpawns: Vector2D[] = [
    // 1
    new Vector2D(-11000, 0), // lookout
    new Vector2D(2500, 10500), // top middle island
    new Vector2D(26000, 10000), // android 8 ice area
    new Vector2D(24200, 1000), // satan city
    new Vector2D(22400, -10200), // kame house
    new Vector2D(5000, -7000), // gohan training mtns

    // 2
    new Vector2D(1800, 0), // capsule corp
    new Vector2D(-7700, -15000), // baba's palace
    new Vector2D(-10000, 10000), // top left ice area
    new Vector2D(10000, 11400), // top ice mtn
    new Vector2D(20500, 6500), // el hermano
    new Vector2D(23900, -5500), // grandpa gohan house
    new Vector2D(29000, -13500), // bottom right island 

    // 3
    new Vector2D(3260, 6870), // cell's arena
    new Vector2D(10000, 1000), // center desert
    new Vector2D(19500, 10000), // top of top right river
    new Vector2D(27000, 0), // middle right popo carpet 
    new Vector2D(-5500, 3000), // middle left mtns
    new Vector2D(-5000, -7000), // bottom left mtns
    new Vector2D(-3000, 12000), // right of top left ice area

    // 4
    new Vector2D(15000, 1000), // middle right near pod
    new Vector2D(5500, 2100), // middle mtns 
    new Vector2D(-12000, -11000), // bottom left desert
    new Vector2D(14000, -7000), // bottom middle mountain
    new Vector2D(8000, -4000), // middle river down
  ];
}