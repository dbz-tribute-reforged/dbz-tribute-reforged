import { CustomHero } from "CustomHero/CustomHero";

export interface HeroPassive {
  initialize(customHero: CustomHero): void;
}