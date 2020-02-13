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
  protected sfxStarted: boolean;

  constructor(
    public name: string = "SfxComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public sfxSource: number = SfxComponent.SOURCE_UNIT,
    public sfxYawType: number = SfxComponent.YAW_SOURCE_FACING,
    public useLastCastPoint: boolean = true,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {
    this.sfxCoords = new Vector2D();
    this.sfxStarted = false;
  }

  getActualTargetPoint(input: CustomAbilityInput): Vector2D {
    if (this.useLastCastPoint) {
      return input.castPoint;
    }
    return input.targetPoint;
  }

  setSfxCoordsToTargettedPoint(input: CustomAbilityInput) {
    const actualTargetPoint = this.getActualTargetPoint(input);
    this.sfxCoords = new Vector2D(actualTargetPoint.x, actualTargetPoint.y);
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.sfxStarted) {
      AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
      AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
      this.sfxStarted = true;
      if (this.sfxSource == SfxComponent.SOURCE_TARGET_POINT_FIXED) {
        this.setSfxCoordsToTargettedPoint(input);
      }
    }

    if (this.sfxSource == SfxComponent.SOURCE_TARGET_POINT_DYNAMIC) {
      this.setSfxCoordsToTargettedPoint(input);
    } else if (this.sfxSource == SfxComponent.SOURCE_UNIT) {
      this.sfxCoords.x = GetUnitX(source);
      this.sfxCoords.y = GetUnitY(source);
    } else if (this.sfxSource == SfxComponent.SOURCE_TARGET_UNIT) {
      if (input.targetUnit) {
        this.sfxCoords = new Vector2D(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
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
    const height = GetUnitFlyHeight(source) + BlzGetUnitZ(source);

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
    )


    if (ability.isFinishedUsing(this)) {
      AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
      AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
      this.sfxStarted = false;
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
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
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
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
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