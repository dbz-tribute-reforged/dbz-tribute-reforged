import { TypedFrame } from "./TypedFrame";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { SliderData } from "./SliderData";

export class Slider extends TypedFrame {

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
    this.setMinMaxValue(slider).setValue(slider.value).setStepSize(slider.stepSize);
  }

}