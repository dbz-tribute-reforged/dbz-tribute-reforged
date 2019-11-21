import { CustomAbility, CostType} from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { CustomAbilityHelper } from "./CustomAbilityHelper";

export class BlueHurricane implements CustomAbility {
  static readonly defaultName = "Blue Hurricane"; 
  static readonly defaultCD = 10; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 120; 
  static readonly defaultDuration = 250; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDamageAmount = 0.02;
  static readonly defaultDamageAttribute = bj_HEROSTAT_AGI;
  static readonly defaultAttackType = ATTACK_TYPE_HERO;
  static readonly defaultDamageType = DAMAGE_TYPE_NORMAL;
  static readonly defaultWeaponType = WEAPON_TYPE_WHOKNOWS;
  static readonly defaultAngle = 70;
  static readonly defaultDistance = 37;
  static readonly defaultAOE = 650.0;
  static readonly defaultSfx = "Abilities\\Spells\\Other\\Tornado\\TornadoElemental.mdl";
  static readonly defaultSfx2 = "Objects\Spawnmodels\Naga\NagaDeath\NagaDeath.mdl";
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNTornado.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNTornado.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    "Blue Hurricane",
    "The fastest attack in the universe!" + 
    "|nDeals " + BlueHurricane.defaultDamageAmount + " * AGI per tick " + 
    "(x2 when closer, and another x2 over the duration of the ability)" + 
    "|nCost: " + BlueHurricane.defaultCostAmount + " " + BlueHurricane.defaultCostType + 
    "|nCD: " + BlueHurricane.defaultCD,
  );

  public currentTick: number;
  public abilityTimer: timer;
  protected abilityData: CustomAbilityData | undefined;

  constructor(
    public readonly name: string = BlueHurricane.defaultName,
    public currentCd: number = 0,
    public maxCd: number = BlueHurricane.defaultCD, 
    public costType: CostType = BlueHurricane.defaultCostType,
    public costAmount: number = BlueHurricane.defaultCostAmount,
    public duration: number = BlueHurricane.defaultDuration,
    public updateRate: number = BlueHurricane.defaultUpdateRate,
    public damageAmount: number = BlueHurricane.defaultDamageAmount,
    public damageAttribute: number = BlueHurricane.defaultDamageAttribute,
    public attackType: attacktype = BlueHurricane.defaultAttackType,
    public damageType: damagetype = BlueHurricane.defaultDamageType,
    public weaponType: weapontype = BlueHurricane.defaultWeaponType,
    public angle: number = BlueHurricane.defaultAngle,
    public distance: number = BlueHurricane.defaultDistance,
    public aoe: number = BlueHurricane.defaultAOE,
    public sfx: string = BlueHurricane.defaultSfx,
    public sfx2: string = BlueHurricane.defaultSfx2,
    public icon: Icon = BlueHurricane.defaultIcon,
    public tooltip: Tooltip = BlueHurricane.defaultTooltip,
  ) {
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
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

  private performTickAction(): this {
    if (this.abilityData) {
      const currentCoord = new Vector2D(GetUnitX(this.abilityData.caster.unit), GetUnitY(this.abilityData.caster.unit));
      
      if (this.currentTick % 75 == 0) {
        let sfxLoc = Location(currentCoord.x, currentCoord.y);
        let tornado = AddSpecialEffectLoc(this.sfx, sfxLoc);
        BlzSetSpecialEffectScale(tornado, 3.0);
        BlzSetSpecialEffectColor(tornado, 15, 55, 255);
        DestroyEffect(tornado);
        RemoveLocation(sfxLoc);
      }

      if (this.currentTick % 50 == 0) {
        let sfxLoc = Location(currentCoord.x, currentCoord.y);
        let splash = AddSpecialEffectLoc(this.sfx2, sfxLoc);
        BlzSetSpecialEffectScale(splash, 3.0);
        BlzSetSpecialEffectColor(splash, 15, 55, 255);
        DestroyEffect(splash);
        RemoveLocation(sfxLoc);
      }
      
      const affectedGroup = CreateGroup();
      GroupEnumUnitsInRange(
        affectedGroup, 
        currentCoord.x, 
        currentCoord.y, 
        this.aoe, 
        Condition(() => {
          return this.isValidTarget(GetFilterUnit());
        }),
      );

      ForGroup(affectedGroup, () => {
        const target = GetEnumUnit();
        if (this.abilityData) {
          
          const targetCurrentCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
          const targetDistance = CoordMath.distance(currentCoord, targetCurrentCoord);
          // closenessRatio = 1 at 0 distance, 0 at max distance
          const closenessRatio = 1 - (targetDistance / Math.max(1, this.aoe));
          // the closer you are, the less you move towards the centre
          const projectionAngle = 
            this.angle + 
            (105 - this.angle - 3) * closenessRatio + 
            CoordMath.angleBetweenCoords(targetCurrentCoord, currentCoord);
          const projectionDistance = 
            this.distance + 
            (-0.25 * this.distance) * closenessRatio;
          

          const targetNewCoord = CoordMath.polarProjectCoords(
            targetCurrentCoord, 
            projectionAngle,
            projectionDistance
          );

          if (
            PathingCheck.IsWalkable(targetNewCoord) 
            && 
            !IsTerrainPathable(targetNewCoord.x, targetNewCoord.y, PATHING_TYPE_WALKABILITY) 
          ) {
            SetUnitX(target, targetNewCoord.x);
            SetUnitY(target, targetNewCoord.y);
          }
          
          const damageThisTick = 
            this.damageAmount * 
            (1 + 1 * closenessRatio) * 
            (1 + 1 * this.currentTick / this.duration) * 
            GetHeroStatBJ(this.damageAttribute, this.abilityData.caster.unit, true);

          UnitDamageTarget(
            this.abilityData.caster.unit, 
            target,
            damageThisTick,
            true,
            false,
            this.attackType,
            this.damageType,
            this.weaponType
          );

        }
      });
      DestroyGroup(affectedGroup);
    }
    ++this.currentTick;
    return this;
  }

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts(data);

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick < this.duration) {
        this.performTickAction();
      }
      this.updateCd();
    });
  }

}
