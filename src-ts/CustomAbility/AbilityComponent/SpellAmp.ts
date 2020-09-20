import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class SpellAmp implements AbilityComponent, Serializable<SpellAmp> {
  static readonly INSTANT_MODE = 0;
  static readonly INCREASE_MODE = 1;
  static readonly DECREASE_MODE = 2;

  protected currentBonus: number;

  constructor(
    public name: string = "SpellAmp",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public bonus: number = 0.1,
    public rate: number = 0.1,
  ) {
    this.currentBonus = 0;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (
      (this.currentBonus > 0 && this.currentBonus < this.bonus)
      ||
      (this.currentBonus < 0 && this.currentBonus > this.bonus)
    ) {
      let addedSpellPower = this.rate;
      if (this.currentBonus + addedSpellPower > this.bonus) {
        addedSpellPower = this.bonus - this.currentBonus;
      }
      this.currentBonus += addedSpellPower;
      input.caster.addSpellPower(addedSpellPower);
    }

    if (ability.isFinishedUsing(this)) {
      input.caster.removeSpellPower(this.currentBonus);
      this.currentBonus = 0;
    }
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new SpellAmp(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.bonus, this.rate,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      bonus: number;
      rate: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.bonus = input.bonus;
    this.rate = input.rate;
    return this;
  }
}