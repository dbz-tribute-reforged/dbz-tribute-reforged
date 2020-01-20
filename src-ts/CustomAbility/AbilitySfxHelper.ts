import { SfxData } from "Common/SfxData";
import { Vector2D } from "Common/Vector2D";
import { CustomAbility } from "./CustomAbility";
import { ComponentConstants } from "./AbilityComponent/AbilityComponent";

export module AbilitySfxHelper {
  // probably move sfx stuff to a sfx displaying class
  // TODO: vary height of the sfx over their lifetime...
  // also expand to cover more sfx attributes for greater customisability
  export function displaySfxAtCoord(
    displayedSfx: SfxData, 
    target: Vector2D, 
    yaw: number,
    height: number,
    persistentSfx: Map<SfxData, effect[]>,
  ) {
    if (
      displayedSfx.persistent && 
      displayedSfx.updateCoordsOnly 
    ) {
      const currentEffects = persistentSfx.get(displayedSfx);
      if (currentEffects) {
        for (const effect of currentEffects) {
          BlzSetSpecialEffectX(effect, target.x);
          BlzSetSpecialEffectY(effect, target.y);
          if (height + displayedSfx.startHeight > 0) {
            BlzSetSpecialEffectHeight(effect, height + displayedSfx.startHeight);
          }
        }
        // yes i know, bad, but if current sfx not found, create sfx
        return;
      }
    }
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

    manageSfxPersistence(displayedSfx, createdSfx, persistentSfx);
  }

  // displays the sfx at the caster's location
  // if the current tick is divisible by the repeat interval
  export function displaySfxListAtCoord(ability: CustomAbility, sfxList: SfxData[], target: Vector2D, group: number, angle: number, height: number) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      // NOTE: avoid mod by 0 
      if (ability.isReadyToUse(sfx.repeatInterval, ComponentConstants.MIN_DURATION, ComponentConstants.MAX_DURATION)) {
        AbilitySfxHelper.displaySfxAtCoord(
          sfx, 
          target,
          angle,
          height,
          ability.persistentUniqueSfx,
        );
      };
    }
  }

  export function displaySfxOnUnit(
    displayedSfx: SfxData, 
    unit: unit, 
    angle: number, 
    height: number, 
    persistentSfx: Map<SfxData, effect[]>
  ) {
    const createdSfx = AddSpecialEffectTarget(displayedSfx.model, unit, displayedSfx.attachmentPoint);
    
    if (displayedSfx.color.x + displayedSfx.color.y + displayedSfx.color.z < 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, displayedSfx.color.r, displayedSfx.color.g, displayedSfx.color.b);
    }

    manageSfxPersistence(displayedSfx, createdSfx, persistentSfx);
  }

  export function displaySfxListOnUnit(ability: CustomAbility, sfxList: SfxData[], unit: unit, group: number, angle: number, height: number) {
    for (const sfx of sfxList) {
      if (sfx.group != group && group != SfxData.SHOW_ALL_GROUPS) continue;
      
      if (ability.isReadyToUse(sfx.repeatInterval, ComponentConstants.MIN_DURATION, ComponentConstants.MAX_DURATION)) {
        AbilitySfxHelper.displaySfxOnUnit(
          sfx,
          unit,
          angle,
          height,
          ability.persistentUniqueSfx,
        );
      }
    }
  }

  export function cleanupPersistentSfx(persistentSfx: effect[]) {
    for (const currentSfx of persistentSfx) {
      DestroyEffect(currentSfx);
    }
  }

  export function manageSfxPersistence(
    displayedSfx: SfxData, 
    createdSfx: effect, 
    persistentSfx: Map<SfxData, effect[]>
  ) {
    if (displayedSfx.persistent) {
      const effects = persistentSfx.get(displayedSfx);
      if (effects) {
        effects.push(createdSfx);
      } else {
        persistentSfx.set(displayedSfx, [createdSfx]);
      }
    } else {
      DestroyEffect(createdSfx);
    }
  }
}