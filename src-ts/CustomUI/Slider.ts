import { Frame } from "./Frame";
import { Vector2D } from "./Vector2D";
import { FramePosition } from "./FramePosition";
import { SliderData } from "./SliderData";

export class Slider extends Frame {

  constructor(
    name: string, 
    frameType: string, 
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    inherits: string = "", 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
    public slider: SliderData
  ) {
    super(name, frameType, owner, inherits, createContext, size, position);
    this.setMinMaxValue().setValue().setStepSize();
  }

  setValue(): this {
    BlzFrameSetValue(this.frameHandle, this.slider.value);
    return this;
  }

  setMinMaxValue(): this  {
    BlzFrameSetMinMaxValue(this.frameHandle, this.slider.minValue, this.slider.maxValue);
    return this;
  }

  setStepSize(): this  {
    BlzFrameSetStepSize(this.frameHandle,  this.slider.stepSize);
    return this;
  }

}