import { Vector2D } from 'Common/Vector2D';
import { FramePosition } from './FramePosition';
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
    this.frameHandle = BlzCreateFrameByType(frameType, name, owner, inherits, createContext);
    this.setRenderSize(size).setRenderPosition(position).setRenderEnable(false).setRenderEnable(true);
  }
  
  public setRenderSize(size: Vector2D): this {
    BlzFrameSetSize(this.frameHandle, size.x, size.y)
    return this;
  }

  public resetRenderPosition(): this {
    BlzFrameClearAllPoints(this.frameHandle);
    return this;
  }

  public setRenderPosition(position: FramePosition): this {
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
}