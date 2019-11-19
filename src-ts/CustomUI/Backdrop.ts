import { Frame } from './Frame';
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';

export class Backdrop extends Frame {
  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle,
    inherits: string = "EscMenuBackdrop", 
    index: number = 0, 
    size: Vector2D, 
    position: FramePosition
  ) {
    super(name, frameType, owner, inherits, index, size, position);
  }
}