import { CustomAbility, CostType} from "./CustomAbility";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { DamageData } from "./DamageData";
import { SfxData } from "./SfxData";
import { HeroStatToString } from "Common/HeroStatToString";
import { Vector3D } from "Common/Vector3D";
import { UnitHelper } from "Common/UnitHelper";

export class BlueHurricane extends CustomAbility {
  static readonly defaultName = "Blue Hurricane"; 
  static readonly defaultCD = 10; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 120; 
  static readonly defaultDuration = 250; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultCastTime = 0.25;
  static readonly defaultDamageData = new DamageData(
    0.02,
    bj_HEROSTAT_AGI,
    ATTACK_TYPE_HERO,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  static readonly defaultAngle = 70;
  static readonly defaultDistance = 37;
  static readonly defaultAOE = 650.0;
  // at 90, units move tangential to the centre
  // > 90, units move away from the centre if they get close enough
  static readonly defaultClosenessAngle = 90.0 + 12.0;
  // slow down unit as they get closer to offset reduced period
  static readonly defaultClosenessDistanceMult = -0.25;
  // multiplies damage by 1 + mult when at max closeness / duration
  static readonly defaultClosenessDamageMult = 1.0;
  static readonly defaultDurationDamageMult = 1.0;
  static readonly defaultCanMultiCast = false;
  static readonly defaultWaitsForNextClick = false;
  static readonly defaultAnimation = "spell";
  static readonly defaultSfxList = [
    new SfxData(
      "Abilities\\Spells\\Other\\Tornado\\TornadoElemental.mdl", 
      75, 0, 3.0, 0, 0, 0, 
      new Vector3D(55, 155, 255),
      false
    ),
    new SfxData("Objects\Spawnmodels\Naga\NagaDeath\NagaDeath.mdl", 50, 1.5),
  ];
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNTornado.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNTornado.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    BlueHurricane.defaultName,
    "The fastest attack in the universe!" + 
    "|nDeals " + 
    BlueHurricane.defaultDamageData.multiplier + " * " + 
    HeroStatToString(BlueHurricane.defaultDamageData.attribute) +
    " per tick " + 
    "(x" + (1.0 + BlueHurricane.defaultClosenessDamageMult) + " when closer," + 
    "and another x" + (1.0 + BlueHurricane.defaultDurationDamageMult) + 
    " over the duration of the ability)" + 
    "|nCost: " + BlueHurricane.defaultCostAmount + " " + BlueHurricane.defaultCostType + 
    "|nCD: " + BlueHurricane.defaultCD,
  );

  constructor(
    name: string = BlueHurricane.defaultName,
    currentCd: number = 0,
    maxCd: number = BlueHurricane.defaultCD, 
    costType: CostType = BlueHurricane.defaultCostType,
    costAmount: number = BlueHurricane.defaultCostAmount,
    duration: number = BlueHurricane.defaultDuration,
    updateRate: number = BlueHurricane.defaultUpdateRate,
    castTime: number = BlueHurricane.defaultCastTime,
    canMultiCast: boolean = BlueHurricane.defaultCanMultiCast,
    waitsForNextClick: boolean = BlueHurricane.defaultWaitsForNextClick,
    animation: string = BlueHurricane.defaultAnimation,
    icon: Icon = BlueHurricane.defaultIcon,
    tooltip: Tooltip = BlueHurricane.defaultTooltip,
    public damageData: DamageData = BlueHurricane.defaultDamageData, 
    public angle: number = BlueHurricane.defaultAngle,
    public distance: number = BlueHurricane.defaultDistance,
    public aoe: number = BlueHurricane.defaultAOE,
    public closenessAngle: number = BlueHurricane.defaultClosenessAngle,
    public closenessDistanceMult: number = BlueHurricane.defaultClosenessDistanceMult,
    public closenessDamageMult: number = BlueHurricane.defaultClosenessDamageMult,
    public durationDamageMult: number = BlueHurricane.defaultDurationDamageMult,
    public sfxList: SfxData[] = BlueHurricane.defaultSfxList,
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
      tooltip
    );
  }

  private dealDamageToUnit(source: unit, target: unit, closenessRatio: number): this {
    const damageThisTick = 
      this.damageData.multiplier * 
      (1 + this.closenessDamageMult * closenessRatio) * 
      (1 + this.durationDamageMult * this.currentTick / this.duration) * 
      GetHeroStatBJ(this.damageData.attribute, source, true);

    UnitDamageTarget(
      source, 
      target,
      damageThisTick,
      true,
      false,
      this.damageData.attackType,
      this.damageData.damageType,
      this.damageData.weaponType
    );
    return this;
  }
  
  private performHurricane(affectedGroup: group, input: CustomAbilityInput): this {
    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      
      const currentCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      const targetCurrentCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
      const targetDistance = CoordMath.distance(currentCoord, targetCurrentCoord);

      // closenessRatio = 1 at 0 distance, 0 at max distance
      const closenessRatio = 1 - (targetDistance / Math.max(1, this.aoe));

      const projectionAngle = 
        this.angle + 
        (this.closenessAngle - this.angle) * closenessRatio + 
        CoordMath.angleBetweenCoords(targetCurrentCoord, currentCoord);
      
      const projectionDistance = 
        this.distance + 
        (this.closenessDistanceMult * this.distance) * closenessRatio;
      
      const targetNewCoord = CoordMath.polarProjectCoords(
        targetCurrentCoord, 
        projectionAngle,
        projectionDistance
      );

      PathingCheck.moveGroundUnitToCoord(target, targetNewCoord);
      this.dealDamageToUnit(input.caster.unit, target, closenessRatio);
    });
    return this;
  }

  private performTickAction(input: CustomAbilityInput): this {
    this.displaySfxListAtCoord(
      this.sfxList, 
      new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit)), 
      SfxData.SHOW_ALL_GROUPS,
      0, 
      BlzGetUnitZ(input.caster.unit),
    );

    const affectedGroup = UnitHelper.getNearbyValidUnits(
      new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit)), 
      this.aoe, 
      () => {
        return this.isBasicValidTarget(GetFilterUnit(), input.casterPlayer);
      }
    );

    this.performHurricane(affectedGroup, input);
    DestroyGroup(affectedGroup);

    ++this.currentTick;
    return this;
  }

  // assume can cast ability
  public activate(input: CustomAbilityInput): void {
    this.takeCosts(input);

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick <= this.duration) {
        this.performTickAction(input);
      }
      if (this.currentTick > this.duration) {
        this.cleanupPersistentSfx();
      }
      this.updateCd();
    });
  }

}
