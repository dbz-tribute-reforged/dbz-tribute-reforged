import { CustomAbility, CostType } from "./CustomAbility";
import { AbilityComponent } from "./AbilityComponent/AbilityComponent";
import { GroundTargetDash } from "./AbilityComponent/GroundTargetDash";
import { BeamComponent } from "./AbilityComponent/BeamComponent";
import { SfxComponent } from "./AbilityComponent/SfxComponent";
import { GroundVortex } from "./AbilityComponent/GroundVortex";
import { AOEDamage } from "./AbilityComponent/AOEDamage";
import { AOEDamageComponents } from "./AbilityData/AOEDamageComponents";
import { AOEKnockbackComponents } from "./AbilityData/AOEKnockbackComponents";
import { AOEKnockback } from "./AbilityComponent/AOEKnockback";
import { FlyingForwardDashComponents } from "./AbilityData/FlyingForwardDashComponents";
import { FlyingForwardDash } from "./AbilityComponent/FlyingForwardDash";
import { GroundTargetDashComponents } from "./AbilityData/GroundTargetDashComponents";
import { GroundVortexComponents } from "./AbilityData/GroundVortexComponents";
import { SwordSlashComponents } from "./AbilityData/SwordSlashComponents";
import { SwordSlash } from "./AbilityComponent/SwordSlash";
import { BeamComponents } from "./AbilityData/BeamComponents";
import { SfxComponents } from "./AbilityData/SfxComponents";
import { AbilitiesList } from "./AbilityData/AbilitiesList";
import { DodgeComponents } from "./AbilityData/DodgeComponents";
import { Dodge } from "./AbilityComponent/Dodge";
import { DamageBlockComponents } from "./AbilityData/DamageBlockComponents";
import { DamageBlock } from "./AbilityComponent/DamageBlock";

export class CustomAbilityManager {
  public components: Map<string, AbilityComponent>;
  public abilities: Map<string, CustomAbility>;

  constructor() {
    this.abilities = new Map();
    this.components = new Map();

    // load sfx components first
    for (const component of SfxComponents) {
      this.setComponent(new SfxComponent().deserialize(component));
    }

    // create components then
    // save components into the components map
    for (const component of AOEDamageComponents) {
      this.setComponent(new AOEDamage().deserialize(component));
    }

    for (const component of AOEKnockbackComponents) {
      this.setComponent(new AOEKnockback().deserialize(component));
    }

    for (const component of DamageBlockComponents) {
      this.setComponent(new DamageBlock().deserialize(component));
    }

    for (const component of DodgeComponents) {
      this.setComponent(new Dodge().deserialize(component));
    }

    for (const component of FlyingForwardDashComponents) {
      this.setComponent(new FlyingForwardDash().deserialize(component));
    }

    for (const component of GroundTargetDashComponents) {
      this.setComponent(new GroundTargetDash().deserialize(component));
    }

    for (const component of GroundVortexComponents) {
      this.setComponent(new GroundVortex().deserialize(component));
    }

    for (const component of SwordSlashComponents) {
      this.setComponent(new SwordSlash().deserialize(component));
    }


    // load beam components after all other components
    for (const beam of BeamComponents) {
      const beamComponent = new BeamComponent().deserialize(beam);
      this.beamComponentAddComponent(beamComponent, beam.components);
      this.setComponent(beamComponent);
    }

    // load abilities after all other components
    for (const abilityData of AbilitiesList) {
      const ability = new CustomAbility().deserialize(abilityData);
      this.abilityAddComponent(ability, abilityData.components);
      this.setAbility(ability);
    }
  }

  setComponent(component: AbilityComponent): this {
    this.components.set(component.name, component);
    return this;
  }

  setAbility(ability: CustomAbility): this {
    this.abilities.set(ability.name, ability);
    return this;
  }

  getAbility(name: string) {
    return this.abilities.get(name);
  }

  getComponent(name: string) {
    return this.components.get(name);
  }

  beamComponentAddComponent(beam: BeamComponent, components: {name: string}[] ) {
    for (const component of components) {
      const retrievedComponent = this.getComponent(component.name);
      if (retrievedComponent) {
        beam.addComponent(retrievedComponent.clone());
      }
    }
  }

  abilityAddComponent(ability: CustomAbility, components: {name: string}[] ) {
    for (const component of components) {
      const retrievedComponent = this.getComponent(component.name);
      if (retrievedComponent) {
        ability.addComponent(retrievedComponent.clone());
      }
    }
  }
}

export const AllCustomAbilities: CustomAbilityManager = new CustomAbilityManager();