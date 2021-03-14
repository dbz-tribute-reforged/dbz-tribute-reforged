import { SfxData } from "Common/SfxData";
import { Vector2D } from "Common/Vector2D";
import { CustomAbility } from "./CustomAbility";
import { ComponentConstants } from "./AbilityComponent/AbilityComponent";
import { CoordMath } from "Common/CoordMath";

export module AbilitySfxHelper {
  // probably move sfx stuff to a sfx displaying class
  // also expand to cover more sfx attributes for greater customisability
  export function displaySfxAtCoord(
    sfxData: SfxData, 
    target: Vector2D, 
    yaw: number,
    height: number,
    timeRatio: number,
  ) {
    if (
      sfxData.persistent && 
      sfxData.updateCoordsOnly 
    ) {
      if (sfxData.effects.length > 0) {
        const effect = sfxData.effects[0];
        BlzSetSpecialEffectX(effect, target.x);
        BlzSetSpecialEffectY(effect, target.y);

        if (sfxData.endScale >= 0) {
          BlzSetSpecialEffectScale(effect, 
            sfxData.scale + (sfxData.endScale - sfxData.scale) * timeRatio
          );
        }

        const newYaw = yaw + sfxData.extraDirectionalYaw * CoordMath.degreesToRadians;
        if (newYaw > 0) {
          BlzSetSpecialEffectYaw(effect, newYaw);
        }
        
        if (height + sfxData.startHeight > 0 || sfxData.startHeight <= 0) {
          BlzSetSpecialEffectHeight(effect, 
            height + sfxData.startHeight + 
            (sfxData.endHeight - sfxData.startHeight) * timeRatio
          );
        }
        // if effect exists, modify, then return
        // otherwise: still need to create sfx
        return;
      }
    }
    const createdSfx = AddSpecialEffect(sfxData.model, target.x, target.y);
    BlzSetSpecialEffectScale(createdSfx, sfxData.scale);
    const newYaw = yaw + sfxData.extraDirectionalYaw * CoordMath.degreesToRadians;
    if (newYaw > 0) {
      BlzSetSpecialEffectYaw(createdSfx, newYaw);
    }

    if (sfxData.extraPitch > 0) {
      BlzSetSpecialEffectPitch(createdSfx, sfxData.extraPitch * CoordMath.degreesToRadians);
    }

    if (sfxData.extraRoll > 0) {
      BlzSetSpecialEffectRoll(createdSfx, sfxData.extraRoll * CoordMath.degreesToRadians);
    }

    if (height + sfxData.startHeight > 0 || sfxData.startHeight <= 0) {
      BlzSetSpecialEffectHeight(createdSfx, 
        height + sfxData.startHeight + 
        (sfxData.endHeight - sfxData.startHeight) * timeRatio
      );
    }
    if (sfxData.color.x + sfxData.color.y + sfxData.color.z < 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, sfxData.color.r, sfxData.color.g, sfxData.color.b);
    }
    if (sfxData.animSpeed != 1.0) {
      BlzSetSpecialEffectTimeScale(createdSfx, sfxData.animSpeed);
    }

    manageSfxPersistence(sfxData, createdSfx);
  }

  // displays the sfx at the caster's location
  // if the current tick is divisible by the repeat interval
  export function displaySfxListAtCoord(
    ability: CustomAbility, 
    sfxList: SfxData[], 
    target: Vector2D, 
    group: number, 
    angle: number, 
    height: number,
    timeRatio: number,
  ) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      // NOTE: avoid mod by 0 
      if (ability.isReadyToUse(sfx.repeatInterval, ComponentConstants.MIN_DURATION, ComponentConstants.MAX_DURATION)) {
        AbilitySfxHelper.displaySfxAtCoord(
          sfx, 
          target,
          angle,
          height,
          timeRatio,
        );
      };
    }
  }

  export function displaySfxOnUnit(
    sfxData: SfxData, 
    unit: unit, 
    angle: number, 
    height: number, 
    timeRatio: number,
  ) {
    const createdSfx = AddSpecialEffectTarget(sfxData.model, unit, sfxData.attachmentPoint);
    
    if (sfxData.color.x + sfxData.color.y + sfxData.color.z < 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, sfxData.color.r, sfxData.color.g, sfxData.color.b);
    }

    manageSfxPersistence(sfxData, createdSfx);
  }

  export function displaySfxListOnUnit(
    ability: CustomAbility, 
    sfxList: SfxData[], 
    unit: unit, 
    group: number, 
    angle: number, 
    height: number,
    timeRatio: number,
  ) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      
      if (ability.isReadyToUse(sfx.repeatInterval, ComponentConstants.MIN_DURATION, ComponentConstants.MAX_DURATION)) {
        AbilitySfxHelper.displaySfxOnUnit(
          sfx,
          unit,
          angle,
          height,
          timeRatio,
        );
      }
    }
  }

  export function cleanupPersistentSfx(sfxData: SfxData[]) {
    for (const currentSfx of sfxData) {
      for (const effect of currentSfx.effects) {
        DestroyEffect(effect);
      }
      currentSfx.effects.splice(0, currentSfx.effects.length);
    }
  }

  export function manageSfxPersistence(
    sfxData: SfxData, 
    createdSfx: effect, 
  ) {
    if (sfxData.persistent) {
      sfxData.effects.push(createdSfx);
    } else {
      DestroyEffect(createdSfx);
    }
  }

  export function duplicateSfxList(sfxList: SfxData[]): SfxData[] {
    const duplicate: SfxData[] = [];
    for (const sfx of sfxList) {
      duplicate.push(sfx.clone());
    }
    return duplicate;
  }
}