import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CustomAbility, CostType } from "./CustomAbility";
import { CoordMath } from "Common/CoordMath";
import { Vector2D } from "Common/Vector2D";
import { PathingCheck } from "Common/PathingCheck";
import { HeroStatToString } from "Common/HeroStatToString";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";
import { DamageData } from "./DamageData";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { HeightVariation, VariationTypes } from "Common/HeightVariation";
import { KnockbackData } from "./KnockbackData";

export class Beam extends CustomAbility {

  private static readonly defaultName = "Beam Base"; 
  private static readonly defaultCD = 6; 
  private static readonly defaultCostType = CostType.MP; 
  private static readonly defaultCostAmount = 25; 
  private static readonly defaultDuration = 160; 
  private static readonly defaultUpdateRate = 0.03;
  private static readonly defaultCastTime = 0.25;
  private static readonly defaultDamageData = new DamageData(
    0.25,
    bj_HEROSTAT_INT,
    ATTACK_TYPE_HERO, 
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  private static readonly defaultBeamHpMult = 0.5;
  private static readonly defaultSpeed = 16.0;
  private static readonly defaultAOE = 250;
  private static readonly defaultClashingDelayTicks = 1;
  private static readonly defaultMaxDelayTicks = 8;
  private static readonly defaultDurationIncPerDelay = 15;
  private static readonly defaultFinishDamageData = new DamageData(
    5,
    bj_HEROSTAT_INT,
    ATTACK_TYPE_HERO, 
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  private static readonly defaultFinishAOE = 500;
  private static readonly defaultKnockbackData = new KnockbackData (
    16, 0, 250
  );
  private static readonly defaultBeamHeightVariationType = VariationTypes.LINEAR_VARIATION;
  private static readonly defaultBeamHeightStart = 300;
  private static readonly defaultBeamHeightEnd = 0;
  private static readonly defaultIsTracking = false;
  private static readonly defaultIsFixedAngle = true;
  private static readonly defaultCanClashWithHero = true;
  private static readonly defaultCanMultiCast = false;
  private static readonly defaultWaitsForNextClick = true;
  private static readonly defaultBeamUnitType = FourCC('hpea');
  private static readonly defaultAnimation = "spell";
  private static readonly defaultSfx = [
    new SfxData(
      "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl",
      8, 0, 1.2, 0, 0, 0,
      new Vector3D(
        255, 255, 255  
      ),
      false,
    ),
    new SfxData(
      "Abilities\\Spells\\Undead\\ReplenishMana\\ReplenishManaCasterOverhead.mdl",
      Beam.defaultDuration, 1, 2, 0, 0, 0,
      new Vector3D(
        255, 255, 255  
      ),
      false,
    ),
  ];
  private static readonly defaultAttachedSfx = [
    new SfxData(
      "Abilities\\Weapons\\FrostWyrmMissile\\FrostWyrmMissile.mdl",
      5, 0, 1.5, 0, 0, 0,
      new Vector3D(
        255, 255, 255  
      ),
      false,"origin",
    ),
  ];
  private static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNBreathOfFrost.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBreathOfFrost.blp"
  );
  private static readonly defaultTooltip = new Tooltip(
    Beam.defaultName,
    "Fires a beam" + 
    "|nDeals " + 
    Beam.defaultDamageData.multiplier + " * " + 
    HeroStatToString(Beam.defaultDamageData.attribute) +
    " per Damage Tick" + 
    "|nCost: " + Beam.defaultCostAmount + " " + Beam.defaultCostType + 
    "|nCD: " + Beam.defaultCD,
  );

  protected angle: number;
  protected previousBeamHp: number;
  protected affectedEnemyHeroes: number;
  protected persistentSfx: effect[];

  constructor(
    name: string = Beam.defaultName,
    currentCd: number = 0,
    maxCd: number = Beam.defaultCD, 
    costType: CostType = Beam.defaultCostType,
    costAmount: number = Beam.defaultCostAmount,
    duration: number = Beam.defaultDuration,
    updateRate: number = Beam.defaultUpdateRate,
    castTime: number = Beam.defaultCastTime,
    canMultiCast: boolean = Beam.defaultCanMultiCast,
    waitsForNextClick: boolean = Beam.defaultWaitsForNextClick,
    animation: string = Beam.defaultAnimation,
    icon: Icon = Beam.defaultIcon,
    tooltip: Tooltip = Beam.defaultTooltip,
    public damageData: DamageData = Beam.defaultDamageData,
    public beamHpMult: number = Beam.defaultBeamHpMult,
    public speed: number = Beam.defaultSpeed,
    public aoe: number = Beam.defaultAOE,
    public clashingDelayTicks: number = Beam.defaultClashingDelayTicks,
    public maxDelayTicks: number = Beam.defaultMaxDelayTicks,
    public durationIncPerDelay: number = Beam.defaultDurationIncPerDelay,
    public finishDamageData: DamageData = Beam.defaultFinishDamageData,
    public finishAoe: number = Beam.defaultFinishAOE,
    public knockbackData: KnockbackData = Beam.defaultKnockbackData,
    public beamHeightVariationType: number = Beam.defaultBeamHeightVariationType,
    public beamHeightStart: number = Beam.defaultBeamHeightStart,
    public beamHeightEnd: number = Beam.defaultBeamHeightEnd,
    public isTracking : boolean = Beam.defaultIsTracking,
    public isFixedAngle : boolean = Beam.defaultIsFixedAngle,
    public canClashWithHero : boolean = Beam.defaultCanClashWithHero,
    public beamUnitType: number = Beam.defaultBeamUnitType,
    public sfxList: SfxData[] = Beam.defaultSfx,
    public attachedSfxList: SfxData[] = Beam.defaultAttachedSfx,
  ) {
    super(
      name, 
      currentCd, 
      maxCd, 
      costType,
      costAmount,
      duration,
      updateRate,
      castTime,
      canMultiCast,
      waitsForNextClick,
      animation,
      icon,
      tooltip,
    );
    this.angle = 0;
    this.previousBeamHp = 0;
    this.affectedEnemyHeroes = 0;
    this.persistentSfx = [];
  }

  public calculateBeamMaxHp(damage: number): number {
    return Math.max(150, Math.floor(damage * this.beamHpMult) * 50);
  }

  protected checkForBeamClash(beamUnit: unit): this {
    if (this.clashingDelayTicks > 0) {
      const currentBeamHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
      if (
        currentBeamHp < this.previousBeamHp || 
        (this.canClashWithHero && this.affectedEnemyHeroes > 0)
      ) {
        this.delayTicks = Math.min(this.maxDelayTicks, (this.delayTicks + this.clashingDelayTicks));
      }
      this.previousBeamHp = currentBeamHp;
    }
    return this;
  }

  protected moveBeamUnit(input: CustomAbilityInput, beamUnit: unit): this {
    this.checkForBeamClash(beamUnit);
    
    if (this.delayTicks <= 0) {
      const currentCoord = new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit));
      if (!this.isFixedAngle) {
        this.angle = GetUnitFacing(beamUnit);
      }
      const targetCoord = CoordMath.polarProjectCoords(currentCoord, this.angle, this.speed);

     PathingCheck.moveFlyingUnitToCoord(beamUnit, targetCoord);
    } else {
      --this.delayTicks;
      // when delaying movement, if duration inc per delay > 0
      // there is a chance that the current tick is reduced by 1
      // i.e. total duration of beam is increased by 1
      // e.g. a durationIncPerDelay of 1, would on average 
      // increase the beam duration by 1 per 100 ticks
      // thus duractionIncPerDelay X produces a +X% incerease in total duration
      if (this.durationIncPerDelay > Math.random()*99 + 0.0001) {
        this.currentTick = Math.max(2, this.currentTick - 1);
      }
    }
    return this;
  }

  protected calculateDamage(source: unit, damageData: DamageData): number {
    return (
      damageData.multiplier * 
      GetHeroStatBJ(damageData.attribute, source, true)
    );
  }

  protected dealDamageToGroup(source: unit, affectedGroup: group, damageData: DamageData): this {
    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      UnitDamageTarget(
        source, 
        target, 
        this.calculateDamage(source, damageData),
        true,
        false,
        damageData.attackType,
        damageData.damageType,
        damageData.weaponType,
      )
    })
    return this;
  }

  protected dealAOEDamage(
    input: CustomAbilityInput, 
    beamUnit: unit, 
    aoe: number, 
    damageData: DamageData) 
  {
    const beamCoords = new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit));
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      beamCoords, 
      aoe,
      () => {
        return this.isBasicValidTarget(GetFilterUnit(), input.casterPlayer);
      }
    );
    
    this.dealDamageToGroup(input.caster.unit, affectedGroup, damageData);
    this.affectedEnemyHeroes = UnitHelper.countEnemyHeroes(affectedGroup, input.casterPlayer);

    DestroyGroup(affectedGroup);
  }

  protected displaySfxList(input: CustomAbilityInput, beamUnit: unit): this {
    this.displaySfxListAtCoord(
      this.sfxList, 
      new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit)), 
      SfxData.SHOW_ALL_GROUPS,
      this.angle, 
      BlzGetUnitZ(beamUnit),
    );
    return this;
  }

  protected displayAttachedSfxList(input: CustomAbilityInput, beamUnit: unit): this {
    this.displaySfxListOnUnit(
      this.attachedSfxList,
      beamUnit,
      SfxData.SHOW_ALL_GROUPS,
      this.angle,
      BlzGetUnitZ(beamUnit),
    )
    return this;
  }

  protected dealDamage(input: CustomAbilityInput, beamUnit: unit): this {
    this.dealAOEDamage(
      input, 
      beamUnit, 
      this.aoe, 
      this.damageData,
    );
    if (this.finishAoe > 0 && this.currentTick == this.duration) {
      this.dealAOEDamage(
        input, 
        beamUnit, 
        this.finishAoe, 
        this.finishDamageData,
      );
    }
    return this;
  }

  protected performKnockback(input: CustomAbilityInput, beamUnit: unit) {
    if (this.knockbackData.aoe > 0) {
      const beamCoords = new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit));
      const affectedGroup = UnitHelper.getNearbyValidUnits(
        beamCoords, 
        this.knockbackData.aoe,
        () => {
          return this.isBasicValidTarget(GetFilterUnit(), input.casterPlayer);
        }
      );

      ForGroup(affectedGroup, () => {
        const target = GetEnumUnit();
        const targetCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
        const knockbackAngle = this.knockbackData.angle + CoordMath.angleBetweenCoords(beamCoords, targetCoord);
        const newTargetCoord = CoordMath.polarProjectCoords(targetCoord, knockbackAngle, this.knockbackData.speed);
        PathingCheck.moveGroundUnitToCoord(target, newTargetCoord);
      });
      return this;
    }
  }

  private performTickAction(input: CustomAbilityInput, beamUnit: unit): this {
    this.moveBeamUnit(input, beamUnit);
    this.dealDamage(input, beamUnit);
    this.performKnockback(input, beamUnit);
    this.displaySfxList(input, beamUnit);
    this.displayAttachedSfxList(input, beamUnit);
    return this;
  }

  protected setupBeamUnit(input: CustomAbilityInput): unit {
    const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    this.angle = CoordMath.angleBetweenCoords(casterCoord, input.targetPoint);

    let beamUnit = CreateUnit(
      input.casterPlayer, 
      this.beamUnitType, 
      GetUnitX(input.caster.unit), 
      GetUnitY(input.caster.unit), 
      this.angle,
    );
    
    UnitHelper.giveUnitFlying(beamUnit);
    
    SetUnitFlyHeight(beamUnit, BlzGetUnitZ(input.caster.unit) + this.beamHeightStart, 0);

    SetUnitFlyHeight(
      beamUnit, 
      this.beamHeightEnd, 
      Math.abs((this.beamHeightEnd - this.beamHeightStart) / (this.duration * this.updateRate)),
    );
    
    // hp MUST be a multiple of 50??? or something
    // else it causes a crash / uncatched exception
    // and prevents the rest of the beam code from firing
    let maxHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
    maxHp = this.calculateBeamMaxHp(this.calculateDamage(input.caster.unit, this.damageData));
    BlzSetUnitMaxHP(beamUnit, maxHp);
    // SetUnitState(this.beamUnit, UNIT_STATE_LIFE, maxHp);
    SetUnitLifePercentBJ(beamUnit, 100);
    this.previousBeamHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
    BlzSetUnitName(beamUnit, this.name);

    if (!this.isTracking) {
      PauseUnit(beamUnit, true);
    } else {
      // possible selection bug again?
      SelectUnitAddForPlayer(beamUnit, input.casterPlayer);
    }

    return beamUnit;
  }

  protected preactivationEffects(input: CustomAbilityInput, beamUnit: unit) {
    this.delayTicks = 0;
  }

  // assume can cast ability
  public activate(input: CustomAbilityInput): void {
    this.takeCosts(input);

    let beamUnit: unit = this.setupBeamUnit(input);
    this.preactivationEffects(input, beamUnit);

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      // assume beam unit is created after this point
      if (this.currentTick <= this.duration) {
        if (beamUnit && IsUnitType(beamUnit, UNIT_TYPE_DEAD) == true) {
          this.currentTick = this.duration;
        }
        this.performTickAction(input, beamUnit);
        ++this.currentTick;
      } 
      if (this.currentTick > this.duration) {
        RemoveUnit(beamUnit);
        this.cleanupPersistentSfx();
      }
      this.updateCd();
    });
  }
}
