import { Vector2D } from "Common/Vector2D";
import { CustomHero } from "CustomHero/CustomHero";

export class CustomAbilityInput {
  constructor(
    public caster: CustomHero,
    public casterPlayer: player, 
    public level: number,
    public targetPoint: Vector2D,
    public mouseData: Vector2D, 
    public castPoint: Vector2D,
    public targetUnit?: unit,
  ) {

  }

  clone(): CustomAbilityInput {
    return new CustomAbilityInput(
      this.caster,
      this.casterPlayer,
      this.level,
      new Vector2D(this.targetPoint.x, this.targetPoint.y),
      new Vector2D(this.mouseData.x, this.mouseData.y),
      new Vector2D(this.castPoint.x, this.castPoint.y),
      this.targetUnit
    );
  }
}