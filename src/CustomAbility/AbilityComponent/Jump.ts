import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { Vector2D } from "Common/Vector2D";

export class Jump implements AbilityComponent, Serializable<Jump> {

  protected currentTime: number;
  protected timeRatio: number;
  protected currentHeight: number;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "Jump",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public duration: number = 40,
    public maxHeight: number = 900,
    public useSpeedToCastPoint: boolean = false,
    public speed: number = -1,
  ) {
    this.currentTime = 0;
    this.timeRatio = 1;
    this.currentHeight = 0;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {  
      UnitHelper.giveUnitFlying(source);
      this.isStarted = true;
      this.isFinished = false;
      if (this.useSpeedToCastPoint && this.speed >= 0) {
        this.duration = ability.currentTick + Math.floor(
          CoordMath.distance(
            new Vector2D(GetUnitX(source), GetUnitY(source)), 
            input.castPoint
          ) / Math.floor(this.speed)
        )
      }
    } else {
      this.timeRatio = -1 + 2 * this.currentTime / Math.max(this.duration, 1);
      this.currentHeight = this.maxHeight * (
        1 - this.timeRatio * this.timeRatio
      );
      SetUnitFlyHeight(source, this.currentHeight, 0);
      ++this.currentTime;
    }

    if (ability.isFinishedUsing(this)) {
      SetUnitFlyHeight(source, GetUnitDefaultFlyHeight(source), 0);
      this.cleanup();
    }
  }

  cleanup() {
    this.isStarted = false;
    this.isFinished = true;
    this.currentTime = 0;
  }
  

  clone(): AbilityComponent {
    return new Jump(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.duration, this.maxHeight,
      this.useSpeedToCastPoint, this.speed,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      duration: number;
      maxHeight: number;
      useSpeedToCastPoint: boolean;
      speed: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.duration = input.duration;
    this.maxHeight = input.maxHeight;
    this.useSpeedToCastPoint = input.useSpeedToCastPoint;
    this.speed = input.speed;
    return this;
  }
}