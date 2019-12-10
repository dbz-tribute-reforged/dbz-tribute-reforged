import { Vector2D } from "Common/Vector2D";

export class CustomCreep {
  constructor (
    public unit: unit, 
    public unitTypeId: number = GetUnitTypeId(unit),
    public owner: player,
    public position: Vector2D,
    public isUpgrading: boolean = false,
  ) {

  }

}