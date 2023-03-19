import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Trigger } from "w3ts";
import { UnitHelper } from "Common/UnitHelper";

// this component cannot be transferred to another unit
// for performance reasons
export class Channelling implements AbilityComponent, Serializable<Channelling> {

  protected isChannelling: boolean;
  protected finishedChannel: boolean;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "Channelling",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public ticksFromEnd: number = 1,
  ) {
    this.isChannelling = false;
    this.finishedChannel = false;
  }

  forceTerminateAbility(ability: CustomAbility) {
    const newTick = ability.duration - this.ticksFromEnd;
    if (newTick > ability.currentTick) {
      ability.currentTick = newTick;
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
      this.isChannelling = true;
      this.finishedChannel = false;
    }

    if (!ability.isFinishedUsing(this)) {
      if (
        UnitHelper.isUnitStunned(input.caster.unit) 
        || UnitHelper.isUnitDead(input.caster.unit)
      ) {
        this.finishedChannel = true;
      } else {
        this.finishedChannel = !input.caster.isChanneling();
      }
  
      if (this.isChannelling && this.finishedChannel) {
        this.forceTerminateAbility(ability);
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
    }
  }

  cleanup() {

  }
  

  clone(): AbilityComponent {
    return new Channelling(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.ticksFromEnd,
    );
  }
  
  deserialize(
    input: { 
      name: string; 

      repeatInterval: number; 
      startTick: number;
      endTick: number;
      ticksFromEnd: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.ticksFromEnd = input.ticksFromEnd;
    return this;
  }
}