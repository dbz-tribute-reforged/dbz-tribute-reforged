export const AbilitiesList = [
  // copy from here
  {
    name: "Zanzo Dash",
    currentCd: 0,
    maxCd: 19,
    costType: "MP",
    costAmount: 75,
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
      title: "Zanzo Dash",
      body: 
        "Dashes towards your next right click." + 
        "|nCost: 75 MP |nCD: 19",
    },
    components: [
      { name: "ground dash 40dist" },
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
        "Basic Guard ability that blocks 50% of incoming dmg until the damage blocked exceeds 5 * STR." + 
        "|nCost:25 MP|nCD: 9"
    },
    components: [
      { name: "block basic guard" },
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
      title: "kame",
      body: 
        "kame stuff"
    },
    components: [
      { name: "beam kamehameha" },
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
    duration: 132,
    updateRate: 0.03,
    castTime: 0.25,
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
      { name: "sfx blue wind aura" },
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
      { name: "ground dash 25dist" },
      { name: "damage 1tick 0.15agi 300aoe" },
      { name: "damage final 5agi 400aoe" },
      { name: "knockback 1tick 25speed 180angle 250aoe" },
      { name: "sfx dragon fist" },
    ],
  },
  // -------------------------------------------
  {
    name: "Ultra Instinct",
    currentCd: 0,
    maxCd: 6,
    costType: "HP",
    costAmount: 0,
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
      title: "Ultra Instinct",
      body: 
        "Ultra Instinct (dodging randomly + blocking 20*INT). 25hp, cd7"
    },
    components: [
      { name: "dodge ultra instinct" },
      { name: "block ultra instinct" },
      { name: "sfx ultra instinct" },
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
    name: "Shining Sword Attack",
    currentCd: 0,
    maxCd: 4,
    costType: "MP",
    costAmount: 25,
    duration: 67,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: false,
    animation: "attack",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNArcaniteMelee.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNArcaniteMelee.blp"
    },
    tooltip: {
      title: "Shining Sword Attack",
      body: 
        "Performs multiple sword slashes as you move your cursor around." + 
        "|nDeals 1 * AGI per slash in 225 AOE per damage tick" + 
        "(minimum 0.09s)" + 
        "|nCost: 25 MP |nCD: 4",
    },
    components: [
      { name: "sword slash orange" },
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability",
    currentCd: 0,
    maxCd: 7,
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
      { name: "ground dash 25dist" },
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