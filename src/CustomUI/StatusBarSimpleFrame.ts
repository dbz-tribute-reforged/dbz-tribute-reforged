import { TexturedSimpleFrame } from "./TexturedSimpleFrame";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { TextureData } from "./TextureData";

export class StatusBarSimpleFrame extends TexturedSimpleFrame {

  constructor(
    frameType: string, 
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(frameType, owner, createContext, size, position);
    this.setValue(statusBar.value);
  }
}