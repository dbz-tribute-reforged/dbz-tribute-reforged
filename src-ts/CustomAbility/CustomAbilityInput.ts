import { Vector2D } from "Common/Vector2D";
import { CustomHero } from "CustomHero/CustomHero";

export class CustomAbilityInput {
  constructor(
    public caster: CustomHero,
    public casterPlayer: player, 
    public level: number,
    public targetPoint: Vector2D,
    public mouseData: Vector2D, 
    public target?: unit,
  ) {

  }
}