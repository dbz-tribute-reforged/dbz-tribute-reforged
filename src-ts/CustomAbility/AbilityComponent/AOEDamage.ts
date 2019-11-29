import { AbilityComponent } from "./AbilityComponent";
import { DamageData } from "Common/DamageData";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";

export class AOEDamage implements AbilityComponent, Serializable<AOEDamage> {

  constructor(
    public name: string = "AOEDamage",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public aoe: number = 250,
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
  ) {

  }

  protected calculateDamage(input: CustomAbilityInput): number {
    return (
      input.level * (
        10 + 
        this.damageData.multiplier *
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true)
      )
    );
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      sourceCoord, 
      this.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer);
      }
    );

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      UnitDamageTarget(
        input.caster.unit, 
        target, 
        this.calculateDamage(input),
        true,
        false,
        this.damageData.attackType,
        this.damageData.damageType,
        this.damageData.weaponType,
      )
    })

    DestroyGroup(affectedGroup);

  }

  clone(): AbilityComponent {
    return new AOEDamage(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.aoe, this.damageData,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      aoe: number; 
      damageData: {
        multiplier: number; 
        attribute: number; 
        attackType: number; 
        damageType: number; 
        weaponType: number; 
      }; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.aoe = input.aoe;
    this.damageData = new DamageData().deserialize(input.damageData);
    return this;
  }
}