import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Trigger } from "w3ts";
import { UnitHelper } from "Common/UnitHelper";
import { OrderIds } from "Common/Constants";

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
    public fakeChannel: boolean = false,
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
      
      if (this.fakeChannel) {
        input.caster.setIsChanneling(true); // pretend to channel
      }
    }

    if (!ability.isFinishedUsing(this)) {
      if (
        UnitHelper.isUnitStunned(input.caster.unit) 
        || UnitHelper.isUnitDead(input.caster.unit)
      ) {
        this.finishedChannel = true;
      } else if (!this.fakeChannel) {
        this.finishedChannel = (
          !input.caster.isChanneling() 
          || input.caster.channelAbilityId != input.abilityId
        );
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
      this.ticksFromEnd, this.fakeChannel,
    );
  }
  
  deserialize(
    input: { 
      name: string; 

      repeatInterval: number; 
      startTick: number;
      endTick: number;
      ticksFromEnd: number;
      fakeChannel: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.ticksFromEnd = input.ticksFromEnd;
    this.fakeChannel = input.fakeChannel;
    return this;
  }
}