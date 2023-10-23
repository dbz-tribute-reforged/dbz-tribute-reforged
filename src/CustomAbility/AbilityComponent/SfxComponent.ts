import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { SfxData } from "Common/SfxData";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";
import { CoordMath } from "Common/CoordMath";

export class SfxComponent implements AbilityComponent, Serializable<SfxComponent>  {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT_FIXED = 1;
  static readonly SOURCE_TARGET_POINT_DYNAMIC = 2;
  static readonly SOURCE_TARGET_UNIT = 3;

  static readonly YAW_SOURCE_FACING = 0;
  static readonly YAW_SOURCE_TO_TARGET = 1;

  protected sfxCoords: Vector2D;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "SfxComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public sfxSource: number = SfxComponent.SOURCE_UNIT,
    public sfxYawType: number = SfxComponent.YAW_SOURCE_FACING,
    public useLastCastPoint: boolean = true,
    public useHeight: boolean = true,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {
    this.sfxCoords = new Vector2D();
  }

  getActualTargetPoint(input: CustomAbilityInput): Vector2D {
    if (this.useLastCastPoint) {
      return input.castPoint;
    }
    return input.targetPoint;
  }

  setSfxCoordsToTargettedPoint(input: CustomAbilityInput) {
    this.sfxCoords.setVector(this.getActualTargetPoint(input));
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.cleanup();
      this.isStarted = true;
      this.isFinished = false;
      if (this.sfxSource == SfxComponent.SOURCE_TARGET_POINT_FIXED) {
        this.setSfxCoordsToTargettedPoint(input);
      }
    }

    if (this.sfxSource == SfxComponent.SOURCE_TARGET_POINT_DYNAMIC) {
      this.setSfxCoordsToTargettedPoint(input);
    } else if (this.sfxSource == SfxComponent.SOURCE_UNIT) {
      this.sfxCoords.setPos(GetUnitX(source), GetUnitY(source));
    } else if (this.sfxSource == SfxComponent.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.sfxCoords.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.setSfxCoordsToTargettedPoint(input);
      }
    }

    const timeRatio = ability.calculateTimeRatio(this.startTick, this.endTick);
    let yaw = 0;
    if (this.sfxYawType == SfxComponent.YAW_SOURCE_FACING) {
      yaw = GetUnitFacing(source) * CoordMath.degreesToRadians;
    } else {
      yaw = (
        CoordMath.angleBetweenCoords(this.sfxCoords, this.getActualTargetPoint(input))
        + 360
      ) * CoordMath.degreesToRadians;
    }
    const height = (this.useHeight) ? GetUnitFlyHeight(source) + BlzGetUnitZ(source) : 0;
    // const height = (this.useHeight) ? GetUnitFlyHeight(source) : 0;

    AbilitySfxHelper.displaySfxListAtCoord(
      ability,
      this.sfxList, 
      this.sfxCoords, 
      SfxData.SHOW_ALL_GROUPS,
      yaw, 
      height,
      timeRatio,
    );
    AbilitySfxHelper.displaySfxListOnUnit(
      ability,
      this.attachedSfxList,
      source,
      SfxData.SHOW_ALL_GROUPS,
      yaw, 
      height,
      timeRatio,
    );


    if (ability.isFinishedUsing(this)) {
      this.cleanup();
      this.isStarted = false;
      this.isFinished = true;
    }
  }

  cleanup() {    
    AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
    AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
  }

  clone(): AbilityComponent {
    return new SfxComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.sfxSource, this.sfxYawType, this.useLastCastPoint,
      this.useHeight,
      AbilitySfxHelper.duplicateSfxList(this.sfxList),
      AbilitySfxHelper.duplicateSfxList(this.attachedSfxList),
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      sfxSource: number;
      sfxYawType: number;
      useLastCastPoint: boolean;
      useHeight: boolean;
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        endScale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
        extraRoll: number;
        animSpeed: number;
        color: {
          x: number,
          y: number,
          z: number,
        },
        updateCoordsOnly: boolean;
        persistent: boolean;
        attachmentPoint: string;
      }[];
      attachedSfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        endScale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
        extraRoll: number;
        animSpeed: number;
        color: {
          x: number,
          y: number,
          z: number,
        },
        updateCoordsOnly: boolean;
        persistent: boolean;
        attachmentPoint: string;
      }[];
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.sfxSource = input.sfxSource;
    this.sfxYawType = input.sfxYawType;
    this.useLastCastPoint = input.useLastCastPoint;
    this.useHeight = input.useHeight;
    this.sfxList = [];
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    for (const sfx of input.attachedSfxList) {
      this.attachedSfxList.push(new SfxData().deserialize(sfx));
    }
    return this;
  }
}