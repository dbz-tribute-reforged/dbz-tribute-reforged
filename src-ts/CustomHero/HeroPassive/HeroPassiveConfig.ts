import { HeroPassive } from "./HeroPassive";
import { SuperJanemba } from "./SuperJanemba";

export const heroPassiveConfig = new Map<number, HeroPassive>(
  [
    [FourCC("H062"), new SuperJanemba()],
  ],
);