import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class HideUnit implements AbilityComponent, Serializable<HideUnit> {

  protected isHidden: boolean;

  constructor(
    public name: string = "HideUnit",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public preventMovement: boolean = true,
  ) {
    this.isHidden = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isHidden) {
      this.isHidden = true;
      ShowUnitHide(source);
      if (this.preventMovement) {
        PauseUnit(source, true);
      }
      SetUnitInvulnerable(source, true);
    }

    if (ability.isFinishedUsing(this)) {
      this.isHidden = false;
      ShowUnitShow(source);
      if (this.preventMovement) {
        PauseUnit(source, false);
      }
      SetUnitInvulnerable(source, false);
    }
  }
  

  clone(): AbilityComponent {
    return new HideUnit(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.preventMovement,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      preventMovement: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.preventMovement = input.preventMovement;
    return this;
  }
}