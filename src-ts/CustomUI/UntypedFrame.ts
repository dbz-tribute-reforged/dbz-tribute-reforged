import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';
import { Frame } from './Frame';

export abstract class UntypedFrame extends Frame {
  public readonly frameHandle: framehandle;

  constructor(
    name: string,
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    public priority?: number,
  ) {
    super(name, frameType, owner, "", createContext, size, position);
    this.frameHandle = BlzCreateFrame(frameType, owner, priority?priority:0, createContext);
    this.setup();
  }
}