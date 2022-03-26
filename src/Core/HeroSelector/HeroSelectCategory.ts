export module HeroSelectCategory {
  export let MELEE = 1;
  export let RANGED = 2;
  export let STR = 4;
  export let AGI = 8;
  export let INT = 16;

  let c_index = 32;

  export let GOOD = c_index; c_index*=2;
  export let EVIL = c_index; c_index*=2;
  export let CRONO = c_index; c_index*=2;
  export let MEME = c_index; c_index*=2;

  export let BRUISER = c_index; c_index*=2;
  export let ASSASSIN = c_index; c_index*=2;
  export let BEAMER = c_index; c_index*=2;

  export let CARRY = c_index; c_index*=2;
  export let SUPPORT = c_index; c_index*=2;
  export let MICRO = c_index; c_index*=2;

  export function setupHeroSelectCategories() {
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNHolyBolt.blp", "Good");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNDeathCoil.blp", "Evil");
    HeroSelector.addCategory("BTNCrono.blp", "Crono");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNSelectHeroOn.blp", "Meme");

    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNOrcMeleeUpThree.blp", "Brioser");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNDaggerOfEscape.blp", "Assassin");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNBrilliance.blp", "Beamer");

    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNTransmute.blp", "Carry");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNSentryWard.blp", "Support");
    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNDarkSummoning.blp", "Micro");
  }
}
