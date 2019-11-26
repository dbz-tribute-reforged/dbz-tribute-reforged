import { SfxData } from "Common/SfxData";
import { Vector2D } from "Common/Vector2D";
import { CustomAbility } from "./CustomAbility";

export module AbilitySfxHelper {
  // probably move sfx stuff to a sfx displaying class
  // TODO: vary height of the sfx over their lifetime...
  // also expand to cover more sfx attributes for greater customisability
  export function displaySfxAtCoord(
    displayedSfx: SfxData, 
    target: Vector2D, 
    yaw: number,
    height: number,
    persistentSfx: effect[],
  ) {
    const createdSfx = AddSpecialEffect(displayedSfx.model, target.x, target.y);
    BlzSetSpecialEffectScale(createdSfx, displayedSfx.scale);
    const newYaw = yaw + displayedSfx.extraDirectionalYaw;
    if (newYaw > 0) {
      BlzSetSpecialEffectYaw(createdSfx, newYaw);
    }
    if (height + displayedSfx.startHeight > 0) {
      BlzSetSpecialEffectHeight(createdSfx, height + displayedSfx.startHeight);
    }
    if (displayedSfx.color.x + displayedSfx.color.y + displayedSfx.color.z < 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, displayedSfx.color.r, displayedSfx.color.g, displayedSfx.color.b);
    }

    if (displayedSfx.persistent) {
      persistentSfx.push(createdSfx);
    } else {
      DestroyEffect(createdSfx);
    }
  }

  // displays the sfx at the caster's location
  // if the current tick is divisible by the repeat interval
  export function displaySfxListAtCoord(ability: CustomAbility, sfxList: SfxData[], target: Vector2D, group: number, angle: number, height: number) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      // NOTE: avoid mod by 0 
      if (ability.isReadyToUse(sfx.repeatInterval)) {
        AbilitySfxHelper.displaySfxAtCoord(
          sfx, 
          target,
          angle,
          height,
          ability.persistentSfx,
        );
      };
    }
  }

  export function displaySfxOnUnit(displayedSfx: SfxData, unit: unit, angle: number, height: number, persistentSfx: effect[]) {
    const createdSfx = AddSpecialEffectTarget(displayedSfx.model, unit, displayedSfx.attachmentPoint);
    
    if (displayedSfx.color.x + displayedSfx.color.y + displayedSfx.color.z < 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, displayedSfx.color.r, displayedSfx.color.g, displayedSfx.color.b);
    }

    if (displayedSfx.persistent) {
      persistentSfx.push(createdSfx);
    } else {
      DestroyEffect(createdSfx);
    }
  }

  export function displaySfxListOnUnit(ability: CustomAbility, sfxList: SfxData[], unit: unit, group: number, angle: number, height: number) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      
      if (ability.isReadyToUse(sfx.repeatInterval)) {
        AbilitySfxHelper.displaySfxOnUnit(
          sfx,
          unit,
          angle,
          height,
          ability.persistentSfx,
        );
      }
    }
  }

  export function cleanupPersistentSfx(persistentSfx: effect[]) {
    for (const currentSfx of persistentSfx) {
      DestroyEffect(currentSfx);
    }
  }
}