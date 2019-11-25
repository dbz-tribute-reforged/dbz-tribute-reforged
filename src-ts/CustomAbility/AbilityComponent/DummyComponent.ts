import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class DummyComponent implements AbilityComponent, Serializable<DummyComponent> {

  constructor(
    public name: string = "DummyComponent",
    public repeatInterval: number = 1,
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {

  }
  

  clone(): AbilityComponent {
    return new DummyComponent(
      this.name, this.repeatInterval,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    return this;
  }
}