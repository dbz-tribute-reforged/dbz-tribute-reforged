import { AbilityNames } from "CustomAbility/AbilityNames";

export const AbilitiesList = [
  // copy from here
  {
    name: AbilityNames.BasicAbility.ZANZO_DASH,
    currentCd: 0,
    maxCd: 19,
    costType: "MP",
    costAmount: 25,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: true,
    waitsForNextClick: true,
    // NOTE: animations aren't implemented yet
    animation: "walk",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNBlink.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBlink.blp",
    },
    tooltip: {
      title: "(Z) Zanzo Dash",
      body: 
        "Dashes towards your next right click. Cooldown is based on distance travelled. " + 
        "Can be used to cross cliffs unlike many other dashes. " + 
        "Y is also a valid hotkey if using a QWERTZ keyboard." + 
        "|nCost: 25 MP |nCD: 19 (varies)",
    },
    components: [
      { name: "dash zanzo" },
      { name: "sfx zanzo dash" },
    ],
  },
  // to here, and replace with unique name
  {
    name: AbilityNames.BasicAbility.GUARD,
    currentCd: 0,
    maxCd: 16,
    costType: "MP",
    costAmount: 25,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNDefend.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNDefend.blp",
    },
    tooltip: {
      title: "(X) Guard",
      body: 
        "Basic Guard ability that blocks 50% of incoming damage until more than 3 * AGI damage is blocked." + 
        "|nCost:25 MP|nCD: 16"
    },
    components: [
      { name: "block basic guard" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.BasicAbility.MAX_POWER,
    currentCd: 0,
    maxCd: 40,
    costType: "MP",
    costAmount: 100,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNNagaUnBurrow.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNNagaUnBurrow.blp",
    },
    tooltip: {
      title: "(C) Max Power",
      body: 
        "Boosts your ability damage by 10% and increases movement speed by 66 for 10 seconds." + 
        "|nCost:100 MP|nCD: 40"
    },
    components: [
      { name: "spell amp max power" },
      { name: "dash ground forward max power" },
      { name: "sfx max power" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.KAMEHAMEHA, // Goku's Kame
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.KAMEHAMEHA,
      body: 
        "Kame"
    },
    components: [
      { name: "beam kamehameha" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.GOD_KAMEHAMEHA, // Goku's Kame 2
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKameGod.blp",
      disabled: "BTNKameGod.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.GOD_KAMEHAMEHA,
      body: 
        "God Kame"
    },
    components: [
      { name: "beam god kamehameha" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.SPIRIT_BOMB,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 120,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSpiritbomb.blp",
      disabled: "BTNSpiritbomb.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.SPIRIT_BOMB,
      body: 
        "spirit bomb stuff"
    },
    components: [
      { name: "beam spirit bomb" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.DRAGON_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 48,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDragonFist.blp",
      disabled: "BTNDragonFist.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.DRAGON_FIST,
      body: 
        "Dragon Fisto"
    },
    components: [
      { name: "dash ground point dragon fist" },
      { name: "damage dragon fist dps" },
      { name: "damage dragon fist explosion" },
      { name: "knockback dfist" },
      { name: "sfx dragon fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.SUPER_DRAGON_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 48,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDragonFist.blp",
      disabled: "BTNDragonFist.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.DRAGON_FIST,
      body: 
        "Dragon Fisto"
    },
    components: [
      { name: "dash ground point super dragon fist" },
      { name: "damage super dragon fist dps" },
      { name: "damage super dragon fist explosion" },
      { name: "knockback dfist" },
      { name: "sfx dragon fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.ULTRA_INSTINCT,
    currentCd: 0,
    maxCd: 1,
    costType: "HP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGokuUltraInstinct.blp",
      disabled: "BTNGokuUltraInstinct.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.ULTRA_INSTINCT,
      body: 
        "Ultra Instinct (dodging randomly + blocking 20*INT)."
    },
    components: [
      { name: "dodge ultra instinct" },
      { name: "block ultra instinct" },
      { name: "sfx ultra instinct" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    currentCd: 0,
    maxCd: 1,
    costType: "HP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGokuMasteredUltraInstinct.blp",
      disabled: "BTNGokuMasteredUltraInstinct.blp",
    },
    tooltip: {
      title: AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
      body: 
        AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    },
    components: [
      { name: "dash ground forward mastered ultra instinct" },
      { name: "spell amp mastered ultra instinct" },
      { name: "dodge ultra instinct" },
      { name: "block mastered ultra instinct" },
      { name: "sfx ultra instinct" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.GALICK_GUN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGalickGun.blp",
      disabled: "BTNGalickGun.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.GALICK_GUN,
      body: 
        "galick gun stuff"
    },
    components: [
      { name: "beam galick gun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.FINAL_FLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFinalFlash.blp",
      disabled: "BTNFinalFlash.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.FINAL_FLASH,
      body: 
        "Final Flash stuff"
    },
    components: [
      { name: "beam final flash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.FINAL_FLASH_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFinalFlash2.blp",
      disabled: "BTNFinalFlash2.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.FINAL_FLASH_2,
      body: 
        AbilityNames.Vegeta.FINAL_FLASH_2
    },
    components: [
      { name: "multi final flash 2" },
      { name: "knockback power level rising" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.BIG_BANG_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 30,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBigBangAttack.blp",
      disabled: "BTNBigBangAttack.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.BIG_BANG_ATTACK,
      body: 
        "Big Bang Attack stuff"
    },
    components: [
      { name: "beam big bang attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 70,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNVegetaEnergyBlastVolley.blp",
      disabled: "BTNVegetaEnergyBlastVolley.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY,
      body: 
        AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY
    },
    components: [
      { name: "multi energy blast volley" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.TWIN_DRAGON_SHOT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTwinDragonShot.blp",
      disabled: "BTNTwinDragonShot.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.TWIN_DRAGON_SHOT,
      body: 
        AbilityNames.Gohan.TWIN_DRAGON_SHOT
    },
    components: [
      { name: "multi twin dragon shot" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.MASENKO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMasenko.blp",
      disabled: "BTNMasenko.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.MASENKO,
      body: 
        AbilityNames.Gohan.MASENKO
    },
    components: [
      { name: "beam masenko" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.SUPER_MASENKO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMasenko.blp",
      disabled: "BTNMasenko.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.SUPER_MASENKO,
      body: 
        AbilityNames.Gohan.SUPER_MASENKO
    },
    components: [
      { name: "multi super masenko" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.SUPER_DRAGON_FLIGHT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSuperDragonFlight.blp",
      disabled: "BTNSuperDragonFlight.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.SUPER_DRAGON_FLIGHT,
      body: 
        AbilityNames.Gohan.SUPER_DRAGON_FLIGHT
    },
    components: [
      { name: "damage super dragon flight dps" },
      { name: "knockback super dragon flight" },
      { name: "dash ground point super dragon flight" },
      { name: "spell amp super dragon flight" },
      { name: "sfx super dragon flight" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 264,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGohanFatherSonKame.blp",
      disabled: "BTNGohanFatherSonKame.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA,
      body: 
        AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA
    },
    components: [
      { name: "channel caster default" },
      { name: "multi father-son kame" },
      { name: "multi father-son kame goku" },
      { name: "damage solar kame dps charging" },
      { name: "sfx solar kame caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.UNLOCK_POTENTIAL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUnlockPotential.blp",
      disabled: "BTNUnlockPotential.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.UNLOCK_POTENTIAL,
      body: 
        AbilityNames.Gohan.UNLOCK_POTENTIAL
    },
    components: [
      { name: "spell amp unlock potential" },
      { name: "sfx unlock potential" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.THE_GREAT_SAIYAMAN_HAS_ARRIVED,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJusticePose.blp",
      disabled: "BTNJusticePose.blp",
    },
    tooltip: {
      title: "Justice Pose",
      body: 
        "Justice Pose"
    },
    components: [
      { name: "spell amp justice pose" },
      { name: "sfx unlock potential" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.POTENTIAL_UNLEASHED,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 660,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPotentialUnleashed.blp",
      disabled: "BTNPotentialUnleashed.blp",
    },
    tooltip: {
      title: AbilityNames.Gohan.POTENTIAL_UNLEASHED,
      body: 
        AbilityNames.Gohan.POTENTIAL_UNLEASHED
    },
    components: [
      { name: "spell amp potential unleashed" },
      { name: "dash ground forward potential unleashed" },
      { name: "sfx unlock potential" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goten.ROCK_THROW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenRockThrow.blp",
      disabled: "BTNGotenRockThrow.blp",
    },
    tooltip: {
      title: AbilityNames.Goten.ROCK_THROW,
      body: 
        AbilityNames.Goten.ROCK_THROW
    },
    components: [
      { name: "multi goten rock throw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Goten.SUPER_GOTEN_STRIKE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenStrike.blp",
      disabled: "BTNGotenStrike.blp",
    },
    tooltip: {
      title: AbilityNames.Goten.SUPER_GOTEN_STRIKE,
      body: 
        AbilityNames.Goten.SUPER_GOTEN_STRIKE
    },
    components: [
      { name: "damage super goten strike dps" },
      { name: "dash ground point 20dist" },
      { name: "debuff stun super goten strike" },
      { name: "sfx super dragon flight" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KidTrunks.FINAL_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKidTrunksFinalCannon.blp",
      disabled: "BTNKidTrunksFinalCannon.blp",
    },
    tooltip: {
      title: AbilityNames.KidTrunks.FINAL_CANNON,
      body: 
        AbilityNames.KidTrunks.FINAL_CANNON,
    },
    components: [
      { name: "beam kid trunks final cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KidTrunks.SWORD_OF_HOPE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 334,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKidTrunksSwordOfHope.blp",
      disabled: "BTNKidTrunksSwordOfHope.blp",
    },
    tooltip: {
      title: AbilityNames.KidTrunks.SWORD_OF_HOPE,
      body: 
        AbilityNames.KidTrunks.SWORD_OF_HOPE
    },
    components: [
      { name: "debuff heros song heros flute start" },
      { name: "spell amp kid trunks sword of hope" },
      { name: "temp ability kid trunks sword of hope aura" },
      { name: "sfx kid trunks sword of hope" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.DIE_DIE_MISSILE_BARRAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksDieDieMissileBarrage.blp",
      disabled: "BTNGotenksDieDieMissileBarrage.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.DIE_DIE_MISSILE_BARRAGE,
      body: 
        AbilityNames.Gotenks.DIE_DIE_MISSILE_BARRAGE
    },
    components: [
      { name: "multi die die missile barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.GALACTIC_DONUT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 80,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksGalacticDonut.blp",
      disabled: "BTNGotenksGalacticDonut.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.GALACTIC_DONUT,
      body: 
        AbilityNames.Gotenks.GALACTIC_DONUT
    },
    components: [
      { name: "beam galactic donut" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.ULTRA_VOLLEYBALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 80,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksUltraVolleyball.blp",
      disabled: "BTNGotenksUltraVolleyball.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.ULTRA_VOLLEYBALL,
      body: 
        AbilityNames.Gotenks.ULTRA_VOLLEYBALL
    },
    components: [
      { name: "beam ultra volleyball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksGhostKamikaze.blp",
      disabled: "BTNGotenksGhostKamikaze.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK,
      body: 
        AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK
    },
    components: [
      { name: "multi super ghost kamikaze attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 300,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksGhostKamikaze2.blp",
      disabled: "BTNGotenksGhostKamikaze2.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK_2,
      body: 
        AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK_2
    },
    components: [
      { name: "multi super ghost kamikaze attack 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gotenks.GOTENKS_SS3,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGotenksSS3.blp",
      disabled: "BTNGotenksSS3.blp",
    },
    tooltip: {
      title: AbilityNames.Gotenks.GOTENKS_SS3,
      body: 
        AbilityNames.Gotenks.GOTENKS_SS3
    },
    components: [
      { name: "dash ground forward gotenks ss3" },
      { name: "spell amp gotenks ss3" },
      { name: "multi super saiyan 3 ghosts 1" },
      { name: "multi super saiyan 3 ghosts 2" },
      { name: "multi super saiyan 3 ghosts 3" },
      { name: "sfx gotenks super saiyan 3" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.FINISH_BUSTER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTFinishBuster.blp",
      disabled: "BTNFTFinishBuster.blp",
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.FINISH_BUSTER,
      body: 
        AbilityNames.FutureTrunks.FINISH_BUSTER
    },
    components: [
      { name: "beam finish buster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.HEAT_DOME_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTHeatDomeAttack.blp",
      disabled: "BTNFTHeatDomeAttackblp",
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.HEAT_DOME_ATTACK,
      body: 
        AbilityNames.FutureTrunks.HEAT_DOME_ATTACK
    },
    components: [
      { name: "beam heat dome attack" },
      { name: "damage heat dome attack explosion" },
      { name: "knockback heat dome attack" },
      { name: "sfx heat dome attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.BURNING_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBurningAttack.blp",
      disabled: "BTNBurningAttack.blp",
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.BURNING_ATTACK,
      body: 
        AbilityNames.FutureTrunks.BURNING_ATTACK
    },
    components: [
      { name: "beam burning attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 80,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "attack",
    icon: {
      enabled: "BTNFTShiningSwordAttack.blp",
      disabled: "BTNFTShiningSwordAttack.blp"
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK,
      body: 
        "Performs multiple sword slashes as you move your cursor around." + 
        "|nDeals ? * AGI per slash in 225 AOE per damage tick" + 
        "(minimum 0.09s)" + 
        "|nCost: ? MP |nCD: ?",
    },
    components: [
      { name: "slash shining sword attack" },
      { name: "beam shining sword attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.BLAZING_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 26,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTBlazingRush.blp",
      disabled: "BTNFTBlazingRush.blp",
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.BLAZING_RUSH,
      body: 
        AbilityNames.FutureTrunks.BLAZING_RUSH
    },
    components: [
      { name: "dash ground point 15dist" },
      { name: "damage blazing rush explosion" },
      { name: "stun blazing rush" },
      { name: "sfx blazing rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTSSRage.blp",
      disabled: "BTNFTSSRage.blp",
    },
    tooltip: {
      title: AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE,
      body: 
        AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE
    },
    components: [
      { name: "dash ground forward super saiyan rage" },
      { name: "stun super saiyan rage" },
      { name: "spell amp super saiyan rage" },
      { name: "block super saiyan rage" },
      { name: "sfx super saiyan rage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Piccolo.SPECIAL_BEAM_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSpecialBeamCannon.blp",
      disabled: "BTNSpecialBeamCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Piccolo.SPECIAL_BEAM_CANNON,
      body: 
        AbilityNames.Piccolo.SPECIAL_BEAM_CANNON
    },
    components: [
      { name: "beam special beam cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Piccolo.SLAPPY_HAND,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloSlappyHand.blp",
      disabled: "BTNPiccoloSlappyHand.blp",
    },
    tooltip: {
      title: AbilityNames.Piccolo.SLAPPY_HAND,
      body: 
        AbilityNames.Piccolo.SLAPPY_HAND
    },
    components: [
      { name: "hook slappy hand" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Piccolo.HELLZONE_GRENADE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloHellzoneGrenade.blp",
      disabled: "BTNPiccoloHellzoneGrenade.blp",
    },
    tooltip: {
      title: AbilityNames.Piccolo.HELLZONE_GRENADE,
      body: 
        AbilityNames.Piccolo.HELLZONE_GRENADE
    },
    components: [
      { name: "multi hellzone grenade" },
      { name: "multi hellzone grenade 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Piccolo.KYODAIKA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloKyodaika.blp",
      disabled: "BTNPiccoloKyodaika.blp",
    },
    tooltip: {
      title: AbilityNames.Piccolo.KYODAIKA,
      body: 
        AbilityNames.Piccolo.KYODAIKA
    },
    components: [
      { name: "dash ground point 5dist" },
      { name: "block kyodaika" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.FUTURE_SIGHT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockFutureSight.blp",
      disabled: "BTNBardockFutureSight.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.FUTURE_SIGHT,
      body: 
        AbilityNames.Bardock.FUTURE_SIGHT
    },
    components: [
      { name: "dodge future sight" },
      { name: "block future sight" },
      { name: "sfx future sight" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.TYRANT_BREAKER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockTyrantBreaker.blp",
      disabled: "BTNBardockTyrantBreaker.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.TYRANT_BREAKER,
      body: 
        AbilityNames.Bardock.TYRANT_BREAKER
    },
    components: [
      { name: "dash ground point tyrant breaker" },
      { name: "damage tyrant breaker dps" },
      { name: "knockback tyrant breaker" },
      { name: "temp ability tyrant lancer" },
      { name: "sfx tyrant breaker" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.TYRANT_LANCER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockTyrantLancer.blp",
      disabled: "BTNBardockTyrantLancer.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.TYRANT_LANCER,
      body: 
        AbilityNames.Bardock.TYRANT_LANCER
    },
    components: [
      { name: "beam tyrant lancer" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.SAIYAN_SPIRIT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockSaiyanSpirit.blp",
      disabled: "BTNBardockSaiyanSpirit.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.SAIYAN_SPIRIT,
      body: 
        AbilityNames.Bardock.SAIYAN_SPIRIT
    },
    components: [
      { name: "dash ground point saiyan spirit" },
      { name: "dash ground point saiyan spirit pushback" },
      { name: "damage saiyan spirit dps" },
      { name: "knockback 1tick 5speed 0angle 250aoe" },
      { name: "stun saiyan spirit" },
      { name: "beam saiyan spirit" },
      { name: "sfx saiyan spirit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.RIOT_JAVELIN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockRiotJavelin.blp",
      disabled: "BTNBardockRiotJavelin.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.RIOT_JAVELIN,
      body: 
        AbilityNames.Bardock.RIOT_JAVELIN
    },
    components: [
      { name: "beam riot javelin" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Bardock.REBELLION_SPEAR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockRebellionSpear.blp",
      disabled: "BTNBardockRebellionSpear.blp",
    },
    tooltip: {
      title: AbilityNames.Bardock.REBELLION_SPEAR,
      body: 
        AbilityNames.Bardock.REBELLION_SPEAR
    },
    components: [
      { name: "dash ground forward rebellion spear" },
      { name: "damage rebellion spear dps" },
      { name: "knockback kame" },
      { name: "sfx rebellion spear" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Vegeta.ANGRY_SHOUT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOozaru.blp",
      disabled: "BTNOozaru.blp",
    },
    tooltip: {
      title: AbilityNames.Vegeta.ANGRY_SHOUT,
      body: 
        AbilityNames.Vegeta.ANGRY_SHOUT
    },
    components: [
      { name: "channel caster default" },
      { name: "block angry shout" },
      { name: "damage angry shout dps" },
      { name: "knockback angry shout" },
      { name: "sfx angry shout" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.KAMEHAMEHA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.KAMEHAMEHA,
      body: 
        AbilityNames.Pan.KAMEHAMEHA
    },
    components: [
      { name: "beam pan kamehameha" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.GOD_KAMEHAMEHA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKameGod.blp",
      disabled: "BTNKameGod.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.GOD_KAMEHAMEHA,
      body: 
        AbilityNames.Pan.GOD_KAMEHAMEHA
    },
    components: [
      { name: "beam pan god kamehameha" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.MAIDEN_BLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanMaidenBlast.blp",
      disabled: "BTNPanMaidenBlast.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.MAIDEN_BLAST,
      body: 
        AbilityNames.Pan.MAIDEN_BLAST
    },
    components: [
      { name: "beam maiden blast" },
      { name: "aoe apply pan immolation" },
      { name: "damage pan immolation dps" },
      { name: "sfx pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.RELIABLE_FRIEND,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanReliableFriend.blp",
      disabled: "BTNPanReliableFriend.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.RELIABLE_FRIEND,
      body: 
        AbilityNames.Pan.RELIABLE_FRIEND
    },
    components: [
      { name: "beam reliable friend" },
      { name: "aoe apply reliable friend" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.HONEY_BEE_COSTUME,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 500,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanHoneyBee.blp",
      disabled: "BTNPanHoneyBee.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.HONEY_BEE_COSTUME,
      body: 
        "Honey Bee Custome"
    },
    components: [
      { name: "spell amp honey bee costume" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Pan.SUMMON_GIRU,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiru.blp",
      disabled: "BTNGiru.blp",
    },
    tooltip: {
      title: AbilityNames.Pan.SUMMON_GIRU,
      body: 
        AbilityNames.Pan.SUMMON_GIRU
    },
    components: [
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.POWER_BLITZ,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17PowerBlitz.blp",
      disabled: "BTN17PowerBlitz.blp",
    },
    tooltip: {
      title: AbilityNames.Android17DBS.POWER_BLITZ,
      body: 
        AbilityNames.Android17DBS.POWER_BLITZ
    },
    components: [
      { name: "beam power blitz" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17PowerBlitzBarrage.blp",
      disabled: "BTN17PowerBlitzBarrage.blp",
    },
    tooltip: {
      title: AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE,
      body: 
        AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE
    },
    components: [
      { name: "channel caster default" },
      { name: "multi power blitz barrage" },
      { name: "spell amp power blitz barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.BARRIER_PRISON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17BarrierPrison.blp",
      disabled: "BTN17BarrierPrison.blp",
    },
    tooltip: {
      title: AbilityNames.Android17DBS.BARRIER_PRISON,
      body: 
        AbilityNames.Android17DBS.BARRIER_PRISON
    },
    components: [
      // { name: "multi barrier prison" },
      { name: "beam barrier prison" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.BARRIER_WALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 264,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17BarrierWall.blp",
      disabled: "BTN17BarrierWall.blp",
    },
    tooltip: {
      title: AbilityNames.Android17DBS.BARRIER_WALL,
      body: 
        AbilityNames.Android17DBS.BARRIER_WALL
    },
    components: [
      { name: "multi barrier wall" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 231,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17SuperElectricStrike.blp",
      disabled: "BTN17SuperElectricStrike.blp",
    },
    tooltip: {
      title:  AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE,
      body: 
        AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE,
    },
    components: [
      { name: "multi super electric strike" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Videl.PUNCH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNVidel.blp",
      disabled: "BTNVidel.blp",
    },
    tooltip: {
      title:  AbilityNames.Videl.PUNCH,
      body: 
        AbilityNames.Videl.PUNCH,
    },
    components: [
      { name: "multi videl punch" },
      { name: "spell amp videl boost" },
      { name: "dash ground forward videl speed boost" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Videl.KICK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNVidel.blp",
      disabled: "BTNVidel.blp",
    },
    tooltip: {
      title:  AbilityNames.Videl.KICK,
      body: 
        AbilityNames.Videl.KICK,
    },
    components: [
      { name: "spell amp videl boost" },
      { name: "damage videl kick" },
      { name: "knockback videl kick" },
      { name: "dash ground forward videl speed boost" },
      { name: "sfx videl kick" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Videl.FLYING_KICK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNVidel.blp",
      disabled: "BTNVidel.blp",
    },
    tooltip: {
      title:  AbilityNames.Videl.KICK,
      body: 
        AbilityNames.Videl.KICK,
    },
    components: [
      { name: "channel caster default" },
      { name: "dash ground point videl flying kick" },
      { name: "damage videl flying kick dps" },
      { name: "damage videl flying kick explosion" },
      { name: "knockback videl flying kick" },
      { name: "jump videl flying kick" },
      { name: "spell amp videl boost" },
      { name: "sfx videl flying kick" },
    ],
  },
  // -------------------------------------------
  // NOTE: ANY CHANGES TO THIS ABILITY REQUIRES CHANGES TO THE GUI
  // COUNTERPART RESPONSIBLE FOR DRAGGING UPA TOWARDS KORIN'S FLAG
  // (more component classes seems to crash the game, so gui workaround...)
  {
    name: AbilityNames.Upa.JAVELIN_THROW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 35,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUpaQ.blp",
      disabled: "BTNUpaQ.blp",
    },
    tooltip: {
      title: AbilityNames.Upa.JAVELIN_THROW,
      body: 
        AbilityNames.Upa.JAVELIN_THROW
    },
    components: [
      { name: "beam javelin throw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Upa.WHIRLWIND_TEMPEST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUpaW.blp",
      disabled: "BTNUpaW.blp",
    },
    tooltip: {
      title: AbilityNames.Upa.WHIRLWIND_TEMPEST,
      body: 
        AbilityNames.Upa.WHIRLWIND_TEMPEST
    },
    components: [
      { name: "dash ground point whirlwind tempest" },
      { name: "damage whirlwind tempest dps" },
      { name: "knockback kame" },
      { name: "sfx whirlwind tempest" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Upa.KORIN_FLAG,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 216,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUpaE.blp",
      disabled: "BTNUpaE.blp",
    },
    tooltip: {
      title: AbilityNames.Upa.KORIN_FLAG,
      body: 
        AbilityNames.Upa.KORIN_FLAG
    },
    components: [
      { name: "beam korin flag" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Upa.LAST_STAND,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200 ,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUpaR.blp",
      disabled: "BTNUpaR.blp",
    },
    tooltip: {
      title: AbilityNames.Upa.LAST_STAND,
      body: 
        AbilityNames.Upa.LAST_STAND
    },
    components: [
      { name: "dash ground forward last stand" },
      { name: "beam last stand" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tapion.BRAVE_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 10,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTapion.blp",
      disabled: "BTNTapion.blp",
    },
    tooltip: {
      title:  AbilityNames.Tapion.BRAVE_SLASH,
      body: 
        AbilityNames.Tapion.BRAVE_SLASH,
    },
    components: [
      { name: "multi brave slash" },
      // { name: "temp ability brave cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tapion.BRAVE_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTapion.blp",
      disabled: "BTNTapion.blp",
    },
    tooltip: {
      title:  AbilityNames.Tapion.BRAVE_CANNON,
      body: 
        AbilityNames.Tapion.BRAVE_CANNON,
    },
    components: [
      { name: "beam brave cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tapion.SHINING_SWORD,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTapionShiningSword.blp",
      disabled: "BTNTapionShiningSword.blp",
    },
    tooltip: {
      title:  AbilityNames.Tapion.SHINING_SWORD,
      body: 
        AbilityNames.Tapion.SHINING_SWORD,
    },
    components: [
      { name: "dash ground point shining sword" },
      { name: "damage shining sword explosion" },
      { name: "damage shining sword bonus buff explosion" },
      { name: "sfx shining sword" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tapion.HEROS_FLUTE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 334,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTapionHerosFlute.blp",
      disabled: "BTNTapionHerosFlute.blp",
    },
    tooltip: {
      title: AbilityNames.Tapion.HEROS_FLUTE,
      body: 
        AbilityNames.Tapion.HEROS_FLUTE
    },
    components: [
      { name: "channel caster default" },
      { name: "debuff heros song heros flute start" },
      { name: "debuff heros song heros flute continuous" },
      { name: "block heros flute" },
      { name: "beam heros flute barrier" },
      { name: "temp ability heros flute armor aura" },
      { name: "sfx heros flute" },
      // { name: "knockback babidi barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tapion.BRAVE_SWORD_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTapionBraveSwordAttack.blp",
      disabled: "BTNTapionBraveSwordAttack.blp",
    },
    tooltip: {
      title:  AbilityNames.Tapion.BRAVE_SWORD_ATTACK,
      body: 
        AbilityNames.Tapion.BRAVE_SWORD_ATTACK,
    },
    components: [
      { name: "sfx brave sword attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.POWER_IMPACT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenPowerImpact.blp",
      disabled: "BTNJirenPowerImpact.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.POWER_IMPACT,
      body: 
        AbilityNames.Jiren.POWER_IMPACT
    },
    components: [
      { name: "beam power impact" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.POWER_IMPACT_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenPowerImpact2.blp",
      disabled: "BTNJirenPowerImpact2.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.POWER_IMPACT_2,
      body: 
        AbilityNames.Jiren.POWER_IMPACT_2
    },
    components: [
      { name: "beam power impact 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.HEATWAVE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenHeatwave.blp",
      disabled: "BTNJirenHeatwave.blp",
    },
    tooltip: {
      title:  AbilityNames.Jiren.HEATWAVE,
      body: 
        AbilityNames.Jiren.HEATWAVE,
    },
    components: [
      { name: "multi heatwave" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.HEATWAVE_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenHeatwave2.blp",
      disabled: "BTNJirenHeatwave2.blp",
    },
    tooltip: {
      title:  AbilityNames.Jiren.HEATWAVE,
      body: 
        AbilityNames.Jiren.HEATWAVE,
    },
    components: [
      { name: "multi heatwave 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.MEDITATE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenMeditate.blp",
      disabled: "BTNJirenMeditate.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.MEDITATE,
      body: 
        AbilityNames.Jiren.MEDITATE
    },
    components: [
      { name: "block jiren meditate" },
      { name: "beam jiren meditate barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.MEDITATE_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenMeditate.blp",
      disabled: "BTNJirenMeditate.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.MEDITATE_2,
      body: 
        AbilityNames.Jiren.MEDITATE_2
    },
    components: [
      { name: "block jiren meditate 2" },
      { name: "beam jiren meditate 2 barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenUltimateBurningWarrior.blp",
      disabled: "BTNJirenUltimateBurningWarrior.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR,
      body: 
        AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR
    },
    components: [
      { name: "dash ground forward ultimate burning warrior" },
      { name: "damage ultimate burning warrior dps" },
      { name: "block ultimate burning warrior" },
      { name: "sfx ultimate burning warrior" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJirenUltimateBurningWarrior2.blp",
      disabled: "BTNJirenUltimateBurningWarrior2.blp",
    },
    tooltip: {
      title: AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_2,
      body: 
        AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_2
    },
    components: [
      { name: "dash ground forward ultimate burning warrior 2" },
      { name: "damage ultimate burning warrior 2 dps" },
      { name: "block ultimate burning warrior 2" },
      { name: "sfx ultimate burning warrior" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_FLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeFlash.blp",
      disabled: "BTNToppoJusticeFlash.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_FLASH,
      body: 
        AbilityNames.Toppo.JUSTICE_FLASH
    },
    components: [
      // { name: "channel caster default" },
      { name: "multi justice flash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_FLASH_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeFlash.blp",
      disabled: "BTNToppoJusticeFlash.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_FLASH,
      body: 
        AbilityNames.Toppo.JUSTICE_FLASH
    },
    components: [
      // { name: "channel caster default" },
      { name: "multi justice flash 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_PUNCH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticePunch.blp",
      disabled: "BTNToppoJusticePunch.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_PUNCH,
      body: 
        AbilityNames.Toppo.JUSTICE_PUNCH
    },
    components: [
      { name: "dash ground point justice punch" },
      { name: "damage justice punch explosion" },
      { name: "sfx justice punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_PUNCH_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticePunch.blp",
      disabled: "BTNToppoJusticePunch.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_PUNCH,
      body: 
        AbilityNames.Toppo.JUSTICE_PUNCH
    },
    components: [
      { name: "dash ground point justice punch 2" },
      { name: "damage justice punch 2 explosion" },
      { name: "sfx justice punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_TORNADO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeTornado.blp",
      disabled: "BTNToppoJusticeTornado.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_TORNADO,
      body: 
        AbilityNames.Toppo.JUSTICE_TORNADO
    },
    components: [
      { name: "dash ground forward justice tornado" },
      { name: "damage justice tornado dps" },
      { name: "knockback justice tornado" },
      { name: "sfx justice tornado" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_TORNADO_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 133,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeTornado.blp",
      disabled: "BTNToppoJusticeTornado.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_TORNADO,
      body: 
        AbilityNames.Toppo.JUSTICE_TORNADO
    },
    components: [
      { name: "dash ground forward justice tornado 2" },
      { name: "damage justice tornado 2 dps" },
      { name: "knockback justice tornado 2" },
      { name: "sfx justice tornado" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_HOLD,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeHold.blp",
      disabled: "BTNToppoJusticeHold.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_HOLD,
      body: 
        AbilityNames.Toppo.JUSTICE_HOLD
    },
    components: [
      { name: "channel caster default" },
      { name: "damage justice hold dps" },
      // { name: "sfx justice hold" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_HOLD_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticeHold.blp",
      disabled: "BTNToppoJusticeHold.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_HOLD,
      body: 
        AbilityNames.Toppo.JUSTICE_HOLD
    },
    components: [
      { name: "channel caster default" },
      { name: "damage justice hold dps" },
      // { name: "sfx justice hold" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.JUSTICE_POSE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoJusticePose.blp",
      disabled: "BTNToppoJusticePose.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_POSE,
      body: 
        AbilityNames.Toppo.JUSTICE_POSE
    },
    components: [
      { name: "spell amp justice pose toppo" },
      { name: "temp ability disable god of destruction toppo" },
      { name: "sfx justice pose toppo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Toppo.GOD_OF_DESTRUCTION,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 990,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNToppoGoD.blp",
      disabled: "BTNToppoGoD.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.GOD_OF_DESTRUCTION,
      body: 
        AbilityNames.Toppo.GOD_OF_DESTRUCTION
    },
    components: [
      { name: "dash ground forward god of destruction toppo" },
      { name: "block god of destruction toppo" },
      { name: "sfx god of destruction toppo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.LIGHT_BULLET,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoLightBullet.blp",
      disabled: "BTNDyspoLightBullet.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.LIGHT_BULLET,
      body: 
        AbilityNames.Dyspo.LIGHT_BULLET
    },
    components: [
      { name: "dash ground point light bullet" },
      { name: "damage light bullet explosion" },
      { name: "sfx light bullet" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_KICK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticeKick.blp",
      disabled: "BTNDyspoJusticeKick.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_KICK,
      body: 
        AbilityNames.Dyspo.JUSTICE_KICK
    },
    components: [
      { name: "dash ground forward justice kick" },
      { name: "damage justice kick explosion" },
      { name: "sfx justice kick" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_KICK_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticeKick2.blp",
      disabled: "BTNDyspoJusticeKick2.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_KICK_2,
      body: 
        AbilityNames.Dyspo.JUSTICE_KICK_2
    },
    components: [
      { name: "dash ground forward justice kick 2" },
      { name: "damage justice kick 2 explosion" },
      { name: "knockback justice kick 2" },
      { name: "sfx justice kick" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_KICK_ON_HIT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticeKick.blp",
      disabled: "BTNDyspoJusticeKick.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_KICK,
      body: 
        AbilityNames.Dyspo.JUSTICE_KICK
    },
    components: [
      { name: "dash ground forward justice kick" },
      { name: "damage justice kick on hit explosion" },
      { name: "jump justice kick on hit" },
      { name: "sfx justice kick on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 20,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticeCannon.blp",
      disabled: "BTNDyspoJusticeCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_CANNON,
      body: 
        AbilityNames.Dyspo.JUSTICE_CANNON
    },
    components: [
      { name: "beam justice cannon"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_CANNON_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 20,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticeCannon2.blp",
      disabled: "BTNDyspoJusticeCannon2.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_CANNON_2,
      body: 
        AbilityNames.Dyspo.JUSTICE_CANNON_2
    },
    components: [
      { name: "beam justice cannon 2"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.CIRCLE_FLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 48,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoCircleFlash.blp",
      disabled: "BTNDyspoCircleFlash.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.CIRCLE_FLASH,
      body: 
        AbilityNames.Dyspo.CIRCLE_FLASH
    },
    components: [
      { name: "beam circle flash"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.CIRCLE_FLASH_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 48,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoCircleFlash2.blp",
      disabled: "BTNDyspoCircleFlash2.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.CIRCLE_FLASH_2,
      body: 
        AbilityNames.Dyspo.CIRCLE_FLASH_2
    },
    components: [
      { name: "beam circle flash 2"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.JUSTICE_POSE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoJusticePose.blp",
      disabled: "BTNDyspoJusticePose.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.JUSTICE_POSE,
      body: 
        AbilityNames.Dyspo.JUSTICE_POSE
    },
    components: [
      { name: "spell amp justice pose dyspo" },
      { name: "sfx justice pose dyspo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 666,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDyspoSuperMax.blp",
      disabled: "BTNDyspoSuperMax.blp",
    },
    tooltip: {
      title: AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE,
      body: 
        AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE
    },
    components: [
      { name: "dash ground forward super maximum light speed mode" },
      { name: "temp ability disable light bullet" },
      { name: "sfx super maximum light speed mode" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Krillin.SCATTERING_BULLET,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKrillinScatteringBullet.blp",
      disabled: "BTNKrillinScatteringBullet.blp",
    },
    tooltip: {
      title: AbilityNames.Krillin.SCATTERING_BULLET,
      body: 
        AbilityNames.Krillin.SCATTERING_BULLET,
    },
    components: [
      { name: "multi scattering bullet start 1" },
      { name: "multi scattering bullet start 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Krillin.DESTRUCTO_DISC,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKrillinDestructoDisc.blp",
      disabled: "BTNKrillinDestructoDisc.blp",
    },
    tooltip: {
      title: AbilityNames.Krillin.DESTRUCTO_DISC,
      body: 
        AbilityNames.Krillin.DESTRUCTO_DISC,
    },
    components: [
      { name: "beam destructo disc" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.LIGHT_PUNCH,
    currentCd: 0,
    maxCd: 0.3,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.LIGHT_PUNCH,
      body: 
        AbilityNames.YamchaR.LIGHT_PUNCH,
    },
    components: [
      { name: "dash ground forward yamcha r light punch" },
      { name: "damage yamcha r light punch" },
      { name: "sfx yamcha r light punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.MEDIUM_PUNCH,
    currentCd: 0,
    maxCd: 0.3,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.MEDIUM_PUNCH,
      body: 
        AbilityNames.YamchaR.MEDIUM_PUNCH,
    },
    components: [
      { name: "dash ground forward yamcha r medium punch" },
      { name: "damage yamcha r medium punch" },
      { name: "sfx yamcha r light punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.HEAVY_PUNCH,
    currentCd: 0,
    maxCd: 0.3,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.HEAVY_PUNCH,
      body: 
        AbilityNames.YamchaR.HEAVY_PUNCH,
    },
    components: [
      { name: "dash ground forward yamcha r heavy punch" },
      { name: "damage yamcha r heavy punch" },
      { name: "sfx yamcha r heavy punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.DASH_LEFT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.DASH_LEFT,
      body: 
        AbilityNames.YamchaR.DASH_LEFT,
    },
    components: [
      { name: "damage yamcha r dash explosion" },
      { name: "dash ground forward yamcha r dash left" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.DASH_FORWARD,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.DASH_FORWARD,
      body: 
        AbilityNames.YamchaR.DASH_FORWARD,
    },
    components: [
      { name: "damage yamcha r dash explosion" },
      { name: "dash ground forward yamcha r dash forward" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.DASH_RIGHT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.DASH_RIGHT,
      body: 
        AbilityNames.YamchaR.DASH_RIGHT,
    },
    components: [
      { name: "damage yamcha r dash explosion" },
      { name: "dash ground forward yamcha r dash right" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.SUPER_SPIRIT_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.SUPER_SPIRIT_BALL,
      body: 
        AbilityNames.YamchaR.SUPER_SPIRIT_BALL,
    },
    components: [
      { name: "beam yamcha r super spirit ball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA,
      body: 
        AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA,
    },
    components: [
      { name: "beam yamcha r full power kame" },
      { name: "dash ground forward yamcha r full power kame pushback" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_BLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.WOLF_FANG_BLAST,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_BLAST,
    },
    components: [
      { name: "damage yamcha r wolf fang blast" },
      { name: "beam yamcha r wolf fang blast" },
      { name: "sfx yamcha r wolf fang blast" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.SLEDGEHAMMER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.SLEDGEHAMMER,
      body: 
        AbilityNames.YamchaR.SLEDGEHAMMER,
    },
    components: [
      { name: "dash ground forward yamcha r sledgehammer" },
      { name: "damage yamcha r sledgehammer" },
      { name: "debuff stun yamcha r sledgehammer" },
      { name: "jump yamcha r sledgehammer" },
      { name: "sfx yamcha r sledgehammer" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.METEOR_CRASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.METEOR_CRASH,
      body: 
        AbilityNames.YamchaR.METEOR_CRASH,
    },
    components: [
      { name: "dash ground forward yamcha r meteor crash" },
      { name: "damage yamcha r meteor crash" },
      { name: "sfx yamcha r meteor crash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.UPPERCUT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 10,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.UPPERCUT,
      body: 
        AbilityNames.YamchaR.UPPERCUT,
    },
    components: [
      { name: "dash ground forward yamcha r heavy punch" },
      { name: "damage yamcha r uppercut" },
      { name: "debuff stun yamcha r uppercut" },
      { name: "sfx yamcha r uppercut" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_HURRICANE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.WOLF_FANG_HURRICANE,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_HURRICANE
    },
    components: [
      { name: "dash ground forward yamcha r wolf fang hurricane" },
      { name: "damage yamcha r wolf fang hurricane dps" },
      { name: "knockback yamcha r wolf fang hurricane" },
      { name: "sfx yamcha r wolf fang hurricane" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_VOLLEY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.WOLF_FANG_VOLLEY,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_VOLLEY
    },
    components: [
      { name: "multi yamcha r wolf fang volley" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST,
      body: 
        AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST,
    },
    components: [
      { name: "dash ground forward yamcha r reverse wolf fang blast" },
      { name: "damage yamcha r wolf fang blast" },
      { name: "multi yamcha r reverse wolf fang blast" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST,
      body: 
        AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST,
    },
    components: [
      { name: "dash ground forward yamcha r wolf fang fist" },
      { name: "damage yamcha r blinding wolf fang fist" },
      { name: "debuff blind yamcha r blinding wolf fang fist" },
      { name: "sfx yamcha r blinding wolf fang fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST,
      body: 
        AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST,
    },
    components: [
      { name: "multi yamcha r neo wolf fang blast" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.NEO_WOLF_FANG_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.NEO_WOLF_FANG_FIST,
      body: 
        AbilityNames.YamchaR.NEO_WOLF_FANG_FIST,
    },
    components: [
      { name: "dash ground forward yamcha r wolf fang fist" },
      { name: "damage yamcha r neo wolf fang fist" },
      { name: "debuff stun yamcha r neo wolf fang fist" },
      { name: "sfx yamcha r neo wolf fang fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.SPIRIT_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.SPIRIT_BALL,
      body: 
        AbilityNames.YamchaR.SPIRIT_BALL,
    },
    components: [
      { name: "beam yamcha r spirit ball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.FLASH_KAME,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.FLASH_KAME,
      body: 
        AbilityNames.YamchaR.FLASH_KAME,
    },
    components: [
      { name: "beam yamcha r flash kame" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_BARRAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.WOLF_FANG_BARRAGE,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_BARRAGE
    },
    components: [
      { name: "multi yamcha r wolf fang barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK,
    },
    components: [
      { name: "dash ground forward yamcha r wolf fang fist" },
      { name: "damage yamcha r wolf fang pack attack" },
      { name: "damage yamcha r wolf fang pack attack solar flare bonus" },
      { name: "sfx yamcha r wolf fang pack attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_FLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 30,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.WOLF_FANG_FLASH,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_FLASH,
    },
    components: [
      { name: "multi yamcha r flash kame" },
      { name: "dash ground forward yamcha r wolf fang flash" },
      { name: "damage yamcha r wolf fang flash" },
      { name: "damage yamcha r wolf fang flash spirit ball bonus" },
      { name: "sfx yamcha r wolf fang flash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_FINISHER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.WOLF_FANG_FINISHER,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_FINISHER,
    },
    components: [
      { name: "dash ground forward yamcha r wolf fang fist" },
      { name: "damage yamcha r wolf fang finisher" },
      { name: "damage yamcha r wolf fang finisher stun bonus" },
      { name: "sfx yamcha r wolf fang finisher" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.YAMCHA_BLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.YAMCHA_BLAST,
      body: 
        AbilityNames.YamchaR.YAMCHA_BLAST,
    },
    components: [
      { name: "multi yamcha r yamcha blast" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.PLAY_DEAD,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 67,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.PLAY_DEAD,
      body: 
        AbilityNames.YamchaR.PLAY_DEAD
    },
    components: [
      { name: "damage yamcha r play dead explosion" },
      { name: "hide unit yamcha r play dead" },
      { name: "sfx yamcha r play dead" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.HOMERUN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.HOMERUN,
      body: 
        AbilityNames.YamchaR.HOMERUN,
    },
    components: [
      { name: "dash ground forward yamcha r homerun" },
      { name: "sfx yamcha r homerun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title:  AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST,
      body: 
        AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST,
    },
    components: [
      { name: "multi yamcha r wolf fang pitching fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.BATTER_UP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 12,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.BATTER_UP,
      body: 
        AbilityNames.YamchaR.BATTER_UP
    },
    components: [
      { name: "damage yamcha r batter up" },
      { name: "knockback yamcha r batter up deflect" },
      { name: "sfx yamcha r batter up" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.YamchaR.SPARKING,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYamcha.blp",
      disabled: "BTNYamcha.blp",
    },
    tooltip: {
      title: AbilityNames.YamchaR.SPARKING,
      body: 
        AbilityNames.YamchaR.SPARKING
    },
    components: [
      { name: "knockback yamcha r sparking" },
      { name: "sfx yamcha r sparking" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.KAMEHAMEHA_CHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiKamehameha.blp",
      disabled: "BTNRoshiKamehameha.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.KAMEHAMEHA_CHARGE,
      body: 
        AbilityNames.Roshi.KAMEHAMEHA_CHARGE,
    },
    components: [
      { name: "dash ground forward last stand" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.KAMEHAMEHA_FIRE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiKamehamehaFire.blp",
      disabled: "BTNRoshiKamehamehaFire.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.KAMEHAMEHA_FIRE,
      body: 
        AbilityNames.Roshi.KAMEHAMEHA_FIRE,
    },
    components: [
      { name: "beam kame roshi" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.KAMEHAMEHA_SUPER_CHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiKamehameha2.blp",
      disabled: "BTNRoshiKamehameha2.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.KAMEHAMEHA_SUPER_CHARGE,
      body: 
        AbilityNames.Roshi.KAMEHAMEHA_SUPER_CHARGE,
    },
    components: [
      { name: "dash ground forward roshi max power" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.KAMEHAMEHA_SUPER_FIRE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiKamehamehaFire2.blp",
      disabled: "BTNRoshiKamehamehaFire2.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.KAMEHAMEHA_SUPER_FIRE,
      body: 
        AbilityNames.Roshi.KAMEHAMEHA_SUPER_FIRE
    },
    components: [
      { name: "beam kame super roshi" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.LIGHTNING_SURPRISE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiLightningSurprise.blp",
      disabled: "BTNRoshiLightningSurprise.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.LIGHTNING_SURPRISE,
      body: 
        AbilityNames.Roshi.LIGHTNING_SURPRISE,
    },
    components: [
      { name: "channel caster default" },
      { name: "beam lightning surprise" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Roshi.MAX_POWER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRoshiFullPower.blp",
      disabled: "BTNRoshiFullPower.blp",
    },
    tooltip: {
      title: AbilityNames.Roshi.MAX_POWER,
      body: 
        AbilityNames.Roshi.MAX_POWER,
    },
    components: [
      { name: "dash ground forward roshi max power" },
      { name: "block roshi max power" },
      { name: "temp ability disable new trick" },
      { name: "sfx roshi max power" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.DETROIT_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightDetroitSmash.blp",
      disabled: "BTNAllMightDetroitSmash.blp",
    },
    tooltip: {
      title:  AbilityNames.AllMight.DETROIT_SMASH,
      body: 
        AbilityNames.AllMight.DETROIT_SMASH,
    },
    components: [
      { name: "multi detroit smash" },
      { name: "beam detroit smash" },
      { name: "dash ground forward all might right smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.LEFT_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightLeftSmash.blp",
      disabled: "BTNAllMightLeftSmash.blp",
    },
    tooltip: {
      title:  AbilityNames.AllMight.LEFT_SMASH,
      body: 
        AbilityNames.AllMight.LEFT_SMASH,
    },
    components: [
      { name: "multi all might left smash" },
      { name: "spell amp left right smash" },
      { name: "dash ground forward all might left smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.RIGHT_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightRightSmash.blp",
      disabled: "BTNAllMightRightSmash.blp",
    },
    tooltip: {
      title:  AbilityNames.AllMight.RIGHT_SMASH,
      body: 
        AbilityNames.AllMight.RIGHT_SMASH,
    },
    components: [
      { name: "multi all might right smash" },
      { name: "spell amp left right smash" },
      { name: "dash ground forward all might right smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.UNITED_STATES_OF_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightUnitedStatesOfSmash.blp",
      disabled: "BTNAllMightUnitedStatesOfSmash.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.UNITED_STATES_OF_SMASH,
      body: 
        AbilityNames.AllMight.UNITED_STATES_OF_SMASH,
    },
    components: [
      { name: "dash ground point united states of smash" },
      { name: "damage united states of smash dps" },
      { name: "damage united states of smash explosion inner" },
      { name: "damage united states of smash explosion outer" },
      { name: "debuff stun united states of smash" },
      { name: "beam united states of smash" },
      { name: "knockback united states of smash" },
      { name: "sfx united states of smash" },
      { name: "sfx united states of smash explosion" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.ONE_FOR_ALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightOneForAll.blp",
      disabled: "BTNAllMightOneForAll.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.ONE_FOR_ALL,
      body: 
        AbilityNames.AllMight.ONE_FOR_ALL
    },
    components: [
      { name: "dash ground forward one for all" },
      { name: "block one for all" },
      { name: "multi one for all 1" },
      { name: "multi one for all 2" },
      { name: "multi one for all 3" },
      { name: "multi one for all 4" },
      { name: "multi one for all 5" },
      { name: "sfx one for all" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.OKLAHOMA_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 85,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightOklahomaSmash.blp",
      disabled: "BTNAllMightOklahomaSmash.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.OKLAHOMA_SMASH,
      body: 
        AbilityNames.AllMight.OKLAHOMA_SMASH
    },
    components: [
      { name: "dash ground forward oklahoma smash" },
      { name: "damage oklahoma smash dps" },
      { name: "damage oklahoma smash release dps" },
      { name: "knockback oklahoma smash" },
      { name: "knockback oklahoma smash release" },
      { name: "sfx oklahoma smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.CAROLINA_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightCarolinaSmash.blp",
      disabled: "BTNAllMightCarolinaSmash.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.CAROLINA_SMASH,
      body: 
        AbilityNames.AllMight.CAROLINA_SMASH
    },
    components: [
      { name: "dash ground point carolina smash" },
      { name: "damage carolina smash explosion" },
      { name: "debuff stun carolina smash" },
      { name: "sfx carolina smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.CALIFORNIA_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightCaliforniaSmash.blp",
      disabled: "BTNAllMightCaliforniaSmash.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.CALIFORNIA_SMASH,
      body: 
        AbilityNames.AllMight.CALIFORNIA_SMASH
    },
    components: [
      { name: "dash ground point california smash" },
      { name: "damage california smash dps" },
      { name: "damage california smash explosion" },
      { name: "debuff stun california smash" },
      { name: "jump california smash" },
      { name: "sfx california smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.AllMight.NEW_HAMPSHIRE_SMASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNAllMightNewHampshireSmash.blp",
      disabled: "BTNAllMightNewHampshireSmash.blp",
    },
    tooltip: {
      title: AbilityNames.AllMight.NEW_HAMPSHIRE_SMASH,
      body: 
        AbilityNames.AllMight.NEW_HAMPSHIRE_SMASH
    },
    components: [
      { name: "dash ground point new hampshire smash pushback" },
      { name: "damage new hampshire smash explosion" },
      { name: "knockback new hampshire smash" },
      { name: "debuff stun new hampshire smash" },
      { name: "jump new hamphsire smash" },
      { name: "sfx new hampshire smash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.JUMP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioQ.blp",
      disabled: "BTNMarioQ.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.JUMP,
      body: 
        AbilityNames.Mario.JUMP,
    },
    components: [
      { name: "dash ground forward mario jump" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.HAMMER_TIME,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioW.blp",
      disabled: "BTNMarioW.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.HAMMER_TIME,
      body: 
        AbilityNames.Mario.HAMMER_TIME,
    },
    components: [
      { name: "multi hammer time" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.SPIN_JUMP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioQ.blp",
      disabled: "BTNMarioQ.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.SPIN_JUMP,
      body: 
        AbilityNames.Mario.SPIN_JUMP,
    },
    components: [
      { name: "dash ground forward spin jump" },
      { name: "damage spin jump dps" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.SUPER_CAPE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioQ.blp",
      disabled: "BTNMarioQ.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.SUPER_CAPE,
      body: 
        AbilityNames.Mario.SUPER_CAPE,
    },
    components: [
      { name: "multi super cape" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.POWER_UP_BLOCK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 250,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioQ.blp",
      disabled: "BTNMarioQ.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.POWER_UP_BLOCK,
      body: 
        AbilityNames.Mario.POWER_UP_BLOCK,
    },
    components: [
      { name: "dash ground forward power up block" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Mario.FIREBALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 44,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMarioF.blp",
      disabled: "BTNMarioF.blp",
    },
    tooltip: {
      title: AbilityNames.Mario.FIREBALL,
      body: 
        AbilityNames.Mario.FIREBALL
    },
    components: [
      { name: "beam mario fireball"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tien.DODON_RAY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTienDodonRay.blp",
      disabled: "BTNTienDodonRay.blp",
    },
    tooltip: {
      title: AbilityNames.Tien.DODON_RAY,
      body: 
        AbilityNames.Tien.DODON_RAY
    },
    components: [
      { name: "beam dodon ray" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tien.TRI_BEAM_CHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTienTriBeamCharge.blp",
      disabled: "BTNTienTriBeamCharge.blp",
    },
    tooltip: {
      title: AbilityNames.Tien.TRI_BEAM_CHARGE,
      body: 
        AbilityNames.Tien.TRI_BEAM_CHARGE,
    },
    components: [
      { name: "dash ground forward last stand" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tien.TRI_BEAM_FIRE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTienTriBeamFire.blp",
      disabled: "BTNTienTriBeamFire.blp",
    },
    tooltip: {
      title: AbilityNames.Tien.TRI_BEAM_FIRE,
      body: 
        AbilityNames.Tien.TRI_BEAM_FIRE
    },
    components: [
      { name: "beam tri beam fire" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Tien.KIAI,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTienKiai.blp",
      disabled: "BTNTienKiai.blp",
    },
    tooltip: {
      title: AbilityNames.Tien.KIAI,
      body: 
        AbilityNames.Tien.KIAI
    },
    components: [
      { name: "channel caster default" },
      { name: "damage tien kiai dps" },
      { name: "block tien kiai" },
      { name: "knockback tien kiai" },
      { name: "sfx tien kiai" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_TENSHO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou.blp",
      disabled: "BTNIchigoGetsugaTenshou.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_TENSHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga tensho" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_KUROI,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaKuroi.blp",
      disabled: "BTNIchigoGetsugaKuroi.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_KUROI,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga kuroi" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_GRAN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaGran.blp",
      disabled: "BTNIchigoGetsugaGran.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_GRAN,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga gran" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_JUJISHO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou2.blp",
      disabled: "BTNIchigoGetsugaTenshou2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_JUJISHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga jujisho" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_1,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou2.blp",
      disabled: "BTNIchigoGetsugaTenshou2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_JUJISHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga jujisho on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_2,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou2.blp",
      disabled: "BTNIchigoGetsugaTenshou2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_JUJISHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga jujisho on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_3,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou2.blp",
      disabled: "BTNIchigoGetsugaTenshou2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_JUJISHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga jujisho on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.GETSUGA_JUJISHO_ON_HIT_4,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoGetsugaTenshou2.blp",
      disabled: "BTNIchigoGetsugaTenshou2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.GETSUGA_JUJISHO,
      body: 
        ""
    },
    components: [
      { name: "beam getsuga jujisho on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.BANKAI_HOLLOW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoBankai.blp",
      disabled: "BTNIchigoBankai.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.BANKAI_HOLLOW,
      body: 
        AbilityNames.Ichigo.BANKAI_HOLLOW
    },
    components: [
      { name: "heal caster bankai hollow" },
      { name: "sfx bankai hollow" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.BANKAI_BLUT_VENE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 500,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoBankai.blp",
      disabled: "BTNIchigoBankai.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.BANKAI_BLUT_VENE,
      body: 
        AbilityNames.Ichigo.BANKAI_BLUT_VENE
    },
    components: [
      { name: "block bankai blut vene" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.BANKAI_FINAL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 500,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoBankai2.blp",
      disabled: "BTNIchigoBankai2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.BANKAI_FINAL,
      body: 
        AbilityNames.Ichigo.BANKAI_FINAL
    },
    components: [
      { name: "dash ground forward bankai" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.CERO_CHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 170,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoCero.blp",
      disabled: "BTNIchigoCero.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.CERO_CHARGE,
      body: 
        AbilityNames.Ichigo.CERO_CHARGE
    },
    components: [
      { name: "channel caster cero fire" },
      { name: "temp ability cero fire" },
      { name: "sfx cero charge caster" },
      { name: "sfx cero charge ready" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.CERO_FIRE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoCeroFire.blp",
      disabled: "BTNIchigoCeroFire.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.CERO_FIRE,
      body: 
        AbilityNames.Ichigo.CERO_FIRE
    },
    components: [
      { name: "beam cero fire" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.CERO_GIGANTE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoCeroGigante.blp",
      disabled: "BTNIchigoCeroGigante.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.CERO_GIGANTE,
      body: 
        AbilityNames.Ichigo.CERO_GIGANTE
    },
    components: [
      { name: "beam cero gigante"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.MUGETSU_UNLEASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoMugetsu2.blp",
      disabled: "BTNIchigoMugetsu2.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.MUGETSU_UNLEASH,
      body: 
        AbilityNames.Ichigo.MUGETSU_UNLEASH
    },
    components: [
      { name: "beam mugetsu unleash" },
      { name: "sfx mugetsu" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.MUGETSU_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoMugetsu3.blp",
      disabled: "BTNIchigoMugetsu3.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.MUGETSU_SLASH,
      body: 
        AbilityNames.Ichigo.MUGETSU_SLASH
    },
    components: [
      { name: "beam mugetsu slash" },
      { name: "sfx mugetsu" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.SHUNPO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoShunpo.blp",
      disabled: "BTNIchigoShunpo.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.SHUNPO,
      body: 
        AbilityNames.Ichigo.SHUNPO
    },
    components: [
      { name: "dash shunpo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.HIRENKYAKU,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoHirenkyaku.blp",
      disabled: "BTNIchigoHirenkyaku.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.HIRENKYAKU,
      body: 
        AbilityNames.Ichigo.HIRENKYAKU
    },
    components: [
      { name: "dash hirenkyaku" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ichigo.BLUTVENE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNIchigoBlutVene.blp",
      disabled: "BTNIchigoBlutVene.blp",
    },
    tooltip: {
      title: AbilityNames.Ichigo.BLUTVENE,
      body: 
        AbilityNames.Ichigo.BLUTVENE
    },
    components: [
      { name: "block blut vene" },
    ],
  },
  // -------------------------------------------
  // {
  //   name: AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
  //   currentCd: 0,
  //   maxCd: 0.5,
  //   costType: "MP",
  //   costAmount: 0,
  //   duration: 15,
  //   updateRate: 0.03,
  //   castTime: 0.0,
  //   canMultiCast: true,
  //   waitsForNextClick: false,
  //   animation: "spell",
  //   icon: {
  //     enabled: "BTNIchigoShunpo.blp",
  //     disabled: "BTNIchigoShunpo.blp",
  //   },
  //   tooltip: {
  //     title: AbilityNames.Ichigo.SHUNPO,
  //     body: 
  //       AbilityNames.Ichigo.SHUNPO
  //   },
  //   components: [
  //     { name: "dash bankai final on hit" },
  //   ],
  // },
  // // -------------------------------------------
  // {
  //   name: AbilityNames.Ichigo.DASH_BANKAI_FINAL_2,
  //   currentCd: 0,
  //   maxCd: 0.5,
  //   costType: "MP",
  //   costAmount: 0,
  //   duration: 15,
  //   updateRate: 0.03,
  //   castTime: 0.0,
  //   canMultiCast: true,
  //   waitsForNextClick: false,
  //   animation: "spell",
  //   icon: {
  //     enabled: "BTNIchigoShunpo.blp",
  //     disabled: "BTNIchigoShunpo.blp",
  //   },
  //   tooltip: {
  //     title: AbilityNames.Ichigo.SHUNPO,
  //     body: 
  //       AbilityNames.Ichigo.SHUNPO
  //   },
  //   components: [
  //     { name: "dash bankai final on hit" },
  //   ],
  // },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.DOUBLE_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 17,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.DOUBLE_SLASH,
      body: 
        AbilityNames.DartFeld.DOUBLE_SLASH,
    },
    components: [
      { name: "slash double slash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.BURNING_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.BURNING_RUSH,
      body: 
        "",
    },
    components: [
      { name: "slash burning rush" },
      { name: "multi burning rush" },
      { name: "dash ground forward dart speed boost" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.MADNESS_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.BURNING_RUSH,
      body: 
        "",
    },
    components: [
      { name: "slash madness slash" },
      { name: "multi madness slash" },
      { name: "dash ground forward dart speed boost" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.CRUSH_DANCE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.CRUSH_DANCE,
      body: 
        AbilityNames.DartFeld.CRUSH_DANCE,
    },
    components: [
      { name: "dash ground point crush dance" },
      { name: "damage crush dance explosion" },
      { name: "sfx crush dance" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.HEART_OF_FIRE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.HEART_OF_FIRE,
      body: 
        AbilityNames.DartFeld.HEART_OF_FIRE,
    },
    components: [
      { name: "temp ability heart of fire" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.MADNESS_HERO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 333,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.MADNESS_HERO,
      body: 
        AbilityNames.DartFeld.MADNESS_HERO,
    },
    components: [
      //
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT,
    currentCd: 0,
    maxCd: 0.06,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT,
      body: 
        AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT,
    },
    components: [
      { name: "beam madness on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.BLAZING_DYNAMO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.BLAZING_DYNAMO,
      body: 
        AbilityNames.DartFeld.BLAZING_DYNAMO
    },
    components: [
      { name: "dash ground point blazing dynamo 1" },
      { name: "dash ground point blazing dynamo 2" },
      { name: "dash ground point blazing dynamo 3" },
      { name: "damage blazing dynamo dps" },
      { name: "damage blazing dynamo explosion" },
      { name: "block blazing dynamo" },
      { name: "temp ability blazing dynamo spell immunity" },
      { name: "sfx blazing dynamo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.DRAGOON_TRANSFORMATION,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 333,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.DRAGOON_TRANSFORMATION,
      body: 
        AbilityNames.DartFeld.DRAGOON_TRANSFORMATION
    },
    components: [
      // 
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.DRAGOON_FLOURISH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.DRAGOON_FLOURISH,
      body: 
        AbilityNames.DartFeld.DRAGOON_FLOURISH
    },
    components: [
      { name: "multi dragoon flourish" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.FLAME_SHOT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.FLAME_SHOT,
      body: 
        AbilityNames.DartFeld.FLAME_SHOT
    },
    components: [
      { name: "beam flame shot" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.PARAGON_OF_FLAME,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.PARAGON_OF_FLAME,
      body: 
        AbilityNames.DartFeld.PARAGON_OF_FLAME
    },
    components: [
      { name: "damage block paragon of flame" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT,
    currentCd: 0,
    maxCd: 0.24,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT,
      body: 
        AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT
    },
    components: [
      { name: "damage paragon of flame on hit" },
      { name: "sfx paragon of flame on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 15,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1,
      body: 
        AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1
    },
    components: [
      { name: "dash paragon of flame on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2,
    currentCd: 0,
    maxCd: 0.5,
    costType: "MP",
    costAmount: 0,
    duration: 15,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2,
      body: 
        AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2
    },
    components: [
      { name: "dash paragon of flame on hit" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.FINAL_BURST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title:  AbilityNames.DartFeld.FINAL_BURST,
      body: 
        AbilityNames.DartFeld.FINAL_BURST,
    },
    components: [
      { name: "dash ground point final burst" },
      { name: "debuff slow final burst" },
      { name: "damage final burst dps" },
      { name: "damage final burst explosion" },
      { name: "sfx final burst" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.DartFeld.RED_EYED_DRAGON_SUMMON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDartFeld.blp",
      disabled: "BTNDartFeld.blp",
    },
    tooltip: {
      title: AbilityNames.DartFeld.RED_EYED_DRAGON_SUMMON,
      body: 
        AbilityNames.DartFeld.RED_EYED_DRAGON_SUMMON
    },
    components: [
      { name: "beam red eyed dragon summon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android13.ENERGY_BEAM, // androids 13 14 15 beam
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Beam.blp",
      disabled: "BTN13Beam.blp",
    },
    tooltip: {
      title: "Energy Beam 13",
      body: 
        "Energy Beam 13"
    },
    components: [
      { name: "beam energy beam" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android13.SS_DEADLY_HAMMER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 124,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Hammer.blp",
      disabled: "BTN13Hammer.blp",
    },
    tooltip: {
      title: AbilityNames.Android13.SS_DEADLY_HAMMER,
      body: 
        AbilityNames.Android13.SS_DEADLY_HAMMER
    },
    components: [
      { name: "dash ground point ss deadly hammer" },
      { name: "damage ss deadly hammer dps" },
      { name: "beam ss deadly hammer" },
      { name: "knockback ss deadly hammer" },
      { name: "sfx ss deadly hammer" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android13.SS_DEADLY_BOMBER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 208,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13SSDB.blp",
      disabled: "BTN13SSDB.blp",
    },
    tooltip: {
      title: AbilityNames.Android13.SS_DEADLY_BOMBER,
      body: 
        AbilityNames.Android13.SS_DEADLY_BOMBER
    },
    components: [
      { name: "beam ss deadly bomber" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android13.NUKE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Nuke.blp",
      disabled: "BTN13Nuke.blp",
    },
    tooltip: {
      title: AbilityNames.Android13.NUKE,
      body: 
        AbilityNames.Android13.NUKE
    },
    components: [
      { name: "beam nuke" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android17DBS.ANDROID_BARRIER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 250,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Barrier.blp",
      disabled: "BTN13Barrier.blp",
    },
    tooltip: {
      title: AbilityNames.Android17DBS.ANDROID_BARRIER,
      body: 
        AbilityNames.Android17DBS.ANDROID_BARRIER
    },
    components: [
      { name: "block android barrier" },
      { name: "beam android barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Android13.OVERCHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 500,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\PassiveButtons\\PASBTNFeedBack.blp",
      disabled: "ReplaceableTextures\\PassiveButtons\\PASBTNFeedBack.blp",
    },
    tooltip: {
      title: AbilityNames.Android13.OVERCHARGE,
      body: 
        AbilityNames.Android13.OVERCHARGE
    },
    components: [
      { name: "spell amp overcharge" },
      { name: "damage overcharge dps" },
      { name: "sfx overcharge" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Babidi.HARETSU,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBabidiQ.blp",
      disabled: "BTNBabidiQ.blp",
    },
    tooltip: {
      title: AbilityNames.Babidi.HARETSU,
      body: 
        AbilityNames.Babidi.HARETSU
    },
    components: [
      { name: "damage target haretsu explosion" },
      { name: "sfx haretsu" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Babidi.BABIDI_BARRIER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBabidiW.blp",
      disabled: "BTNBabidiW.blp",
    },
    tooltip: {
      title: AbilityNames.Babidi.BABIDI_BARRIER,
      body: 
        AbilityNames.Babidi.BABIDI_BARRIER
    },
    components: [
      { name: "block babidi barrier" },
      { name: "beam babidi barrier" },
      // { name: "knockback babidi barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Babidi.SUMMON_PUI_PUI,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPuiPui.blp",
      disabled: "BTNPuiPui.blp",
    },
    tooltip: {
      title: AbilityNames.Babidi.SUMMON_PUI_PUI,
      body: 
        AbilityNames.Babidi.SUMMON_PUI_PUI
    },
    components: [
      // { name: "summon summon pui pui" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Babidi.SUMMON_YAKON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYakon.blp",
      disabled: "BTNYakon.blp",
    },
    tooltip: {
      title: AbilityNames.Babidi.SUMMON_YAKON,
      body: 
        AbilityNames.Babidi.SUMMON_YAKON
    },
    components: [
      // { name: "summon summon yakon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Babidi.SUMMON_DABURA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDabura.blp",
      disabled: "BTNDabura.blp",
    },
    tooltip: {
      title: AbilityNames.Babidi.SUMMON_DABURA,
      body: 
        AbilityNames.Babidi.SUMMON_DABURA
    },
    components: [
      // { name: "summon summon dabura" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Dabura.EVIL_SPEAR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNImpalingBolt.blp",
      disabled: "ReplaceableTextures\\CommandButtons\\BTNImpalingBolt.blp",
    },
    tooltip: {
      title: AbilityNames.Dabura.EVIL_SPEAR,
      body: 
        AbilityNames.Dabura.EVIL_SPEAR
    },
    components: [
      { name: "beam evil spear" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Buu.FLESH_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuFleshAttack.blp",
      disabled: "BTNBuuFleshAttack.blp",
    },
    tooltip: {
      title: AbilityNames.Buu.FLESH_ATTACK,
      body: 
        AbilityNames.Buu.FLESH_ATTACK
    },
    components: [
      { name: "damage target flesh attack explosion" },
      { name: "sfx flesh attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Buu.INNOCENCE_BREATH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 120,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuInnocenceBreath.blp",
      disabled: "BTNBuuInnocenceBreath.blp",
    },
    tooltip: {
      title:  AbilityNames.Buu.INNOCENCE_BREATH,
      body: 
        AbilityNames.Buu.INNOCENCE_BREATH,
    },
    components: [
      { name: "multi innocence breath" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Buu.ANGRY_EXPLOSION,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuAngryExplosion.blp",
      disabled: "BTNBuuAngryExplosion.blp",
    },
    tooltip: {
      title:  AbilityNames.Buu.ANGRY_EXPLOSION,
      body: 
        AbilityNames.Buu.ANGRY_EXPLOSION,
    },
    components: [
      { name: "beam angry explosion" },
      { name: "hide unit angry explosion" },
      { name: "sfx angry explosion delay" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Buu.VANISHING_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuVanishingBall.blp",
      disabled: "BTNBuuVanishingBall.blp",
    },
    tooltip: {
      title: AbilityNames.Buu.VANISHING_BALL,
      body: 
        AbilityNames.Buu.VANISHING_BALL
    },
    components: [
      { name: "beam vanishing ball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 264,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuMankind.blp",
      disabled: "BTNBuuMankind.blp",
    },
    tooltip: {
      title: AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK,
      body: 
        AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK
    },
    components: [
      { name: "channel caster default" },
      { name: "multi mankind destruction attack" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Broly.ENERGY_PUNCH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBrolyEnergyPunch.blp",
      disabled: "BTNBrolyEnergyPunch.blp",
    },
    tooltip: {
      title: AbilityNames.Broly.ENERGY_PUNCH,
      body: 
        "Energy Puncho"
    },
    components: [
      { name: "dash ground point energy punch" },
      { name: "damage energy punch dps" },
      { name: "knockback energy punch" },
      { name: "knockback energy punch reverse" },
      { name: "stun energy punch" },
      // every broly spell gives broly a lvl x str shield that reduces incoming dmg by 15%
      { name: "block broly" },
      { name: "sfx energy punch" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Broly.POWER_LEVEL_RISING,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 16,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPowerLevelRising.blp",
      disabled: "BTNPowerLevelRising.blp",
    },
    tooltip: {
      title: AbilityNames.Broly.POWER_LEVEL_RISING,
      body: 
        AbilityNames.Broly.POWER_LEVEL_RISING
    },
    components: [
      { name: "damage power level rising explosion" },
      { name: "knockback power level rising" },
      { name: "block broly" },
      { name: "sfx power level rising" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Broly.PLANET_CRUSHER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPlanetCrusher.blp",
      disabled: "BTNPlanetCrusher.blp",
    },
    tooltip: {
      title: AbilityNames.Broly.PLANET_CRUSHER,
      body: 
        AbilityNames.Broly.PLANET_CRUSHER
    },
    components: [
      { name: "beam planet crusher" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Broly.GIGANTIC_ROAR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 36,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiganticRoar.blp",
      disabled: "BTNGiganticRoar.blp",
    },
    tooltip: {
      title: AbilityNames.Broly.GIGANTIC_ROAR,
      body: 
        AbilityNames.Broly.GIGANTIC_ROAR
    },
    components: [
      { name: "beam gigantic roar" },
      { name: "dash ground point gigantic roar pushback" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Broly.GIGANTIC_OMEGASTORM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiganticOmegastorm.blp",
      disabled: "BTNGiganticOmegastorm.blp",
    },
    tooltip: {
      title: AbilityNames.Broly.GIGANTIC_OMEGASTORM,
      body: 
        AbilityNames.Broly.GIGANTIC_OMEGASTORM
    },
    components: [
      { name: "beam gigantic omegastorm" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cell.SPAWN_CELL_JUNIORS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCellJunior.blp",
      disabled: "BTNCellJunior.blp",
    },
    tooltip: {
      title: AbilityNames.Cell.SPAWN_CELL_JUNIORS,
      body: 
        AbilityNames.Cell.SPAWN_CELL_JUNIORS
    },
    components: [
      // { name: "summon spawn cell juniors" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cell.ABSORB,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNCellAbsorb.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNCellAbsorb.blp",
    },
    tooltip: {
      title: AbilityNames.Cell.ABSORB,
      body: 
        AbilityNames.Cell.ABSORB
    },
    components: [
      { name: "block absorb" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cell.SOLAR_KAMEHAMEHA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 264,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCellSolarKamehameha.blp",
      disabled: "BTNCellSolarKamehameha.blp",
    },
    tooltip: {
      title: AbilityNames.Cell.SOLAR_KAMEHAMEHA,
      body: 
        AbilityNames.Cell.SOLAR_KAMEHAMEHA
    },
    components: [
      { name: "channel caster default" },
      { name: "multi solar kame" },
      { name: "damage solar kame dps charging" },
      { name: "sfx solar kame caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cell.CELL_X_FORM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 990,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCellXForm.blp",
      disabled: "BTNCellXForm.blp",
    },
    tooltip: {
      title: AbilityNames.Cell.CELL_X_FORM,
      body: 
        AbilityNames.Cell.CELL_X_FORM
    },
    components: [
      { name: "dash ground forward cell-x pushback" },
      { name: "spell amp cell-x" },
      { name: "block cell-x" },
      { name: "sfx cell-x" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.DEATH_BEAM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    // higher update rate than normal!!
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDeathBeam.blp",
      disabled: "BTNDeathBeam.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.DEATH_BEAM,
      body: 
        AbilityNames.Cooler.DEATH_BEAM
    },
    components: [
      { name: "beam death beam cooler" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.SUPERNOVA_COOLER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerSupernova.blp",
      disabled: "BTNCoolerSupernova.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.SUPERNOVA_COOLER,
      body: 
        AbilityNames.Cooler.SUPERNOVA_COOLER
    },
    components: [
      { name: "beam supernova cooler" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.NOVA_CHARIOT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerNovaChariot.blp",
      disabled: "BTNCoolerNovaChariot.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.NOVA_CHARIOT,
      body: 
        AbilityNames.Cooler.NOVA_CHARIOT
    },
    components: [
      { name: "dash ground point nova chariot" },
      { name: "damage nova chariot dps" },
      { name: "block nova chariot" },
      { name: "sfx nova chariot" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.DEAFENING_WAVE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.DEAFENING_WAVE,
      body: 
        AbilityNames.Cooler.DEAFENING_WAVE
    },
    components: [
      { name: "beam deafening wave" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.GETI_STAR_REPAIR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNEngineeringUpgrade.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNEngineeringUpgrade.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.GETI_STAR_REPAIR,
      body: 
        AbilityNames.Cooler.GETI_STAR_REPAIR
    },
    components: [
      { name: "block geti star repair" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Cooler.SUPERNOVA_GOLDEN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerGoldenSupernova.blp",
      disabled: "BTNCoolerGoldenSupernova.blp",
    },
    tooltip: {
      title: AbilityNames.Cooler.SUPERNOVA_GOLDEN,
      body: 
        AbilityNames.Cooler.SUPERNOVA_GOLDEN
    },
    components: [
      { name: "beam supernova golden" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Raditz.DOUBLE_SUNDAY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRaditzDoubleSunday.blp",
      disabled: "BTNRaditzDoubleSunday.blp",
    },
    tooltip: {
      title: AbilityNames.Raditz.DOUBLE_SUNDAY,
      body: 
        AbilityNames.Raditz.DOUBLE_SUNDAY
    },
    components: [
      { name: "multi double sunday" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Raditz.SATURDAY_CRASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 35,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRaditzSaturdayCrash.blp",
      disabled: "BTNRaditzSaturdayCrash.blp",
    },
    tooltip: {
      title: AbilityNames.Raditz.SATURDAY_CRASH,
      body: 
        AbilityNames.Raditz.SATURDAY_CRASH
    },
    components: [
      { name: "beam saturday crash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Raditz.BEHIND_YOU,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRaditzBehindYou.blp",
      disabled: "BTNRaditzBehindYou.blp",
    },
    tooltip: {
      title: AbilityNames.Raditz.BEHIND_YOU,
      body: 
        AbilityNames.Raditz.BEHIND_YOU
    },
    components: [
      { name: "dash ground point behind you pushback" },
      { name: "damage behind you dps" },
      { name: "knockback behind you" },
      { name: "stun behind you" },
      { name: "sfx behind you" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Raditz.DOUBLE_SUNDAE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRaditzDoubleSundae.blp",
      disabled: "BTNRaditzDoubleSundae.blp",
    },
    tooltip: {
      title: AbilityNames.Raditz.DOUBLE_SUNDAE,
      body: 
        AbilityNames.Raditz.DOUBLE_SUNDAE
    },
    components: [
      { name: "spell amp double sundae" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Nappa.GIANT_STORM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNNappaGiantStorm.blp",
      disabled: "BTNNappaGiantStorm.blp",
    },
    tooltip: {
      title: AbilityNames.Nappa.GIANT_STORM,
      body: 
        AbilityNames.Nappa.GIANT_STORM
    },
    components: [
      { name: "beam giant storm" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Nappa.BLAZING_STORM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNNappaBlazingStorm.blp",
      disabled: "BTNNappaBlazingStorm.blp",
    },
    tooltip: {
      title: AbilityNames.Nappa.BLAZING_STORM,
      body: 
        AbilityNames.Nappa.BLAZING_STORM
    },
    components: [
      // { name: "multi blazing storm" },
      { name: "multi blazing storm 1" },
      { name: "multi blazing storm 2" },
      { name: "multi blazing storm 3" },
      { name: "multi blazing storm 4" },
      { name: "multi blazing storm 5" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Nappa.BREAK_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNNappaBreakCannon.blp",
      disabled: "BTNNappaBreakCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Nappa.BREAK_CANNON,
      body: 
        AbilityNames.Nappa.BREAK_CANNON
    },
    components: [
      { name: "beam break cannon"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saibaman.BOMB,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 22,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSaibamanBomb.blp",
      disabled: "BTNSaibamanBomb.blp",
    },
    tooltip: {
      title: AbilityNames.Saibaman.BOMB,
      body: 
        AbilityNames.Saibaman.BOMB
    },
    components: [
      { name: "dash ground unit saibaman bomb" },
      { name: "damage saibaman bomb explosion" },
      { name: "jump saibaman bomb" },
      { name: "sfx saibaman bomb" },
      { name: "self destruct generic end" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saibaman.ACID,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSaibamanAcid.blp",
      disabled: "BTNSaibamanAcid.blp",
    },
    tooltip: {
      title: AbilityNames.Saibaman.ACID,
      body: 
        AbilityNames.Saibaman.ACID
    },
    components: [
      { name: "beam saibaman acid" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Moro.ENERGY_DRAIN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 10,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMoro.blp",
      disabled: "BTNMoro.blp",
    },
    tooltip: {
      title: AbilityNames.Moro.ENERGY_DRAIN,
      body: 
        AbilityNames.Moro.ENERGY_DRAIN
    },
    components: [
      { name: "damage target energy drain moro explosion" },
      { name: "sfx energy drain moro" },
      { name: "sfx energy drain moro caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Moro.ENERGY_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMoro.blp",
      disabled: "BTNMoro.blp",
    },
    tooltip: {
      title: AbilityNames.Moro.ENERGY_BALL,
      body: 
        AbilityNames.Moro.ENERGY_BALL
    },
    components: [
      { name: "beam energy ball moro" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Moro.LAVA_BURST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMoro.blp",
      disabled: "BTNMoro.blp",
    },
    tooltip: {
      title: AbilityNames.Moro.LAVA_BURST,
      body: 
        AbilityNames.Moro.LAVA_BURST
    },
    components: [
      { name: "multi lava burst" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Moro.LAVA_PILLARS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 256,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMoro.blp",
      disabled: "BTNMoro.blp",
    },
    tooltip: {
      title: AbilityNames.Moro.LAVA_PILLARS,
      body: 
        AbilityNames.Moro.LAVA_PILLARS
    },
    components: [
      { name: "multi lava pillars" },
      { name: "multi lava pillars 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Moro.POWER_LEVEL_SHARING,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMoroPowerLevelRising.blp",
      disabled: "BTNMoroPowerLevelRising.blp",
    },
    tooltip: {
      title: AbilityNames.Moro.POWER_LEVEL_SHARING,
      body: 
        AbilityNames.Moro.POWER_LEVEL_SHARING
    },
    components: [
      { name: "aoe apply power level sharing" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.DEMONS_MARK,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperDemonMark1.blp",
      disabled: "BTNJanembaSuperDemonMark1.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.DEMONS_MARK,
      body: 
        "."
    },
    components: [
      { name: "temp ability swap demon mark" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.DEMON_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperDemonMark2.blp",
      disabled: "BTNJanembaSuperDemonMark2.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.DEMON_RUSH,
      body: 
        "."
    },
    components: [
      { name: "sfx demon rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.RAKSHASA_CLAW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 31,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperRakshasaClaw.blp",
      disabled: "BTNJanembaSuperRakshasaClaw.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.RAKSHASA_CLAW,
      body: 
        "."
    },
    components: [
      { name: "beam rakshasa claw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 25,
    duration: 31,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperRakshasaClaw.blp",
      disabled: "BTNJanembaSuperRakshasaClaw.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.RAKSHASA_CLAW,
      body: 
        "."
    },
    components: [
      { name: "beam rakshasa claw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.DEVIL_CLAW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 31,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperRakshasaClaw2.blp",
      disabled: "BTNJanembaSuperRakshasaClaw2.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.DEVIL_CLAW,
      body: 
        "."
    },
    components: [
      { name: "multi devil claw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 500,
    duration: 31,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperRakshasaClaw2.blp",
      disabled: "BTNJanembaSuperRakshasaClaw2.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT,
      body: 
        "."
    },
    components: [
      { name: "multi devil claw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.BUNKAI_TELEPORT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 215,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperBunkaiTeleport.blp",
      disabled: "BTNJanembaSuperBunkaiTeleport.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.BUNKAI_TELEPORT,
      body: 
        "."
    },
    components: [
      { name: "teleport bunkai teleport return" },
      { name: "dash ground point bunkai teleport" },
      { name: "temp ability evil aura" },
      { name: "temp ability demonic blade" },
      { name: "sfx bunkai teleport caster 1" },
      { name: "sfx bunkai teleport caster 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.DEMONIC_BLADE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 10,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperDemonicBlade.blp",
      disabled: "BTNJanembaSuperDemonicBlade.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.DEMONIC_BLADE,
      body: 
        "."
    },
    components: [
      { name: "damage demonic blade" },
      { name: "sfx demonic blade" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.COSMIC_SLASH,
    currentCd: 0,
    maxCd: 6,
    costType: "MP",
    costAmount: 25,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperRakshasaClaw.blp",
      disabled: "BTNJanembaSuperRakshasaClaw.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.RAKSHASA_CLAW,
      body: 
        "."
    },
    components: [
      { name: "beam cosmic slash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.HELLS_GATE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperHellsGate.blp",
      disabled: "BTNJanembaSuperHellsGate.blp",
    },
    tooltip: {
      title: AbilityNames.SuperJanemba.HELLS_GATE,
      body: 
        AbilityNames.SuperJanemba.HELLS_GATE
    },
    components: [
      { name: "beam hells gate"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNJanembaSuperLightningShowerRain.blp",
      disabled: "BTNJanembaSuperLightningShowerRain.blp",
    },
    tooltip: {
      title:  AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN,
      body: 
        AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN,
    },
    components: [
      { name: "multi lightning shower rain" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.BELLY_ARMOR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKRoolBellyArmor.blp",
      disabled: "BTNKingKRoolBellyArmor.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.BELLY_ARMOR,
      body: 
        AbilityNames.KingKRool.BELLY_ARMOR
    },
    components: [
      { name: "dash ground forward belly armor" },
      { name: "block belly armor" },
      { name: "knockback belly armor" },
      { name: "sfx belly armor" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.KROWN_TOSS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 110,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKroolCrownToss.blp",
      disabled: "BTNKingKroolCrownToss.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.KROWN_TOSS,
      body: 
        AbilityNames.KingKRool.KROWN_TOSS
    },
    components: [
      { name: "beam krown toss" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.KHARGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKroolCharge.blp",
      disabled: "BTNKingKroolCharge.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.KHARGE,
      body: 
        AbilityNames.KingKRool.KHARGE
    },
    components: [
      { name: "dash ground point kharge" },
      { name: "damage kharge explosion" },
      { name: "debuff stun kharge" },
      { name: "sfx kharge" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.HAND_KANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKRoolCannon.blp",
      disabled: "BTNKingKRoolCannon.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.HAND_KANNON,
      body: 
        AbilityNames.KingKRool.HAND_KANNON
    },
    components: [
      { name: "channel caster default" },
      { name: "multi hand kannon" },
      // { name: "temp ability kannonblast" },
      { name: "sfx hand kannon gun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.KANNONBLAST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKRoolHandKannon2.blp",
      disabled: "BTNKingKRoolHandKannon2.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.HAND_KANNON,
      body: 
        AbilityNames.KingKRool.HAND_KANNON
    },
    components: [
      { name: "beam kannonblast" },
      { name: "sfx hand kannon gun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.MONKEY_SMASHER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 88,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMonkeySmasher.blp",
      disabled: "BTNMonkeySmasher.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.MONKEY_SMASHER,
      body: 
        AbilityNames.KingKRool.MONKEY_SMASHER
    },
    components: [
      { name: "beam monkey smasher" },
      { name: "sfx hand kannon gun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.BLAST_O_MATIC,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKRoolBlastOMatic.blp",
      disabled: "BTNKingKRoolBlastOMatic.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.BLAST_O_MATIC,
      body: 
        AbilityNames.KingKRool.BLAST_O_MATIC
    },
    components: [
      { name: "channel caster default" },
      { name: "multi blast-o-matic" },
      { name: "damage blast-o-matic charging" },
      { name: "sfx blast-o-matic caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.KingKRool.KINGS_THRONE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1000,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKingKRoolKingsThrone.blp",
      disabled: "BTNKingKRoolKingsThrone.blp",
    },
    tooltip: {
      title: AbilityNames.KingKRool.KINGS_THRONE,
      body: 
        AbilityNames.KingKRool.KINGS_THRONE
    },
    components: [
      { name: "spell amp kings throne" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.EisShenron.FROST_CLAWS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 6,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNEisShenronFrostClaws.blp",
      disabled: "BTNEisShenronFrostClaws.blp",
    },
    tooltip: {
      title: AbilityNames.EisShenron.FROST_CLAWS,
      body: 
        AbilityNames.EisShenron.FROST_CLAWS
    },
    components: [
      { name: "multi frost claws" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.EisShenron.ICE_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNEisShenronIceSlash.blp",
      disabled: "BTNEisShenronIceSlash.blp",
    },
    tooltip: {
      title:  AbilityNames.EisShenron.ICE_SLASH,
      body: 
        AbilityNames.EisShenron.ICE_SLASH,
    },
    components: [
      { name: "damage ice slash" },
      { name: "debuff slow ice slash" },
      { name: "sfx ice slash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.EisShenron.ABSOLUTE_ZERO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNEisShenronAbsoluteZero.blp",
      disabled: "BTNEisShenronAbsoluteZero.blp",
    },
    tooltip: {
      title: AbilityNames.EisShenron.ABSOLUTE_ZERO,
      body: 
        AbilityNames.EisShenron.ABSOLUTE_ZERO
    },
    components: [
      { name: "block absolute zero" },
      { name: "debuff stun absolute zero finish" },
      { name: "sfx absolute zero" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.EisShenron.ICE_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNEisShenronIceCannon.blp",
      disabled: "BTNEisShenronIceCannon.blp",
    },
    tooltip: {
      title: AbilityNames.EisShenron.ICE_CANNON,
      body: 
        AbilityNames.EisShenron.ICE_CANNON
    },
    components: [
      { name: "beam ice cannon"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ginyu.MILKY_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGinyuMilkyCannon.blp",
      disabled: "BTNGinyuMilkyCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Ginyu.MILKY_CANNON,
      body: 
        AbilityNames.Ginyu.MILKY_CANNON
    },
    components: [
      { name: "beam milky cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ginyu.GALAXY_DYNAMITE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 75,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGinyuGalaxyDynamite.blp",
      disabled: "BTNGinyuGalaxyDynamite.blp",
    },
    tooltip: {
      title: AbilityNames.Ginyu.GALAXY_DYNAMITE,
      body: 
        AbilityNames.Ginyu.GALAXY_DYNAMITE
    },
    components: [
      { name: "multi galaxy dynamite" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ginyu.GINYU_POSE_FIGHTING,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 164,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGinyuPoseFighting.blp",
      disabled: "BTNGinyuPoseFighting.blp",
    },
    tooltip: {
      title: AbilityNames.Ginyu.GINYU_POSE_FIGHTING,
      body: 
        AbilityNames.Ginyu.GINYU_POSE_FIGHTING
    },
    components: [
      { name: "spell amp ginyu pose fighting" },
      { name: "dash ground forward ginyu pose fighting" },
      { name: "temp ability ginyu pose fighting armor aura" },
      { name: "sfx ginyu pose fighting" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Ginyu.FROG_TONGUE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloSlappyHand.blp",
      disabled: "BTNPiccoloSlappyHand.blp",
    },
    tooltip: {
      title: AbilityNames.Ginyu.FROG_TONGUE,
      body: 
        AbilityNames.Ginyu.FROG_TONGUE
    },
    components: [
      { name: "hook frog tongue" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_BEAM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    // higher update rate than normal!!
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathBeam.blp",
      disabled: "BTNFriezaDeathBeam.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_BEAM,
      body: 
        AbilityNames.Frieza.DEATH_BEAM
    },
    components: [
      { name: "beam death beam frieza" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathCannon.blp",
      disabled: "BTNFriezaDeathCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_CANNON,
      body: 
        AbilityNames.Frieza.DEATH_CANNON
    },
    components: [
      { name: "beam death cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.LAST_EMPEROR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaLastEmperor.blp",
      disabled: "BTNFriezaLastEmperor.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.LAST_EMPEROR,
      body: 
        AbilityNames.Frieza.LAST_EMPEROR,
    },
    components: [
      { name: "beam last emperor" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.NOVA_STRIKE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaNovaStrike.blp",
      disabled: "BTNFriezaNovaStrike.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.NOVA_STRIKE,
      body: 
        AbilityNames.Frieza.NOVA_STRIKE
    },
    components: [
      { name: "dash ground point nova strike" },
      { name: "damage nova strike dps" },
      { name: "sfx nova chariot" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.SUPERNOVA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaSupernova.blp",
      disabled: "BTNFriezaSupernova.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.SUPERNOVA,
      body: 
        AbilityNames.Frieza.SUPERNOVA
    },
    components: [
      { name: "beam supernova frieza" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.SUPERNOVA_2,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaSupernova2.blp",
      disabled: "BTNFriezaSupernova2.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.SUPERNOVA_2,
      body: 
        AbilityNames.Frieza.SUPERNOVA_2,
    },
    components: [
      { name: "beam supernova frieza 2" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.EMPERORS_THRONE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaEmperorsThrone.blp",
      disabled: "BTNFriezaEmperorsThrone.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.EMPERORS_THRONE,
      body: 
        AbilityNames.Frieza.EMPERORS_THRONE
    },
    components: [
      { name: "dash ground forward emperors throne" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_STORM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathStorm.blp",
      disabled: "BTNFriezaDeathStorm.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_STORM,
      body: 
        AbilityNames.Frieza.DEATH_STORM
    },
    components: [
      { name: "damage death storm dps" },
      { name: "damage death storm explosion" },
      { name: "knockback death storm start" },
      { name: "knockback death storm explosion" },
      { name: "knockback death storm end" },
      { name: "sfx death storm start" },
      { name: "sfx death storm explosion" },
      { name: "sfx death storm end" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.IMPALING_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 20,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaImaplingRush.blp",
      disabled: "BTNFriezaImaplingRush.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.IMPALING_RUSH,
      body: 
        AbilityNames.Frieza.IMPALING_RUSH
    },
    components: [
      { name: "dash ground point impaling rush" },
      { name: "damage impaling rush explosion" },
      { name: "debuff stun impaling rush" },
      { name: "sfx impaling rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_BEAM_BARRAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathBeamBarrage.blp",
      disabled: "BTNFriezaDeathBeamBarrage.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_BEAM_BARRAGE,
      body: 
        AbilityNames.Frieza.DEATH_BEAM_BARRAGE,
    },
    components: [
      { name: "multi death beam barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.NOVA_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaNovaRush.blp",
      disabled: "BTNFriezaNovaRush.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.NOVA_RUSH,
      body: 
        AbilityNames.Frieza.NOVA_RUSH
    },
    components: [
      { name: "dash ground point nova rush" },
      { name: "damage nova rush dps" },
      { name: "damage nova rush explosion" },
      { name: "debuff stun nova rush" },
      { name: "jump nova rush" },
      { name: "sfx nova rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathBall.blp",
      disabled: "BTNFriezaDeathBall.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_BALL,
      body: 
        AbilityNames.Frieza.DEATH_BALL
    },
    components: [
      { name: "beam death ball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.TAIL_WHIP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaTail.blp",
      disabled: "BTNFriezaTail.blp",
    },
    tooltip: {
      title:  AbilityNames.Frieza.TAIL_WHIP,
      body: 
        AbilityNames.Frieza.TAIL_WHIP,
    },
    components: [
      { name: "damage tail whip frieza" },
      { name: "sfx tail whip frieza" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_SAUCER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathSaucer.blp",
      disabled: "BTNFriezaDeathSaucer.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_SAUCER,
      body: 
        AbilityNames.Frieza.DEATH_SAUCER,
    },
    components: [
      { name: "multi death saucer" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_BEAM_GOLDEN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    // higher update rate than normal!!
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaGoldenDeathBeam.blp",
      disabled: "BTNFriezaGoldenDeathBeam.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_BEAM_GOLDEN,
      body: 
        AbilityNames.Frieza.DEATH_BEAM_GOLDEN,
    },
    components: [
      { name: "beam death beam frieza golden" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.DEATH_CANNON_GOLDEN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaGoldenDeathCannon.blp",
      disabled: "BTNFriezaGoldenDeathCannon.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.DEATH_CANNON_GOLDEN,
      body: 
        AbilityNames.Frieza.DEATH_CANNON_GOLDEN
    },
    components: [
      { name: "beam death cannon golden" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.NOVA_RUSH_GOLDEN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaGoldenRush.blp",
      disabled: "BTNFriezaGoldenRush.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.NOVA_RUSH_GOLDEN,
      body: 
        AbilityNames.Frieza.NOVA_RUSH_GOLDEN
    },
    components: [
      { name: "dash ground point nova rush golden" },
      { name: "damage nova rush golden dps" },
      { name: "damage nova rush golden explosion" },
      { name: "debuff stun nova rush" },
      { name: "jump nova rush" },
      { name: "sfx nova rush golden" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.EARTH_BREAKER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaEarthBreaker.blp",
      disabled: "BTNFriezaEarthBreaker.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.EARTH_BREAKER,
      body: 
        AbilityNames.Frieza.EARTH_BREAKER
    },
    components: [
      { name: "channel caster default" },
      { name: "damage earth breaker dps" },
      { name: "damage earth breaker explosion" },
      { name: "sfx earth breaker" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Frieza.CAGE_OF_LIGHT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaCageOfLight.blp",
      disabled: "BTNFriezaCageOfLight.blp",
    },
    tooltip: {
      title: AbilityNames.Frieza.CAGE_OF_LIGHT,
      body: 
        AbilityNames.Frieza.CAGE_OF_LIGHT
    },
    components: [
      { name: "channel caster default" },
      { name: "beam cage of light barrier" },
      { name: "multi cage of light" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 70,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOmegaShenronDragonFlashBullet.blp",
      disabled: "BTNOmegaShenronDragonFlashBullet.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET,
      body: 
        AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET
    },
    components: [
      { name: "multi dragon flash bullet" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOmegaShenronNegativeEnergyBall.blp",
      disabled: "BTNOmegaShenronNegativeEnergyBall.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL,
      body: 
        AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL
    },
    components: [
      { name: "beam negative energy ball" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.SHADOW_FIST,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 48,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOmegaShenronShadowFist.blp",
      disabled: "BTNOmegaShenronShadowFist.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.SHADOW_FIST,
      body: 
        AbilityNames.OmegaShenron.SHADOW_FIST
    },
    components: [
      { name: "dash ground point shadow fist" },
      { name: "damage shadow fist dps" },
      { name: "knockback dfist" },
      { name: "sfx shadow fist" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.DRAGONIC_RAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOmegaShenronDragonicRage.blp",
      disabled: "BTNOmegaShenronDragonicRage.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.DRAGONIC_RAGE,
      body: 
        AbilityNames.OmegaShenron.DRAGONIC_RAGE
    },
    components: [
      { name: "dash ground forward dragonic rage" },
      { name: "temp ability dragonic rage crit" },
      { name: "sfx dragonic rage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.ICE_CANNON,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNEisShenronIceCannon.blp",
      disabled: "BTNEisShenronIceCannon.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.ICE_CANNON,
      body: 
        AbilityNames.OmegaShenron.ICE_CANNON
    },
    components: [
      { name: "beam ice cannon omega"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.NOVA_STAR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNNuovaShenronNovaStar.blp",
      disabled: "BTNNuovaShenronNovaStar.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.NOVA_STAR,
      body: 
        AbilityNames.OmegaShenron.NOVA_STAR
    },
    components: [
      { name: "channel caster default" },
      { name: "multi nova star omega" },
      { name: "damage nova star omega dps charging" },
      { name: "sfx nova star omega caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.OmegaShenron.DRAGON_THUNDER,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOmegaShenronDragonThunder.blp",
      disabled: "BTNOmegaShenronDragonThunder.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.DRAGON_THUNDER,
      body: 
        AbilityNames.OmegaShenron.DRAGON_THUNDER
    },
    components: [
      { name: "damage dragon thunder omega dps" },
      { name: "debuff slow dragon thunder omega" },
      { name: "sfx dragon thunder omega" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Guldo.PSYCHO_JAVELIN,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGuldoPsychoJavelin.blp",
      disabled: "BTNGuldoPsychoJavelin.blp",
    },
    tooltip: {
      title: AbilityNames.Guldo.PSYCHO_JAVELIN,
      body: 
        AbilityNames.Guldo.PSYCHO_JAVELIN
    },
    components: [
      { name: "beam psycho javelin" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Guldo.PSYCHIC_ROCK_THROW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 55,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGuldoPsychicRockThrow.blp",
      disabled: "BTNGuldoPsychicRockThrow.blp",
    },
    tooltip: {
      title: AbilityNames.Guldo.PSYCHIC_ROCK_THROW,
      body: 
        AbilityNames.Guldo.PSYCHIC_ROCK_THROW
    },
    components: [
      { name: "multi psychic rock throw" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Guldo.TELEKINESIS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGuldoTelekinesis.blp",
      disabled: "BTNGuldoTelekinesis.blp",
    },
    tooltip: {
      title: AbilityNames.Guldo.TELEKINESIS,
      body: 
        AbilityNames.Guldo.TELEKINESIS
    },
    components: [
      { name: "knockback guldo telekinesis" },
      { name: "sfx guldo telekinesis" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Guldo.TIME_STOP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGuldoTimeStop.blp",
      disabled: "BTNGuldoTimeStop.blp",
    },
    tooltip: {
      title: AbilityNames.Guldo.TIME_STOP,
      body: 
        AbilityNames.Guldo.TIME_STOP
    },
    components: [
      { name: "dash ground forward guldo time stop" },
      { name: "sfx zanzo dash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Guldo.GINYU_POSE_GULDO,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 660,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGuldoPose.blp",
      disabled: "BTNGuldoPose.blp",
    },
    tooltip: {
      title: AbilityNames.Guldo.GINYU_POSE_GULDO,
      body: 
        AbilityNames.Guldo.GINYU_POSE_GULDO
    },
    components: [
      { name: "dash ground forward ginyu pose guldo" },
      { name: "spell amp ginyu pose guldo" },
      { name: "sfx ginyu pose guldo" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Zamasu.DIVINE_AUTHORITY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 70,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNZamasuDivineAuthority.blp",
      disabled: "BTNZamasuDivineAuthority.blp",
    },
    tooltip: {
      title: AbilityNames.Zamasu.DIVINE_AUTHORITY,
      body: 
        AbilityNames.Zamasu.DIVINE_AUTHORITY
    },
    components: [
      { name: "channel caster default" },
      { name: "multi divine authority" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Zamasu.GOD_SLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNZamasuGodSlash.blp",
      disabled: "BTNZamasuGodSlash.blp",
    },
    tooltip: {
      title:  AbilityNames.Zamasu.GOD_SLASH,
      body: 
        AbilityNames.Zamasu.GOD_SLASH,
    },
    components: [
      { name: "damage god slash bonus" },
      { name: "damage god slash" },
      { name: "debuff bleed zamasu" },
      { name: "dash ground forward zamasu god slash" },
      { name: "sfx videl kick" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Zamasu.HOLY_LIGHT_GRENADE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNZamasuHolyLightGrenade.blp",
      disabled: "BTNZamasuHolyLightGrenade.blp",
    },
    tooltip: {
      title: AbilityNames.Zamasu.HOLY_LIGHT_GRENADE,
      body: 
        AbilityNames.Zamasu.HOLY_LIGHT_GRENADE
    },
    components: [
      { name: "beam holy light grenade" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Zamasu.HEAVENLY_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSuperDragonFlight.blp",
      disabled: "BTNSuperDragonFlight.blp",
    },
    tooltip: {
      title: AbilityNames.Zamasu.HEAVENLY_RUSH,
      body: 
        AbilityNames.Zamasu.HEAVENLY_RUSH
    },
    components: [
      { name: "dash ground point 45dist" },
      { name: "damage heavenly rush bonus explosion" },
      { name: "damage heavenly rush explosion" },
      { name: "sfx heavenly rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Zamasu.ENERGY_BLADES,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNZamasuEnergyBlades.blp",
      disabled: "BTNZamasuEnergyBlades.blp",
    },
    tooltip: {
      title: AbilityNames.Zamasu.ENERGY_BLADES,
      body: 
        AbilityNames.Zamasu.ENERGY_BLADES,
    },
    components: [
      { name: "dash ground forward zamasu energy blades" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.OCTOSLASH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 80,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothQ.blp",
      disabled: "BTNSephirothQ.blp",
    },
    tooltip: {
      title:  AbilityNames.Sephiroth.OCTOSLASH,
      body: 
        AbilityNames.Sephiroth.OCTOSLASH,
    },
    components: [
      { name: "channel caster default" },
      { name: "multi octoslash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.HELLS_GATE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothW.blp",
      disabled: "BTNSephirothW.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.HELLS_GATE,
      body: 
        AbilityNames.Sephiroth.HELLS_GATE
    },
    components: [
      { name: "dash ground point 20dist" },
      { name: "damage hells gate sephiroth explosion inner" },
      { name: "damage hells gate sephiroth explosion outer" },
      { name: "jump hells gate sephiroth" },
      { name: "sfx hells gate sephiroth" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.FERVENT_BLOW,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothE.blp",
      disabled: "BTNSephirothE.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.FERVENT_BLOW,
      body: 
        AbilityNames.Sephiroth.FERVENT_BLOW
    },
    components: [
      { name: "beam fervent blow"},
      { name: "temp ability fervent rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.FERVENT_RUSH,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothE2.blp",
      disabled: "BTNSephirothE2.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.FERVENT_RUSH,
      body: 
        AbilityNames.Sephiroth.FERVENT_RUSH
    },
    components: [
      { name: "dash ground point 25dist" },
      { name: "damage fervent rush explosion" },
      { name: "damage fervent rush bonus explosion" },
      { name: "sfx fervent rush" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.BLACK_MATERIA,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 130,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothR.blp",
      disabled: "BTNSephirothR.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.BLACK_MATERIA,
      body: 
        AbilityNames.Sephiroth.BLACK_MATERIA
    },
    components: [
      { name: "beam black materia"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.ONE_WINGED_ANGEL,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 825,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothD.blp",
      disabled: "BTNSephirothD.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.ONE_WINGED_ANGEL,
      body: 
        AbilityNames.Sephiroth.ONE_WINGED_ANGEL
    },
    components: [
      { name: "dash ground forward one winged angel" },
      { name: "spell amp one winged angel" },
      { name: "sfx one winged angel" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Sephiroth.PARRY,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSephirothF.blp",
      disabled: "BTNSephirothF.blp",
    },
    tooltip: {
      title: AbilityNames.Sephiroth.PARRY,
      body: 
        AbilityNames.Sephiroth.PARRY
    },
    components: [
      { name: "block sephiroth parry" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Hit.TIME_SKIP,
    currentCd: 0,
    maxCd: 0.03,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNHitTimeSkip.blp",
      disabled: "BTNHitTimeSkip.blp",
    },
    tooltip: {
      title: AbilityNames.Hit.TIME_SKIP,
      body: 
        AbilityNames.Hit.TIME_SKIP
    },
    components: [
      { name: "teleport time skip" },
      { name: "damage target time skip explosion" },
      { name: "sfx time skip" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Hit.POCKET_DIMENSION,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNHitPocketDimension.blp",
      disabled: "BTNHitPocketDimension.blp",
    },
    tooltip: {
      title: AbilityNames.Hit.POCKET_DIMENSION,
      body: 
        AbilityNames.Hit.POCKET_DIMENSION
    },
    components: [
      { name: "sfx pocket dimension" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Hit.FLASH_FIST,
    currentCd: 0,
    maxCd: 0.66,
    costType: "MP",
    costAmount: 0,
    duration: 22,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNHitFlashFist.blp",
      disabled: "BTNHitFlashFist.blp",
    },
    tooltip: {
      title: AbilityNames.Hit.FLASH_FIST,
      body: 
        AbilityNames.Hit.FLASH_FIST
    },
    components: [
      { name: "beam flash fist"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Hit.TIME_CAGE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNHitTimeCage.blp",
      disabled: "BTNHitTimeCage.blp",
    },
    tooltip: {
      title: AbilityNames.Hit.TIME_CAGE,
      body: 
        AbilityNames.Hit.TIME_CAGE
    },
    components: [
      { name: "beam time cage"},
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Hit.PURE_PROGRESS,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 825,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNHitPureProgress.blp",
      disabled: "BTNHitPureProgress.blp",
    },
    tooltip: {
      title: AbilityNames.Hit.PURE_PROGRESS,
      body: 
        AbilityNames.Hit.PURE_PROGRESS
    },
    components: [
      { name: "spell amp pure progress" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.RustTyranno.TYRANNO_FLAME,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRustTyranno.blp",
      disabled: "BTNRustTyranno.blp",
    },
    tooltip: {
      title: AbilityNames.RustTyranno.TYRANNO_FLAME,
      body: 
        AbilityNames.RustTyranno.TYRANNO_FLAME
    },
    components: [
      { name: "beam tyranno flame" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.RustTyranno.RUST_CHOMP,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRustTyranno.blp",
      disabled: "BTNRustTyranno.blp",
    },
    tooltip: {
      title: AbilityNames.RustTyranno.RUST_CHOMP,
      body: 
        AbilityNames.RustTyranno.RUST_CHOMP
    },
    components: [
      { name: "hook rust chomp" },
      { name: "temp ability rust gobble" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.RustTyranno.RUST_GOBBLE,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRustTyranno.blp",
      disabled: "BTNRustTyranno.blp",
    },
    tooltip: {
      title: AbilityNames.RustTyranno.RUST_GOBBLE,
      body: 
        AbilityNames.RustTyranno.RUST_GOBBLE
    },
    components: [
      { name: "damage target rust gobble explosion" },
      { name: "heal caster rust gobble" },
      { name: "sfx rust gobble" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.RustTyranno.TYRANNO_ROAR,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNRustTyranno.blp",
      disabled: "BTNRustTyranno.blp",
    },
    tooltip: {
      title: AbilityNames.RustTyranno.TYRANNO_ROAR,
      body: 
        AbilityNames.RustTyranno.TYRANNO_ROAR
    },
    components: [
      { name: "damage tyranno roar" },
      { name: "block tyranno roar" },
      { name: "knockback tyranno roar" },
      { name: "sfx angry shout" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.GENERIC_BEAM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: AbilityNames.Saga.GENERIC_BEAM,
      body: 
        "Generic Saga Beam"
    },
    components: [
      { name: "beam galick gun" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.GENERIC_BOMB,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: AbilityNames.Saga.GENERIC_BOMB,
      body: 
        "Generic Saga Bomb"
    },
    components: [
      { name: "beam vanishing ball" },
    ],
  },
  // saga zanzo
  {
    name: AbilityNames.Saga.ZANZO_DASH,
    currentCd: 0,
    maxCd: 19,
    costType: "MP",
    costAmount: 25,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "walk",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNBlink.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBlink.blp",
    },
    tooltip: {
      title: "(Z) Zanzo Dash",
      body: 
        "Dashes towards your next right click." + 
        "|nCost: 25 MP |nCD: 19",
    },
    components: [
      { name: "dash ground point zanzo saga" },
      { name: "sfx zanzo dash" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.MAX_POWER,
    currentCd: 0,
    maxCd: 40,
    costType: "MP",
    costAmount: 100,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNNagaUnBurrow.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNNagaUnBurrow.blp",
    },
    tooltip: {
      title: "(C) Max Power",
      body: 
        "Boosts your ability damage by 10% and increases movement speed by 66 for 10 seconds." + 
        "|nCost:100 MP|nCD: 40"
    },
    components: [
      { name: "spell amp max power" },
      { name: "dash ground forward max power saga" },
      { name: "sfx max power" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.POWER_BLITZ_BARRAGE_CUSTOM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN17PowerBlitzBarrage.blp",
      disabled: "BTN17PowerBlitzBarrage.blp",
    },
    tooltip: {
      title: AbilityNames.Saga.POWER_BLITZ_BARRAGE_CUSTOM,
      body: 
        AbilityNames.Saga.POWER_BLITZ_BARRAGE_CUSTOM
    },
    components: [
      { name: "multi power blitz barrage saga" },
      { name: "spell amp power blitz barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.SOLAR_KAMEHAMEHA_CUSTOM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 264,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCellSolarKamehameha.blp",
      disabled: "BTNCellSolarKamehameha.blp",
    },
    tooltip: {
      title: AbilityNames.Cell.SOLAR_KAMEHAMEHA,
      body: 
        AbilityNames.Cell.SOLAR_KAMEHAMEHA
    },
    components: [
      { name: "teleport original point continuous" },
      { name: "multi solar kame" },
      { name: "damage solar kame dps charging" },
      { name: "sfx solar kame caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.NOVA_STAR_OMEGA_CUSTOM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 200,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNNuovaShenronNovaStar.blp",
      disabled: "BTNNuovaShenronNovaStar.blp",
    },
    tooltip: {
      title: AbilityNames.OmegaShenron.NOVA_STAR,
      body: 
        AbilityNames.OmegaShenron.NOVA_STAR
    },
    components: [
      { name: "teleport original point continuous" },
      { name: "multi nova star omega" },
      { name: "damage nova star omega dps charging" },
      { name: "sfx nova star omega caster" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuMankind.blp",
      disabled: "BTNBuuMankind.blp",
    },
    tooltip: {
      title: AbilityNames.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM,
      body: 
        AbilityNames.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM,
    },
    components: [
      { name: "multi mankind destruction attack saga" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Items.ANDROID_BOMB,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 23,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSaibamanBomb.blp",
      disabled: "BTNSaibamanBomb.blp",
    },
    tooltip: {
      title: AbilityNames.Items.ANDROID_BOMB,
      body: 
      AbilityNames.Items.ANDROID_BOMB
    },
    components: [
      { name: "dash ground unit saibaman bomb" },
      { name: "damage android bomb item explosion" },
      { name: "sfx android bomb item" },
      { name: "self destruct generic end" },
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Items.GETI_STAR_FRAGMENT,
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNEngineeringUpgrade.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNEngineeringUpgrade.blp",
    },
    tooltip: {
      title: AbilityNames.Items.GETI_STAR_FRAGMENT,
      body: 
        AbilityNames.Items.GETI_STAR_FRAGMENT
    },
    components: [
      { name: "block geti star fragment item" },
    ],
  },
  // -------------------------------------------
  {
    name: "Blue Hurricane",
    currentCd: 0,
    maxCd: 10,
    costType: "MP",
    costAmount: 120,
    duration: 250,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNTornado.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNTornado.blp"
    },
    tooltip: {
      title: "Blue Hurricane",
      body: 
        "The fastest attack in the universe!" + 
        "|nDeals 0.02 * AGI per tick " + 
        "(x2 when closer," + 
        "and another x2 over the duration of the ability)" + 
        "|nCost: 120 MP |nCD: 10",
    },
    components: [
      { name: "ground vortex blue hurricane" },
      { name: "sfx blue hurricane" },
    ],
  },
  // -------------------------------------------
  {
    name: "Big Bang Kamehameha",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: true,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "BTNBigBangKamehameha.blp",
      disabled: "BTNBigBangKamehameha.blp",
    },
    tooltip: {
      title: "Big Bang Kamehameha",
      body: 
        "Big Bang Kamehameha stuff"
    },
    components: [
      { name: "beam big bang kamehameha" },
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability",
    currentCd: 0,
    maxCd: 1,
    costType: "HP",
    costAmount: 25,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: true,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNAcolyte.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNAcolyte.blp",
    },
    tooltip: {
      title: "Test Ability (R)",
      body: 
        "Ultra Instinct (dodging randomly + blocking 10*INT). 25hp, cd7"
    },
    components: [
      // { name: "sfx blue wind aura" },
      // { name: "beam spirit bomb" },
      { name: "dodge ultra instinct" },
      { name: "sfx ultra instinct" },
      { name: "block ultra instinct" },
      // { name: "beam homing kamehameha" },
    ],
  },
];