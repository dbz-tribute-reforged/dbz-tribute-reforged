export module HeroSelectCategory {
  export let MELEE = 1;
  export let RANGED = 2;
  export let STR = 4;
  export let AGI = 8;
  export let INT = 16;

  let c_index = 32;

  export let GOOD = c_index; c_index*=2;
  export let EVIL = c_index; c_index*=2;

  export let BRUISER = c_index; c_index*=2;
  export let ASSASSIN = c_index; c_index*=2;
  export let BEAMER = c_index; c_index*=2;

  export let SUPPORT = c_index; c_index*=2;
  export let MICRO = c_index; c_index*=2;

  export let DBZ = c_index; c_index*=2;
  export let CRONO = c_index; c_index*=2;
  export let ANIME = c_index; c_index*=2;
  export let VIDEOGAME = c_index; c_index*=2;
  export let MEME = c_index; c_index*=2;

  export function setupHeroSelectCategories() {
    HeroSelector.addCategory("BTNHSGood.blp", "Good");
    HeroSelector.addCategory("BTNHSEvil.blp", "Evil");

    HeroSelector.addCategory("BTNFTSwordOfHope.blp", "Bruiser");
    HeroSelector.addCategory("BTNHitFlashFist.blp", "Assassin");
    HeroSelector.addCategory("BTNKame2.blp", "Beamer");

    HeroSelector.addCategory("ReplaceableTextures\\CommandButtons\\BTNSentryWard.blp", "Support");
    HeroSelector.addCategory("BTNFriezaArmy.blp", "Micro");

    HeroSelector.addCategory("BTNHSDBZ.blp", "DBZ");
    HeroSelector.addCategory("BTNHSCrono.blp", "Crono");
    HeroSelector.addCategory("BTNHSAnime.blp", "Anime");
    HeroSelector.addCategory("BTNHSVG.blp", "Videogame");
    HeroSelector.addCategory("BTNHSMeme.blp", "Meme");
  }
}
