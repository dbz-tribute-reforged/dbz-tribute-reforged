import { Button } from "./Button";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { TextFrameData } from "./TextFrameData";
import { StatusBarSimpleFrame } from "./StatusBarSimpleFrame";
import { ToolTipFrame } from "./ToolTipFrame";
import { StatusBarData } from "./StatusBarData";
import { Icon } from "Common/Icon";

export class AbilityButton extends Button {
  static readonly frameType = "GLUEBUTTON";
  static readonly inherits = "IconButtonTemplate";
  static readonly abilityIconFrameType = "MyAbilityIconBar";
  static readonly abilityIconFrameDisabled = "MyAbilityIconBarBackground";
  static readonly abilityIconFrameText = "MyAbilityIconBarText";
  static readonly tooltipSize = new Vector2D(0.207, 0.05);
	

  public abilityIconFrame: StatusBarSimpleFrame;
  public tooltip: ToolTipFrame;
  
  // a button that contains a statusbar background
  // and a tooltip (uses up tooltip context space)
  constructor(
    name: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    createContext: number = 0,
    size: Vector2D = new Vector2D(0.04, 0.04), 
    position: FramePosition,
    icon: Icon,
    tooltipTitle: string,
    tooltipValue: string,
  ) {
    super(
      name, 
      AbilityButton.frameType, 
      owner, 
      AbilityButton.inherits, 
      createContext, 
      size, 
      position, 
      new TextFrameData("", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
    );

    this.abilityIconFrame = new StatusBarSimpleFrame(
      AbilityButton.abilityIconFrameType, 
      this.frameHandle, 
      createContext, 
      size,
      position, 
      new StatusBarData(100, 0, 100),
    );
    
    this.tooltip = new ToolTipFrame(
      name + "ToolTip",
      this.frameHandle,
      createContext,
      AbilityButton.tooltipSize,
      new FramePosition(
        FRAMEPOINT_BOTTOMRIGHT, 
        BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
        FRAMEPOINT_BOTTOMRIGHT, 
        0, 
        0.1639
      ),
      tooltipTitle, 
      tooltipValue,
    );

    this.
      setAbilityIcon(icon).
      setAbilityIconToTarget(this.frameHandle).
      setTooltip(this.tooltip.frameHandle);
  }

  public setAbilityIcon(icon: Icon): this {
    return this.setAbilityIconEnabled(icon).setAbilityIconDisabled(icon);
  }

  public setAbilityIconEnabled(icon: Icon): this {
    BlzFrameSetTexture(this.abilityIconFrame.frameHandle, icon.enabled, 0, true);
    return this;
  }

  public setAbilityIconDisabled(icon: Icon): this {
    BlzFrameSetTexture(
      BlzGetFrameByName(AbilityButton.abilityIconFrameDisabled, this.createContext), 
      icon.disabled, 
      0, 
      true
    );
    return this;
  }

  public setAbilityIconToTarget(target: framehandle): this {
    BlzFrameClearAllPoints(this.abilityIconFrame.frameHandle);
    BlzFrameSetAllPoints(this.abilityIconFrame.frameHandle, target);
    return this;
  }

  public setTooltip(tooltip: framehandle): this {
    BlzFrameSetTooltip(this.frameHandle, tooltip);
    return this;
  }
}