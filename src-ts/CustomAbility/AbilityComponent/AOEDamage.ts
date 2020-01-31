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
  static readonly SOURCE_TARGET_POINT_FIXED = 1;
  static readonly SOURCE_TARGET_POINT_DYNAMIC = 2;
  static readonly SOURCE_TARGET_UNIT = 3;
  static readonly SOURCE_LAST_CAST_UNIT = 4;

  static readonly UNLIMITED_DAMAGE_TICKS = -1;

  protected damageCoords: Vector2D;
  protected damageStarted: boolean;

  protected damagedHeroes: Map<unit, number>;

  constructor(
    public name: string = "AOEDamage",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageSource: number = AOEDamage.SOURCE_UNIT,
    public scaleDamageToSourceHp: boolean = false,
    public useLastCastPoint: boolean = true,
    public aoe: number = 250,
    public maxDamageTicks: number = 20,
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
    this.damagedHeroes = new Map();
  }

  protected calculateDamage(input: CustomAbilityInput, source: unit): number {
    let damage = input.level * input.caster.spellPower * this.damageData.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true)
      );
    if (this.scaleDamageToSourceHp) {
      const percentHP = GetUnitState(source, UNIT_STATE_LIFE) / GetUnitState(source, UNIT_STATE_MAX_LIFE);
      damage *= percentHP * percentHP;
    }
    return damage;
  }

  setDamageSourceToTargettedPoint(input: CustomAbilityInput) {
    if (this.useLastCastPoint) {
      this.damageCoords = new Vector2D(input.castPoint.x, input.castPoint.y);
    } else {
      this.damageCoords = new Vector2D(input.targetPoint.x, input.targetPoint.y);
    }
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.damageStarted) {
      this.damagedHeroes.clear();
      this.damageStarted = true;
      if (this.damageSource == AOEDamage.SOURCE_TARGET_POINT_FIXED) {
        this.setDamageSourceToTargettedPoint(input);
      }
    }

    if (this.damageSource == AOEDamage.SOURCE_TARGET_POINT_DYNAMIC) {
      this.setDamageSourceToTargettedPoint(input);
    } else if (this.damageSource == AOEDamage.SOURCE_UNIT) {
      this.damageCoords = new Vector2D(GetUnitX(source), GetUnitY(source));
    } else if (this.damageSource == AOEDamage.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.damageCoords = new Vector2D(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.setDamageSourceToTargettedPoint(input);
      }
    } else if (this.damageSource == AOEDamage.SOURCE_LAST_CAST_UNIT) {
      if (input.castUnit) {
        this.damageCoords = new Vector2D(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
      } else {
        this.setDamageSourceToTargettedPoint(input);
      }
    }
    // TextTagHelper.showTempText(
    //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + "Damage!", 
    //   this.damageCoords.x, this.damageCoords.y, 5.0, 4.0
    // );

    const affectedGroup = UnitHelper.getNearbyValidUnits(
      this.damageCoords, 
      this.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer);
      }
    );

    const damage = this.calculateDamage(input, source);

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();

      if (
        this.maxDamageTicks != AOEDamage.UNLIMITED_DAMAGE_TICKS && 
        IsUnitType(target, UNIT_TYPE_HERO) && 
        !IsUnitType(target, UNIT_TYPE_SUMMONED)
      ) {
        const damageCount = this.damagedHeroes.get(target);
        if (damageCount) {
          if (damageCount <= this.maxDamageTicks) {
            this.damagedHeroes.set(target, damageCount + 1);
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
          }
        } else {
          this.damagedHeroes.set(target, 1);
        }
      } else {    
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
      }

      // TextTagHelper.showTempText(
      //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(damage), 
      //   GetUnitX(target), GetUnitY(target), 1.0, 0.8
      // );
    })

    DestroyGroup(affectedGroup);
    
    if (ability.isFinishedUsing(this)) {
      this.damageStarted = false;
    }
  }

  clone(): AbilityComponent {
    return new AOEDamage(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageSource, 
      this.scaleDamageToSourceHp,
      this.useLastCastPoint,
      this.aoe, 
      this.maxDamageTicks,
      this.damageData,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      damageSource: number;
      scaleDamageToSourceHp: boolean;
      useLastCastPoint: boolean;
      aoe: number; 
      maxDamageTicks: number;
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
    this.scaleDamageToSourceHp = input.scaleDamageToSourceHp;
    this.useLastCastPoint = input.useLastCastPoint;
    this.aoe = input.aoe;
    this.maxDamageTicks = input.maxDamageTicks;
    this.damageData = new DamageData().deserialize(input.damageData);
    return this;
  }
}