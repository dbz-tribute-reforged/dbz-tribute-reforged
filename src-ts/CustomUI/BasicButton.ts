import { Button } from './Button';
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrameData } from './TextFrameData';

export class BasicButton extends Button {
  static readonly frameType = "GLUETEXTBUTTON";
  static readonly inherits = "ScriptDialogButton";

  constructor(
    name: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    createContext: number = 0,
    size: Vector2D, 
    position: FramePosition,
    text: string,
  ) {
    super(
      name, 
      BasicButton.frameType, 
      owner, 
      BasicButton.inherits, 
      createContext, 
      size, 
      position, 
      new TextFrameData(text, TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
    );
  }

}