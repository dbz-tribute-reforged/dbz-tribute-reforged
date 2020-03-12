import { CustomAbility, CostType } from "./CustomAbility";
import { AbilityComponent } from "./AbilityComponent/AbilityComponent";
import { BeamComponent } from "./AbilityComponent/BeamComponent";
import { SfxComponent } from "./AbilityComponent/SfxComponent";
import { GroundVortex } from "./AbilityComponent/GroundVortex";
import { AOEDamage } from "./AbilityComponent/AOEDamage";
import { AOEDamageComponents } from "./AbilityData/AOEDamageComponents";
import { AOEKnockbackComponents } from "./AbilityData/AOEKnockbackComponents";
import { AOEKnockback } from "./AbilityComponent/AOEKnockback";
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
import { AOEStunComponents } from "./AbilityData/AOEStunComponents";
import { AOEStun } from "./AbilityComponent/AOEStun";
import { MultiComponents } from "./AbilityData/MultiComponents";
import { MultiComponent } from "./AbilityComponent/MultiComponent";
import { SpellAmpComponents } from "./AbilityData/SpellAmpComponent";
import { SpellAmp } from "./AbilityComponent/SpellAmp";
import { HideUnitComponents } from "./AbilityData/HideUnitComponents";
import { HideUnit } from "./AbilityComponent/HideUnit";
import { ChannellingComponents } from "./AbilityData/ChannellingComponents";
import { Channelling } from "./AbilityComponent/Channelling";
import { TimedLifeComponents } from "./AbilityData/TimedLifeComponents";
import { TimedLife } from "./AbilityComponent/TimedLife";
import { SummonComponents } from "./AbilityData/SummonComponents";
import { Summon } from "./AbilityComponent/Summon";
import { DashComponents } from "./AbilityData/DashComponents";
import { Dash } from "./AbilityComponent/Dash";
import { HookComponents } from "./AbilityData/HookComponents";
import { Hook } from "./AbilityComponent/Hook";
import { AOEApplyComponentComponents } from "./AbilityData/AOEApplyComponentComponents";
import { AOEApplyComponent } from "./AbilityComponent/AOEApplyComponent";
import { AddableComponent } from "./AbilityComponent/AddableComponent";
import { SelfDestructComponents } from "./AbilityData/SelfDestructComponents";
import { SelfDestruct } from "./AbilityComponent/SelfDestruct";
import { BarrierComponents } from "./AbilityData/BarrierComponents";
import { Barrier } from "./AbilityComponent/Barrier";
import { TeleportComponents } from "./AbilityData/TeleportComponents";
import { Teleport } from "./AbilityComponent/Teleport";
import { TempAbilityComponents } from "./AbilityData/TempAbilityComponents";
import { TempAbility } from "./AbilityComponent/TempAbility";
import { AOEDebuffComponents } from "./AbilityData/AOEDebuffComponents";
import { AOEDebuff } from "./AbilityComponent/AOEDebuff";
import { Hooks } from "Libs/TreeLib/Hooks";
import { DeflectorComponents } from "./AbilityData/DeflectorComponents";
import { Deflector } from "./AbilityComponent/Deflector";

export class CustomAbilityManager {
  private static instance: CustomAbilityManager; 

  public components: Map<string, AbilityComponent>;
  public abilities: Map<string, CustomAbility>;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CustomAbilityManager();
      Hooks.set("CustomAbilityManager", this.instance);
    }
    return this.instance;
  }

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

    for (const component of AOEDebuffComponents) {
      this.setComponent(new AOEDebuff().deserialize(component));
    }

    for (const component of AOEKnockbackComponents) {
      this.setComponent(new AOEKnockback().deserialize(component));
    }

    // this component has been deprecated
    // it is superseded by the AOEDebuff component
    // for (const component of AOEStunComponents) {
    //   this.setComponent(new AOEStun().deserialize(component));
    // }

    for (const component of BarrierComponents) {
      this.setComponent(new Barrier().deserialize(component));
    }

    for (const component of ChannellingComponents) {
      this.setComponent(new Channelling().deserialize(component));
    }

    for (const component of DamageBlockComponents) {
      this.setComponent(new DamageBlock().deserialize(component));
    }

    for (const component of DashComponents) {
      this.setComponent(new Dash().deserialize(component));
    }

    // cant add cause of weird error
    // for (const component of DeflectorComponents) {
    //   this.setComponent(new Deflector().deserialize(component));
    // }

    for (const component of DodgeComponents) {
      this.setComponent(new Dodge().deserialize(component));
    }

    for (const component of GroundVortexComponents) {
      this.setComponent(new GroundVortex().deserialize(component));
    }

    for (const component of HideUnitComponents) {
      this.setComponent(new HideUnit().deserialize(component));
    }

    for (const component of HookComponents) {
      this.setComponent(new Hook().deserialize(component));
    }

    for (const component of SelfDestructComponents) {
      this.setComponent(new SelfDestruct().deserialize(component));
    }

    for (const component of SpellAmpComponents) {
      this.setComponent(new SpellAmp().deserialize(component));
    }

    for (const component of SummonComponents) {
      this.setComponent(new Summon().deserialize(component));
    }

    for (const component of SwordSlashComponents) {
      this.setComponent(new SwordSlash().deserialize(component));
    }

    for (const component of TeleportComponents) {
      this.setComponent(new Teleport().deserialize(component));
    }

    for (const component of TempAbilityComponents) {
      this.setComponent(new TempAbility().deserialize(component));
    }

    for (const component of TimedLifeComponents) {
      this.setComponent(new TimedLife().deserialize(component));
    }


    // load beam components after all other singular components
    for (const beam of BeamComponents) {
      const beamComponent = new BeamComponent().deserialize(beam);
      this.addableComponentAddComponent(beamComponent, beam.components, 1);
      this.setComponent(beamComponent);
    }

    // load aoe applyable components after
    for (const aoeApplyComponentConfig of AOEApplyComponentComponents) {
      const aoeApplyComponent = new AOEApplyComponent().deserialize(aoeApplyComponentConfig);
      this.addableComponentAddComponent(aoeApplyComponent, aoeApplyComponentConfig.components, 1);
      this.setComponent(aoeApplyComponent);
    } 

    // load multi components after all other components
    for (const multi of MultiComponents) {
      const multiComponent = new MultiComponent().deserialize(multi);
      this.addableComponentAddComponent(multiComponent, multi.components, multiComponent.multiplyComponents);
      this.setComponent(multiComponent);
    }

    // load abilities after all multi components
    for (const abilityData of AbilitiesList) {
      const ability = new CustomAbility().deserialize(abilityData);
      this.addableComponentAddComponent(ability, abilityData.components, 1);
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

  addableComponentAddComponent(
    addTarget: AddableComponent, 
    components: { name: string }[], 
    numRepeatComponents: number,
  ) {
    for (let i = 0; i < numRepeatComponents; ++i) {
      for (const component of components) {
        const retrievedComponent = this.getComponent(component.name);
        if (retrievedComponent) {
          addTarget.addComponent(retrievedComponent.clone());
        }
      }
    }
  }
}