import { FramePosition } from "./FramePosition";
import { Vector2D } from "Common/Vector2D";
import { Frame } from "./Frame";

// implements frame stuff
export class SimpleFrame extends Frame {
  public readonly frameHandle: framehandle;

  constructor(
    frameType: string,
    owner: framehandle, 
    createContext: number,
    size: Vector2D,
    position: FramePosition
  ) {
    super(frameType, frameType, owner, "", createContext, size, position);
    this.frameHandle = BlzCreateSimpleFrame(frameType, owner, createContext);
    this.setup();
  }
}