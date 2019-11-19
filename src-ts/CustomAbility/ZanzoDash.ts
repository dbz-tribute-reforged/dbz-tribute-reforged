import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class ZanzoDash implements CustomAbility {
  static readonly defaultName = "Zanzo Dash"; 
  static readonly defaultCD = 4; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 25; 
  static readonly defaultDuration = 25; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDistance = 40.0;
  static readonly defaultSfx = "Abilities\\Spells\\NightElf\\Blink\\BlinkTarget.mdl";
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNBlink.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBlink.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    "Zanzo Dash",
    "Does a contiguous dash to your mouse cursor" + 
    "|nCost: " + ZanzoDash.defaultCostAmount + " " + ZanzoDash.defaultCostType + 
    "|nCD: " + ZanzoDash.defaultCD,
  );

  protected currentTick: number;
  protected abilityData: CustomAbilityData | undefined;
  protected abilityTimer: timer;

  constructor(
    public readonly name: string = ZanzoDash.defaultName,
    public currentCd: number = 0,
    public maxCd: number = ZanzoDash.defaultCD, 
    public costType: CostType = ZanzoDash.defaultCostType,
    public costAmount: number = ZanzoDash.defaultCostAmount,
    public duration: number = ZanzoDash.defaultDuration,
    public updateRate: number = ZanzoDash.defaultUpdateRate,
    public distance: number = ZanzoDash.defaultDistance,
    public sfx: string = ZanzoDash.defaultSfx,
    public icon: Icon = ZanzoDash.defaultIcon,
    public tooltip: Tooltip = ZanzoDash.defaultTooltip,
  ) {
    this.tooltip = new Tooltip(
      "Zanzo Dash",
      "Does a contiguous dash to your mouse cursor" + "|nCost: " + costAmount + " " + costType + "|nCD: " + maxCd,
    );
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
  }

  public canCastAbility(data: CustomAbilityData): boolean {
    if (this.currentCd > 0) return false;
    if (this.currentTick > 0) return false;
    if (!data || !data.caster || !data.mouseData) return false;
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

  private performTickAction(): this {
    if (this.abilityData && this.abilityData.mouseData) {
      const currentCoord = new Vector2D(GetUnitX(this.abilityData.caster.unit), GetUnitY(this.abilityData.caster.unit));
      const direction = CoordMath.angleBetweenCoords(currentCoord, this.abilityData.mouseData);
      const targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, this.distance);
      
      if (this.currentTick == 0) {
        let sfxLoc = Location(currentCoord.x, currentCoord.y);
        DestroyEffect(AddSpecialEffectLoc(this.sfx, sfxLoc));
        RemoveLocation(sfxLoc);
      }

      if (
        PathingCheck.IsWalkable(targetCoord) 
        && 
        !IsTerrainPathable(targetCoord.x, targetCoord.y, PATHING_TYPE_WALKABILITY) 
      ) {
        SetUnitX(this.abilityData.caster.unit, targetCoord.x);
        SetUnitY(this.abilityData.caster.unit, targetCoord.y);
      }
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
