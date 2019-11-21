import { Backdrop } from "./Backdrop";
import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { ButtonOrganizer } from "Common/ButtonOrganizer";
import { Button } from "./Button";

export class AbilityButtonHotbar extends Backdrop {
  // static readonly backdropFrameType = "BACKDROP";
  // static readonly backdropInherits = "BNetPopupMenuBackdropTemplate";
  static readonly backdropFrameType = "FRAME";
  static readonly backdropInherits = "StandardFrameTemplate";
  static readonly initialButtonXOffset = 0;
  static readonly initialButtonYOffset = 0;

  protected buttons: Map<string, Button>;

  constructor(
    name: string, 
    owner: framehandle, 
    createContext: number = 0, 
    size: Vector2D, 
    position: FramePosition,
  ) {
    super(
      name, 
      AbilityButtonHotbar.backdropFrameType, 
      owner, 
      AbilityButtonHotbar.backdropInherits, 
      createContext, 
      size, 
      position
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
      AbilityButtonHotbar.initialButtonXOffset,
      AbilityButtonHotbar.initialButtonYOffset,
    );
    return this;
  }

  public getButton(name: string): Button | undefined {
    return this.buttons.get(name);
  }


}