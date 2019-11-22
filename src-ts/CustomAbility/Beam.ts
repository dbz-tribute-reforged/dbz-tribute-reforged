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

export class Beam extends CustomAbility {
  private static readonly defaultName = "Beam Base"; 
  private static readonly defaultCD = 6; 
  private static readonly defaultCostType = CostType.MP; 
  private static readonly defaultCostAmount = 25; 
  private static readonly defaultDuration = 160; 
  private static readonly defaultUpdateRate = 0.03;
  private static readonly defaultDamageData = new DamageData(
    0.4,
    bj_HEROSTAT_INT,
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
  private static readonly beamStartHeight = 0;
  private static readonly beamEndHeight = 0;
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
    "|nDeals " + 
    Beam.defaultDamageData.multiplier + " * " + 
    HeroStatToString(Beam.defaultDamageData.attribute) +
    " per Damage Tick" + 
    "|nCost: " + Beam.defaultCostAmount + " " + Beam.defaultCostType + 
    "|nCD: " + Beam.defaultCD,
  );

  protected angle: number;
  protected previousBeamHp: number;
  protected persistentSfx: effect[];

  constructor(
    name: string = Beam.defaultName,
    currentCd: number = 0,
    maxCd: number = Beam.defaultCD, 
    costType: CostType = Beam.defaultCostType,
    costAmount: number = Beam.defaultCostAmount,
    duration: number = Beam.defaultDuration,
    updateRate: number = Beam.defaultUpdateRate,
    icon: Icon = Beam.defaultIcon,
    tooltip: Tooltip = Beam.defaultTooltip,
    public damageData: DamageData = Beam.defaultDamageData,
    public beamHpMult: number = Beam.defaultBeamHpMult,
    public speed: number = Beam.defaultSpeed,
    public aoe: number = Beam.defaultAOE,
    public clashingDelayTicks: number = Beam.defaultClashingDelayTicks,
    public maxDelayTicks: number = Beam.defaultMaxDelayTicks,
    public durationIncPerDelay: number = Beam.defaultDurationIncPerDelay,
    public isTracking : boolean = Beam.defaultIsTracking,
    public beamUnitType: number = Beam.defaultBeamUnitType,
    public animation: string = Beam.defaultAnimation,
    public sfxList: SfxData[] = Beam.defaultSfx,
  ) {
    super(
      name, 
      currentCd, 
      maxCd, 
      costType,
      costAmount,
      duration,
      updateRate,
      icon,
      tooltip,
    );
    this.angle = 0;
    this.previousBeamHp = 0;
    this.persistentSfx = [];
  }

  public calculateBeamMaxHp(damage: number): number {
    return Math.max(150, Math.floor(damage * this.beamHpMult) * 50);
  }

  protected dealDamageToGroup(source: unit, affectedGroup: group, damage: number): this {
    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      UnitDamageTarget(
        source, 
        target, 
        damage,
        true,
        false,
        this.damageData.attackType,
        this.damageData.damageType,
        this.damageData.weaponType,
      )
    })
    return this;
  }

  protected checkForBeamClash(beamUnit: unit): this {
    if (this.clashingDelayTicks > 0) {
      const currentBeamHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
      if (currentBeamHp < this.previousBeamHp) {
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

  protected calculateDamage(source: unit): number {
    return (
      this.damageData.multiplier * 
      GetHeroStatBJ(this.damageData.attribute, source, true)
    );
  }

  protected dealAOEDamage(input: CustomAbilityInput, beamUnit: unit) {
    const beamCoords = new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit));
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      beamCoords, 
      this.aoe,
      () => {
        return this.isBasicValidTarget(GetFilterUnit(), input.casterPlayer);
      }
    );
    
    const damage = this.calculateDamage(input.caster.unit);
    this.dealDamageToGroup(input.caster.unit, affectedGroup, damage);

    DestroyGroup(affectedGroup);
  }

  private performTickAction(input: CustomAbilityInput, beamUnit: unit): this {
    this.moveBeamUnit(input, beamUnit);
    this.dealAOEDamage(input, beamUnit);
    this.displaySfxListAtCoord(
      this.sfxList, 
      new Vector2D(GetUnitX(beamUnit), GetUnitY(beamUnit)), 
      this.angle, 
      BlzGetUnitZ(beamUnit),
    );
    return this;
  }

  protected setupBeamUnit(input: CustomAbilityInput): unit {
    let beamUnit = CreateUnit(
      input.casterPlayer, 
      this.beamUnitType, 
      GetUnitX(input.caster.unit), 
      GetUnitY(input.caster.unit), 
      0
    );
    
    // hp MUST be a multiple of 50??? or something
    // else it causes a crash / uncatched exception
    // and prevents the rest of the beam code from firing
    let maxHp = GetUnitState(beamUnit, UNIT_STATE_LIFE);
    maxHp = this.calculateBeamMaxHp(this.calculateDamage(input.caster.unit));
    BlzSetUnitMaxHP(beamUnit, maxHp);
    // SetUnitState(this.beamUnit, UNIT_STATE_LIFE, maxHp);
    SetUnitLifePercentBJ(beamUnit, 100);
    this.previousBeamHp = maxHp;
    BlzSetUnitName(beamUnit, this.name);

    SetUnitInvulnerable(beamUnit, true);
    ShowUnit(beamUnit, false);

    return beamUnit;
  }

  protected preactivationEffects(input: CustomAbilityInput, beamUnit: unit) {
    const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    this.angle = CoordMath.angleBetweenCoords(casterCoord, input.targetPoint);

    SetUnitInvulnerable(beamUnit, false);
    ShowUnit(beamUnit, true);

    SetUnitX(beamUnit, casterCoord.x);
    SetUnitY(beamUnit, casterCoord.y);
    SetUnitFacing(beamUnit, this.angle);

    if (!this.isTracking) {
      PauseUnit(beamUnit, true);
    } else {
      // possible selection bug again?
      SelectUnitAddForPlayer(beamUnit, input.casterPlayer);
    }

    SetUnitAnimation(input.caster.unit, this.animation);
    this.delayTicks = 0;
  }

  // assume can cast ability
  public activate(input: CustomAbilityInput): void {
    this.takeCosts(input);

    // dont go unless player right clicks one more time
    // er maybe expand for also clicking a unit
    let isReady = false;
    const readyTrigger = CreateTrigger();
    TriggerRegisterPlayerUnitEvent(
      readyTrigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit && !UnitHelper.isUnitStunned(input.caster.unit);
      })
    );

    TriggerAddAction(readyTrigger, () => {
      const x = GetOrderPointX();
      const y = GetOrderPointY();
      input.targetPoint = new Vector2D(x, y);
      isReady = true;
      DestroyTrigger(readyTrigger);
    })

    let beamUnit = this.setupBeamUnit(input);

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (isReady) {
        if (this.currentTick == 0) {
          this.preactivationEffects(input, beamUnit);
        }
        if (this.currentTick < this.duration) {
          if (beamUnit && IsUnitType(beamUnit, UNIT_TYPE_DEAD) == true) {
            this.currentTick = this.duration;
          }
          this.performTickAction(input, beamUnit);
          ++this.currentTick;
        } 
        if (this.currentTick >= this.duration) {
          RemoveUnit(beamUnit);
          this.cleanupPersistentSfx();
        }
        this.updateCd();
      }
    });
  }
}
