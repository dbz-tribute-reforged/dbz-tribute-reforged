import { Vector2D } from "Common/Vector2D";

export class SagaUnit {
  constructor (
    public unitId: number,
    public lvl: number,
    public str: number,
    public agi: number,
    public int: number,
    public spawnPos: Vector2D,
    public weakBeams: string[] = [],
    public strongBeams: string[] = [],
  ) {

  }
}