import { Vector2D } from "Common/Vector2D";
import { SagaAbility } from "./SagaAbility";

export class SagaUnit {
  constructor (
    public unitId: number,
    public lvl: number,
    public str: number,
    public agi: number,
    public int: number,
    public spawnPos: Vector2D,
    public abilities: SagaAbility[] = [],
    public itemDrops: number[] = [],
  ) {

  }
}