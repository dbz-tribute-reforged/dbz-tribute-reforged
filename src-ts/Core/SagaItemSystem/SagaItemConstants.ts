export module SagaItemConstants {
  export const upgradeItemAbility = FourCC("A0F1");
  export const battleArmor = [
    FourCC("I036"), 
    FourCC("I037"), 
    FourCC("I03C"), 
    FourCC("I03D"), 
    FourCC("I03E"), 
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
  export const androidBomb = [
    FourCC("I047"),
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
  export const braveSword = [
    FourCC("I03F"),
    FourCC("I03G"),
    FourCC("I03H"),
    FourCC("I03I"),
    FourCC("I03J"),
  ];
  export const sorbetRing = [
    FourCC("I046"),
  ]

  export module SagaDrops {
    export const BATTLE_ARMOR_1 = battleArmor[0];
    export const BATTLE_ARMOR_2 = battleArmor[1];
    export const BATTLE_ARMOR_3 = battleArmor[2];
    export const BATTLE_ARMOR_4 = battleArmor[3];
    export const BATTLE_ARMOR_5 = battleArmor[4];
  
    export const WHEELO_RESEARCH_1 = wheeloResearch[0];

    export const DARKNESS_GENERATOR = darknessGenerator[0];
    
    export const SCOUTER_2 = scouter[1];

    export const DEAD_ZONE_FRAGMENT = deadZoneFragment[0];

    export const ANDROID_BOMB = androidBomb[0];

    export const BIO_LAB_RESEARCH = bioLabResearch[0];

    export const DIMENSION_SWORD = dimensionSwordSaga[0];

    export const BRAVE_SWORD = braveSword[0];

    export const SORBET_RING = sorbetRing[0];
  }
}