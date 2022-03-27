import { Slider } from "./Slider";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { SliderData } from "./SliderData";
import { TextFrame } from "./TextFrame";
import { BasicTextFrame } from "./BasicTextFrame";

export class BasicTitledSlider extends Slider {
  static readonly frameType = "SLIDER";
  static readonly inherits = "EscMenuSliderTemplate";
  static readonly titleFrameType = "TEXT";
  static readonly titleInherits = "EscMenuTitleTextTemplate";
  static readonly titleSize = new Vector2D(0.0, 0.0);

  public title: TextFrame;

  constructor(
    sliderName: string, 
    titleName: string,
    owner: framehandle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),
    createContext: number = 0,
    size: Vector2D, 
    sliderPosition: FramePosition,
    slider: SliderData,
    title: string
  ) {
    super(
      sliderName, 
      BasicTitledSlider.frameType, 
      owner, 
      BasicTitledSlider.inherits, 
      createContext, 
      size, 
      sliderPosition, 
      slider
    );

    this.title = new BasicTextFrame(
      titleName, 
      this.frameHandle,
      BasicTitledSlider.titleInherits,
      createContext, 
      BasicTitledSlider.titleSize, 
      new FramePosition(FRAMEPOINT_BOTTOMLEFT, this.frameHandle, FRAMEPOINT_TOPLEFT, 0.0, 0.0), 
      title
    );
  }

}