export const AbilitiesList = [
  // copy from here
  {
    name: "Zanzo Dash",
    currentCd: 0,
    maxCd: 4,
    costType: "MP",
    costAmount: 25,
    duration: 25,
    updateRate: 0.03,
    castTime: 0.06,
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
        "Dashes towards your last right click." + 
        "|nCost: 25 MP |nCD: 4",
    },
    components: [
      { name: "ground dash 40dist" },
      { name: "sfx zanzo dash" },
    ],
  },
  // to here, and replace with unique name
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
    name: "Beam Blue",
    currentCd: 0,
    maxCd: 6,
    costType: "MP",
    costAmount: 25,
    duration: 160,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNBreathOfFrost.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNBreathOfFrost.blp"
    },
    tooltip: {
      title: "Beam Blue",
      body: 
        "Fires a slow-moving blue beam. " + 
        "|nDeals 0.5 * INT per Damage Tick in 250 AOE and 5 * INT in 300 AOE at the end." + 
        "|nCost: 25 MP |nCD: 6",
    },
    components: [
      { name: "beam blue" },
    ],
  },
  // -------------------------------------------
  {
    name: "Beam Purple",
    currentCd: 0,
    maxCd: 6,
    costType: "MP",
    costAmount: 75,
    duration: 60,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp"
    },
    tooltip: {
      title: "Beam Purple",
      body: 
        "Fires a medium-speed purple beam that sucks in nearby enemies and can be redirected with right clicks." + 
        "|nDeals 0.5 * INT per Damage Tick in 250 AOE and 5 * INT in 300 AOE at the end." + 
        "|nCost: 75 MP |nCD: 6",
    },
    components: [
      { name: "beam purple" },
    ],
  },
  // -------------------------------------------
  {
    name: "Beam Red",
    currentCd: 0,
    maxCd: 6,
    costType: "HP",
    costAmount: 75,
    duration: 40,
    updateRate: 0.03,
    castTime: 0.25,
    canMultiCast: false,
    waitsForNextClick: true,
    animation: "spell",
    icon: {
      enabled: "ReplaceableTextures\\CommandButtons\\BTNSoulBurn.blp",
      disabled: "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNSoulBurn.blp"
    },
    tooltip: {
      title: "Beam Red",
      body: 
        "Fires a fast-moving red beam. " + 
        "|nDeals 0.5 * STR per Damage Tick in 250 AOE and 5 * STR in 300 AOE at the end." + 
        "|nCost: 75 MP |nCD: 6",
    },
    components: [
      { name: "beam red" },
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability",
    currentCd: 0,
    maxCd: 4,
    costType: "HP",
    costAmount: 25,
    duration: 67,
    updateRate: 0.03,
    castTime: 0.25,
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
        "Lorem Ips. 25hp, cd4"
    },
    components: [
      {name: "beam kamehameha"},
      {name: "sword slash pink"},
      {name: "flying dash 5dist"},
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
        "Lorem Ips 2. 25mp, cd4"
    },
    components: [
      {name: "flying dash 20dist"},
    ],
  },
  // -------------------------------------------
  {
    name: "Test Ability 3",
    currentCd: 0,
    maxCd: 12,
    costType: "MP",
    costAmount: 125,
    duration: 150,
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
        "Lorem Ips 3. 125 mp, cd 12"
    },
    components: [
      {name: "beam vortex test"},
    ],
  },
  // -------------------------------------------
];