import { Backdrop } from './Backdrop';
import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';
import { TextFrame } from './TextFrame';
import { BasicTextFrame } from './BasicTextFrame';

export class BasicTitledBackdrop extends Backdrop {
  static readonly backdropFrameType = "BACKDROP";
  static readonly backdropInherits = "EscMenuBackdrop";
  static readonly titleFrameType = "TEXT";
  static readonly titleInherits = "EscMenuTitleTextTemplate";
  static readonly titleSize = new Vector2D(0.0, 0.0);

  public title: TextFrame;

  constructor(
    backdropName: string, 
    titleName: string, 
    owner: framehandle,
    createContext: number = 0,
    size: Vector2D, 
    position: FramePosition, 
    text: string
  ) {
    super(
      backdropName, 
      BasicTitledBackdrop.backdropFrameType, 
      owner, 
      BasicTitledBackdrop.backdropInherits, 
      createContext,
      size, 
      position
    );
    
    this.title = new BasicTextFrame(
      titleName, 
      this.frameHandle,
      BasicTitledBackdrop.titleInherits,
      createContext, 
      BasicTitledBackdrop.titleSize, 
      new FramePosition(FRAMEPOINT_TOP, this.frameHandle, FRAMEPOINT_TOP, 0.0, -0.025), 
      text
    )
  }

}