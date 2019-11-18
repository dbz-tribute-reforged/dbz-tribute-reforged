import { Backdrop } from "./Backdrop";
import { Button } from "./Button";
import { Vector2D } from "./Vector2D";
import { FramePosition } from "./FramePosition";
import { BasicTitledBackdrop } from "./BasicTitledBackdrop";

export class ButtonMenu extends BasicTitledBackdrop{
  static readonly initialButtonXOffset = 0.02;
  static readonly initialButtonYOffset = -0.05;

  protected buttons: Map<string, Button>;

  // why not just pass in a basic titled backdrop at this point then?
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
      titleName,
      owner,
      createContext, 
      size,
      position,
      text
    );
    this.buttons = new Map();
  }

  public addButton(button: Button): this {
    this.buttons.set(button.name, button);
    return this;
  }

  public autoAlignButtonPositions(): this {
    const maxX = this.size.x;
    let xOffset = 0;
    let yOffset = 0;
    let topLeftHandle = this.frameHandle;
    let leftHandle = topLeftHandle;
    let isFirstButton = true;

    // will abstract this later, probably
    for (const [name, button] of this.buttons) {
      if (isFirstButton) {
        button.position = new FramePosition(
          FRAMEPOINT_TOPLEFT, 
          topLeftHandle, 
          FRAMEPOINT_TOPLEFT, 
          ButtonMenu.initialButtonXOffset,
          ButtonMenu.initialButtonYOffset
        );
        isFirstButton = false;
        topLeftHandle = button.frameHandle;
        leftHandle = button.frameHandle;
        xOffset = button.size.x + ButtonMenu.initialButtonXOffset;
        yOffset = -ButtonMenu.initialButtonYOffset;
      } else {
        if (xOffset + button.size.x < maxX) {
          button.position = new FramePosition(
            FRAMEPOINT_LEFT, 
            leftHandle, 
            FRAMEPOINT_RIGHT, 
            0,
            0
          );
          leftHandle = button.frameHandle;
          xOffset += button.size.x;
          yOffset = button.size.y > yOffset ? button.size.y : yOffset;
        } else {
          button.position = new FramePosition(
            FRAMEPOINT_TOP, 
            topLeftHandle, 
            FRAMEPOINT_BOTTOM, 
            0,
            0
          );
          topLeftHandle = button.frameHandle;
          leftHandle = button.frameHandle;
          xOffset = button.size.x + ButtonMenu.initialButtonXOffset;
          yOffset = button.size.y;
        }
      }
      button.resetRenderPosition().setRenderPosition(button.position);
    }
    return this;
  }

  public getButton(name: string): Button|undefined {
    return this.buttons.get(name);
  }

}