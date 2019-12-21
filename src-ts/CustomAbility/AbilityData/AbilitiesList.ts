export const AbilitiesList = [
  // copy from here
  {
    name: "Zanzo Dash",
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
    name: "Guard",
    currentCd: 0,
    maxCd: 9,
    costType: "MP",
    costAmount: 25,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNDefend.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNDefend.blp",
    },
    tooltip: {
      title: "(X) Guard",
      body: 
        "Basic Guard ability that blocks 50% of incoming damage until more than 5 * STR damage is blocked." + 
        "|nCost:25 MP|nCD: 9"
    },
    components: [
      { name: "block basic guard" },
    ],
  },
  // -------------------------------------------
  {
    name: "Max Power",
    currentCd: 0,
    maxCd: 40,
    costType: "MP",
    costAmount: 100,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNNagaUnBurrow.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNNagaUnBurrow.blp",
    },
    tooltip: {
      title: "(C) Max Power",
      body: 
        "Boosts your ability damage by 10% for 10seconds." + 
        "|nCost:100 MP|nCD: 40"
    },
    components: [
      { name: "spell amp max power" },
      { name: "sfx max power" },
    ],
  },
  // -------------------------------------------
  {
    name: "Kamehameha", // Goku's Kame
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: "Kamehameha",
      body: 
        "Kamehameha"
    },
    components: [
      { name: "beam kamehameha" },
    ],
  },
  // -------------------------------------------
  {
    name: "God Kamehameha", // Goku's Kame 2
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKameGod.blp",
      disabled: "BTNKameGod.blp",
    },
    tooltip: {
      title: "God Kame",
      body: 
        "God Kame"
    },
    components: [
      { name: "beam god kamehameha" },
      { name: "sfx blue wind aura" },
    ],
  },
  // -------------------------------------------
  {
    name: "Spirit Bomb",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 160,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSpiritbomb.blp",
      disabled: "BTNSpiritbomb.blp",
    },
    tooltip: {
      title: "Spirit bomb",
      body: 
        "spirit bomb stuff"
    },
    components: [
      { name: "beam spirit bomb" },
    ],
  },
  // -------------------------------------------
  {
    name: "Dragon Fist",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDragonFist.blp",
      disabled: "BTNDragonFist.blp",
    },
    tooltip: {
      title: "Dragon fist",
      body: 
        "Dragon Fisto"
    },
    components: [
      { name: "dash ground point 25dist" },
      { name: "damage dragon fist dps" },
      { name: "damage dragon fist explosion" },
      { name: "knockback 1tick 25speed 180angle 250aoe" },
      { name: "sfx dragon fist" },
    ],
  },
  // -------------------------------------------
  {
    name: "Ultra Instinct",
    currentCd: 0,
    maxCd: 25,
    costType: "HP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNMirrorImage.tga",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNMirrorImage.tga",
    },
    tooltip: {
      title: "Ultra Instinct",
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
    name: "Galick Gun",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGalickGun.blp",
      disabled: "BTNGalickGun.blp",
    },
    tooltip: {
      title: "galick gun",
      body: 
        "galick gun stuff"
    },
    components: [
      { name: "beam galick gun" },
    ],
  },
  // -------------------------------------------
  {
    name: "Final Flash",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFinalFlash.blp",
      disabled: "BTNFinalFlash.blp",
    },
    tooltip: {
      title: "Final Flash",
      body: 
        "Final Flash stuff"
    },
    components: [
      { name: "beam final flash" },
    ],
  },
  // -------------------------------------------
  {
    name: "Final Flash 2",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFinalFlash2.blp",
      disabled: "BTNFinalFlash2.blp",
    },
    tooltip: {
      title: "Final Flash 2",
      body: 
        "Final Flash 2"
    },
    components: [
      { name: "multi final flash 2" },
      { name: "knockback power level rising" },
    ],
  },
  // -------------------------------------------
  {
    name: "Big Bang Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 30,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBigBangAttack.blp",
      disabled: "BTNBigBangAttack.blp",
    },
    tooltip: {
      title: "Big Bang Attack",
      body: 
        "Big Bang Attack stuff"
    },
    components: [
      { name: "beam big bang attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "Energy Blast Volley",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNVegetaEnergyBlastVolley.blp",
      disabled: "BTNVegetaEnergyBlastVolley.blp",
    },
    tooltip: {
      title: "Energy Blast Volley",
      body: 
        "Energy Blast Volley"
    },
    components: [
      { name: "multi energy blast volley" },
    ],
  },
  // -------------------------------------------
  {
    name: "Twin Dragon Shot",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNTwinDragonShot.blp",
      disabled: "BTNTwinDragonShot.blp",
    },
    tooltip: {
      title: "Twin dragon shot",
      body: 
        "Twin dragon shot"
    },
    components: [
      { name: "multi twin dragon shot" },
    ],
  },
  // -------------------------------------------
  {
    name: "Masenko",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNMasenko.blp",
      disabled: "BTNMasenko.blp",
    },
    tooltip: {
      title: "Masenko",
      body: 
        "Masenko"
    },
    components: [
      { name: "beam masenko" },
    ],
  },
  // -------------------------------------------
  {
    name: "Super Dragon Flight",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSuperDragonFlight.blp",
      disabled: "BTNSuperDragonFlight.blp",
    },
    tooltip: {
      title: "Super Dragon Flight",
      body: 
        "Super Dragon Flight"
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
    name: "Unlock Potential",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNUnlockPotential.blp",
      disabled: "BTNUnlockPotential.blp",
    },
    tooltip: {
      title: "Unlock Potential",
      body: 
        "Unlock Potential"
    },
    components: [
      { name: "spell amp unlock potential" },
    ],
  },
  // -------------------------------------------
  {
    name: "The Great Saiyaman has arrived!",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
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
    name: "Potential Unleashed",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPotentialUnleashed.blp",
      disabled: "BTNPotentialUnleashed.blp",
    },
    tooltip: {
      title: "Potential Unleashed",
      body: 
        "Potential Unleashed"
    },
    components: [
      { name: "spell amp potential unleashed" },
    ],
  },
  // -------------------------------------------
  {
    name: "Finish Buster",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTFinishBuster.blp",
      disabled: "BTNFTFinishBuster.blp",
    },
    tooltip: {
      title: "Finish Buster",
      body: 
        "Finish Buster"
    },
    components: [
      { name: "beam finish buster" },
    ],
  },
  // -------------------------------------------
  {
    name: "Heat Dome Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTFinishBuster.blp",
      disabled: "BTNFTFinishBuster.blp",
    },
    tooltip: {
      title: "Heat Dome Attack",
      body: 
        "Heat Dome Attack"
    },
    components: [
      { name: "beam finish buster" },
      { name: "damage heat dome attack explosion" },
      { name: "knockback heat dome attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "Burning Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBurningAttack.blp",
      disabled: "BTNBurningAttack.blp",
    },
    tooltip: {
      title: "Burning Attack",
      body: 
        "Burning Attack"
    },
    components: [
      { name: "damage target burning attack dps" },
      { name: "damage target burning attack explosion" },
      { name: "sfx burning attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "Shining Sword Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 90,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "attack",
    icon: {
      enabled: "BTNFTShiningSwordAttack.blp",
      disabled: "BTNFTShiningSwordAttack.blp"
    },
    tooltip: {
      title: "Shining Sword Attack",
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
    name: "Blazing Rush",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 26,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTBlazingRush.blp",
      disabled: "BTNFTBlazingRush.blp",
    },
    tooltip: {
      title: "Blazing Rush",
      body: 
        "Blazing Rush"
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
    name: "Super Saiyan Rage",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 495,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFTRageIcon.blp",
      disabled: "BTNFTRageIcon.blp",
    },
    tooltip: {
      title: "Super Saiyan Rage",
      body: 
        "Super Saiyan Rage"
    },
    components: [
      { name: "dash ground point 5dist" },
      { name: "stun super saiyan rage" },
      { name: "spell amp super saiyan rage" },
      { name: "block super saiyan rage" },
      { name: "sfx super saiyan rage" },
    ],
  },
  // -------------------------------------------
  {
    name: "Special Beam Cannon",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNSpecialBeamCannon.blp",
      disabled: "BTNSpecialBeamCannon.blp",
    },
    tooltip: {
      title: "Special Beam Cannon",
      body: 
        "Special Beam Cannon"
    },
    components: [
      { name: "beam special beam cannon" },
    ],
  },
  // -------------------------------------------
  {
    name: "Slappy Hand",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 100,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloSlappyHand.blp",
      disabled: "BTNPiccoloSlappyHand.blp",
    },
    tooltip: {
      title: "Slappy Hand",
      body: 
        "Slappy Hand"
    },
    components: [
      { name: "hook slappy hand" },
    ],
  },
  // -------------------------------------------
  {
    name: "Hellzone Grenade",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloHellzoneGrenade.blp",
      disabled: "BTNPiccoloHellzoneGrenade.blp",
    },
    tooltip: {
      title: "Hellzone Grenade",
      body: 
        "Hellzone Grenade"
    },
    components: [
      { name: "multi hellzone grenade" },
    ],
  },
  // -------------------------------------------
  {
    name: "Kyodaika",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPiccoloKyodaika.blp",
      disabled: "BTNPiccoloKyodaika.blp",
    },
    tooltip: {
      title: "Kyodaika",
      body: 
        "Kyodaika"
    },
    components: [
      { name: "dash ground point 5dist" },
    ],
  },
  // -------------------------------------------
  {
    name: "Future Sight",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockFutureSight.blp",
      disabled: "BTNBardockFutureSight.blp",
    },
    tooltip: {
      title: "Future Sight",
      body: 
        "Future Sight"
    },
    components: [
      { name: "dodge future sight" },
      { name: "block future sight" },
      { name: "sfx future sight" },
    ],
  },
  // -------------------------------------------
  {
    name: "Tyrant Lancer",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 75,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockTyrantLancer.blp",
      disabled: "BTNBardockTyrantLancer.blp",
    },
    tooltip: {
      title: "Tyrant Lancer",
      body: 
        "Tyrant Lancer"
    },
    components: [
      { name: "dash ground point tyrant lancer" },
      { name: "damage tyrant lancer dps" },
      { name: "knockback 1tick 5speed 0angle 250aoe" },
      { name: "beam tyrant lancer" },
      { name: "sfx tyrant lancer" },
    ],
  },
  // -------------------------------------------
  {
    name: "Saiyan Spirit",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockSaiyanSpirit.blp",
      disabled: "BTNBardockSaiyanSpirit.blp",
    },
    tooltip: {
      title: "Saiyan Spirit",
      body: 
        "Saiyan Spirit"
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
    name: "Riot Javelin",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 33,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockRiotJavelin.blp",
      disabled: "BTNBardockRiotJavelin.blp",
    },
    tooltip: {
      title: "Riot Javelin",
      body: 
        "Riot Javelin"
    },
    components: [
      { name: "beam riot javelin" },
    ],
  },
  // -------------------------------------------
  {
    name: "Rebellion Spear",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBardockRebellionSpear.blp",
      disabled: "BTNBardockRebellionSpear.blp",
    },
    tooltip: {
      title: "Rebellion Spear",
      body: 
        "Rebellion Spear"
    },
    components: [
      { name: "dash ground unit rebellion spear" },
      { name: "damage rebellion spear dps" },
      { name: "knockback kame" },
      { name: "sfx rebellion spear" },
    ],
  },
  // -------------------------------------------
  {
    name: "Angry Shout",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNOozaru.blp",
      disabled: "BTNOozaru.blp",
    },
    tooltip: {
      title: "Angry Shout",
      body: 
        "Angry Shout"
    },
    components: [
      { name: "channel caster default" },
      { name: "block angry shout" },
      { name: "damage angry shout dps" },
      { name: "knockback 1tick 20speed 0angle 900aoe" },
      { name: "sfx angry shout" },
    ],
  },
  // -------------------------------------------
  {
    name: "Pan Kamehameha",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 50,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNKame2.blp",
      disabled: "BTNKame2.blp",
    },
    tooltip: {
      title: "Kamehameha",
      body: 
        "Kamehameha"
    },
    components: [
      { name: "beam kamehameha" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: "Maiden Blast",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanMaidenBlast.blp",
      disabled: "BTNPanMaidenBlast.blp",
    },
    tooltip: {
      title: "Maiden Blast",
      body: 
        "Maiden Blast"
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
    name: "Reliable Friend",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 66,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanReliableFriend.blp",
      disabled: "BTNPanReliableFriend.blp",
    },
    tooltip: {
      title: "Reliable Friend",
      body: 
        "Reliable Friend"
    },
    components: [
      { name: "beam reliable friend" },
      { name: "aoe apply reliable friend" },
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: "Honey Bee Costume",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPanHoneyBee.blp",
      disabled: "BTNPanHoneyBee.blp",
    },
    tooltip: {
      title: "Honey Bee Costume",
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
    name: "Summon Giru",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiru.blp",
      disabled: "BTNGiru.blp",
    },
    tooltip: {
      title: "Summon Giru",
      body: 
        "Summon Giru"
    },
    components: [
      { name: "aoe apply pan immolation" },
    ],
  },
  // -------------------------------------------
  {
    name: "Energy Beam", // androids 13 14 15 beam
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
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
    name: "S.S. Deadly Hammer",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 124,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Hammer.blp",
      disabled: "BTN13Hammer.blp",
    },
    tooltip: {
      title: "S.S. Deadly Hammer",
      body: 
        "S.S. Deadly Hammer"
    },
    components: [
      { name: "dash ground point ss deadly hammer" },
      { name: "damage ss deadly hammer dps" },
      { name: "multi ss deadly hammer" },
      { name: "knockback ss deadly hammer" },
      { name: "sfx ss deadly hammer" },
    ],
  },
  // -------------------------------------------
  {
    name: "S.S. Deadly Bomber",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 208,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13SSDB.blp",
      disabled: "BTN13SSDB.blp",
    },
    tooltip: {
      title: "S.S. Deadly Bomber",
      body: 
        "S.S. Deadly Bomber"
    },
    components: [
      { name: "beam ss deadly bomber" },
    ],
  },
  // -------------------------------------------
  {
    name: "Nuke",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Nuke.blp",
      disabled: "BTN13Nuke.blp",
    },
    tooltip: {
      title: "Nuke",
      body: 
        "Nuke"
    },
    components: [
      { name: "damage target nuke dps" },
      { name: "damage target nuke explosion" },
      { name: "sfx nuke" },
    ],
  },
  // -------------------------------------------
  {
    name: "Android Barrier",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTN13Barrier.blp",
      disabled: "BTN13Barrier.blp",
    },
    tooltip: {
      title: "Android Barrier",
      body: 
        "Android Barrier"
    },
    components: [
      { name: "block android barrier" },
      { name: "knockback android barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: "Overcharge",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 231,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\PassiveButtons\\PASBTNFeedBack.blp",
      disabled: "ReplaceableTextures\\PassiveButtons\\PASBTNFeedBack.blp",
    },
    tooltip: {
      title: "Overcharge",
      body: 
        "Overcharge"
    },
    components: [
      { name: "spell amp overcharge" },
      { name: "damage overcharge dps" },
      { name: "sfx overcharge" },
    ],
  },
  // -------------------------------------------
  {
    name: "Haretsu no Majutsu",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBabidiQ.blp",
      disabled: "BTNBabidiQ.blp",
    },
    tooltip: {
      title: "Haretsu no Majutsu",
      body: 
        "Haretsu no Majutsu"
    },
    components: [
      { name: "damage target haretsu explosion" },
      { name: "sfx haretsu" },
    ],
  },
  // -------------------------------------------
  {
    name: "Babidi Barrier",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 165,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBabidiW.blp",
      disabled: "BTNBabidiW.blp",
    },
    tooltip: {
      title: "Babidi Barrier",
      body: 
        "Babidi Barrier"
    },
    components: [
      { name: "block babidi barrier" },
      { name: "knockback babidi barrier" },
    ],
  },
  // -------------------------------------------
  {
    name: "Summon Pui Pui",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPuiPui.blp",
      disabled: "BTNPuiPui.blp",
    },
    tooltip: {
      title: "Summon Pui Pui",
      body: 
        "Summon Pui Pui"
    },
    components: [
      // { name: "summon summon pui pui" },
    ],
  },
  // -------------------------------------------
  {
    name: "Summon Yakon",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNYakon.blp",
      disabled: "BTNYakon.blp",
    },
    tooltip: {
      title: "Summon Yakon",
      body: 
        "Summon Yakon"
    },
    components: [
      // { name: "summon summon yakon" },
    ],
  },
  // -------------------------------------------
  {
    name: "Summon Dabura",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNDabura.blp",
      disabled: "BTNDabura.blp",
    },
    tooltip: {
      title: "Summon Dabura",
      body: 
        "Summon Dabura"
    },
    components: [
      // { name: "summon summon dabura" },
    ],
  },
  // -------------------------------------------
  {
    name: "Flesh Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 1,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuFleshAttack.blp",
      disabled: "BTNBuuFleshAttack.blp",
    },
    tooltip: {
      title: "Flesh Attack",
      body: 
        "Flesh Attack"
    },
    components: [
      { name: "damage target flesh attack explosion" },
      { name: "sfx flesh attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "Innocence Breath",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 132,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuInnocenceBreath.blp",
      disabled: "BTNBuuInnocenceBreath.blp",
    },
    tooltip: {
      title:  "Innocence Breath",
      body: 
        "Innocence Breath",
    },
    components: [
      { name: "multi innocence breath" },
    ],
  },
  // -------------------------------------------
  {
    name: "Angry Explosion",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 300,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuAngryExplosion.blp",
      disabled: "BTNBuuAngryExplosion.blp",
    },
    tooltip: {
      title:  "Angry Explosion",
      body: 
        "Angry Explosion",
    },
    components: [
      { name: "damage angry explosion dps" },
      { name: "damage angry explosion explosion" },
      { name: "hide unit angry explosion" },
      { name: "sfx angry explosion delay" },
      { name: "sfx angry explosion explosion" },
    ],
  },
  // -------------------------------------------
  {
    name: "Vanishing Ball",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuVanishingBall.blp",
      disabled: "BTNBuuVanishingBall.blp",
    },
    tooltip: {
      title: "Vanishing Ball",
      body: 
        "Vanishing Ball"
    },
    components: [
      { name: "beam vanishing ball" },
    ],
  },
  // -------------------------------------------
  {
    name: "Mankind Destruction Attack",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 330,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBuuMankind.blp",
      disabled: "BTNBuuMankind.blp",
    },
    tooltip: {
      title: "Mankind Destruction Attack",
      body: 
        "Mankind Destruction Attack"
    },
    components: [
      { name: "channel caster default" },
      { name: "multi mankind destruction attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "Energy Punch",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNBrolyEnergyPunch.blp",
      disabled: "BTNBrolyEnergyPunch.blp",
    },
    tooltip: {
      title: "Energy Punch",
      body: 
        "Energy Puncho"
    },
    components: [
      { name: "dash ground point energy punch" },
      { name: "damage energy punch dps" },
      { name: "knockback energy punch" },
      { name: "stun energy punch" },
      // every broly spell gives broly a lvl x str shield that reduces incoming dmg by 15%
      { name: "block broly" },
      { name: "sfx energy punch" },
    ],
  },
  // -------------------------------------------
  {
    name: "Power Level Rising",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 2,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPowerLevelRising.blp",
      disabled: "BTNPowerLevelRising.blp",
    },
    tooltip: {
      title: "Power Level Rising",
      body: 
        "Power Level Rising"
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
    name: "Planet Crusher",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNPlanetCrusher.blp",
      disabled: "BTNPlanetCrusher.blp",
    },
    tooltip: {
      title: "Planet Crusher",
      body: 
        "Planet Crusher"
    },
    components: [
      { name: "beam planet crusher" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: "Gigantic Roar",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiganticRoar.blp",
      disabled: "BTNGiganticRoar.blp",
    },
    tooltip: {
      title: "Gigantic Roar",
      body: 
        "Gigantic Roar"
    },
    components: [
      { name: "beam gigantic roar" },
      { name: "dash ground point gigantic roar pushback" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: "Gigantic Omegastorm",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 30,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNGiganticOmegastorm.blp",
      disabled: "BTNGiganticOmegastorm.blp",
    },
    tooltip: {
      title: "Gigantic Omegastorm",
      body: 
        "Gigantic Omegastorm"
    },
    components: [
      { name: "beam gigantic omegastorm" },
      { name: "block broly" },
    ],
  },
  // -------------------------------------------
  {
    name: "Spawn Cell Juniors",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 3,
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCellJunior.blp",
      disabled: "BTNCellJunior.blp",
    },
    tooltip: {
      title: "Spawn Cell Juniors",
      body: 
        "Spawn Cell Juniors"
    },
    components: [
      // { name: "summon spawn cell juniors" },
    ],
  },
  // -------------------------------------------
  {
    name: "Absorb",
    currentCd: 0,
    maxCd: 2,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNCellAbsorb.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNCellAbsorb.blp",
    },
    tooltip: {
      title: "Absorb",
      body: 
        "Absorb"
    },
    components: [
      { name: "block absorb" },
    ],
  },
  // -------------------------------------------
  {
    name: "Death Beam Frieza",
    currentCd: 0,
    maxCd: 1,
    costType: "MP",
    costAmount: 0,
    duration: 40,
    // higher update rate than normal!!
    updateRate: 0.02,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNFriezaDeathBeam.blp",
      disabled: "BTNFriezaDeathBeam.blp",
    },
    tooltip: {
      title: "Death Beam Frieza",
      body: 
        "Death Beam Frieza"
    },
    components: [
      { name: "beam death beam frieza" },
    ],
  },
  // -------------------------------------------
  {
    name: "Supernova Cooler",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerSupernova.blp",
      disabled: "BTNCoolerSupernova.blp",
    },
    tooltip: {
      title: "Supernova Cooler",
      body: 
        "Supernova Cooler"
    },
    components: [
      { name: "beam supernova cooler" },
    ],
  },
  // -------------------------------------------
  {
    name: "Nova Chariot",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerNovaChariot.blp",
      disabled: "BTNCoolerNovaChariot.blp",
    },
    tooltip: {
      title: "Nova Chariot",
      body: 
        "Nova Chariot"
    },
    components: [
      { name: "dash ground point 25dist" },
      { name: "damage nova chariot dps" },
      { name: "block nova chariot" },
      { name: "sfx nova chariot" },
    ],
  },
  // -------------------------------------------
  {
    name: "Deafening Wave",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 45,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp",
    },
    tooltip: {
      title: "Deafening Wave",
      body: 
        "Deafening Wave"
    },
    components: [
      { name: "beam deafening wave" },
    ],
  },
  // -------------------------------------------
  {
    name: "Geti Star Repair",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNEngineeringUpgrade.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNEngineeringUpgrade.blp",
    },
    tooltip: {
      title: "Geti Star Repair",
      body: 
        "Geti Star Repair"
    },
    components: [
      { name: "block geti star repair" },
    ],
  },
  // -------------------------------------------
  {
    name: "Supernova Golden",
    currentCd: 0,
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "BTNCoolerGoldenSupernova.blp",
      disabled: "BTNCoolerGoldenSupernova.blp",
    },
    tooltip: {
      title: "Supernova Golden",
      body: 
        "Supernova Golden"
    },
    components: [
      { name: "beam supernova golden" },
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
    canMultiCast: false,
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
    maxCd: 5,
    costType: "MP",
    costAmount: 0,
    duration: 99,
    updateRate: 0.03,
    castTime: 0.0,
    canMultiCast: false,
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
    canMultiCast: false,
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
    maxCd: 5,
    costType: "HP",
    costAmount: 25,
    duration: 150,
    updateRate: 0.03,
    castTime: 0.03,
    canMultiCast: false,
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
  // -------------------------------------------
  {
    name: "Test Ability 2",
    currentCd: 0,
    maxCd: 4,
    costType: "MP",
    costAmount: 25,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNPeon.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNPeon.blp",
    },
    tooltip: {
      title: "Test Ability 2 (D)",
      body: 
        "Dragon Fisto. 25mp, cd4"
    },
    components: [
      { name: "dash ground point 25dist" },
      { name: "damage 1tick 1int 250aoe" },
      { name: "damage final 10int 500aoe" },
      { name: "knockback 1tick 25speed 180angle 200aoe" },
      { name: "sfx dragon fist" },
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability 3",
    currentCd: 0,
    maxCd: 12,
    costType: "MP",
    costAmount: 125,
    duration: 67,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNPeasant.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNPeasant.blp",
    },
    tooltip: {
      title: "Test Ability 3 (F)",
      body: 
        "Beam kame. 125 mp, cd 12"
    },
    components: [
      { name: "beam kamehameha" },
      { name: "sfx blue wind aura" },
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability 4",
    currentCd: 0,
    maxCd: 7,
    costType: "MP",
    costAmount: 25,
    duration: 120,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "spell",
    icon: {
      enabled: "Replaceabletextures\\CommandButtons\\BTNDefend.blp",
      disabled: "Replaceabletextures\\CommandButtonsDisabled\\DISBTNDefend.blp",
    },
    tooltip: {
      title: "Test Ability 4 (V)",
      body: 
        "Energy Absorption Guard, blocks 150% of incoming dmg until the dmg block exceeds 10*INT. 25 mp, cd 7"
    },
    components: [
      { name: "block energy absorption" },
    ],
  },
  // -------------------------------------------
];