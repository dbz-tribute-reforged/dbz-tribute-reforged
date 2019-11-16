import { Frame } from './Frame';
import { Vector2D } from './Vector2D';
import { FramePosition } from './FramePosition';

export class Backdrop extends Frame {
  constructor(
    public readonly name: string, 
    public readonly frameType: string, 
    public readonly owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    public readonly inherits: string = "", 
    public readonly index: number = 0, 
    public size: Vector2D, 
    public position: FramePosition
  ) {
    super(name, frameType, owner, inherits, index, size, position);
  }
}