import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { StatusBarSimpleFrame } from "./StatusBarSimpleFrame";
import { TextureData } from "./TextureData";

export class LevelBar extends StatusBarSimpleFrame {
  static readonly frameType = "MyLevelBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(LevelBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}