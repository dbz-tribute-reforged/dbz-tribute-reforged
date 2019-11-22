import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityHelper } from "./CustomAbilityHelper";
import { CoordMath } from "Common/CoordMath";
import { Vector2D } from "Common/Vector2D";
import { PathingCheck } from "Common/PathingCheck";
import { HeroStatToString } from "Common/HeroStatToString";
import { DamageTypeData } from "./DamageTypeData";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";

export class Beam implements CustomAbility {
  private static readonly defaultName = "Beam Base"; 
  private static readonly defaultCD = 6; 
  private static readonly defaultCostType = CostType.MP; 
  private static readonly defaultCostAmount = 25; 
  private static readonly defaultDuration = 160; 
  private static readonly defaultUpdateRate = 0.03;
  private static readonly defaultDamageAmount = 0.4;
  private static readonly defaultDamageAttribute = bj_HEROSTAT_INT;
  private static readonly defaultDamageTypeData = new DamageTypeData(
    ATTACK_TYPE_HERO, 
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  )
  private static readonly defaultBonusFinishDamage = 0.4;
  private static readonly defaultBonusFinishAOE = 0.4;
  private static readonly defaultBeamHpMult = 0.4;
  private static readonly defaultSpeed = 16.0;
  private static readonly defaultAOE = 250;
  private static readonly defaultClashingDelayTicks = 3;
  private static readonly defaultMaxDelayTicks = 10;
  private static readonly defaultDurationIncPerDelay = 1;
  private static readonly defaultCastTime = 8;
  private static readonly defaultKnockbackSpeed = 5;
  private static readonly defaultKnockbackAOE = 1;
  private static readonly defaultIsTracking = false;
  private static readonly defaultBeamUnitType = FourCC('hpea');
  private static readonly defaultAnimation = "spell";
  private static readonly defaultSfx = [
    new SfxData(
      "Abilities\\Weapons\\FrostWyrmMissile\\FrostWyrmMissile.mdl",
      5, 
      1.5,
      0,
      0, 
      0,
      new Vector3D(
        255, 255, 255  
      ),
      false,
    ),
  ];
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
  public delayTicks: number;
  public abilityTimer: timer;
  protected abilityData: CustomAbilityData | undefined;
  protected angle: number;
  protected beamUnit: unit | undefined;
  protected previousBeamHp: number;
  protected persistentSfx: effect[];

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
    public damageTypeData: DamageTypeData = Beam.defaultDamageTypeData,
    public beamHpMult: number = Beam.defaultBeamHpMult,
    public speed: number = Beam.defaultSpeed,
    public aoe: number = Beam.defaultAOE,
    public clashingDelayTicks: number = Beam.defaultClashingDelayTicks,
    public maxDelayTicks: number = Beam.defaultMaxDelayTicks,
    public durationIncPerDelay: number = Beam.defaultDurationIncPerDelay,
    public isTracking : boolean = Beam.defaultIsTracking,
    public beamUnitType: number = Beam.defaultBeamUnitType,
    public animation: string = Beam.defaultAnimation,
    public sfx: SfxData[] = Beam.defaultSfx,
    public icon: Icon = Beam.defaultIcon,
    public tooltip: Tooltip = Beam.defaultTooltip,
  ) {
    this.currentTick = 0;
    this.delayTicks = 0;
    this.abilityTimer = CreateTimer();
    this.angle = 0;
    this.previousBeamHp = 0;
    this.persistentSfx = [];
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

  public calculateBeamMaxHp(damage: number): number {
    return CustomAbilityHelper.calculateBeamMaxHp(this, damage);
  }

  public isValidTarget(unit: unit) {
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
      this.damageTypeData.attackType,
      this.damageTypeData.damageType,
      this.damageTypeData.weaponType,
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
      if (this.isTracking) {
        this.angle = GetUnitFacing(beamUnit);
      }
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

  // TODO: vary height of the sfx over their lifetime...
  protected displaySfx(data: CustomAbilityData, beamUnit: unit) {
    for (const currentSfx of this.sfx) {
      if (this.currentTick % currentSfx.repeatInterval == 0) {
        const effect = AddSpecialEffect(currentSfx.model, GetUnitX(beamUnit), GetUnitY(beamUnit));
        BlzSetSpecialEffectScale(effect, currentSfx.scale);
        if (currentSfx.startHeight > 0) {
          BlzSetSpecialEffectZ(effect, BlzGetUnitZ(data.caster.unit) + currentSfx.startHeight);
        }
        BlzSetSpecialEffectYaw(effect, this.angle + currentSfx.directionalYawExtra);
        if (currentSfx.persistent) {
          this.persistentSfx.push(effect);
        } else {
          DestroyEffect(effect);
        }
      }
    }
  }

  private performTickAction(): this {
    if (this.abilityData && this.abilityData.targetPoint && this.beamUnit) {
      this.moveBeamUnit(this.abilityData, this.beamUnit);
      this.dealAOEDamage(this.abilityData, this.beamUnit);
      this.displaySfx(this.abilityData, this.beamUnit);
    }
    return this;
  }

  protected preactivationEffects(data: CustomAbilityData) {
    SetUnitAnimation(data.caster.unit, this.animation);
    const casterCoord = new Vector2D(GetUnitX(data.caster.unit), GetUnitY(data.caster.unit));
    this.angle = CoordMath.angleBetweenCoords(casterCoord, data.targetPoint);

    this.beamUnit = CreateUnit(data.casterPlayer, this.beamUnitType, casterCoord.x, casterCoord.y, this.angle);
    
    // hp MUST be a multiple of 50??? or something
    // else it causes a crash / uncatched exception
    // and prevents the rest of the beam code from firing
    let maxHp = GetUnitState(this.beamUnit, UNIT_STATE_LIFE);
    maxHp = this.calculateBeamMaxHp(this.calculateDamage(data));
    BlzSetUnitMaxHP(this.beamUnit, maxHp);
    // SetUnitState(this.beamUnit, UNIT_STATE_LIFE, maxHp);
    SetUnitLifePercentBJ(this.beamUnit, 100);
    this.previousBeamHp = maxHp;
    BlzSetUnitName(this.beamUnit, this.name);
    
    if (!this.isTracking) {
      PauseUnit(this.beamUnit, true);
    } else {
      // possible selection bug again?
      SelectUnitAddForPlayer(this.beamUnit, data.casterPlayer);
    }

    this.delayTicks = 0;
  }

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts(data);

    // dont go unless player right clicks one more time
    // er maybe expand for also clicking a unit
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
        if (this.currentTick == 0) {
          this.preactivationEffects(data);
        }
        if (this.currentTick < this.duration) {
          if (this.beamUnit && IsUnitType(this.beamUnit, UNIT_TYPE_DEAD) == true) {
            this.currentTick = this.duration;
          }
          this.performTickAction();
          ++this.currentTick;
        } 
        if (this.currentTick >= this.duration) {
          if (this.beamUnit) {
            RemoveUnit(this.beamUnit);
          }
          for (const currentSfx of this.persistentSfx) {
            DestroyEffect(currentSfx);
          }
          this.persistentSfx = [];
        }
        this.updateCd();
      }
    });
  }
}
