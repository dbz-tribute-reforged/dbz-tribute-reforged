import { CustomAbility, CostType } from "./CustomAbility";
import { AbilityComponent } from "./AbilityComponent/AbilityComponent";
import { GroundTargetDash } from "./AbilityComponent/GroundTargetDash";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { BeamComponent } from "./AbilityComponent/BeamComponent";
import { SfxComponent } from "./AbilityComponent/SfxComponent";
import { SfxData } from "Common/SfxData";
import { GroundVortex } from "./AbilityComponent/GroundVortex";
import { Vector3D } from "Common/Vector3D";
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

    // load component

    var jsonComponent = {
      type: "AOEDamage",
      name: "AOE DMG TEST",
      repeatInterval: 5,
      damageData: {
        multiplier: 2,
        attribute: 1,
        attackType: 6,
        damageType: 0,
        weaponType: 0,
      },
      aoe: 500,
    };

    const testComponent = new AOEDamage().deserialize(jsonComponent);
    this.setComponent(testComponent);
    
    var jsonAbility = {
      name: "Test Ability",
      currentCd: 0,
      maxCd: 4,
      costType: "MP",
      costAmount: 20,
      duration: 67,
      updateRate: 0.03,
      castTime: 0.4,
      canMultiCast: true,
      waitsForNextClick: false,
      animation: "spell",
      icon: {
        enabled: "Replaceabletextures\\CommandButtons\\BTNAcolyte.blp",
        disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNAcolyte.blp",
      },
      tooltip: {
        title: "Test Ability",
        body: "Body Text.",
      },
      components: [
        {name: "beam kamehameha"},
        {name: "sword slash orange"},
      ],
    };

    const testAbility = new CustomAbility().deserialize(jsonAbility);
    this.abilityAddComponent(testAbility, jsonAbility.components);

    this.setAbility(testAbility);






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