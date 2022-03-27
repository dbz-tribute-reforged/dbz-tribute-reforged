import { TypedFrame } from './TypedFrame'
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrameData } from './TextFrameData';

export class TextFrame extends TypedFrame {
  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "EscMenuLabelTextTemplate", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    text: TextFrameData
  ) {
    super(name, frameType, owner, inherits, createContext, size, position);
    this.setRenderedText(text.value);
  }
}