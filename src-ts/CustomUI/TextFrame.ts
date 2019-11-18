import { Frame } from './Frame'
import { Vector2D } from './Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrameData } from './TextFrameData';

export class TextFrame extends Frame {
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

  public setRenderedText(text: string): this {
    BlzFrameSetText(this.frameHandle, text);
    return this;
  }
  
  public getRenderedText(): string {
    return BlzFrameGetText(this.frameHandle);
  }

  public setTextAlignment(verticalAlignment: textaligntype, horizontalAlignment: textaligntype): this {
    BlzFrameSetTextAlignment(this.frameHandle, verticalAlignment, horizontalAlignment); 
    return this;
  }

  public setFont(fileName: string, height: number, flags: number): this {
    BlzFrameSetFont(this.frameHandle, fileName, height, flags);
    return this;
  }
}