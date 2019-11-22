import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityHelper } from "./CustomAbilityHelper";
import { CoordMath } from "Common/CoordMath";
import { Vector2D } from "Common/Vector2D";
import { Unit } from "w3ts";
import { PathingCheck } from "Common/PathingCheck";
import { HeroStatToString } from "Common/HeroStatToString";

export class Beam implements CustomAbility {
  private static readonly defaultName = "Beam Base"; 
  private static readonly defaultCD = 6; 
  private static readonly defaultCostType = CostType.MP; 
  private static readonly defaultCostAmount = 25; 
  private static readonly defaultDuration = 160; 
  private static readonly defaultUpdateRate = 0.03;
  private static readonly defaultDamageAmount = 0.4;
  private static readonly defaultDamageAttribute = bj_HEROSTAT_INT;
  private static readonly defaultAttackType = ATTACK_TYPE_HERO;
  private static readonly defaultDamageType = DAMAGE_TYPE_NORMAL;
  private static readonly defaultWeaponType = WEAPON_TYPE_WHOKNOWS;
  private static readonly defaultBeamHpMult = 3.0;
  private static readonly defaultSpeed = 16.0;
  private static readonly defaultAOE = 250;
  private static readonly defaultClashingDelayTicks = 3;
  private static readonly defaultMaxDelayTicks = 10;
  private static readonly defaultDurationIncPerDelay = 1;
  private static readonly defaultCastTime = 8;
  private static readonly defaultKnockbackSpeed = 5;
  private static readonly defaultKnockbackAOE = 1;
  private static readonly defaultAnimation = "spell";
  // repalce with SfxData
  // so to have multiple sfx able to render easily
  private static readonly defaultSfx = "Abilities\\Weapons\\FrostWyrmMissile\\FrostWyrmMissile.mdl";
  private static readonly defaultSfxInterval = 5;
  private static readonly defaultSfxScale = 1.5;
  private static readonly defaultSfxHeight = 75;
  private static readonly defaultBeamUnitType = FourCC('hpea');
  private static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNBreathOfFrost.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBreathOfFrost.blp"
  );
  private static readonly defaultTooltip = new Tooltip(
    Beam.defaultName,
    "Fires a beam" + 
    "|nDeals " + Beam.defaultDamageAmount + " * " + HeroStatToString(Beam.defaultDamageAttribute) + " per Damage Tick"+ 
    "|nCost: " + Beam.defaultCostAmount + " " + Beam.defaultCostType + 
    "|nCD: " + Beam.defaultCD,
  );

  public currentTick: number;
  public abilityTimer: timer;
  protected abilityData: CustomAbilityData | undefined;
  protected angle: number;
  protected beamUnit: unit | undefined;
  protected previousBeamHp: number;
  protected delayTicks: number;

  constructor(
    public readonly name: string = Beam.defaultName,
    public currentCd: number = 0,
    public maxCd: number = Beam.defaultCD, 
    public costType: CostType = Beam.defaultCostType,
    public costAmount: number = Beam.defaultCostAmount,
    public duration: number = Beam.defaultDuration,
    public updateRate: number = Beam.defaultUpdateRate,
    public damageAmount: number = Beam.defaultDamageAmount,
    public damageAttribute: number = Beam.defaultDamageAttribute,
    public attackType: attacktype = Beam.defaultAttackType,
    public damageType: damagetype = Beam.defaultDamageType,
    public weaponType: weapontype = Beam.defaultWeaponType,
    public beamHpMult: number = Beam.defaultBeamHpMult,
    public speed: number = Beam.defaultSpeed,
    public aoe: number = Beam.defaultAOE,
    public clashingDelayTicks: number = Beam.defaultClashingDelayTicks,
    public maxDelayTicks: number = Beam.defaultMaxDelayTicks,
    public durationIncPerDelay: number = Beam.defaultDurationIncPerDelay,
    public animation: string = Beam.defaultAnimation,
    public sfx: string = Beam.defaultSfx,
    public sfxInterval: number = Beam.defaultSfxInterval,
    public sfxScale: number = Beam.defaultSfxScale,
    public sfxHeight: number = Beam.defaultSfxHeight,
    public beamUnitType: number = Beam.defaultBeamUnitType,
    public icon: Icon = Beam.defaultIcon,
    public tooltip: Tooltip = Beam.defaultTooltip,
  ) {
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
    this.angle = 0;
    this.previousBeamHp = 0;
    this.delayTicks = 0;
  }
  
  public canCastAbility(data: CustomAbilityData): boolean {
    return CustomAbilityHelper.canCast(this, data);
  }

  public takeAbilityCosts(data: CustomAbilityData): this {
    CustomAbilityHelper.takeCosts(this, data);
    return this;
  }

  public updateCd(): this {
    CustomAbilityHelper.updateCD(this);
    return this;
  }

  private isValidTarget(unit: unit) {
    if (this.abilityData) {
      return CustomAbilityHelper.basicIsValidTarget(unit, this.abilityData);
    }
    return false;
  }

  protected dealDamageToTarget(data: CustomAbilityData, target: unit, damage: number): this {
    UnitDamageTarget(
      data.caster.unit, 
      target, 
      damage,
      true,
      false,
      this.attackType,
      this.damageType,
      this.weaponType,
    )
    return this;
  }

  protected checkForBeamClash(data: CustomAbilityData, beamUnit: unit): this {
    if (this.clashingDelayTicks > 0) {
      const currentBeamHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
      if (currentBeamHp < this.previousBeamHp) {
        this.delayTicks = Math.min(this.maxDelayTicks, (this.delayTicks + this.clashingDelayTicks));
      }
      this.previousBeamHp = currentBeamHp;
    }
    return this;
  }

  protected moveBeamUnit(data: CustomAbilityData, beamUnit: unit): this {
    this.checkForBeamClash(data, beamUnit);
    
    if (this.delayTicks <= 0) {
      const currentCoord = new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit));
      const targetCoord = CoordMath.polarProjectCoords(currentCoord, this.angle, this.speed);
      
      if (PathingCheck.IsWalkable(targetCoord)) {
        SetUnitX(beamUnit, targetCoord.x);
        SetUnitY(beamUnit, targetCoord.y);
      }
    } else {
      --this.delayTicks;
      this.currentTick = Math.max(2, this.currentTick + this.durationIncPerDelay);
    }
    return this;
  }

  protected calculateDamage(data: CustomAbilityData): number {
    return (
      this.damageAmount * 
      GetHeroStatBJ(this.damageAttribute, data.caster.unit, true)
    );
  }

  protected dealAOEDamage(data: CustomAbilityData, beamUnit: unit) {
    const affectedGroup = CreateGroup();
    GroupEnumUnitsInRange(
      affectedGroup, 
      GetUnitX(beamUnit), 
      GetUnitY(beamUnit), 
      this.aoe, 
      Condition(() => {
        return this.isValidTarget(GetFilterUnit());
      }),
    );
    
    const damage = this.calculateDamage(data,);

    ForGroup(affectedGroup, () => {
      this.dealDamageToTarget(data, GetEnumUnit(), damage);
    })

    DestroyGroup(affectedGroup);
  }

  // maybe use arrays to help show multiple at a time
  protected displaySfx(data: CustomAbilityData, beamUnit: unit) {
    if (this.currentTick % this.sfxInterval == 0) {
      const firstSfx = AddSpecialEffect(this.sfx, GetUnitX(beamUnit), GetUnitY(beamUnit));
      BlzSetSpecialEffectScale(firstSfx, this.sfxScale);
      if (this.sfxHeight > 0) {
        BlzSetSpecialEffectZ(firstSfx, BlzGetUnitZ(data.caster.unit) + this.sfxHeight);
      }
      BlzSetSpecialEffectYaw(firstSfx, this.angle);
      DestroyEffect(firstSfx);
    }
  }

  private performTickAction(): this {
    if (this.abilityData && this.abilityData.targetPoint && this.beamUnit) {
      if (this.previousBeamHp > 0) {
        this.moveBeamUnit(this.abilityData, this.beamUnit);
        this.dealAOEDamage(this.abilityData, this.beamUnit);
        this.displaySfx(this.abilityData, this.beamUnit);
      } else {
        this.currentTick = this.duration;
      }
    }
    ++this.currentTick;
    return this;
  }

  protected preactivationEffects(data: CustomAbilityData) {
    SetUnitAnimation(data.caster.unit, this.animation);
    const casterCoord = new Vector2D(GetUnitX(data.caster.unit), GetUnitY(data.caster.unit));
    this.angle = CoordMath.angleBetweenCoords(casterCoord, data.targetPoint);

    this.beamUnit = CreateUnit(data.casterPlayer, this.beamUnitType, casterCoord.x, casterCoord.y, this.angle);
    const maxHp = Math.max(150, Math.floor(this.calculateDamage(data) * this.beamHpMult * 0.1) * 50);
    // const maxHp = GetUnitState(this.beamUnit, UNIT_STATE_LIFE);
    BlzSetUnitMaxHP(this.beamUnit, maxHp);
    // SetUnitState(this.beamUnit, UNIT_STATE_LIFE, maxHp);
    SetUnitLifePercentBJ(this.beamUnit, 100);
    this.previousBeamHp = maxHp;
    // BlzSetUnitName(this.beamUnit, this.name);
    // PauseUnit(this.beamUnit, true);

    this.delayTicks = 0;
  }

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts(data);

    // dont go unless player right clicks one more time
    // er maybe expand for also clicking a unit
    this.currentTick = 1;
    let isReady = false;
    const readyTrigger = CreateTrigger();
    TriggerRegisterPlayerUnitEvent(
      readyTrigger, 
      data.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, 
      Condition(()=>{
        return GetFilterUnit() == data.caster.unit && !CustomAbilityHelper.isUnitStunned(data.caster.unit);
      })
    );

    TriggerAddAction(readyTrigger, () => {
      const x = GetOrderPointX();
      const y = GetOrderPointY();
      this.abilityData = new CustomAbilityData(
        data.caster,
        data.casterPlayer,
        data.level,
        new Vector2D(x, y), 
        data.mouseData,
        data.target?data.target:undefined,
      );
      isReady = true;
      DestroyTrigger(readyTrigger);
    })
    
    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (isReady) {
        if (this.currentTick == 1) {
          this.preactivationEffects(data);
        }
        if (this.currentTick < this.duration) {
          this.performTickAction();
        } else {
          if (this.beamUnit) {
            RemoveUnit(this.beamUnit);
          }
          this.delayTicks = 0;
        }
        this.updateCd();
      }
    });
  }
}
