import { UnitHelper } from "Common/UnitHelper";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { SfxData } from "./SfxData";
import { Vector2D } from "Common/Vector2D";

export enum CostType {
  HP = "Life",
  MP = "Mana",
  STAMINA = "Stamina",
}

export abstract class CustomAbility {

  protected currentTick: number;
  protected delayTicks: number;
  protected abilityTimer: timer;
  protected persistentSfx: effect[];

  constructor(
    public name: string, 
    public currentCd: number,
    public maxCd: number,
    public costType: CostType,
    public costAmount: number,
    public duration: number,
    public updateRate: number,
    public icon: Icon,
    public tooltip: Tooltip,
  ) {
    this.currentTick = 0;
    this.delayTicks = 0;
    this.abilityTimer = CreateTimer();
    this.persistentSfx = [];
  }

  activate(abilityInput: CustomAbilityInput): void {
    // fill this out on a per-ability basis
  }

  canCastAbility(input: CustomAbilityInput): boolean {
    if (this.currentCd > 0) return false;
    if (this.currentTick > 0) return false;
    if (!input || !input.caster || !input.casterPlayer || !input.targetPoint || !input.mouseData) return false;
    if (UnitHelper.isUnitStunned(input.caster.unit)) {
      return false;
    }
    if (
      (this.costType == CostType.HP && GetUnitState(input.caster.unit, UNIT_STATE_LIFE) < this.costAmount)
      ||
      (this.costType == CostType.MP && GetUnitState(input.caster.unit, UNIT_STATE_MANA) < this.costAmount)
    ) {
      return false;
    }
    return true;
  }

  takeCosts(input: CustomAbilityInput) {
    this.currentCd = this.maxCd;
    if (this.costType == CostType.HP) {
      SetUnitState(
        input.caster.unit, 
        UNIT_STATE_LIFE,
        GetUnitState(input.caster.unit, UNIT_STATE_LIFE) - this.costAmount
      );
    } else if (this.costType == CostType.MP) {
      SetUnitState(
        input.caster.unit, 
        UNIT_STATE_MANA,
        GetUnitState(input.caster.unit, UNIT_STATE_MANA) - this.costAmount
      );
    } else {
      // stamina
    }
  }

  updateCd() {
    if (this.currentCd <= 0 && this.currentTick >= this.duration) {
      this.currentCd = 0;
      this.currentTick = 0;
      this.delayTicks = 0;
      PauseTimer(this.abilityTimer);
    } else {
      this.currentCd -= this.updateRate;
    }
  }
  
  isBasicValidTarget(unit: unit, caster: player): boolean {
    return (
      IsUnitEnemy(unit, caster) == true
      &&
      !BlzIsUnitInvulnerable(unit)
    );
  }

  // TODO: vary height of the sfx over their lifetime...
  // also expand to cover more sfx attributes for greater customisability
  displaySfxAtCoord(
    displayedSfx: SfxData, 
    target: Vector2D, 
    yaw: number,
    height: number,
  ) {
    const createdSfx = AddSpecialEffect(displayedSfx.model, target.x, target.y);
    BlzSetSpecialEffectScale(createdSfx, displayedSfx.scale);
    const newYaw = yaw + displayedSfx.extraDirectionalYaw;
    if (newYaw > 0) {
      BlzSetSpecialEffectYaw(createdSfx, newYaw);
    }
    if (displayedSfx.startHeight > 0) {
      BlzSetSpecialEffectHeight(createdSfx, height + displayedSfx.startHeight);
    }
    if (displayedSfx.color.x + displayedSfx.color.y + displayedSfx.color.z != 255 * 3) {
      BlzSetSpecialEffectColor(createdSfx, displayedSfx.color.r, displayedSfx.color.g, displayedSfx.color.b);
    }

    if (displayedSfx.persistent) {
      this.persistentSfx.push(createdSfx);
    } else {
      DestroyEffect(createdSfx);
    }
  }

  // displays the sfx at the caster's location
  // if the current tick is divisible by the repeat interval
  displaySfxListAtCoord(sfxList: SfxData[], target: Vector2D, angle: number, height: number) {
    for (const sfx of sfxList) {
      // NOTE: avoid mod by 0 
      if (
        this.currentTick == 0 || 
        (sfx.repeatInterval != 0 && this.currentTick % sfx.repeatInterval == 0)
      ) {
        this.displaySfxAtCoord(
          sfx, 
          target,
          angle,
          height,
        );
      }
    }
  }

  cleanupPersistentSfx(): this {
    for (const currentSfx of this.persistentSfx) {
      DestroyEffect(currentSfx);
    }
    this.persistentSfx = [];
    return this;
  }
}
