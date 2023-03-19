import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export module ComponentConstants {
  export const MIN_DURATION: number = 0;
  export const MAX_DURATION: number = -1;
}

export interface AbilityComponent {
  name: string;
  repeatInterval: number;
  startTick: number;
  endTick: number;
  isStarted: boolean;
  isFinished: boolean;

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit): void;
  cleanup(): void;
  clone(): AbilityComponent;
}