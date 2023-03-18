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
    public disableAbility: boolean = false,
    public addAbility: boolean = false,
    public tempPermanence: boolean = false,
    public equalizeLevels: boolean = false,
    public linkCooldowns: number = -1,
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
      } else if (this.disableAbility) {
        SetPlayerAbilityAvailable(GetOwningPlayer(source), this.newAbility, false);
        if (this.performSwap) {
          SetPlayerAbilityAvailable(GetOwningPlayer(source), this.oldAbility, true);
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
      if (this.performSwap && this.linkCooldowns >= 0) {
        BlzStartUnitAbilityCooldown(source, this.newAbility, 
          this.linkCooldowns + 
          Math.max(0, 
            Math.max(
              BlzGetUnitAbilityCooldownRemaining(source, this.oldAbility),
              BlzGetUnitAbilityCooldownRemaining(source, this.newAbility)
            )
          )
        );
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.hasStarted = false;

      if (this.enableAbility) {
        SetPlayerAbilityAvailable(GetOwningPlayer(source), this.newAbility, false);
        if (this.performSwap) {
          SetPlayerAbilityAvailable(GetOwningPlayer(source), this.oldAbility, true);
        }
      } else if (this.disableAbility) {
        SetPlayerAbilityAvailable(GetOwningPlayer(source), this.newAbility, true);
        if (this.performSwap) {
          SetPlayerAbilityAvailable(GetOwningPlayer(source), this.oldAbility, false);
        }
      }
      
      if (this.performSwap && this.linkCooldowns >= 0) {
        BlzStartUnitAbilityCooldown(source, this.oldAbility, 
          this.linkCooldowns + 
          Math.max(0, 
            Math.max(
              BlzGetUnitAbilityCooldownRemaining(source, this.oldAbility),
              BlzGetUnitAbilityCooldownRemaining(source, this.newAbility)
            )
          )
        );
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
      this.disableAbility,
      this.addAbility,
      this.tempPermanence,
      this.equalizeLevels,
      this.linkCooldowns,
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
      disableAbility: boolean;
      addAbility: boolean;
      tempPermanence: boolean;
      equalizeLevels: boolean;
      linkCooldowns: number;
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
    this.disableAbility = input.disableAbility;
    this.addAbility = input.addAbility;
    this.tempPermanence = input.tempPermanence;
    this.equalizeLevels = input.equalizeLevels;
    this.linkCooldowns = input.linkCooldowns;
    return this;
  }
}