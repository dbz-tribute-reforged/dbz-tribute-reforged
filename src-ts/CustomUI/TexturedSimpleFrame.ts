import { SimpleFrame } from "./SimpleFrame";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { TextureData } from "./TextureData";

export class TexturedSimpleFrame extends SimpleFrame {

  constructor(
    frameType: string, 
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    texture?: TextureData
  ) {
    super(frameType, owner, createContext, size, position);
    texture?this.setTexture(texture):texture;
  }
}