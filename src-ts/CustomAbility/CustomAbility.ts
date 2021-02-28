import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { AbilityComponent, ComponentConstants } from "./AbilityComponent/AbilityComponent";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { AbilitySfxHelper } from "./AbilitySfxHelper";
import { UnitHelper } from "Common/UnitHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { Colorizer } from "Common/Colorizer";
import { AddableComponent } from "./AbilityComponent/AddableComponent";
import { SfxData } from "Common/SfxData";

export enum CostType {
  HP = "Life",
  MP = "Mana",
  STAMINA = "Stamina",
}

export function stringToCostType(costType: string): CostType {
  if (costType == "Life" || costType == "HP") {
    return CostType.HP;
  } else if (costType == "Mana" || costType == "MP") {
    return CostType.MP;
  }
  return CostType.STAMINA;
}

export class CustomAbility implements Serializable<CustomAbility>, AddableComponent {
  static readonly BASE_DAMAGE = 1500;
  static readonly BASE_AVG_TICKS = 5;

  public currentTick: number;
  protected abilityTimer: timer;

  constructor(
    public name: string = "No Ability", 
    public currentCd: number = 0,
    public maxCd: number = 1,
    public costType: CostType = CostType.MP,
    public costAmount: number = 25,
    public duration: number = 25,
    public updateRate: number = 0.03,
    public castTime: number = 0.25,
    public canMultiCast: boolean = false,
    public waitsForNextClick: boolean = false,
    public animation: string = "spell",
    public icon: Icon = new Icon(),
    public tooltip: Tooltip = new Tooltip(),
    public components: AbilityComponent[] = [],
  ) {
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
  }

  activate(input: CustomAbilityInput): void {
    this.takeCosts(input);

    // instant activate, bypasses 0.03s delay for ability to start
    if (this.currentTick <= this.duration) {
      for (const component of this.components) {
        if (this.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
          component.performTickAction(this, input, input.caster.unit);
        }
      }
      ++this.currentTick;
    }
    this.updateCd();
    // activate over time every 0.03s
    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick <= this.duration) {
        for (const component of this.components) {
          if (this.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
            component.performTickAction(this, input, input.caster.unit);
          }
        }
        ++this.currentTick;
      }
      this.updateCd();
    });
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

  getName(): string {
    return this.name;
  }

  isInUse(): boolean {
    return (this.currentTick > 0 && this.currentTick <= this.duration);
  }

  updateCd() {
    if (this.currentCd <= 0 && this.currentTick > this.duration) {
      this.currentCd = 0;
      this.currentTick = 0;
      PauseTimer(this.abilityTimer);
    } else {
      this.currentCd -= this.updateRate;
    }
  }

  reduceCurrentTick(amount: number) {
    this.currentTick = Math.max(2, this.currentTick - amount);
  }

  getCurrentCd(): number {
    return this.currentCd;
  }

  setCd(amount: number) {
    this.currentCd = amount;
  }

  setCurrentTick(amount: number) {
    this.currentTick = amount;
  }

  getDuration(): number {
    return this.duration;
  }

  isReadyToUse(repeatInterval: number, startTick: number, endTick: number): boolean {
    return (
      (
        (this.currentTick >= startTick) 
        &&
        (startTick != ComponentConstants.MAX_DURATION ||
          (
            startTick == ComponentConstants.MAX_DURATION && 
            (this.currentTick == endTick || this.currentTick == this.duration)
          ) 
        )
        && 
        (this.currentTick <= endTick || endTick == ComponentConstants.MAX_DURATION)
      ) 
        && 
      (
        (repeatInterval > 0 && this.currentTick % repeatInterval == 0) ||
        (
          (repeatInterval == startTick || repeatInterval == 0) && 
          this.currentTick == startTick
        ) 
        || 
        (
          (repeatInterval == this.duration || repeatInterval == ComponentConstants.MAX_DURATION) && 
          this.currentTick == this.duration
        )
      )
    );
  }

  isFinishedUsing(component: AbilityComponent): boolean {
    return (
      this.currentTick >= component.endTick && 
      (
        component.endTick != ComponentConstants.MAX_DURATION ||
        this.currentTick >= this.duration
      )
    );
  }

  calculateTimeRatio(
    startTick: number, 
    endTick: number
  ): number {
    let timeRatio = 0;
    if (startTick == ComponentConstants.MAX_DURATION) {
      timeRatio = 1;
    } else {
      let lastTick = endTick;
      if (endTick == ComponentConstants.MAX_DURATION) {
        lastTick = this.duration;
      }
      if (lastTick >= startTick) {
        timeRatio = (this.currentTick - startTick) / (lastTick - startTick);
      }
    }
    return timeRatio;
  }

  cleanup() {
    this.currentTick = this.duration + 1;
    for (const component of this.components) {
      component.cleanup();
    }
  }

  deserialize(
    input: {
      name: string;
      currentCd: number;
      maxCd: number;
      costType: string;
      costAmount: number;
      duration: number;
      updateRate: number;
      castTime: number;
      canMultiCast: boolean;
      waitsForNextClick: boolean;
      animation: string;
      icon: {
        enabled: string;
        disabled: string;
      };
      tooltip: {
        title: string;
        body: string;
      };
      components: {
        name: string;
      }[];
    },
  ) {
    this.name = input.name;
    this.currentCd = input.currentCd;
    this.maxCd = input.maxCd;
    this.costType = stringToCostType(input.costType);
    this.costAmount = input.costAmount;
    this.duration = input.duration;
    this.updateRate = input.updateRate;
    this.castTime = input.castTime;
    this.canMultiCast = input.canMultiCast;
    this.waitsForNextClick = input.waitsForNextClick;
    this.animation = input.animation;
    this.icon = new Icon().deserialize(input.icon);
    this.tooltip = new Tooltip().deserialize(input.tooltip);
    return this;
  }

  addComponent(component: AbilityComponent) {
    return this.components.push(component);
  }
}
