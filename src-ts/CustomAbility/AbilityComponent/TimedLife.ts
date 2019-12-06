import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class TimedLife implements AbilityComponent, Serializable<TimedLife> {

  protected appliedTimedLife: boolean;

  constructor(
    public name: string = "TimedLife",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public duration: number = 10,
  ) {
    this.appliedTimedLife = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.appliedTimedLife) {
      this.appliedTimedLife = true;
      UnitApplyTimedLife(source, FourCC("BTLF"), this.duration * ability.updateRate);
    }
    if (ability.isFinishedUsing(this)) {
      this.appliedTimedLife = false;
    }
  }
  

  clone(): AbilityComponent {
    return new TimedLife(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.duration,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      duration: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.duration = input.duration;
    return this;
  }
}