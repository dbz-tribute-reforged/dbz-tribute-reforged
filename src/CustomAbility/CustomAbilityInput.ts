import { Vector2D } from "Common/Vector2D";
import { CustomHero } from "CustomHero/CustomHero";

export class CustomAbilityInput {
  constructor(
    public abilityId: number,
    public caster: CustomHero,
    public casterPlayer: player, 
    public level: number,
    public targetPoint: Vector2D,
    public mouseData: Vector2D, 
    public castPoint: Vector2D,
    public targetUnit?: unit,
    public castUnit?: unit,
    public damageMult?: number,
    public isBeamClash?: boolean,
    public spawnedBeam?: unit
  ) {
  }

  clone(): CustomAbilityInput {
    return new CustomAbilityInput(
      this.abilityId,
      this.caster,
      this.casterPlayer,
      this.level,
      new Vector2D(this.targetPoint.x, this.targetPoint.y),
      new Vector2D(this.mouseData.x, this.mouseData.y),
      new Vector2D(this.castPoint.x, this.castPoint.y),
      this.targetUnit,
      this.castUnit,
      this.damageMult,
      this.isBeamClash,
      this.spawnedBeam
    );
  }
}