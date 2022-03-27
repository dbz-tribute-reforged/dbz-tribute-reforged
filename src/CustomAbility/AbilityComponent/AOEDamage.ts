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

  static readonly SCALE_HP_SOURCE_UNIT = 0;
  static readonly SCALE_HP_CASTER_UNIT = 1;

  static readonly UNLIMITED_DAMAGE_TICKS = -1;
  static readonly DEFAULT_MAX_DAMAGE_TICKS = 8;

  static readonly BEAM_CLASH_DAMAGE_MULTIPLIER = 0.85;

  static readonly INT_DAMAGE_MULT_MIN = 0.9;
  static readonly INT_DAMAGE_MULT_MAX = 1.25;

  protected damageCoords: Vector2D;
  protected damageStarted: boolean;

  protected damagedTargets: Map<unit, number>;
  protected damagedGroup: group;

  constructor(
    public name: string = "AOEDamage",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageSource: number = AOEDamage.SOURCE_UNIT,
    public scaleSourceHPType: number = AOEDamage.SCALE_HP_SOURCE_UNIT,
    public sourceHPDamageScale: number = -1,
    public useInverseDamageScale: boolean = false,
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
    public maxManaLossPercent: number = 0,
    public applyDamageOverTime: boolean = false,
    public requireBuff: boolean = false,
    public buffId: number = 0,
  ) {
    this.damageCoords = new Vector2D(0, 0);
    this.damageStarted = false;
    this.damagedTargets = new Map();
    this.damagedGroup = CreateGroup();
  }

  static getIntDamageMult(unit: unit): number {
    const hInt = GetHeroInt(unit, true);
    return Math.max(AOEDamage.INT_DAMAGE_MULT_MIN, Math.min(AOEDamage.INT_DAMAGE_MULT_MAX, 
      1.05 * hInt / (
        0.333 * (
          GetHeroStr(unit, true) + 
          GetHeroAgi(unit, true) + 
          hInt
        )
      )
    ));
  }

  static calculateDamageRaw(
    level: number,
    spellPower: number,
    damageDataMultiplier: number,
    damageMult: number,
    caster: unit,
    stat: number // bj_HEROSTAT_INT
  ): number {
    return (
      damageMult 
      * AOEDamage.getIntDamageMult(caster) 
      * level * spellPower * damageDataMultiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(stat, caster, true)
      )
    );
  }

  static dealDamageRaw(
    level: number,
    spellPower: number,
    damageDataMultiplier: number,
    damageMult: number,
    caster: unit,
    stat: number,
    target: widget
  ): boolean {
    return UnitDamageTarget(
      caster, target, 
      AOEDamage.calculateDamageRaw(level, spellPower, damageDataMultiplier, damageMult, caster, stat),
      true, false,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL, 
      WEAPON_TYPE_WHOKNOWS
    );
  }

  static genericDealDamageToGroup(
    targetGroup: group,
    caster: unit,
    spellLevel: number,
    spellPower: number,
    damageDataMultiplier: number,
    damageMult: number,
    damageStat: number,
  ) {
    const player = GetOwningPlayer(caster);
    ForGroup(targetGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, player)) {
        const dmg = AOEDamage.calculateDamageRaw(
          spellLevel,
          spellPower,
          damageDataMultiplier,
          damageMult,
          caster,
          damageStat
        );
        UnitDamageTarget(
          caster, 
          target,
          dmg,
          true, false,
          ATTACK_TYPE_HERO,
          DAMAGE_TYPE_NORMAL,
          WEAPON_TYPE_WHOKNOWS
        );
      }
    });

  }

  static genericDealAOEDamage(
    targetGroup: group,
    caster: unit,
    x: number,
    y: number,
    aoe: number,
    spellLevel: number,
    spellPower: number,
    damageDataMultiplier: number,
    damageMult: number,
    damageStat: number,
  ) {
    GroupClear(targetGroup);
    GroupEnumUnitsInRange(
      targetGroup,
      x,
      y,
      aoe,
      null
    );
    AOEDamage.genericDealDamageToGroup(
      targetGroup,
      caster,
      spellLevel,
      spellPower,
      damageDataMultiplier,
      damageMult,
      damageStat,
    );
  }

  protected scaleDamageToSourceHP(damage: number, sourceHPPercent: number): number {
    let percentHP = sourceHPPercent;
    if (this.useInverseDamageScale) {
      percentHP = 1 - percentHP;
    }
    return damage * (1 + this.sourceHPDamageScale * percentHP);
  }

  protected calculateDamage(input: CustomAbilityInput, source: unit, sourceHPPercent: number): number {
    let damage = AOEDamage.getIntDamageMult(input.caster.unit) * input.level * input.caster.spellPower * this.damageData.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true)
      );
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "level " + input.level);
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "spellPower " + input.caster.spellPower);
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "mult " + this.damageData.multiplier);
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "stat " + GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true));
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "damage " + damage);
    if (this.sourceHPDamageScale != 0) {
      damage = this.scaleDamageToSourceHP(damage, sourceHPPercent);
    }
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "damage post scale " + damage);
    // DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, "source hp percent " + sourceHPPercent);
    if (input.isBeamClash && input.isBeamClash == true) {
      damage *= AOEDamage.BEAM_CLASH_DAMAGE_MULTIPLIER;
    }
    
    if (input.damageMult) {
      damage *= input.damageMult;
    }
    return damage;
  }

  protected dealDamageToUnit(input: CustomAbilityInput, target: unit, damage: number, sourceHPPercent: number) {
    if (
      UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer) ||
      (
        this.canDamageCaster && 
        GetOwningPlayer(target) == input.casterPlayer &&
        IsUnitType(target, UNIT_TYPE_HERO)
      )
    ) {
      if (!this.requireBuff || GetUnitAbilityLevel(target, this.buffId) > 0) {
        if (
          this.maxDamageTicks != AOEDamage.UNLIMITED_DAMAGE_TICKS && 
          (IsUnitType(target, UNIT_TYPE_HERO) || !this.onlyDamageCapHeroes)
        ) {
          const damageCount = this.damagedTargets.get(target);
          if (damageCount) {
            if (damageCount < this.maxDamageTicks) {
              this.damagedTargets.set(target, damageCount + 1);
              this.performDamage(input, target, damage, sourceHPPercent);
            }
          } else {
            this.damagedTargets.set(target, 1);
            this.performDamage(input, target, damage, sourceHPPercent);
          }
        } else {    
          this.performDamage(input, target, damage, sourceHPPercent);
        }
      }
    }
  }

  protected performDamage(input: CustomAbilityInput, target: unit, damage: number, sourceHPPercent: number) {
    let bonusMaxHpDamage = 0;
    if (this.maxHealthDamagePercent > 0) {
      bonusMaxHpDamage = (
        GetUnitState(target, UNIT_STATE_MAX_LIFE) * 
        this.maxHealthDamagePercent
      );
      if (this.sourceHPDamageScale != 0) {
        bonusMaxHpDamage = this.scaleDamageToSourceHP(bonusMaxHpDamage, sourceHPPercent);
      }
    }
    if (this.maxManaLossPercent > 0) {
      SetUnitState(target, UNIT_STATE_MANA, 
        Math.max(0, 
          GetUnitState(target, UNIT_STATE_MANA) - 
          GetUnitState(target, UNIT_STATE_MAX_MANA) * this.maxManaLossPercent
        )
      );
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
    // if (input.damageMult) {
    //   TextTagHelper.showTempText(
    //     Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(damage) + " --- " + R2S(input.damageMult), 
    //     GetUnitX(target), GetUnitY(target), 1.0, 0.8
    //   );
    // }
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

    GroupClear(this.damagedGroup);
    GroupEnumUnitsInRange(
      this.damagedGroup, 
      this.damageCoords.x, 
      this.damageCoords.y, 
      this.aoe,
      null
    );

    let sourceHPPercent = 0;
    if (this.scaleSourceHPType == AOEDamage.SCALE_HP_SOURCE_UNIT) {
      sourceHPPercent = GetUnitState(source, UNIT_STATE_LIFE) / GetUnitState(source, UNIT_STATE_MAX_LIFE);
    } else if (this.scaleSourceHPType == AOEDamage.SCALE_HP_CASTER_UNIT) {
      sourceHPPercent = (
        GetUnitState(input.caster.unit, UNIT_STATE_LIFE) 
        / GetUnitState(input.caster.unit, UNIT_STATE_MAX_LIFE)
      );
    }
    const damage = this.calculateDamage(input, source, sourceHPPercent);

    if (this.applyDamageOverTime) {
      for (const target of this.damagedTargets.keys()) {
        this.dealDamageToUnit(input, target, damage, sourceHPPercent);
      }
    }

    ForGroup(this.damagedGroup, () => {
      const target = GetEnumUnit();
      this.dealDamageToUnit(input, target, damage, sourceHPPercent);
    });

    GroupClear(this.damagedGroup);
    
    if (ability.isFinishedUsing(this)) {
      this.reset();
    }
  }

  reset() {
    this.damageStarted = false;
    this.damagedTargets.clear();
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.damagedGroup);
  }

  clone(): AbilityComponent {
    return new AOEDamage(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageSource, 
      this.scaleSourceHPType,
      this.sourceHPDamageScale,
      this.useInverseDamageScale,
      this.useLastCastPoint,
      this.aoe, 
      this.onlyDamageCapHeroes,
      this.canDamageCaster,
      this.maxDamageTicks,
      this.damageData,
      this.maxHealthDamagePercent,
      this.maxManaLossPercent,
      this.applyDamageOverTime,
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
      scaleSourceHPType: number;
      sourceHPDamageScale: number;
      useInverseDamageScale: boolean;
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
      maxManaLossPercent: number;
      applyDamageOverTime: boolean;
      requireBuff: boolean;
      buffId: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.damageSource = input.damageSource;
    this.scaleSourceHPType = input.scaleSourceHPType;
    this.sourceHPDamageScale = input.sourceHPDamageScale;
    this.useInverseDamageScale = input.useInverseDamageScale;
    this.useLastCastPoint = input.useLastCastPoint;
    this.aoe = input.aoe;
    this.onlyDamageCapHeroes = input.onlyDamageCapHeroes;
    this.canDamageCaster = input.canDamageCaster;
    this.maxDamageTicks = input.maxDamageTicks;
    this.damageData = new DamageData().deserialize(input.damageData);
    this.maxHealthDamagePercent = input.maxHealthDamagePercent;
    this.maxManaLossPercent = input.maxManaLossPercent;
    this.applyDamageOverTime = input.applyDamageOverTime;
    this.requireBuff = input.requireBuff;
    this.buffId = input.buffId;
    return this;
  }
}