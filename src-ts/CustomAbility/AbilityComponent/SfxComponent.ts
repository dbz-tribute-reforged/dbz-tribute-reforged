import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { SfxData } from "Common/SfxData";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";

export class SfxComponent implements AbilityComponent {

  constructor(
    public name: string = "SfxComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {

  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    AbilitySfxHelper.displaySfxListAtCoord(
      ability,
      this.sfxList, 
      new Vector2D(GetUnitX(source), GetUnitY(source)), 
      SfxData.SHOW_ALL_GROUPS,
      0, 
      BlzGetUnitZ(source),
    );
    AbilitySfxHelper.displaySfxListOnUnit(
      ability,
      this.attachedSfxList,
      source,
      SfxData.SHOW_ALL_GROUPS,
      0,
      BlzGetUnitZ(source),
    )
  }

  clone(): AbilityComponent {
    return new SfxComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.sfxList, this.attachedSfxList,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        color: {
          x: number,
          y: number,
          z: number,
        },
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
        color: {
          x: number,
          y: number,
          z: number,
        },
        persistent: boolean;
        attachmentPoint: string;
      }[];
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
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