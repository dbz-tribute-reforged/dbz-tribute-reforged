import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class TempAbility implements AbilityComponent, Serializable<TempAbility> {
  protected hasStarted: boolean;
  protected abilityWasAdded: boolean;

  constructor(
    public name: string = "TempAbility",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public newAbility: number = FourCC("Avul"),
    public oldAbility: number = FourCC("Avul"),
    public performSwap: boolean = false,
    public enableAbility: boolean = false,
    public addAbility: boolean = false,
    public tempPermanence: boolean = false,
    public equalizeLevels: boolean = false,
  ) {
    this.hasStarted = false;
    this.abilityWasAdded = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasStarted) {
      this.hasStarted = true;
      if (this.enableAbility) {
        SetPlayerAbilityAvailable(GetOwningPlayer(source), this.newAbility, true);
        if (this.performSwap) {
          SetPlayerAbilityAvailable(GetOwningPlayer(source), this.oldAbility, false);
        }
      }
      if (this.addAbility) {
        this.abilityWasAdded = UnitAddAbility(source, this.newAbility);
      }
      if (this.tempPermanence) {
        UnitMakeAbilityPermanent(source, true, this.newAbility);
      }
      if (this.equalizeLevels) {
        const newAbilityLevel = GetUnitAbilityLevel(source, this.newAbility);
        const oldAbilityLevel = GetUnitAbilityLevel(source, this.oldAbility);
        if (newAbilityLevel > oldAbilityLevel) {
          SetUnitAbilityLevel(source, this.oldAbility, newAbilityLevel);
        } else if (oldAbilityLevel > newAbilityLevel) {
          SetUnitAbilityLevel(source, this.newAbility, oldAbilityLevel);
        }
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.hasStarted = false;
      if (this.enableAbility) {
        SetPlayerAbilityAvailable(GetOwningPlayer(source), this.newAbility, false);
        if (this.performSwap) {
          SetPlayerAbilityAvailable(GetOwningPlayer(source), this.oldAbility, true);
        }
      }
      if (this.addAbility && this.abilityWasAdded) {
        UnitRemoveAbility(source, this.newAbility);
      }
      if (this.tempPermanence) {
        UnitMakeAbilityPermanent(source, false, this.newAbility);
      }
    }
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new TempAbility(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.newAbility,
      this.oldAbility,
      this.performSwap,
      this.enableAbility,
      this.addAbility,
      this.tempPermanence,
      this.equalizeLevels,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      newAbility: number;
      oldAbility: number;
      performSwap: boolean;
      enableAbility: boolean;
      addAbility: boolean;
      tempPermanence: boolean;
      equalizeLevels: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.newAbility = input.newAbility;
    this.oldAbility = input.oldAbility;
    this.performSwap = input.performSwap;
    this.enableAbility = input.enableAbility;
    this.addAbility = input.addAbility;
    this.tempPermanence = input.tempPermanence;
    this.equalizeLevels = input.equalizeLevels;
    return this;
  }
}