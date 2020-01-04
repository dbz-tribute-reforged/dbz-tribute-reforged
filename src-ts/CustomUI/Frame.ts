import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';
import { TextureData } from './TextureData';
import { StatusBarData } from './StatusBarData';
import { SliderData } from './SliderData';
/**
 * Stores what you can't retrieve back from the BlzFrame natives
 */
export abstract class Frame {
  public readonly frameHandle: framehandle;

  constructor(
    public readonly name: string, 
    public readonly frameType: string, 
    public readonly owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    public readonly inherits: string = "", 
    public readonly createContext: number = 0, 
    public size: Vector2D, 
    public position: FramePosition
  ) {
    this.frameHandle = BlzGetFrameByName(name, 0);
  }
  
  public setup(): this {
    return this.
      setRenderSize(this.size).
      setRenderPosition(this.position).
      setRenderEnable(false).
      setRenderEnable(true);
  }

  public setRenderSize(size: Vector2D): this {
    this.size = size;
    BlzFrameSetSize(this.frameHandle, size.x, size.y)
    return this;
  }

  public resetRenderPosition(): this {
    BlzFrameClearAllPoints(this.frameHandle);
    return this;
  }

  public setRenderPosition(position: FramePosition): this {
    this.position = position;
    BlzFrameSetPoint(
      this.frameHandle, 
      position.sourcePoint, 
      position.targetFrame, 
      position.targetPoint, 
      position.xOffset, 
      position.yOffset
    );
    return this;
  }

  public getRenderVisible(): boolean {
    return BlzFrameIsVisible(this.frameHandle);
  }

  public setRenderVisible(visible: boolean): this {
    BlzFrameSetVisible(this.frameHandle, visible);
    return this;
  }

  public getRenderEnable(): boolean {
    return BlzFrameGetEnable(this.frameHandle);
  }

  public setRenderEnable(enable: boolean): this {
    BlzFrameSetEnable(this.frameHandle, enable);
    return this;
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

  public setValue(value: number): this {
    BlzFrameSetValue(this.frameHandle, value);
    return this;
  }

  public setMinMaxValue(statusBar: StatusBarData | SliderData): this  {
    BlzFrameSetMinMaxValue(this.frameHandle, statusBar.minValue, statusBar.maxValue);
    return this;
  }

  public setStepSize(stepSize: number): this  {
    BlzFrameSetStepSize(this.frameHandle, stepSize);
    return this;
  }
  
  public setTexture(texture: TextureData): this {
    BlzFrameSetTexture(this.frameHandle, texture.fileName, texture.flag, texture.blend);
    return this; 
  }
}