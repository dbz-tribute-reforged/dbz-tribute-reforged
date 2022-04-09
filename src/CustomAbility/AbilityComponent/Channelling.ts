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
  protected cancelChannelTrigger: trigger;

  protected triggerHasBeenSetup: boolean;

  constructor(
    public name: string = "Channelling",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public ticksFromEnd: number = 1,
  ) {
    this.isChannelling = false;
    this.finishedChannel = false;
    this.cancelChannelTrigger = CreateTrigger();
    this.triggerHasBeenSetup = false;
  }

  forceTerminateAbility(ability: CustomAbility) {
    const newTick = ability.duration - this.ticksFromEnd;
    if (newTick > ability.currentTick) {
      ability.currentTick = newTick;
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    print(ability.currentTick, this.isChannelling, this.finishedChannel);
    
    if (!this.isChannelling) {
      this.isChannelling = true;
      this.finishedChannel = false;
      if (this.triggerHasBeenSetup) {
        EnableTrigger(this.cancelChannelTrigger);
      } else {
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_SPELL_FINISH);
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_ISSUED_ORDER);
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_DEATH);
        // TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_SPELL_CHANNEL);
        // TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_SPELL_ENDCAST);
        
        TriggerRegisterUnitEvent(this.cancelChannelTrigger, input.caster.unit, EVENT_UNIT_SPELL_ENDCAST);
        // TriggerAddCondition(this.cancelChannelTrigger, Condition(() => {
        //   if (GetSpellAbilityId() == input.abilityId) {
        //     this.finishedChannel = true;
        //   }
        //   return false;
        // }))
  
        TriggerAddAction(this.cancelChannelTrigger, () => {
          print("channel cancel");
          this.finishedChannel = true;
          DisableTrigger(this.cancelChannelTrigger);
        });
        
        this.triggerHasBeenSetup = true;
        print("setup done");
      }
    }

    if (UnitHelper.isUnitStunned(input.caster.unit)) {
      this.finishedChannel = true;
    }

    if (this.isChannelling && this.finishedChannel) {
      this.forceTerminateAbility(ability);
    }

    if (ability.isFinishedUsing(this)) {
      print("channel finish");
      this.isChannelling = false;
      DisableTrigger(this.cancelChannelTrigger);
    }
  }

  cleanup() {
    DestroyTrigger(this.cancelChannelTrigger);
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