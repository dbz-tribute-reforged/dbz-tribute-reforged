import { AbilityComponent } from "./AbilityComponent";

export module AbilityComponentHelper {

  export function clone(components: AbilityComponent[]): AbilityComponent[] {
    let cloned: AbilityComponent[] = [];
    for (const component of components) {
      cloned.push(component.clone());
    }
    return cloned;
  }
}