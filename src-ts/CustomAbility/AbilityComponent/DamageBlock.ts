import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { SfxData } from "Common/SfxData";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";
import { Vector2D } from "Common/Vector2D";

export class DamageBlock implements AbilityComponent, Serializable<DamageBlock> {

  protected previousHp: number;
  protected remainingBlock: number;

  // may need its own sfx component to indicate when block is dead or not
  constructor(
    public name: string = "DamageBlock",
    public repeatInterval: number = 1,
    public blockPerDamage: number = 25,
    public isPercentageBlock: boolean = true,
    public attribute: number = bj_HEROSTAT_STR,
    public multiplier: number = 5,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {
    this.previousHp = 0;
    this.remainingBlock = 0;
  }

  calculateMaxBlock(unit: unit) {
    return this.multiplier * GetHeroStatBJ(this.attribute, unit, true);
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    let currentHp = GetUnitState(source, UNIT_STATE_LIFE);
    if (ability.currentTick == CustomAbility.START_TICK) {
      this.previousHp = currentHp;
      this.remainingBlock = this.calculateMaxBlock(input.caster.unit);
    }
    
    if (this.remainingBlock > 0) {

      // show group 0 of sfx while remainingBlock > 0
      AbilitySfxHelper.displaySfxListOnUnit(
        ability,
        this.attachedSfxList, 
        source, 
        0,
        0, 
        BlzGetUnitZ(source)
      );
      AbilitySfxHelper.displaySfxListAtCoord(
        ability,
        this.sfxList, 
        new Vector2D(GetUnitX(source), GetUnitY(source)), 
        0,
        0, 
        BlzGetUnitZ(source)
      );

      const hpDifference = this.previousHp - currentHp;
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
            0, 
            BlzGetUnitZ(source)
          );
          AbilitySfxHelper.displaySfxListAtCoord(
            ability,
            this.sfxList, 
            new Vector2D(GetUnitX(source), GetUnitY(source)), 
            1,
            0, 
            BlzGetUnitZ(source)
          );
        }

        this.remainingBlock -= amountBlocked;
        currentHp += amountBlocked;
        SetUnitState(source, UNIT_STATE_LIFE, currentHp);
      }

      this.previousHp = currentHp;
    }
  }
  

  clone(): AbilityComponent {
    return new DamageBlock(
      this.name, 
      this.repeatInterval,
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
      blockPerDamage: number;
      isPercentageBlock: boolean;
      attribute: number;
      multiplier: number;
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