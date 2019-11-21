import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { TypedFrame } from "./TypedFrame";
import { TextureData } from "./TextureData";

export class TexturedFrame extends TypedFrame {
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
}