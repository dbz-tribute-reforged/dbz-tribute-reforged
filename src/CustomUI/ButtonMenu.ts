import { Backdrop } from "./Backdrop";
import { Button } from "./Button";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { BasicTitledBackdrop } from "./BasicTitledBackdrop";
import { ButtonOrganizer } from "Common/ButtonOrganizer";

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
    ButtonOrganizer.autoAlignButtonPositions(
      this.frameHandle, 
      this.buttons, 
      this.size.x, 
      ButtonMenu.initialButtonXOffset,
      ButtonMenu.initialButtonYOffset,
    );
    return this;
  }

  public getButton(name: string): Button|undefined {
    return this.buttons.get(name);
  }

}