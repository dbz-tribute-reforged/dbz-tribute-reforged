import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class Teleport implements AbilityComponent, Serializable<Teleport> {

  protected hasTeleported: boolean;
  
  constructor(
    public name: string = "Teleport",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public teleportOnce: boolean = false,
    public useLastCastPoint: boolean = false,
  ) {
    this.hasTeleported = false;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasTeleported || !this.teleportOnce) {
      this.hasTeleported = true;
      if (this.useLastCastPoint) {
        SetUnitX(source, input.castPoint.x);
        SetUnitY(source, input.castPoint.y);
      } else {
        SetUnitX(source, input.targetPoint.x);
        SetUnitY(source, input.targetPoint.y);
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.hasTeleported = false;
    }
  }
  

  clone(): AbilityComponent {
    return new Teleport(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.teleportOnce,
      this.useLastCastPoint,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      teleportOnce: boolean;
      useLastCastPoint: boolean;
    },
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.teleportOnce = input.teleportOnce;
    this.useLastCastPoint = input.useLastCastPoint;
    return this;
  }
}