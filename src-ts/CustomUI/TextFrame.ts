import { Frame } from './Frame'
import { Vector2D } from './Vector2D';
import { FramePosition } from './FramePosition'
import { TextFrameData } from './TextFrameData';

export class TextFrame extends Frame {
  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "", 
    index: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    public text: TextFrameData
  ) {
    super(name, frameType, owner, inherits, index, size, position);
    this.setRenderedText();
  }

  public setRenderedText(): this {
    BlzFrameSetText(this.frameHandle, this.text.value);
    return this;
  }
  
  public getRenderedText(): string {
    return BlzFrameGetText(this.frameHandle);
  }

}