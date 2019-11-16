import { Vector2D } from './Vector2D';
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
    public readonly index: number = 0, 
    public size: Vector2D, 
    public position: FramePosition
  ) {
    this.frameHandle = BlzCreateFrameByType(frameType, name, owner, inherits, index);
    this.setRenderSize().setRenderPosition().setRenderEnable(false).setRenderEnable(true);
  }
  
  public setRenderSize(x: number = this.size.x, y: number = this.size.y): this {
    BlzFrameSetSize(this.frameHandle, x, y)
    return this;
  }

  public setRenderPosition(sourcePoint: framepointtype = this.position.sourcePoint): this {
    BlzFrameSetPoint(
      this.frameHandle, 
      sourcePoint, 
      this.position.targetFrame, 
      this.position.targetPoint, 
      this.position.xOffset, 
      this.position.yOffset
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