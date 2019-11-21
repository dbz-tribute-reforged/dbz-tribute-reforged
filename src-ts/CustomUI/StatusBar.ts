import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { TexturedFrame } from "./TexturedFrame";
import { TextureData } from "./TextureData";

export class StatusBar extends TexturedFrame {

  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    texture: TextureData, 
    public statusBar: StatusBarData,
  ) {
    super(name, frameType, owner, inherits, createContext, size, position, texture);
    this.setMinMaxValue(statusBar).setValue(statusBar.value);
  }

}