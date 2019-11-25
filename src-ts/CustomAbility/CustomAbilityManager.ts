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

export class CustomAbilityManager {
  public components: Map<string, AbilityComponent>;
  public abilities: Map<string, CustomAbility>;

  constructor(
    componentFiles: string[] = [],
    abilityFiles: string[] = [],
  ) {
    this.abilities = new Map();
    this.components = new Map();

    for (const componentFile of componentFiles) {
      // create component
      // save components into the components map
    }

    // make abilities
    // save abilities into abilities map

    const zanzoDashComponent = new GroundTargetDash(
      "zanzoDashComponent", 1, 40.0,
    );
    const zanzoSfxComponent = new SfxComponent(
      "ZanzoSfx", 0,
      [
        new SfxData(
          "WindCircleFaster.mdl", 0, 0, 1.1
        ),
      ],
      [
        new SfxData(
          "DustWindFasterExact.mdl"
        )
      ],
    );

    const zanzoAbility = new CustomAbility(
      "Zanzo Dash", 0, 4, CostType.MP, 25, 25, 0.03, 0.03, true, true, "attack", 
      new Icon(
        "ReplaceableTextures\\CommandButtons\\BTNBlink.blp",
        "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBlink.blp"
      ),
      new Tooltip(
        "Zanzo Dash",
        "Dashes towards your last right click." + 
        "|nCost: 25 MP |nCD: 4",
      ),
      [zanzoDashComponent, zanzoSfxComponent],
    );
    this.setComponent(zanzoDashComponent).setAbility(zanzoAbility);

      
    const hurricaneComponent = new GroundVortex();
    const hurricaneSfxComponent = new SfxComponent(
      "hurricaneSfxComponent", 25,
      [

      ],
      [
        new SfxData(
          "Abilities\\Spells\\Other\\Tornado\\TornadoElemental.mdl", 
          75, 0, 3.0, 0, 0, 0, 
          new Vector3D(55, 155, 255),
          false
        ),
        new SfxData("Objects\Spawnmodels\Naga\NagaDeath\NagaDeath.mdl", 50, 1.5),
      ],
    );
    const hurricaneAbility = new CustomAbility(
      "Blue Hurricane", 0, 10, CostType.MP,
      120, 250, 0.03, 0.25, false, false, 
      "spell", 
      new Icon(
        "ReplaceableTextures\\CommandButtons\\BTNTornado.blp",
        "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNTornado.blp"
      ),
      new Tooltip(
        "Blue Hurricane",
        "The fastest attack in the universe!" + 
        "|nDeals 0.02 * AGI per tick " + 
        "(x2 when closer," + 
        "and another x2 over the duration of the ability)" + 
        "|nCost: 120 MP |nCD: 10",
      ),
      [hurricaneComponent, hurricaneSfxComponent],
    )
    this.setComponent(hurricaneComponent).setComponent(hurricaneSfxComponent).setAbility(hurricaneAbility);


    const beamComponent = new BeamComponent();
    const beamAbility = new CustomAbility(
      "Beam Base", 0, 4, CostType.HP, 50, 160, 0.03, 0.03, 
      false, true, "spell", 
      new Icon(
        "ReplaceableTextures\\CommandButtons\\BTNBreathOfFrost.blp",
        "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBreathOfFrost.blp"
      ),
      new Tooltip(
        "Beam Base",
        "Fires a beam" + 
        "|nDeals ? * INT per Damage Tick" + 
        "|nCost: 50 HP |nCD: 4",
      ),
      [beamComponent],
    )
    this.setComponent(beamComponent).setAbility(beamAbility);






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
      duration: 50,
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
        {name: "AOE DMG TEST"},
        {name: "zanzoDashComponent"},
        {name: "hurricaneSfxComponent"},
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
        beam.addComponent(retrievedComponent);
      }
    }
  }

  abilityAddComponent(ability: CustomAbility, components: {name: string}[] ) {
    for (const component of components) {
      const retrievedComponent = this.getComponent(component.name);
      if (retrievedComponent) {
        ability.addComponent(retrievedComponent);
      }
    }
  }
}

export const AllCustomAbilities: CustomAbilityManager = new CustomAbilityManager();