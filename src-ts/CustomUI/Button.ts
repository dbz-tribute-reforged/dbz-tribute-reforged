import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrame } from './TextFrame';
import { TextFrameData } from './TextFrameData';

export class Button extends TextFrame {

  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "ScriptDialogButton", 
    index: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    text: TextFrameData,
  ) {
    super(name, frameType, owner, inherits, index, size, position, text);
  }

}