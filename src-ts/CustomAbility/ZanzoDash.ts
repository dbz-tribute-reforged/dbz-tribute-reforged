import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { CustomAbilityHelper } from "./CustomAbilityHelper";

export class ZanzoDash implements CustomAbility {
  static readonly defaultName = "Zanzo Dash"; 
  static readonly defaultCD = 4; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 25; 
  static readonly defaultDuration = 25; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDistance = 40.0;
  // static readonly defaultSfx = "Abilities\\Spells\\NightElf\\Blink\\BlinkTarget.mdl";
  static readonly defaultSfx = "WindCirclefaster.mdl";
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNBlink.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBlink.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    ZanzoDash.defaultName,
    "Dashes towards your last right click." + 
    "|nCost: " + ZanzoDash.defaultCostAmount + " " + ZanzoDash.defaultCostType + 
    "|nCD: " + ZanzoDash.defaultCD,
  );

  public currentTick: number;
  public abilityTimer: timer;
  protected abilityData: CustomAbilityData | undefined;

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

  private performTickAction(): this {
    if (this.abilityData && this.abilityData.targetPoint) {
      const currentCoord = new Vector2D(GetUnitX(this.abilityData.caster.unit), GetUnitY(this.abilityData.caster.unit));
      const direction = CoordMath.angleBetweenCoords(currentCoord, this.abilityData.targetPoint);
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

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts(data);
    IssueImmediateOrder(data.caster.unit, "stop");

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick < this.duration) {
        this.performTickAction();
      }
      this.updateCd();
    });
  }

}
