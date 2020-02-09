import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";

export class Teleport implements AbilityComponent, Serializable<Teleport> {
  static readonly TARGET_POINT = 0;
  static readonly CAST_POINT = 1;
  static readonly ORIGINAL_POINT = 2;
  static readonly CASTER_POINT = 3;

  protected hasTeleported: boolean;
  protected originalPoint: Vector2D;
  
  constructor(
    public name: string = "Teleport",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public teleportOnce: boolean = false,
    public teleportTarget: number = Teleport.TARGET_POINT,
  ) {
    this.hasTeleported = false;
    this.originalPoint = new Vector2D();
  }

  doTeleport(input: CustomAbilityInput, source: unit) {
    switch (this.teleportTarget) {
      case Teleport.CAST_POINT:
        SetUnitX(source, input.castPoint.x);
        SetUnitY(source, input.castPoint.y);
        break;
      case Teleport.ORIGINAL_POINT:
        SetUnitX(source, this.originalPoint.x);
        SetUnitY(source, this.originalPoint.y);
        break;
      case Teleport.CASTER_POINT:
        SetUnitX(source, GetUnitX(input.caster.unit));
        SetUnitY(source, GetUnitY(input.caster.unit));
        break;
      case Teleport.TARGET_POINT:
      default:
        SetUnitX(source, input.targetPoint.x);
        SetUnitY(source, input.targetPoint.y);
        break;
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasTeleported) {
      this.hasTeleported = true;
      this.originalPoint.x = GetUnitX(source);
      this.originalPoint.y = GetUnitY(source);
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

  cleanup() {
    
  }
  

  clone(): AbilityComponent {
    return new Teleport(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.teleportOnce,
      this.teleportTarget,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      teleportOnce: boolean;
      teleportTarget: number;
    },
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.teleportOnce = input.teleportOnce;
    this.teleportTarget = input.teleportTarget;
    return this;
  }
}