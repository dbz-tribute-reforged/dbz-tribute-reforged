import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { TexturedFrame } from "./TexturedFrame";
import { TextureData } from "./TextureData";

// implements value, minmaxvalue
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
    this.setMinMaxValue().setValue(statusBar.value).setTexture(texture);
  }

  setValue(value: number): this {
    BlzFrameSetValue(this.frameHandle, value);
    return this;
  }

  setMinMaxValue(): this  {
    BlzFrameSetMinMaxValue(this.frameHandle, this.statusBar.minValue, this.statusBar.maxValue);
    return this;
  }

}