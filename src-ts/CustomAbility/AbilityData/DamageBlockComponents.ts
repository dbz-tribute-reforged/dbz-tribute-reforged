export const DamageBlockComponents = [
  // note: group 0 sfx are shown while dmg can still be blocked
  // group 1 sfx are shown the moment no more dmg can be blocked
  // copy from here
  {
    name: "block basic guard",
    repeatInterval: 1,
    blockPerDamage: 50,
    isPercentageBlock: true,
    attribute: bj_HEROSTAT_STR,
    multiplier: 5,
    sfxList: [
      {
        model: "Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl",
        repeatInterval: 1,
        group: 1,
        scale: 1.5,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        persistent: false,
        attachmentPoint: "",
      },
    ],
    attachedSfxList: [
      {
        model: "Abilities\\Spells\\Human\\ManaShield\\ManaShieldCaster.mdl",
        repeatInterval: 0,
        group: 0,
        scale: 1.0,
        startHeight: 0,
        endHeight: 0,
        extraDirectionalYaw: 0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        persistent: true,
        attachmentPoint: "origin",
      },
    ],
  },
  // to here, and replace with unique name
  // ----------------------------------------
  {
    name: "block energy absorption",
    repeatInterval: 1,
    blockPerDamage: 150,
    isPercentageBlock: true,
    attribute: bj_HEROSTAT_INT,
    multiplier: 10,
    sfxList: [
      {
        model: "Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl",
        repeatInterval: 1,
        group: 1,
        scale: 1.5,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        persistent: false,
        attachmentPoint: "",
      },
    ],
    attachedSfxList: [
      {
        model: "Abilities\\Spells\\Undead\\Cripple\\CrippleTarget.mdl",
        repeatInterval: 0,
        group: 0,
        scale: 1.0,
        startHeight: 0,
        endHeight: 0,
        extraDirectionalYaw: 0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        persistent: true,
        attachmentPoint: "origin",
      },
    ],
  },
  // ----------------------------------------
  {
    name: "block ultra instinct",
    repeatInterval: 1,
    blockPerDamage: 100,
    isPercentageBlock: true,
    attribute: bj_HEROSTAT_INT,
    multiplier: 100,
    sfxList: [
      {
        model: "Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl",
        repeatInterval: 1,
        group: 1,
        scale: 1.5,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        color: {
          x: 105,
          y: 155,
          z: 255,
        },
        persistent: false,
        attachmentPoint: "",
      },
    ],
    attachedSfxList: [
      {
        model: "Abilities\\Spells\\Orc\\MirrorImage\\MirrorImageDeathCaster.mdl",
        repeatInterval: 6,
        group: 0,
        scale: 1.0,
        startHeight: 0,
        endHeight: 0,
        extraDirectionalYaw: 0,
        color: {
          x: 155,
          y: 155,
          z: 255,
        },
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
  },
];