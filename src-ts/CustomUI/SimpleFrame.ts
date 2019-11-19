import { FramePosition } from "./FramePosition";
import { Vector2D } from "Common/Vector2D";

// implements frame stuff
export class SimpleFrame {
  public readonly frameHandle: framehandle;

  constructor(
    frameType: string,
    owner: framehandle, 
    createContext: number,
    public size: Vector2D,
    public position: FramePosition
  ) {
    this.frameHandle = BlzCreateSimpleFrame(frameType, owner, createContext);
    this.setRenderSize(size).setRenderPosition(position);
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