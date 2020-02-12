import { CustomHeroAbilityManager } from "CustomHero/CustomHeroAbilityManager";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CastTimeHelper } from "./CastTimeHelper";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { AbilityComponentHelper } from "CustomAbility/AbilityComponent/AbilityComponentHelper";
import { AllCustomAbilities } from "CustomAbility/CustomAbilityManager";
import { HeroAbilitiesList } from "./HeroData/HeroAbilitiesList";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { HeroPassive } from "./HeroPassive/HeroPassive";
import { heroPassiveConfig } from "./HeroPassive/HeroPassiveConfig";

export class CustomHero {
  public abilities: CustomHeroAbilityManager;
  public isCasting: Map<CustomAbility, boolean>;

  public passive: HeroPassive | undefined;

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
    this.addAbilityFromAll(AbilityNames.BasicAbility.ZANZO_DASH);
    this.addAbilityFromAll(AbilityNames.BasicAbility.GUARD);
    this.addAbilityFromAll(AbilityNames.BasicAbility.MAX_POWER);
    
    // TODO: fix item abilities for heroes... 
    // item workaround.... for now
    this.addAbilityFromAll(AbilityNames.Items.ANDROID_BOMB);
    this.addAbilityFromAll(AbilityNames.Items.GETI_STAR_FRAGMENT);

    const unitTypeId = GetUnitTypeId(unit);

    const abilities = HeroAbilitiesList.get(unitTypeId);
    if (abilities) {
      for (const ability of abilities) {
        this.addAbilityFromAll(ability);
      }
    }

    this.passive = heroPassiveConfig.get(unitTypeId);
    if (this.passive) {
      this.passive.initialize(this);
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

  public getNumAbilities(): number {
    return this.abilities.size();
  }

  public hasAbility(name: string): boolean {
    return this.abilities.hasAbility(name);
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

  public cleanup() {
    this.isCasting.clear();
    this.abilities.cleanup();
  }
}