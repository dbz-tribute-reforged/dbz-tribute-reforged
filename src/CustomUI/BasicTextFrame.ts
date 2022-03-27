import { TextFrame } from './TextFrame'
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrameData } from './TextFrameData';

export class BasicTextFrame extends TextFrame {
  static readonly frameType = "TEXT";

  constructor(
    name: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "EscMenuLabelTextTemplate", 
    createContext: number = 0,
    size: Vector2D, 
    position: FramePosition,
    text: string
  ) {
    super(
      name,
      BasicTextFrame.frameType, 
      owner, 
      inherits, 
      createContext, 
      size, 
      position, 
      new TextFrameData(text, TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
    );
  }
}