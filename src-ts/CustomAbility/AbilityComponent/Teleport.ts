import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";

export class Teleport implements AbilityComponent, Serializable<Teleport> {

  protected hasTeleported: boolean;
  protected originalPoint: Vector2D;
  
  constructor(
    public name: string = "Teleport",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public teleportOnce: boolean = false,
    public useLastCastPoint: boolean = false,
    public useOriginalPoint: boolean = false,
  ) {
    this.hasTeleported = false;
    this.originalPoint = new Vector2D();
  }

  doTeleport(input: CustomAbilityInput, source: unit) {
    if (this.useOriginalPoint) {
      SetUnitX(source, this.originalPoint.x);
      SetUnitY(source, this.originalPoint.y);
    } else if (this.useLastCastPoint) {
      SetUnitX(source, input.castPoint.x);
      SetUnitY(source, input.castPoint.y);
    } else {
      SetUnitX(source, input.targetPoint.x);
      SetUnitY(source, input.targetPoint.y);
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasTeleported) {
      this.hasTeleported = true;
      this.originalPoint.x = GetUnitX(source);
      this.originalPoint.y = GetUnitX(source);
      this.doTeleport(input, source);
    } else {
      if (!this.teleportOnce) {
        this.doTeleport(input, source);
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
      this.useOriginalPoint,
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
      useOriginalPoint: boolean;
    },
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.teleportOnce = input.teleportOnce;
    this.useLastCastPoint = input.useLastCastPoint;
    this.useOriginalPoint = input.useOriginalPoint;
    return this;
  }
}