export module ItemConstants {
  export const ABILITY_UPGRADE_ITEM = FourCC("A0F1");
  export const ABILITY_TIME_RING = FourCC("A0NU");
  export const BIO_LAB_AOE = 600;
  export const BIO_LAB_DAMAGE = 0.014;
  export const BRAVE_SWORD_AOE = 600;
  export const BRAVE_SWORD_MANA_LOSS = 0.02;

  export const battleArmor = [
    FourCC("I036"),
    FourCC("I037"),
    FourCC("I03C"),
    FourCC("I03D"),
    FourCC("I03E"),
    FourCC("I04B"),
  ];
  export const wheeloResearch = [
    FourCC("I00I"),
    FourCC("I038"),
    FourCC("I039"),
    FourCC("I03A"),
    FourCC("I03B"),
  ];
  export const darknessGenerator = [
    FourCC("I035"),
  ];
  export const scouter = [
    FourCC("I00D"),
    FourCC("I03Q"),
  ]
  export const deadZoneFragment = [
    FourCC("I040"),
  ];
  export const geroBoots = [
    FourCC("I04C"),
  ];
  export const androidBomb = [
    FourCC("I047"),
  ];
  export const bananaGenerator = [
    FourCC("I04F"),
  ];
  export const getiStarFragment = [
    FourCC("I048"),
  ]
  export const bioLabResearch = [
    FourCC("I02E"),
  ];
  export const dimensionSwordSaga = [
    FourCC("I03R"),
    FourCC("I03W"),
    FourCC("I03X"),
    FourCC("I03Y"),
    FourCC("I03Z"),
  ];
  export const beeDogItem = [
    FourCC("I04G"),
  ];
  export const braveSword = [
    FourCC("I03F"),
    FourCC("I03G"),
    FourCC("I03H"),
    FourCC("I03I"),
    FourCC("I03J"),
  ];
  export const sorbetRing = [
    FourCC("I046"),
  ];
  export const timeRing = [
    FourCC("I049"),
  ];
  export const sorrowfulScythe = [
    FourCC("I04A"),
  ];
  export const CLEANSED_DRAGONBALL = FourCC("I02V");

  export module Consumables {
    export const SENZU_BEAN = FourCC("I000");
    export const ROAST_HAM = FourCC("I001");
    export const BANANA = FourCC("I044");
    export const KRABBY_PATTY = FourCC("I045");
    export const PUDDING = FourCC("I04D");
  }

  export module SagaDrops {
    export const BATTLE_ARMOR_1 = battleArmor[0];
    export const BATTLE_ARMOR_2 = battleArmor[1];
    export const BATTLE_ARMOR_3 = battleArmor[2];
    export const BATTLE_ARMOR_4 = battleArmor[3];
    export const BATTLE_ARMOR_5 = battleArmor[4];
    export const BROLY_FUR = battleArmor[5];

    export const WHEELO_RESEARCH_1 = wheeloResearch[0];
    export const DARKNESS_GENERATOR = darknessGenerator[0];
    export const SCOUTER_2 = scouter[1];
    export const DEAD_ZONE_FRAGMENT = deadZoneFragment[0];
    export const GERO_BOOTS = geroBoots[0];
    export const ANDROID_BOMB = androidBomb[0];
    export const BANANA_GENERATOR = bananaGenerator[0];
    export const GETI_STAR_FRAGMENT = getiStarFragment[0];
    export const BIO_LAB_RESEARCH = bioLabResearch[0];
    export const DIMENSION_SWORD = dimensionSwordSaga[0];
    export const BEE_DOG_ITEM = beeDogItem[0];
    export const BRAVE_SWORD = braveSword[0];
    export const BEERUS_PUDDING = Consumables.PUDDING;
    export const SORBET_RING = sorbetRing[0];
    export const TIME_RING = timeRing[0];
    export const SORROWFUL_SCYTHE = sorrowfulScythe[0];
  }
}