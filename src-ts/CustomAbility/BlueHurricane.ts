import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class BlueHurricane implements CustomAbility {
  static readonly defaultName = "Blue Hurricane"; 
  static readonly defaultCD = 5; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 120; 
  static readonly defaultDuration = 250; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDamageAmount = 0.06;
  static readonly defaultDamageAttribute = bj_HEROSTAT_AGI;
  static readonly defaultAttackType = ATTACK_TYPE_MELEE;
  static readonly defaultDamageType = DAMAGE_TYPE_NORMAL;
  static readonly defaultWeaponType = WEAPON_TYPE_WHOKNOWS;
  static readonly defaultAngle = 60;
  static readonly defaultDistance = 25;
  static readonly defaultAOE = 650.0;
  static readonly defaultSfx = "Abilities\\Spells\\Other\\Tornado\\TornadoElemental.mdl";
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNTornado.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNTornado.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    "Blue Hurricane",
    "The fastest attack in the universe!" + 
    "|nCost: " + BlueHurricane.defaultCostAmount + " " + BlueHurricane.defaultCostType + 
    "|nCD: " + BlueHurricane.defaultCD,
  );

  protected currentTick: number;
  protected abilityData: CustomAbilityData | undefined;
  protected abilityTimer: timer;

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
    public icon: Icon = BlueHurricane.defaultIcon,
    public tooltip: Tooltip = BlueHurricane.defaultTooltip,
  ) {
    this.tooltip = new Tooltip(
      "Blue Hurricane",
      "The fastest attack in the universe!" + "|nCost: " + costAmount + " " + costType + "|nCD: " + maxCd,
    );
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
  }

  public canCastAbility(data: CustomAbilityData): boolean {
    if (this.currentCd > 0) return false;
    if (this.currentTick > 0) return false;
    if (!data || !data.caster || !data.casterPlayer) return false;
    if (
        (this.costType == CostType.HP && GetUnitState(data.caster.unit, UNIT_STATE_LIFE) < this.costAmount)
        ||
        (this.costType == CostType.MP && GetUnitState(data.caster.unit, UNIT_STATE_MANA) < this.costAmount)
    ) {
      return false;
    }
    return true;
  }

  public takeAbilityCosts(): this {
    this.currentCd = this.maxCd;
    if (this.abilityData) {
      if (this.costType == CostType.HP) {
        SetUnitState(
          this.abilityData.caster.unit, 
          UNIT_STATE_LIFE,
          GetUnitState(this.abilityData.caster.unit, UNIT_STATE_LIFE) - this.costAmount
        );
      } else if (this.costType == CostType.MP) {
        SetUnitState(
          this.abilityData.caster.unit, 
          UNIT_STATE_MANA,
          GetUnitState(this.abilityData.caster.unit, UNIT_STATE_MANA) - this.costAmount
        );
      } else {
        // stamina
      }
    }
    return this;
  }

  private isValidTarget(unit: unit) {
    if (this.abilityData) {
      return (
        IsUnitEnemy(unit, this.abilityData.casterPlayer) == true
        &&
        !BlzIsUnitInvulnerable(unit)
      )
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
          UnitDamageTarget(
            this.abilityData.caster.unit, 
            target,
            this.damageAmount * GetHeroStatBJ(this.damageAttribute, this.abilityData.caster.unit, true),
            true,
            false,
            this.attackType,
            this.damageType,
            this.weaponType
          );
          
          const targetCurrentCoord = new Vector2D(GetUnitX(target), GetUnitY(target));
          const targetNewCoord = CoordMath.polarProjectCoords(
            targetCurrentCoord, 
            this.angle + CoordMath.angleBetweenCoords(targetCurrentCoord, currentCoord),
            this.distance
          );

          if (
            PathingCheck.IsWalkable(targetNewCoord) 
            && 
            !IsTerrainPathable(targetNewCoord.x, targetNewCoord.y, PATHING_TYPE_WALKABILITY) 
          ) {
            SetUnitX(target, targetNewCoord.x);
            SetUnitY(target, targetNewCoord.y);
          }

        }
      });
      DestroyGroup(affectedGroup);
    }
    ++this.currentTick;
    return this;
  }

  public updateCd(): this {
    if (this.currentCd <= 0) {
      this.currentTick = 0;
      PauseTimer(this.abilityTimer);
    } else {
      this.currentCd -= this.updateRate;
    }
    return this;
  }

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts();

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick < this.duration) {
        this.performTickAction();
      }
      this.updateCd();
    });
  }

}
