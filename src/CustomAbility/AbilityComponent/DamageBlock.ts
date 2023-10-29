import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { SfxData } from "Common/SfxData";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class DamageBlock implements AbilityComponent, Serializable<DamageBlock> {

  protected previousHp: number;
  protected remainingBlock: number;
  protected currentHp: number;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  // may need its own sfx component to indicate when block is dead or not
  constructor(
    public name: string = "DamageBlock",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public blockPerDamage: number = 25,
    public isPercentageBlock: boolean = true,
    public attribute: number = bj_HEROSTAT_STR,
    public multiplier: number = 3,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {
    this.previousHp = 0;
    this.remainingBlock = 0;
    this.currentHp = 0;
  }

  calculateMaxBlock(input: CustomAbilityInput): number {
    return (
      input.level * input.caster.spellPower * this.multiplier * 
      (
        GetHeroStatBJ(this.attribute, input.caster.unit, true)
      )
    );
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.currentHp = GetUnitState(source, UNIT_STATE_LIFE);

    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
      this.previousHp = this.currentHp;
      this.remainingBlock = this.calculateMaxBlock(input);
    }
    
    if (this.remainingBlock > 0) {
      const timeRatio = ability.calculateTimeRatio(this.startTick, this.endTick);
      // show group 0 of sfx while remainingBlock > 0
      const yaw = GetUnitFacing(source) * CoordMath.degreesToRadians;
      const height = GetUnitFlyHeight(source) + BlzGetUnitZ(source);

      AbilitySfxHelper.displaySfxListOnUnit(
        ability,
        this.attachedSfxList, 
        source, 
        0,
        yaw, 
        height,
        timeRatio,
      );
      AbilitySfxHelper.displaySfxListAtCoord(
        ability,
        this.sfxList, 
        new Vector2D(GetUnitX(source), GetUnitY(source)), 
        0,
        yaw, 
        height,
        timeRatio,
      );

      const hpDifference = this.previousHp - this.currentHp;
      if (hpDifference > 0) {
        let amountBlocked = 0;
        if (this.isPercentageBlock) {
          amountBlocked = this.blockPerDamage * 0.01 * hpDifference;
        } else {
          amountBlocked = this.blockPerDamage;
        }

        if (amountBlocked > this.remainingBlock) {
          amountBlocked = this.remainingBlock;

          // no more block remaining
          // show group 1 of sfx
          AbilitySfxHelper.displaySfxListOnUnit(
            ability,
            this.attachedSfxList, 
            source, 
            1,
            yaw, 
            height,
            timeRatio,
          );
          AbilitySfxHelper.displaySfxListAtCoord(
            ability,
            this.sfxList, 
            new Vector2D(GetUnitX(source), GetUnitY(source)), 
            1,
            yaw, 
            height,
            timeRatio,
          );
        }

        const maxHp = GetUnitState(source, UNIT_STATE_MAX_LIFE);
        if (this.currentHp + amountBlocked > maxHp) {
          amountBlocked = maxHp - this.currentHp;
        }
        this.remainingBlock -= amountBlocked;
        this.currentHp += amountBlocked;
        SetUnitState(source, UNIT_STATE_LIFE, this.currentHp);
      }

      this.previousHp = this.currentHp;
    }

    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      
      AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
      AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
    }
  }
  
  cleanup() {
    AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
    AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
  }
  

  clone(): AbilityComponent {
    return new DamageBlock(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.blockPerDamage,
      this.isPercentageBlock,
      this.attribute,
      this.multiplier,
      this.sfxList,
      this.attachedSfxList,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      blockPerDamage: number;
      isPercentageBlock: boolean;
      attribute: number;
      multiplier: number;
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
    this.blockPerDamage = input.blockPerDamage;
    this.isPercentageBlock = input.isPercentageBlock;
    this.attribute = input.attribute;
    this.multiplier = input.multiplier;
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    for (const attachedSfx of input.attachedSfxList) {
      this.attachedSfxList.push(new SfxData().deserialize(attachedSfx));
    }
    return this;
  }
}