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
        "Dashes towards your next right click." + 
        "|nCost: 25 MP |nCD: 19",
    },
    components: [
      { name: "dash ground point 40dist" },
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
    duration: 66,
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
    name: AbilityNames.Gohan.SUPER_DRAGON_FLIGHT,
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
    duration: 330,
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
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.THE_GREAT_SAIYAMAN_HAS_ARRIVED,
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
    ],
  },
  // -------------------------------------------
  {
    name: AbilityNames.Gohan.POTENTIAL_UNLEASHED,
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
    name: AbilityNames.Toppo.JUSTICE_FLASH,
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
      enabled: "BTNToppoJusticeFlash.blp",
      disabled: "BTNToppoJusticeFlash.blp",
    },
    tooltip: {
      title: AbilityNames.Toppo.JUSTICE_FLASH,
      body: 
        AbilityNames.Toppo.JUSTICE_FLASH
    },
    components: [
      { name: "channel caster default" },
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
    duration: 132,
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
      { name: "channel caster default" },
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
    name: AbilityNames.Toppo.JUSTICE_HOLD,
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
      { name: "damage justice tornado dps inner" },
      { name: "damage justice tornado dps outer" },
      { name: "knockback justice tornado" },
      { name: "sfx justice tornado" },
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
      { name: "sfx justice pose" },
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
      { name: "temp ability hakai toppo" },
      { name: "sfx god of destruction toppo" },
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
    duration: 231,
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
      { name: "beam hand kannon" },
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
    duration: 660,
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
    name: "Death Beam Barrage",
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
      enabled: "BTNFriezaDeathBeam.blp",
      disabled: "BTNFriezaDeathBeam.blp",
    },
    tooltip: {
      title: "Death Beam Barrage",
      body: 
        "Death Beam Barrage"
    },
    components: [
      { name: "multi death beam barrage" },
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