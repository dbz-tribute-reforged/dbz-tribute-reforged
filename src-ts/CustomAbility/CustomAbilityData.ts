import { Vector2D } from "Common/Vector2D";
import { CustomHero } from "CustomHero/CustomHero";

export class CustomAbilityData {
  constructor(
    public readonly caster: CustomHero,
    public readonly casterPlayer: player, 
    public readonly level: number,
    public readonly target?: unit,
    public readonly targetPoint?: Vector2D,
    public readonly mouseData?: Vector2D, 
  ) {

  }
}