import { AbilityComponent, ComponentConstants } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class Teleport implements AbilityComponent, Serializable<Teleport> {
  static readonly TARGET_POINT = 0;
  static readonly CAST_POINT = 1;
  static readonly ORIGINAL_POINT = 2;
  static readonly CASTER_POINT = 3;

  static readonly INFINITE_RANGE = -1;

  protected hasStarted: boolean;
  protected hasTeleported: boolean;
  protected originalPoint: Vector2D;
  
  constructor(
    public name: string = "Teleport",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public teleportTick: number = 0,
    public teleportOnce: boolean = false,
    public teleportTarget: number = Teleport.TARGET_POINT,
    public maxRange: number = Teleport.INFINITE_RANGE,
  ) {
    this.hasStarted = false;
    this.hasTeleported = false;
    this.originalPoint = new Vector2D();
  }

  getTeleportPoint(input: CustomAbilityInput) {
    switch (this.teleportTarget) {
      case Teleport.CAST_POINT:
        return input.castPoint;
        break;
      case Teleport.ORIGINAL_POINT:
        return this.originalPoint;
        break;
      case Teleport.CASTER_POINT:
        return new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
        break;
      case Teleport.TARGET_POINT:
      default:
        return input.targetPoint;
    }
  }

  doTeleport(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (
      ability.currentTick >= this.teleportTick &&
      (
        ability.currentTick != ComponentConstants.MAX_DURATION ||
        ability.currentTick >= ability.duration
      )
    ) {
      let canTeleport = true;
      const teleportPoint = this.getTeleportPoint(input);
      if (this.maxRange != Teleport.INFINITE_RANGE) {
        const sourcePos = new Vector2D(GetUnitX(source), GetUnitY(source));
        if (CoordMath.distance(sourcePos, teleportPoint) > this.maxRange) {
          canTeleport = false;
        }
      }

      if (canTeleport && CoordMath.isInsideMapBounds(teleportPoint)) {
        SetUnitX(source, teleportPoint.x);
        SetUnitY(source, teleportPoint.y);
        this.hasTeleported = true;
      }
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.originalPoint.x = GetUnitX(source);
      this.originalPoint.y = GetUnitY(source);
    }
    
    if (!this.hasTeleported || !this.teleportOnce) {
      this.doTeleport(ability, input, source);
    }

    if (ability.isFinishedUsing(this)) {
      this.hasStarted = false;
      this.hasTeleported = false;
    }
  }

  cleanup() {

  }
  

  clone(): AbilityComponent {
    return new Teleport(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.teleportTick,
      this.teleportOnce,
      this.teleportTarget,
      this.maxRange,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      teleportTick: number;
      teleportOnce: boolean;
      teleportTarget: number;
      maxRange: number;
    },
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.teleportTick = input.teleportTick;
    this.teleportOnce = input.teleportOnce;
    this.teleportTarget = input.teleportTarget;
    this.maxRange = input.maxRange;
    return this;
  }
}