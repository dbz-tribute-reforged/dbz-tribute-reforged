import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { TextTagHelper } from "Common/TextTagHelper";

export class TimedLife implements AbilityComponent, Serializable<TimedLife> {

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  protected currentTime: number;

  constructor(
    public name: string = "TimedLife",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public duration: number = 10,
  ) {
    this.currentTime = 0;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
    }
    
    if (this.currentTime == 0) {
      // UnitApplyTimedLife(source, FourCC("BTLF"), this.duration);
    }
    ++this.currentTime;
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
      // SetUnitState(source, UNIT_STATE_LIFE, 0);
      KillUnit(source);
    }
    if (ability.isFinishedUsing(this)) {
      this.currentTime = 0;
      this.isStarted = false;
      this.isFinished = true;
    }
  }

  cleanup() {
    
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