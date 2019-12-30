export module ExperienceConstants {
  // hero req exp
  // need additional (lvl X * 25) xp to reach lvl X
  // legacy 200, 1.0, 100 (but xp rate was 400% instead of 100%)
  export const reqBase = 50;
  export const reqPrevMult = 1.0;
  export const reqLevelMult = 25;

  // creep xp table
  // legacy: 25, 1.0, 5, 5
  export const creepBase = 25;
  export const creepPrevMult = 1.0;
  export const creepLevelMult = 5;
  export const creepConstant = 5;

  // hero xp table
  // legacy 50, 1.0, 0.0, 100
  export const heroBase = 50;
  export const heroPrevMult = 1.0;
  export const heroLevelMult = 0.0;
  export const heroConstant = 100;

  export const globalXPRateModifier = 1.0;
  export const nearbyPlayerXPMult = 0.1;
  // legacy range: 3000
  export const expRange = 2500;
}