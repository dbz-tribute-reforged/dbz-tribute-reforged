import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { AbilityComponentHelper } from "./AbilityComponentHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class MultiComponent implements AbilityComponent, Serializable<MultiComponent> {
  static readonly LINEAR_FIRING = 0;
  static readonly SPREAD_FIRING = 1;
  static readonly WRAPAROUND_FIRING = 2;
  static readonly RANDOM_FIRING = 3;

  protected angleCurrent: number;
  protected angleDirection: number;
  protected angleRange: number;
  protected originalAngle: number;
  protected originalDistance: number;
  protected originalTarget: Vector2D;
  protected currentDelay: number;
  protected activeComponents: AbilityComponent[];

  constructor(
    public name: string = "MultiComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public angleDifference: number = 30,
    public angleMin: number = -30,
    public angleMax: number = 30,
    public delayBetweenComponents: number = 1,
    public firingMode: number = MultiComponent.SPREAD_FIRING,
    public multiplyComponents: number = 1,
    public components: AbilityComponent[] = [],
  ) {
    this.angleCurrent = 0;
    this.angleDirection = 1;
    this.angleRange = 0;
    this.originalAngle = 0;
    this.originalDistance = 0;
    this.originalTarget = new Vector2D(0, 0);
    this.currentDelay = 0;
    this.activeComponents = [];
  }

  activateComponentsWhenReady() {
    if (this.components.length > 0 && this.currentDelay >= this.delayBetweenComponents) {
      const component = this.components.pop();
      if (component) {
        this.activeComponents.push(component);
      }
      this.currentDelay = 0;
    }
  }

  adjustAngleCurrent() {
    if (this.firingMode == MultiComponent.SPREAD_FIRING) {
      const nextAngle = this.angleCurrent + this.angleDifference * this.angleDirection;
      if (nextAngle > this.angleMax || nextAngle < this.angleMin) {
        this.angleDirection *= -1;
        this.angleCurrent += this.angleDifference * this.angleDirection;
      } else {
        this.angleCurrent = nextAngle;
      }
    } else if (this.firingMode == MultiComponent.WRAPAROUND_FIRING) {
      this.angleCurrent = (this.angleCurrent + this.angleDifference) % this.angleRange;
    } else if (this.firingMode == MultiComponent.RANDOM_FIRING) {
      this.angleCurrent = this.angleMin + Math.random() * this.angleRange;
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    let sourceCoords = new Vector2D(GetUnitX(source), GetUnitY(source));

    if (ability.currentTick == this.startTick) {
      this.angleCurrent = this.angleMin;
      this.angleDirection = 1;
      this.angleRange = this.angleMax - this.angleMin;
      this.originalAngle = CoordMath.angleBetweenCoords(sourceCoords, input.targetPoint);
      this.originalDistance = CoordMath.distance(sourceCoords, input.targetPoint);
      this.originalTarget = new Vector2D(input.targetPoint.x, input.targetPoint.y);
      if (this.angleRange >= 360) {
        this.originalTarget = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      }
      this.currentDelay = this.delayBetweenComponents;
    }

    // add components to active components when ready
    this.activateComponentsWhenReady();

    const tmp = input.targetPoint;
    input.targetPoint = CoordMath.polarProjectCoords(
      sourceCoords, 
      this.angleCurrent + this.originalAngle,
      this.originalDistance
    )

    // keep showing active components
    for (const component of this.activeComponents) {
      if (ability.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
        component.performTickAction(ability, input, source);
      }
    }

    input.targetPoint = tmp;

    // if fired a beam, then adjust angle to next point
    if (this.currentDelay == 0) {
      this.adjustAngleCurrent();
    }
    ++this.currentDelay;
    
    // finished, so move active components back to components
    if (ability.isFinishedUsing(this)) {
      for (const component of this.activeComponents) {
        this.components.push(component);
      }
      this.activeComponents.splice(0, this.activeComponents.length);
    }
  }
  

  clone(): AbilityComponent {
    return new MultiComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.angleDifference, this.angleMin, this.angleMax, this.delayBetweenComponents,
      this.firingMode,
      this.multiplyComponents,
      AbilityComponentHelper.clone(this.components)
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      angleDifference: number;
      angleMin: number;
      angleMax: number;
      delayBetweenComponents: number;
      firingMode: number;
      multiplyComponents: number;
      components: {
        name: string,
      }[];
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.angleDifference = input.angleDifference;
    this.angleMin = input.angleMin;
    this.angleMax = input.angleMax;
    this.delayBetweenComponents = input.delayBetweenComponents;
    this.firingMode = input.firingMode;
    this.multiplyComponents = input.multiplyComponents;
    return this;
  }

  addComponent(component: AbilityComponent) {
    return this.components.push(component);
  }
}