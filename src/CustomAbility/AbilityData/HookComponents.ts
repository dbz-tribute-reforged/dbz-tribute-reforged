import { BASE_DMG } from "Common/Constants";

export const HookComponents = [
  {
    name: "hook slappy hand", 
    repeatInterval: 1, 
    startTick: 0, 
    endTick: -1,
    damageData: {
      multiplier: BASE_DMG.KAME_DPS * 18,  
      attribute: bj_HEROSTAT_INT, 
      attackType: 6,
      damageType: 4, 
      weaponType: 0, 
    }, 
    maxRange: 1500,
    speed: 50,
    aoe: 200,
    onlyHookHeroes: true,
    enablePierce: true,
    useLastCastPoint: true,
    sfxList: [
      {
        model: "SlappyArm.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.5,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "SlappyHand.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.7,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        updateCoordsOnly: true,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl",
        repeatInterval: 3,
        group: 0,
        scale: 1,
        endScale: -1,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 205,
          y: 255,
          z: 205,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
    ],
  },
  // slurp cut
  {
    name: "hook slurp cut", 
    repeatInterval: 1, 
    startTick: 0, 
    endTick: -1,
    damageData: {
      multiplier: BASE_DMG.DFIST_EXPLOSION * 0.9,  
      attribute: bj_HEROSTAT_INT, 
      attackType: 6,
      damageType: 4, 
      weaponType: 0, 
    }, 
    maxRange: 1500,
    speed: 50,
    aoe: 200,
    onlyHookHeroes: true,
    enablePierce: true,
    useLastCastPoint: true,
    sfxList: [
      {
        model: "FrogTongue.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 0.6,
        endScale: -1,
        startHeight: 100,
        endHeight: 100,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "FrogTongue.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 0.8,
        endScale: -1,
        startHeight: 100,
        endHeight: 100,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        updateCoordsOnly: true,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl",
        repeatInterval: 3,
        group: 0,
        scale: 1,
        endScale: -1,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 205,
          y: 255,
          z: 205,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
    ],
  },
  // frog tongue
  {
    name: "hook frog tongue", 
    repeatInterval: 1, 
    startTick: 0, 
    endTick: -1,
    damageData: {
      multiplier: BASE_DMG.DFIST_EXPLOSION * 0.45,
      attribute: bj_HEROSTAT_INT, 
      attackType: 6,
      damageType: 4, 
      weaponType: 0, 
    }, 
    maxRange: 1500,
    speed: 50,
    aoe: 200,
    onlyHookHeroes: true,
    enablePierce: true,
    useLastCastPoint: true,
    sfxList: [
      {
        model: "SlappyArm.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.5,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 195,
          z: 205,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "SlappyHand.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.7,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 195,
          z: 205,
        },
        updateCoordsOnly: true,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "BuuBreath3.mdl",
        repeatInterval: 2,
        group: 0,
        scale: 0.75,
        endScale: -1,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
    ],
  },
  // hirudegarn tail attack
  {
    name: "hook hirudegarn tail attack", 
    repeatInterval: 1, 
    startTick: 0, 
    endTick: -1,
    damageData: {
      multiplier: BASE_DMG.DFIST_EXPLOSION * 0.6,  
      attribute: bj_HEROSTAT_INT, 
      attackType: 6,
      damageType: 4, 
      weaponType: 0, 
    }, 
    maxRange: 1500,
    speed: 50,
    aoe: 200,
    onlyHookHeroes: true,
    enablePierce: true,
    useLastCastPoint: true,
    sfxList: [
      {
        model: "SlappyArm.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.5,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 55,
          y: 55,
          z: 55,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "SlappyHand.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 3.7,
        endScale: -1,
        startHeight: 75,
        endHeight: 75,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 55,
          y: 55,
          z: 55,
        },
        updateCoordsOnly: true,
        persistent: true,
        attachmentPoint: "",
      },
      {
        model: "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl",
        repeatInterval: 3,
        group: 0,
        scale: 1,
        endScale: -1,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 55,
          y: 155,
          z: 55,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
    ],
  },
  // rust chomp
  {
    name: "hook rust chomp", 
    repeatInterval: 1, 
    startTick: 0, 
    endTick: -1,
    damageData: {
      multiplier: BASE_DMG.DFIST_EXPLOSION * 0.7,
      attribute: bj_HEROSTAT_INT, 
      attackType: 6,
      damageType: 4, 
      weaponType: 0, 
    }, 
    maxRange: 1500,
    speed: 50,
    aoe: 250,
    onlyHookHeroes: true,
    enablePierce: true,
    useLastCastPoint: true,
    sfxList: [
      {
        model: "SpiritBomb.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 2.0,
        endScale: -1,
        startHeight: 300,
        endHeight: 300,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 0,
          z: 0,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
      {
        model: "SpiritBomb.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.0,
        endScale: -1,
        startHeight: 300,
        endHeight: 300,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 25,
          z: 25,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "",
      },
    ],
  },
];