import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class DummyComponent implements AbilityComponent, Serializable<DummyComponent> {

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "DummyComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
    }

    
    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
    }
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new DummyComponent(
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