import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { AbilityComponentHelper } from "./AbilityComponentHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { AddableComponent } from "./AddableComponent";
import { TextTagHelper } from "Common/TextTagHelper";

export class MultiComponent implements 
  AbilityComponent,
  Serializable<MultiComponent>,
  AddableComponent
{
  static readonly LINEAR_FIRING = 0;
  static readonly SPREAD_FIRING = 1;
  static readonly WRAPAROUND_FIRING = 2;
  static readonly RANDOM_FIRING = 3;

  protected hasStarted: boolean;
  protected angleCurrent: number;
  protected angleDirection: number;
  protected angleRange: number;
  protected originalAngle: number;
  protected originalDistance: number;
  protected originalTarget: Vector2D;
  protected sourceCoords: Vector2D;
  protected oldPoint: Vector2D;
  protected replacementCoords: Map<AbilityComponent, Vector2D>;
  protected currentDelay: number;
  protected activeComponents: AbilityComponent[];

  protected targettedPoint: Vector2D;
  protected newCoord: Vector2D;

  constructor(
    public name: string = "MultiComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public angleDifference: number = 30,
    public angleMin: number = -30,
    public angleMax: number = 30,
    public forceMinDistance: number = 0,
    public forceMaxDistance: number = 0,
    public delayBetweenComponents: number = 1,
    public firingMode: number = MultiComponent.SPREAD_FIRING,
    public multiplyComponents: number = 1,
    public componentsAddedPerRound: number = 1,
    public alwaysUpdateAngle: boolean = false,
    public fixedSourceCoords: boolean = false,
    public fixedReplacementCoords: boolean = false,
    public useTargetUnitAsSource: boolean = false,
    public useLastCastPoint: boolean = false,
    public components: AbilityComponent[] = [],
  ) {
    this.hasStarted = false;
    this.angleCurrent = 0;
    this.angleDirection = 1;
    this.angleRange = 0;
    this.originalAngle = 0;
    this.originalDistance = 0;
    this.originalTarget = new Vector2D();
    this.sourceCoords = new Vector2D();
    this.oldPoint = new Vector2D();
    this.replacementCoords = new Map();
    this.currentDelay = 0;
    this.activeComponents = [];
    this.targettedPoint = new Vector2D();
    this.newCoord = new Vector2D();
  }

  activateComponentsWhenReady() {
    if (this.currentDelay >= this.delayBetweenComponents) {
      for (let i = 0; i < this.componentsAddedPerRound && this.components.length > 0; ++i) {
        const component = this.components.pop();
        if (component) {
          this.activeComponents.push(component);
        }
      }
      this.currentDelay = 0;
    }
  }

  adjustAngleCurrent() {
    if (this.firingMode == MultiComponent.RANDOM_FIRING) {
      this.angleCurrent = this.angleMin + Math.random() * this.angleRange;
    } else if (this.firingMode == MultiComponent.LINEAR_FIRING) {
      this.angleCurrent = this.angleMin;
    } else {
      const nextAngle = this.angleCurrent + this.angleDifference * this.angleDirection;
      if (nextAngle > this.angleMax || nextAngle < this.angleMin) {  
        if (this.firingMode == MultiComponent.WRAPAROUND_FIRING) {
          if (this.angleDirection > 0) {
            this.angleCurrent = this.angleMin;
          } else {
            this.angleCurrent = this.angleMax;
          }
        } else {
          this.angleDirection *= -1;
          this.angleCurrent += this.angleDifference * this.angleDirection;
        }
      } else {
        this.angleCurrent = nextAngle;
      }
    }
  }

  manageFixedReplacementCoords(
    component: AbilityComponent, 
    input: CustomAbilityInput, 
    newCoord: Vector2D,
  ) {
    const replacedCoord = this.replacementCoords.get(component)
    if (replacedCoord) {
      if (this.useLastCastPoint) {
        input.castPoint.setVector(replacedCoord);
      } else {
        input.targetPoint.setVector(replacedCoord);
      }
    } else {
      this.replacementCoords.set(component, new Vector2D(newCoord.x, newCoord.y));
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.fixedSourceCoords || !this.hasStarted) {
      if (!this.useTargetUnitAsSource) {
        this.sourceCoords.setPos(GetUnitX(source), GetUnitY(source));
      } else {
        if (input.targetUnit) {
          this.sourceCoords.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
        } else {
          this.sourceCoords.setPos(GetUnitX(source), GetUnitY(source));
        }
      }
    }

    if (!this.hasStarted) {
      this.hasStarted = true;

      this.angleCurrent = this.angleMin;
      if (this.angleMax > this.angleMin) {
        this.angleRange = this.angleMax - this.angleMin;
        this.angleDirection = 1;
      } else {
        this.angleRange = this.angleMin - this.angleMax;
        
        const tmp = this.angleMax;
        this.angleMax = this.angleMin;
        this.angleMin = tmp;
        this.angleDirection = -1;
      }
      this.targettedPoint.setVector(input.targetPoint);
      if (this.useLastCastPoint) {
        this.targettedPoint.setVector(input.castPoint);
      }

      this.originalAngle = CoordMath.angleBetweenCoords(this.sourceCoords, this.targettedPoint);
      if (this.forceMaxDistance < 0.5) {
        this.originalDistance =
          Math.max(
            CoordMath.distance(this.sourceCoords, this.targettedPoint),
            this.forceMinDistance
          );
      } else if (this.forceMaxDistance >= 0.5) {
        this.originalDistance = 
          this.forceMinDistance + 
          Math.random() * (this.forceMaxDistance - this.forceMinDistance);
      }
      if (this.angleRange >= 360) {
        this.originalTarget.setPos(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      } else {
        this.originalTarget.setVector(this.targettedPoint);
      }
      this.currentDelay = this.delayBetweenComponents;
    }

    // very messy, but i used for 0 delay multis
    // 2 conditions for break at the end, 
    // if out of components or delay between components != 0, exit
    for (let activations = 0; activations < 100; ++activations) {

      if (this.components.length > 0) {
        // add components to active components when ready
        this.activateComponentsWhenReady();  
      }
      
      if (this.forceMaxDistance > this.forceMinDistance && this.forceMinDistance > 0.5) {
        this.originalDistance = 
          this.forceMinDistance + 
          Math.random() * (this.forceMaxDistance - this.forceMinDistance);
      }

      this.newCoord.polarProjectCoords(
        this.sourceCoords, 
        this.angleCurrent + this.originalAngle,
        this.originalDistance
      );

      if (this.useLastCastPoint) {
        this.oldPoint.setVector(input.castPoint);
        input.castPoint.setVector(this.newCoord);
      } else {
        this.oldPoint.setPos(input.targetPoint.x, input.targetPoint.y);
        input.targetPoint.setVector(this.newCoord);
      }
      let oldSource = source;
      if (this.useTargetUnitAsSource && input.targetUnit) {
        source = input.targetUnit;
      }

      // keep showing active components
      for (const component of this.activeComponents) {
        if (ability.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
          if (this.fixedReplacementCoords) {
            this.manageFixedReplacementCoords(component, input, this.newCoord);
          }
          component.performTickAction(ability, input, source);
        }
      }

      if (this.useTargetUnitAsSource) {
        source = oldSource;
      }

      if (this.useLastCastPoint) {
        input.castPoint.setVector(this.oldPoint);
      } else {
        input.targetPoint.setVector(this.oldPoint);
      }

      // if fired a beam, then adjust angle to next point
      if (this.currentDelay == 0 || this.alwaysUpdateAngle) {
        this.adjustAngleCurrent();
      }
      ++this.currentDelay;

      if (this.delayBetweenComponents != 0 || this.components.length == 0) {
        break;
      }
    }
    
    // finished, so move active components back to components
    if (ability.isFinishedUsing(this)) {
      for (const component of this.activeComponents) {
        this.components.push(component);
      }
      this.activeComponents.splice(0, this.activeComponents.length);
      this.replacementCoords.clear();
      this.hasStarted = false;
    }
  }

  cleanup() {
    for (const component of this.components) {
      component.cleanup();
    }
    for (const component of this.activeComponents) {
      component.cleanup();
    }
    this.components.splice(0, this.components.length);
    this.activeComponents.splice(0, this.activeComponents.length);
    this.replacementCoords.clear();
  }
  

  clone(): AbilityComponent {
    return new MultiComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.angleDifference, this.angleMin, this.angleMax, 
      this.forceMinDistance,
      this.forceMaxDistance,
      this.delayBetweenComponents,
      this.firingMode,
      this.multiplyComponents,
      this.componentsAddedPerRound,
      this.alwaysUpdateAngle,
      this.fixedSourceCoords,
      this.fixedReplacementCoords,
      this.useTargetUnitAsSource,
      this.useLastCastPoint,
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
      forceMinDistance: number;
      forceMaxDistance: number;
      delayBetweenComponents: number;
      firingMode: number;
      multiplyComponents: number;
      componentsAddedPerRound: number;
      alwaysUpdateAngle: boolean;
      fixedSourceCoords: boolean;
      fixedReplacementCoords: boolean;
      useTargetUnitAsSource: boolean;
      useLastCastPoint: boolean;
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
    this.forceMinDistance = input.forceMinDistance;
    this.forceMaxDistance = input.forceMaxDistance;
    this.delayBetweenComponents = input.delayBetweenComponents;
    this.firingMode = input.firingMode;
    this.componentsAddedPerRound = input.componentsAddedPerRound;
    this.multiplyComponents = input.multiplyComponents;
    this.alwaysUpdateAngle = input.alwaysUpdateAngle;
    this.fixedSourceCoords = input.fixedSourceCoords;
    this.fixedReplacementCoords = input.fixedReplacementCoords;
    this.useTargetUnitAsSource = input.useTargetUnitAsSource;
    this.useLastCastPoint = input.useLastCastPoint;
    return this;
  }

  addComponent(component: AbilityComponent) {
    return this.components.push(component);
  }
}