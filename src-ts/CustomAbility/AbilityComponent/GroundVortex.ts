import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { DamageData } from "Common/DamageData";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class GroundVortex implements AbilityComponent, Serializable<GroundVortex> {

  protected currentCoord: Vector2D;
  protected targetCoord: Vector2D;
  protected tmpPos: Vector2D;
  protected affectedGroup: group;
  
  constructor(
    public name: string = "GroundVortex",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
    public angle: number = 70,
    public distance: number = 37,
    public aoe: number = 650,
    public closenessAngle: number = 90 + 12,
    public closenessDistanceMult: number = -0.25,
    public closenessDamageMult: number = 1.0,
    public durationDamageMult: number = 1.0,
  ) {
    this.currentCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.tmpPos = new Vector2D();
    this.affectedGroup = CreateGroup();
  }

  private dealDamageToUnit(ability: CustomAbility, input: CustomAbilityInput, target: unit, closenessRatio: number): this {
    const damageThisTick = 
      input.level * input.caster.spellPower * this.damageData.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        (1 + this.closenessDamageMult * closenessRatio) * 
        (1 + this.durationDamageMult * ability.currentTick / ability.duration) * 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true
      )
    );

    UnitDamageTarget(
      input.caster.unit, 
      target,
      damageThisTick,
      true,
      false,
      this.damageData.attackType,
      this.damageData.damageType,
      this.damageData.weaponType
    );
    return this;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.currentCoord.setUnit(source);
    GroupEnumUnitsInRange(
      this.affectedGroup, 
      this.currentCoord.x, 
      this.currentCoord.y, 
      this.aoe,
      null
    );

    // this.currentCoord.setUnit(input.caster.unit);
    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer)) {

        this.targetCoord.setUnit(target);
        const targetDistance = CoordMath.distance(this.currentCoord, this.targetCoord);
  
        // closenessRatio = 1 at 0 distance, 0 at max distance
        const closenessRatio = 1 - (targetDistance / Math.max(1, this.aoe));
  
        const projectionAngle = 
          this.angle + 
          (this.closenessAngle - this.angle) * closenessRatio + 
          CoordMath.angleBetweenCoords(this.targetCoord, this.tmpPos);
        
        const projectionDistance = 
          this.distance + 
          (this.closenessDistanceMult * this.distance) * closenessRatio;
        
        this.tmpPos.polarProjectCoords(
          this.targetCoord, 
          projectionAngle,
          projectionDistance
        );
  
        PathingCheck.moveGroundUnitToCoord(target, this.tmpPos);
        this.dealDamageToUnit(ability, input, target, closenessRatio);
      }
    });

    GroupClear(this.affectedGroup);
  }

  cleanup() {
    DestroyGroup(this.affectedGroup);
  }

  clone(): AbilityComponent {
    return new GroundVortex(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageData, this.angle,
      this.distance, this.aoe, this.closenessAngle, this.closenessDamageMult,
      this.closenessDamageMult, this.durationDamageMult,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      damageData: {
        multiplier: number; 
        attribute: number; 
        attackType: number; 
        damageType: number; 
        weaponType: number; 
      }; 
      angle: number;
      distance: number;
      aoe: number;
      closenessAngle: number;
      closenessDistanceMult: number;
      closenessDamageMult: number;
      durationDamageMult: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.damageData = new DamageData().deserialize(input.damageData);
    this.angle = input.angle;
    this.distance = input.distance;
    this.aoe = input.aoe;
    this.closenessAngle = input.closenessAngle;
    this.closenessDistanceMult = input.closenessDistanceMult;
    this.durationDamageMult = input.durationDamageMult;
    return this;
  }
}