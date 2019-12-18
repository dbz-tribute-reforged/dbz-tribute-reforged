export module ExperienceConstants {
  // hero req exp
  // need additional (lvl X * 25) xp to reach lvl X
  export const reqBase = 50;
  export const reqPrevMult = 1.0;
  export const reqLevelMult = 25;

  // creep xp table
  export const creepBase = 25;
  export const creepPrevMult = 1.0;
  export const creepLevelMult = 5;
  export const creepConstant = 5;

  // hero xp table
  export const heroBase = 50;
  export const heroPrevMult = 1.0;
  export const heroLevelMult = 0.0;
  export const heroConstant = 100;

  export const globalXPRateModifier = 1.0;
  export const nearbyPlayerXPMult = 0.1;
  export const expRange = 3000;
}