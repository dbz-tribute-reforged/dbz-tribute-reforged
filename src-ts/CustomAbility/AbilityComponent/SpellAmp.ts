import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class SpellAmp implements AbilityComponent, Serializable<SpellAmp> {
  static readonly INSTANT_MODE = 0;
  static readonly INCREASE_MODE = 1;
  static readonly DECREASE_MODE = 2;

  protected isActive: boolean;

  constructor(
    public name: string = "SpellAmp",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public bonus: number = 0.1,
    public mode: number = SpellAmp.INSTANT_MODE,
  ) {
    this.isActive = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isActive) {
      this.isActive = true;
      input.caster.addSpellPower(this.bonus);
    }

    if (ability.isFinishedUsing(this) && this.isActive) {
      this.isActive = false;
      input.caster.removeSpellPower(this.bonus);
    }
  }
  

  clone(): AbilityComponent {
    return new SpellAmp(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.bonus, this.mode,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      bonus: number;
      mode: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.bonus = input.bonus;
    this.mode = input.mode;
    return this;
  }
}