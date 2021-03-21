import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { Colorizer } from "Common/Colorizer";

export class AOEHeal implements AbilityComponent, Serializable<AOEHeal> {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT_FIXED = 1;
  static readonly SOURCE_TARGET_POINT_DYNAMIC = 2;
  static readonly SOURCE_TARGET_UNIT = 3;
  static readonly SOURCE_LAST_CAST_UNIT = 4;

  static readonly UNLIMITED_HEAL_TICKS = -1;
  static readonly DEFAULT_HEAK_TICKS = 12;

  static readonly BEAM_CLASH_HEAL_MULTIPLIER = 0.5;

  static readonly UNLIMITED_HEAL_TARGETS = -1;

  protected healCoords: Vector2D;
  protected healStarted: boolean;

  protected healTargets: Map<unit, number>;

  protected affectedGroup: group;

  constructor(
    public name: string = "AOEHeal",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public healSource: number = AOEHeal.SOURCE_UNIT,
    public sourceHPHealScale: number = 0,
    public useInverseHealScale: boolean = false,
    public useLastCastPoint: boolean = true,
    public aoe: number = 250,
    public maxHealTargets: number = AOEHeal.UNLIMITED_HEAL_TARGETS,
    public onlyHealHeroes: boolean = true,
    public onlyHealCaster: boolean = false,
    public canHealCaster: boolean = false,
    public maxHealTicks: number = 20,
    public healMult: number = 0.02,
    public healAttribute: number = bj_HEROSTAT_AGI,
    public maxHealthHealPercent: number = 0,
    public requireBuff: boolean = false,
    public buffId: number = 0,
  ) {
    this.healCoords = new Vector2D(0, 0);
    this.healStarted = false;
    this.healTargets = new Map();
    this.affectedGroup = CreateGroup();
  }

  protected scaleHealToSourceHP(heal: number, sourceHPPercent: number): number {
    let percentHP = sourceHPPercent;
    if (this.useInverseHealScale) {
      percentHP = 1 - percentHP;
    }
    return heal * (1 + this.sourceHPHealScale * percentHP);
  }

  protected calculateHeal(input: CustomAbilityInput, source: unit, sourceHPPercent: number): number {
    let heal = input.level * input.caster.spellPower * this.healMult * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(this.healAttribute, input.caster.unit, true)
      );
    if (this.sourceHPHealScale != 0) {
      heal = this.scaleHealToSourceHP(heal, sourceHPPercent);
    }
    if (input.isBeamClash && input.isBeamClash == true) {
      heal *= AOEHeal.BEAM_CLASH_HEAL_MULTIPLIER;
    }
    if (input.damageMult) {
      heal *= input.damageMult;
    }
    return heal;
  }

  protected performHeal(input: CustomAbilityInput, target: unit, heal: number, sourceHPPercent: number) {
    let bonusMaxHPHeal = 0;
    if (this.maxHealthHealPercent > 0) {
      bonusMaxHPHeal = (
        GetUnitState(target, UNIT_STATE_MAX_LIFE) * 
        this.maxHealthHealPercent
      );
      if (this.sourceHPHealScale != 0) {
        bonusMaxHPHeal = this.scaleHealToSourceHP(bonusMaxHPHeal, sourceHPPercent);
      }
    }
    const healAmount = heal + bonusMaxHPHeal;
    if (healAmount > 0) {
      SetUnitState(target, UNIT_STATE_LIFE, GetUnitState(target, UNIT_STATE_LIFE) + healAmount);
      // TextTagHelper.showTempText(
      //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(heal) + " --- " + R2S(bonusMaxHPHeal), 
      //   GetUnitX(target), GetUnitY(target), 6.0, 1.0
      // );
    }
    // if (input.damageMult) {
    // TextTagHelper.showTempText(
    //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + R2S(heal) + " --- " + R2S(bonusMaxHPHeal), 
    //   GetUnitX(target), GetUnitY(target), 6.0, 1.0
    // );
    // }
  }

  setHealSourceToTargettedPoint(input: CustomAbilityInput) {
    if (this.useLastCastPoint) {
      this.healCoords.setPos(input.castPoint.x, input.castPoint.y);
    } else {
      this.healCoords.setPos(input.targetPoint.x, input.targetPoint.y);
    }
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (
      !this.healStarted || 
      ability.currentTick == this.startTick
    ) {
      this.healStarted = true;
      this.healTargets.clear();
      if (this.healSource == AOEHeal.SOURCE_TARGET_POINT_FIXED) {
        this.setHealSourceToTargettedPoint(input);
      }
    }

    if (this.healSource == AOEHeal.SOURCE_TARGET_POINT_DYNAMIC) {
      this.setHealSourceToTargettedPoint(input);
    } else if (this.healSource == AOEHeal.SOURCE_UNIT) {
      this.healCoords.setPos(GetUnitX(source), GetUnitY(source));
    } else if (this.healSource == AOEHeal.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.healCoords.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.setHealSourceToTargettedPoint(input);
      }
    } else if (this.healSource == AOEHeal.SOURCE_LAST_CAST_UNIT) {
      if (input.castUnit) {
        this.healCoords.setPos(GetUnitX(input.castUnit), GetUnitY(input.castUnit));
      } else {
        this.setHealSourceToTargettedPoint(input);
      }
    }
    // TextTagHelper.showTempText(
    //   Colorizer.getPlayerColorText(GetPlayerId(input.casterPlayer)) + "Heal!", 
    //   this.healCoords.x, this.healCoords.y, 5.0, 4.0
    // );


    if (this.onlyHealCaster) {
      GroupClear(this.affectedGroup);
      GroupAddUnit(this.affectedGroup, input.caster.unit);
    } else {
      GroupEnumUnitsInRange(
        this.affectedGroup, 
        this.healCoords.x, 
        this.healCoords.y, 
        this.aoe,
        null
      );
    }


    const sourceHPPercent = GetUnitState(source, UNIT_STATE_LIFE) / GetUnitState(source, UNIT_STATE_MAX_LIFE);
    const heal = this.calculateHeal(input, source, sourceHPPercent);

    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (
        IsUnitAlly(target, input.casterPlayer) &&
        (
          GetOwningPlayer(target) != input.casterPlayer || 
          this.canHealCaster
        )
      ) {

        // can heal more targets and buff is in place
        if (
          (
            this.maxHealTargets == AOEHeal.UNLIMITED_HEAL_TARGETS ||
            this.healTargets.size < this.maxHealTargets ||
            this.healTargets.get(target) != undefined
          )
          &&
          (
            !this.requireBuff || 
            GetUnitAbilityLevel(target, this.buffId) > 0
          )
        ) {
          if (
            this.maxHealTicks != AOEHeal.UNLIMITED_HEAL_TICKS && 
            (IsUnitType(target, UNIT_TYPE_HERO) || !this.onlyHealHeroes)
          ) {
            const healCount = this.healTargets.get(target);
            if (healCount) {
              if (healCount < this.maxHealTicks) {
                this.healTargets.set(target, healCount + 1);
                this.performHeal(input, target, heal, sourceHPPercent);
              }
            } else {
              this.healTargets.set(target, 1);
              this.performHeal(input, target, heal, sourceHPPercent);
            }
          } else {    
            this.performHeal(input, target, heal, sourceHPPercent);
          }
        }
      }
    })

    GroupClear(this.affectedGroup);
    
    if (ability.isFinishedUsing(this)) {
      this.reset();
    }
  }

  reset() {
    this.healStarted = false;
    this.healTargets.clear();
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.affectedGroup);
  }

  clone(): AbilityComponent {
    return new AOEHeal(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.healSource,
      this.sourceHPHealScale,
      this.useInverseHealScale,
      this.useLastCastPoint,
      this.aoe, 
      this.maxHealTargets,
      this.onlyHealHeroes,
      this.onlyHealCaster,
      this.canHealCaster,
      this.maxHealTicks,
      this.healMult,
      this.healAttribute,
      this.maxHealthHealPercent,
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
      healSource: number;
      sourceHPHealScale: number;
      useInverseHealScale: boolean;
      useLastCastPoint: boolean;
      aoe: number; 
      maxHealTargets: number;
      onlyHealHeroes: boolean;
      onlyHealCaster: boolean;
      canHealCaster: boolean;
      maxHealTicks: number;
      healMult: number;
      healAttribute: number;
      maxHealthHealPercent: number;
      requireBuff: boolean;
      buffId: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.healSource = input.healSource;
    this.sourceHPHealScale = input.sourceHPHealScale;
    this.useInverseHealScale = input.useInverseHealScale;
    this.useLastCastPoint = input.useLastCastPoint;
    this.aoe = input.aoe;
    this.maxHealTargets = input.maxHealTargets;
    this.onlyHealHeroes = input.onlyHealHeroes;
    this.onlyHealCaster = input.onlyHealCaster;
    this.canHealCaster = input.canHealCaster;
    this.maxHealTicks = input.maxHealTicks;
    this.healMult = input.healMult;
    this.healAttribute = input.healAttribute;
    this.maxHealthHealPercent = input.maxHealthHealPercent;
    this.requireBuff = input.requireBuff;
    this.buffId = input.buffId;
    return this;
  }
}