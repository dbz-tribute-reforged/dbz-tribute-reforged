import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class AnimationComponent implements AbilityComponent, Serializable<AnimationComponent> {

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  
  constructor(
    public name: string = "AnimationComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public animationSpeed: number = 0,
    public animationIndex: number = -1,
    public animationString: string = "stand",
    public addAnimationProperty: string = "",
    public onlyApplyAtStart: boolean = true,
    public resetAnimation: boolean = false,
  ) {
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted || !this.onlyApplyAtStart) {
      this.isStarted = true;
      this.isFinished = false;

      if (this.animationSpeed > 0) {
        SetUnitTimeScale(source, this.animationSpeed);
      }
      if (this.animationIndex > 0) {
        SetUnitAnimationByIndex(source, this.animationIndex);
      } else if (this.animationString) {
        SetUnitAnimation(source, this.animationString);
      }
      if (this.addAnimationProperty.length > 0) {
        AddUnitAnimationProperties(source, this.addAnimationProperty, true);
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      if (this.animationSpeed > 0) {
        SetUnitTimeScale(source, 1.0);
      }
      if (this.addAnimationProperty.length > 0) {
        AddUnitAnimationProperties(source, this.addAnimationProperty, false);
      }
      if (this.resetAnimation) {
        ResetUnitAnimation(source);
      }
    }
  }

  cleanup() {
    
  }

  clone(): AbilityComponent {
    return new AnimationComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.animationSpeed,
      this.animationIndex,
      this.animationString,
      this.addAnimationProperty,
      this.onlyApplyAtStart,
      this.resetAnimation
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      animationSpeed: number;
      animationIndex: number;
      animationString: string;
      addAnimationProperty: string;
      onlyApplyAtStart: boolean;
      resetAnimation: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.animationSpeed = input.animationSpeed;
    this.animationIndex = input.animationIndex;
    this.animationString = input.animationString;
    this.addAnimationProperty = input.addAnimationProperty;
    this.onlyApplyAtStart = input.onlyApplyAtStart;
    this.resetAnimation = input.resetAnimation;
    return this;
  }
}