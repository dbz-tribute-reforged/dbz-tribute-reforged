import { AbilityComponent } from "./AbilityComponent";

export interface AddableComponent {
  addComponent(component: AbilityComponent): void;
}