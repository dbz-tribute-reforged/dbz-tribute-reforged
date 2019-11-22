import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";

export enum CostType {
  HP = "Life",
  MP = "Mana",
  STAMINA = "Stamina",
}

export interface CustomAbility {
  name: string;
  currentCd: number;
  maxCd: number;
  costType: CostType;
  costAmount: number;
  duration: number;
  updateRate: number;
  icon: Icon;
  tooltip: Tooltip;
  currentTick: number;
  delayTicks: number;
  abilityTimer: timer;

  activate(abilityData: CustomAbilityData): void;

  canCastAbility(abilityData: CustomAbilityData): boolean;
}
