import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class SelfDestruct implements AbilityComponent, Serializable<SelfDestruct> {

  constructor(
    public name: string = "SelfDestruct",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
  ) {
    
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    KillUnit(source);
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new SelfDestruct(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    return this;
  }
}