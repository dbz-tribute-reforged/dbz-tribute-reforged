import { HeroPassive } from "./HeroPassive";
import { SuperJanemba } from "./SuperJanemba";
import { KidBuu } from "./KidBuu";

export const heroPassiveConfig = new Map<number, HeroPassive>(
  [
    [FourCC("H062"), new SuperJanemba()],
    //[FourCC("O00C"), new KidBuu()],
  ],
);