import { CustomHeroAbilityManager } from "CustomHero/CustomHeroAbilityManager";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CastTimeHelper } from "./CastTimeHelper";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { AbilityComponentHelper } from "CustomAbility/AbilityComponent/AbilityComponentHelper";
import { AllCustomAbilities } from "CustomAbility/CustomAbilityManager";
import { HeroAbilitiesList } from "./HeroData/HeroAbilitiesList";

export class CustomHero {
  public abilities: CustomHeroAbilityManager;
  public isCasting: Map<CustomAbility, boolean>;

  public isCastTimeWaiting: boolean;
  public spellPower: number;

  constructor(
    public readonly unit: unit,
  ) {
    // remove these defaults for actual heroes, i think
    this.abilities = new CustomHeroAbilityManager(
      [
        
      ]
    );
    this.isCasting = new Map();

    this.isCastTimeWaiting = false;
    this.spellPower = 1.0;

    // TODO: assign basic abilities to all heroes
    // then read some data and apply special abilities for
    // relevant heroes
    this.addAbilityFromAll("Zanzo Dash");
    this.addAbilityFromAll("Guard");
    this.addAbilityFromAll("Max Power");

    /*
    this.addAbilityFromAll("Ultra Instinct");

    this.addAbilityFromAll("Kamehameha");
    this.addAbilityFromAll("Unlock Potential");
    this.addAbilityFromAll("The Great Saiyaman has arrived!");
    this.addAbilityFromAll("Potential Unleashed");
    
    this.addAbilityFromAll("Super Dragon Flight");
    
    this.addAbilityFromAll("Kamehameha");
    this.addAbilityFromAll("Masenko");
    this.addAbilityFromAll("Twin Dragon Shot");
    this.addAbilityFromAll("Death Beam Barrage");
    this.addAbilityFromAll("Energy Blast Volley");

    this.addAbilityFromAll("Death Beam Frieza");
    this.addAbilityFromAll("Supernova Cooler");
    this.addAbilityFromAll("Nova Chariot");
    this.addAbilityFromAll("Deafening Wave");
    
    
    this.addAbilityFromAll("Geti Star Repair");

    this.addAbilityFromAll("Supernova Golden");

    this.addAbilityFromAll("Galick Gun");
    this.addAbilityFromAll("Final Flash");
    this.addAbilityFromAll("Big Bang Kamehameha");
    
    this.addAbilityFromAll("Kamehameha");
    this.addAbilityFromAll("Spirit Bomb");
    this.addAbilityFromAll("Dragon Fist");

    this.addAbilityFromAll("Final Flash");

    this.addAbilityFromAll("Planet Crusher");
    this.addAbilityFromAll("Gigantic Roar");
    */

    const abilities = HeroAbilitiesList.get(GetUnitTypeId(unit));
    if (abilities) {
      for (const ability of abilities) {
        this.addAbilityFromAll(ability);
      }
    }

  }

  public addAbilityFromAll(name: string) {
    const abil = AllCustomAbilities.getAbility(name);
    if (abil) {
      // possiblity that ability was not fully copied correctly
      const abilCopy = new CustomAbility(
        abil.name, 0, abil.maxCd, abil.costType, 
        abil.costAmount, abil.duration,
        abil.updateRate, abil.castTime, 
        abil.canMultiCast, abil.waitsForNextClick,
        abil.animation, abil.icon, abil.tooltip,
        AbilityComponentHelper.clone(abil.components),
      )
      this.abilities.add(abilCopy.name, abilCopy);
    }
    return (abil != undefined);
  }

  public useAbility(name: string, input: CustomAbilityInput) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(input)) {
      if (!this.isCastTimeWaiting || customAbility.canMultiCast) {
          if (!this.isCasting.get(customAbility)) {
            this.isCastTimeWaiting = true;
            this.isCasting.set(customAbility, true);
            CastTimeHelper.waitCastTimeThenActivate(this, customAbility, input);
          }
      }
    }
  }

  public canCastAbility(name: string, input: CustomAbilityInput): boolean {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility) {
      return customAbility.canCastAbility(input);
    }
    return false;
  }

  public getAbilityByIndex(index: number): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByIndex(index);
  }

  public addAbility(name: string, ability: CustomAbility): this {
    this.abilities.add(name, ability);
    return this;
  }

  public addSpellPower(modifier: number) {
    this.spellPower += modifier;
  }
  
  public removeSpellPower(modifier: number) {
    this.spellPower -= modifier;
  }
}