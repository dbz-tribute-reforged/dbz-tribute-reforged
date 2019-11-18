import { Vector2D } from "./Vector2D";
import { FramePosition } from "./FramePosition";
import { Frame } from "./Frame";
import { TextureData } from "./TextureData";

export class TexturedFrame extends Frame {
  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    texture: TextureData
  ) {
    super(name, frameType, owner, inherits, createContext, size, position);
    this.setTexture(texture);
  }
  
  public setTexture(texture: TextureData): this {
    BlzFrameSetTexture(this.frameHandle, texture.fileName, texture.flag, texture.blend);
    return this; 
  }
}