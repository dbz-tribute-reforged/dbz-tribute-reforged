import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { StatusBarSimpleFrame } from "./StatusBarSimpleFrame";

export class FancyBar extends StatusBarSimpleFrame {
  static readonly frameType = "MyBarEx";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
  ) {
    super(FancyBar.frameType, owner, createContext, size, position, statusBar);
  }
}