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
  static readonly DEFAULT_MAX_DAMAGE_TICKS = 12;

  static readonly BEAM_CLASH_DAMAGE_MULTIPLIER = 0.60;

  protected damageCoords: Vector2D;
  protected damageStarted: boolean;

  protected damagedTargets: Map<unit, number>;

  constructor(
    public name: string = "AOEDamage",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageSource: number = AOEDamage.SOURCE_UNIT,
    public scaleDamageToSourceHp: boolean = false,
    public useLastCastPoint: boolean = true,
    public aoe: number = 250,
    public onlyDamageCapHeroes: boolean = true,
    public canDamageCaster: boolean = false,
    public maxDamageTicks: number = 20,
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
    public maxHealthDamagePercent: number = 0,
    public requireBuff: boolean = false,
    public buffId: number = 0,
  ) {
    this.damageCoords = new Vector2D(0, 0);
    this.damageStarted = false;
    this.damagedTargets = new Map();
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
    if (input.isBeamClash && input.isBeamClash == true) {
      damage *= AOEDamage.BEAM_CLASH_DAMAGE_MULTIPLIER;
    }
    return damage;
  }

  protected performDamage(input: CustomAbilityInput, target: unit, damage: number, sourceHpPercent: number) {
    if (this.maxHealthDamagePercent > 0) {
      let bonusMaxHpDamage = (
        GetUnitState(target, UNIT_STATE_MAX_LIFE) * 
        this.maxHealthDamagePercent
      );
      if (this.scaleDamageToSourceHp) {
        bonusMaxHpDamage *= sourceHpPercent;
      }
      UnitDamageTarget(
        input.caster.unit, 
        target, 
        damage + bonusMaxHpDamage,
        true,
        false,
        this.damageData.attackType,
        this.damageData.damageType,
        this.damageData.weaponType,
      );
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
      );
    }
    // TextTagHelper.showTempText(
    //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(damage), 
    //   GetUnitX(target), GetUnitY(target), 1.0, 0.8
    // );
  }

  setDamageSourceToTargettedPoint(input: CustomAbilityInput) {
    if (this.useLastCastPoint) {
      this.damageCoords.setPos(input.castPoint.x, input.castPoint.y);
    } else {
      this.damageCoords.setPos(input.targetPoint.x, input.targetPoint.y);
    }
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (
      !this.damageStarted || 
      ability.currentTick == this.startTick
    ) {
      this.damageStarted = true;
      this.damagedTargets.clear();
      if (this.damageSource == AOEDamage.SOURCE_TARGET_POINT_FIXED) {
        this.setDamageSourceToTargettedPoint(input);
      }
    }

    if (this.damageSource == AOEDamage.SOURCE_TARGET_POINT_DYNAMIC) {
      this.setDamageSourceToTargettedPoint(input);
    } else if (this.damageSource == AOEDamage.SOURCE_UNIT) {
      this.damageCoords.setPos(GetUnitX(source), GetUnitY(source));
    } else if (this.damageSource == AOEDamage.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.damageCoords.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.setDamageSourceToTargettedPoint(input);
      }
    } else if (this.damageSource == AOEDamage.SOURCE_LAST_CAST_UNIT) {
      if (input.castUnit) {
        this.damageCoords.setPos(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
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
        return (
          UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer) ||
          (
            this.canDamageCaster && 
            GetOwningPlayer(GetFilterUnit()) == input.casterPlayer &&
            IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO)
          )
        );
      }
    );

    const damage = this.calculateDamage(input, source);
    let sourceHpPercent = 0;
    if (this.scaleDamageToSourceHp) {
      sourceHpPercent = GetUnitState(source, UNIT_STATE_LIFE) / GetUnitState(source, UNIT_STATE_MAX_LIFE);
      sourceHpPercent *= sourceHpPercent;
    }

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();

      if (!this.requireBuff || GetUnitAbilityLevel(target, this.buffId) > 0) {
        if (
          this.maxDamageTicks != AOEDamage.UNLIMITED_DAMAGE_TICKS && 
          (IsUnitType(target, UNIT_TYPE_HERO) || !this.onlyDamageCapHeroes)
        ) {
          const damageCount = this.damagedTargets.get(target);
          if (damageCount) {
            if (damageCount < this.maxDamageTicks) {
              this.damagedTargets.set(target, damageCount + 1);
              this.performDamage(input, target, damage, sourceHpPercent);
            }
          } else {
            this.damagedTargets.set(target, 1);
            this.performDamage(input, target, damage, sourceHpPercent);
          }
        } else {    
          this.performDamage(input, target, damage, sourceHpPercent);
        }
      }
    })

    DestroyGroup(affectedGroup);
    
    if (ability.isFinishedUsing(this)) {
      this.cleanup();
    }
  }

  cleanup() {
    this.damageStarted = false;
    this.damagedTargets.clear();
  }

  clone(): AbilityComponent {
    return new AOEDamage(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageSource, 
      this.scaleDamageToSourceHp,
      this.useLastCastPoint,
      this.aoe, 
      this.onlyDamageCapHeroes,
      this.canDamageCaster,
      this.maxDamageTicks,
      this.damageData,
      this.maxHealthDamagePercent,
      this.requireBuff,
      this.buffId,
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
      onlyDamageCapHeroes: boolean;
      canDamageCaster: boolean;
      maxDamageTicks: number;
      damageData: {
        multiplier: number; 
        attribute: number; 
        attackType: number; 
        damageType: number; 
        weaponType: number; 
      }; 
      maxHealthDamagePercent: number;
      requireBuff: boolean;
      buffId: number;
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
    this.onlyDamageCapHeroes = input.onlyDamageCapHeroes;
    this.canDamageCaster = input.canDamageCaster;
    this.maxDamageTicks = input.maxDamageTicks;
    this.damageData = new DamageData().deserialize(input.damageData);
    this.maxHealthDamagePercent = input.maxHealthDamagePercent;
    this.requireBuff = input.requireBuff;
    this.buffId = input.buffId;
    return this;
  }
}