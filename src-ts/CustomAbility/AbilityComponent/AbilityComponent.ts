import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export interface AbilityComponent {
  name: string;
  repeatInterval: number;

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit): void;
  clone(): AbilityComponent;
}