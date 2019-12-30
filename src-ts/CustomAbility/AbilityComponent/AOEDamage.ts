import { AbilityComponent } from "./AbilityComponent";
import { DamageData } from "Common/DamageData";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { Colorizer } from "Common/Colorizer";

export class AOEDamage implements AbilityComponent, Serializable<AOEDamage> {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT = 1;
  static readonly SOURCE_TARGET_UNIT = 2;
  static readonly SOURCE_LAST_CAST_UNIT = 3;

  protected damageCoords: Vector2D;
  protected damageStarted: boolean;

  constructor(
    public name: string = "AOEDamage",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageSource: number = AOEDamage.SOURCE_UNIT,
    public aoe: number = 250,
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
  ) {
    this.damageCoords = new Vector2D(0, 0);
    this.damageStarted = false;
  }

  protected calculateDamage(input: CustomAbilityInput): number {
    return (
      input.level * input.caster.spellPower * this.damageData.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true)
      )
    );
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.damageStarted) {
      this.damageStarted = true;
      if (this.damageSource == AOEDamage.SOURCE_TARGET_POINT) {
        this.damageCoords = new Vector2D(input.targetPoint.x, input.targetPoint.y);
      }
    }

    if (this.damageSource == AOEDamage.SOURCE_UNIT) {
      this.damageCoords = new Vector2D(GetUnitX(source), GetUnitY(source));
    } else if (this.damageSource == AOEDamage.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.damageCoords = new Vector2D(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.damageCoords = new Vector2D(input.targetPoint.x, input.targetPoint.y);
      }
    } else if (this.damageSource == AOEDamage.SOURCE_LAST_CAST_UNIT) {
      if (input.castUnit) {
        this.damageCoords = new Vector2D(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
      } else {
        this.damageCoords = new Vector2D(input.targetPoint.x, input.targetPoint.y);
      }
    }

    const affectedGroup = UnitHelper.getNearbyValidUnits(
      this.damageCoords, 
      this.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer);
      }
    );

    const damage = this.calculateDamage(input);

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      UnitDamageTarget(
        input.caster.unit, 
        target, 
        damage,
        true,
        false,
        this.damageData.attackType,
        this.damageData.damageType,
        this.damageData.weaponType,
      )

      TextTagHelper.showTempText(
        Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(damage), 
        GetUnitX(target), GetUnitY(target), 1.0, 0.8
      );
    })

    DestroyGroup(affectedGroup);
    
    if (ability.isFinishedUsing(this)) {
      this.damageStarted = false;
    }
  }

  clone(): AbilityComponent {
    return new AOEDamage(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageSource, this.aoe, this.damageData,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      damageSource: number;
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
    this.damageSource = input.damageSource;
    this.aoe = input.aoe;
    this.damageData = new DamageData().deserialize(input.damageData);
    return this;
  }
}