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
    public doHide: boolean = true,
    public preventMovement: boolean = true,
    public removeNegativeBuffs: boolean = false,
  ) {
    this.isHidden = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isHidden) {
      this.isHidden = true;
      if (this.doHide) ShowUnitHide(source);
      if (this.preventMovement) {
        PauseUnit(source, true);
      }
      if (this.removeNegativeBuffs) UnitRemoveBuffs(source, false, true);
      SetUnitInvulnerable(source, true);
    }

    if (ability.isFinishedUsing(this)) {
      this.isHidden = false;
      if (this.doHide) ShowUnitShow(source);
      if (this.preventMovement) {
        PauseUnit(source, false);
      }
      SetUnitInvulnerable(source, false);
    }
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new HideUnit(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.doHide,
      this.preventMovement,
      this.removeNegativeBuffs
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      doHide: boolean;
      preventMovement: boolean;
      removeNegativeBuffs: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.doHide = input.doHide;
    this.preventMovement = input.preventMovement;
    this.removeNegativeBuffs = input.removeNegativeBuffs;
    return this;
  }
}