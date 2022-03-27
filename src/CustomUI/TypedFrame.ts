import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';
import { Frame } from './Frame';

export abstract class TypedFrame extends Frame {
  public readonly frameHandle: framehandle;

  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
  ) {
    super(name, frameType, owner, inherits, createContext, size, position);
    this.frameHandle = BlzCreateFrameByType(frameType, name, owner, inherits, createContext);
    this.setup();
  }
}