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
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
    public aoe: number = 250,
  ) {

  }

  protected calculateDamage(source: unit): number {
    return (
      this.damageData.multiplier * 
      GetHeroStatBJ(this.damageData.attribute, source, true)
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
        source, 
        target, 
        this.calculateDamage(input.caster.unit),
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
      this.name, this.repeatInterval, this.damageData, this.aoe,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      damageData: {
        multiplier: number; 
        attribute: number; 
        attackType: number; 
        damageType: number; 
        weaponType: number; 
      }; 
      aoe: number; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.damageData = new DamageData().deserialize(input.damageData);
    this.aoe = input.aoe;
    return this;
  }
}