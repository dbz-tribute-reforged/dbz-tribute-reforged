import { PauseManager } from "Core/PauseSystem/PauseManager";
import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class HideUnit implements AbilityComponent, Serializable<HideUnit> {

  protected wasInvul: boolean;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "HideUnit",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public doHide: boolean = true,
    public doInvul: boolean = true,
    public preventMovement: boolean = true,
    public removeNegativeBuffs: boolean = false,
    public forceReselect: boolean = false,
  ) {
    this.wasInvul = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
      if (this.doHide) ShowUnitHide(source);
      if (this.preventMovement) {
        PauseManager.getInstance().pause(source, false);
      }
      if (this.removeNegativeBuffs) UnitRemoveBuffs(source, false, true);
      this.wasInvul = BlzIsUnitInvulnerable(source);
      if (this.doInvul && !this.wasInvul) {
        SetUnitInvulnerable(source, true);
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      if (this.doHide) ShowUnitShow(source);
      if (this.preventMovement) {
        PauseManager.getInstance().unpause(source, false);
      }
      if (this.forceReselect && GetPlayerController(input.casterPlayer) == MAP_CONTROL_USER) {
        // SelectUnitAddForPlayer(source, input.casterPlayer);
        SelectUnitForPlayerSingle(source, input.casterPlayer);
      }
      if (this.doInvul && !this.wasInvul) {
        SetUnitInvulnerable(source, false);
      }
    }
  }

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new HideUnit(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.doHide,
      this.doInvul,
      this.preventMovement,
      this.removeNegativeBuffs,
      this.forceReselect,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      doHide: boolean;
      doInvul: boolean;
      preventMovement: boolean;
      removeNegativeBuffs: boolean;
      forceReselect: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.doHide = input.doHide;
    this.doInvul = input.doInvul;
    this.preventMovement = input.preventMovement;
    this.removeNegativeBuffs = input.removeNegativeBuffs;
    this.forceReselect = input.forceReselect;
    return this;
  }
}