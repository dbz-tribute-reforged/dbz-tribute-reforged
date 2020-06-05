import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";

export class Jump implements AbilityComponent, Serializable<Jump> {

  protected hasStarted: boolean;
  protected currentTime: number;
  protected timeRatio: number;
  protected currentHeight: number;

  constructor(
    public name: string = "Jump",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public duration = 40,
    public maxHeight = 900,
  ) {
    this.hasStarted = false;
    this.currentTime = 0;
    this.timeRatio = 1;
    this.currentHeight = 0;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasStarted) {  
      UnitHelper.giveUnitFlying(source);
      this.hasStarted = true;
    } else {
      this.timeRatio = -1 + 2 * this.currentTime / this.duration;
      this.currentHeight = this.maxHeight * (
        1 - this.timeRatio * this.timeRatio
      );
      SetUnitFlyHeight(source, this.currentHeight, 0);
      ++this.currentTime;
    }

    if (ability.isFinishedUsing(this)) {
      SetUnitFlyHeight(source, GetUnitDefaultFlyHeight(source), 0);
      this.cleanup();
    }
  }

  cleanup() {
    this.hasStarted = false;
    this.currentTime = 0;
  }
  

  clone(): AbilityComponent {
    return new Jump(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.duration, this.maxHeight,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      duration: number;
      maxHeight: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.duration = input.duration;
    this.maxHeight = input.maxHeight;
    return this;
  }
}