import { CustomAbility, CostType } from "./CustomAbility";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";

export class ZanzoDash extends CustomAbility {
  static readonly defaultName = "Zanzo Dash"; 
  static readonly defaultCD = 4; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 25; 
  static readonly defaultDuration = 25; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDistance = 40.0;
  static readonly defaultSfxList = [
    new SfxData("WindCirclefaster.mdl", 0, 0, 1.0),
  ];
  private static readonly defaultAttachedSfx = [
    new SfxData(
      "DustWindFasterExact.mdl",
      0, 0, 1.0, 0, 0, 0,
      new Vector3D(
        255, 255, 255  
      ),
      false, "origin",
    ),
  ];
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

  constructor(
    name: string = ZanzoDash.defaultName,
    currentCd: number = 0,
    maxCd: number = ZanzoDash.defaultCD, 
    costType: CostType = ZanzoDash.defaultCostType,
    costAmount: number = ZanzoDash.defaultCostAmount,
    duration: number = ZanzoDash.defaultDuration,
    updateRate: number = ZanzoDash.defaultUpdateRate,
    icon: Icon = ZanzoDash.defaultIcon,
    tooltip: Tooltip = ZanzoDash.defaultTooltip,
    protected distance: number = ZanzoDash.defaultDistance,
    protected sfxList: SfxData[] = ZanzoDash.defaultSfxList,
    protected attachedSfxList: SfxData[] = ZanzoDash.defaultAttachedSfx,
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
  }

  private moveCaster(input: CustomAbilityInput): this {
    const currentCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    const direction = CoordMath.angleBetweenCoords(currentCoord, input.targetPoint);
    const targetCoord = CoordMath.polarProjectCoords(currentCoord, direction, this.distance);
    PathingCheck.moveGroundUnitToCoord(input.caster.unit, targetCoord);
    return this;
  }

  private performTickAction(input: CustomAbilityInput): this {
    // BJDebugMsg("helo1");
    this.displaySfxListAtCoord(
      this.sfxList, 
      new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit)), 
      SfxData.SHOW_ALL_GROUPS,
      0, 
      0
    );
    this.displaySfxListOnUnit(
      this.attachedSfxList,
      input.caster.unit,
      SfxData.SHOW_ALL_GROUPS,
      0,
      0,
    )
    this.moveCaster(input);
    ++this.currentTick;
    return this;
  }

  // assume can cast ability
  public activate(input: CustomAbilityInput): void {
    this.takeCosts(input);
    IssueImmediateOrder(input.caster.unit, "stop");

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
