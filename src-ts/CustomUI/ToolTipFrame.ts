import { UntypedFrame } from "./UntypedFrame";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { ToolTipOrganizer } from "Common/ToolTipOrganizer";

export class ToolTipFrame extends UntypedFrame {
  static readonly frameType = "MyToolTipText";
  static readonly titleName = "MyToolTipTextTitle";
  static readonly valueName = "MyToolTipTextValue";

  constructor(
    name: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    public title: string,
    public value: string, 
    public priority?: number,
  ) {
    super(name, ToolTipFrame.frameType, owner, createContext, size, position, priority);
    ToolTipOrganizer.resizeToolTipHeightByValue(this.frameHandle, value);
    this.setTitleText(title).setValueText(value);
  }

  public setTitleText(title: string): this {
    BlzFrameSetText(BlzGetFrameByName(ToolTipFrame.titleName, this.createContext), title);
    return this;
  }

  public setValueText(value: string): this {
    BlzFrameSetText(BlzGetFrameByName(ToolTipFrame.valueName, this.createContext), value);
    return this;
  }
}