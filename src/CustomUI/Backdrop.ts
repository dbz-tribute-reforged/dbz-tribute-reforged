import { TypedFrame } from './TypedFrame';
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';

export class Backdrop extends TypedFrame {
  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle,
    inherits: string = "EscMenuBackdrop", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition
  ) {
    super(name, frameType, owner, inherits, createContext, size, position);
  }
}