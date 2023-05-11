import { BASE_DMG } from "Common/Constants";

/*

// Hero stats
constant integer   bj_HEROSTAT_INT             = 0
constant integer   bj_HEROSTAT_INT             = 1
constant integer   bj_HEROSTAT_INT             = 2

constant attacktype         ATTACK_TYPE_NORMAL              = ConvertAttackType(0)
constant attacktype         ATTACK_TYPE_MELEE               = ConvertAttackType(1)
constant attacktype         ATTACK_TYPE_PIERCE              = ConvertAttackType(2)
constant attacktype         ATTACK_TYPE_SIEGE               = ConvertAttackType(3)
constant attacktype         ATTACK_TYPE_MAGIC               = ConvertAttackType(4)
constant attacktype         ATTACK_TYPE_CHAOS               = ConvertAttackType(5)
constant attacktype         ATTACK_TYPE_HERO                = ConvertAttackType(6)

// damage type is pointless

constant weapontype         WEAPON_TYPE_WHOKNOWS            = ConvertWeaponType(0)
constant weapontype         WEAPON_TYPE_METAL_LIGHT_CHOP    = ConvertWeaponType(1)
constant weapontype         WEAPON_TYPE_METAL_MEDIUM_CHOP   = ConvertWeaponType(2)
constant weapontype         WEAPON_TYPE_METAL_HEAVY_CHOP    = ConvertWeaponType(3)
constant weapontype         WEAPON_TYPE_METAL_LIGHT_SLICE   = ConvertWeaponType(4)
constant weapontype         WEAPON_TYPE_METAL_MEDIUM_SLICE  = ConvertWeaponType(5)
constant weapontype         WEAPON_TYPE_METAL_HEAVY_SLICE   = ConvertWeaponType(6)
constant weapontype         WEAPON_TYPE_METAL_MEDIUM_BASH   = ConvertWeaponType(7)
constant weapontype         WEAPON_TYPE_METAL_HEAVY_BASH    = ConvertWeaponType(8)
constant weapontype         WEAPON_TYPE_METAL_MEDIUM_STAB   = ConvertWeaponType(9)
constant weapontype         WEAPON_TYPE_METAL_HEAVY_STAB    = ConvertWeaponType(10)
constant weapontype         WEAPON_TYPE_WOOD_LIGHT_SLICE    = ConvertWeaponType(11)
constant weapontype         WEAPON_TYPE_WOOD_MEDIUM_SLICE   = ConvertWeaponType(12)
constant weapontype         WEAPON_TYPE_WOOD_HEAVY_SLICE    = ConvertWeaponType(13)
constant weapontype         WEAPON_TYPE_WOOD_LIGHT_BASH     = ConvertWeaponType(14)
constant weapontype         WEAPON_TYPE_WOOD_MEDIUM_BASH    = ConvertWeaponType(15)
constant weapontype         WEAPON_TYPE_WOOD_HEAVY_BASH     = ConvertWeaponType(16)
constant weapontype         WEAPON_TYPE_WOOD_LIGHT_STAB     = ConvertWeaponType(17)
constant weapontype         WEAPON_TYPE_WOOD_MEDIUM_STAB    = ConvertWeaponType(18)
constant weapontype         WEAPON_TYPE_CLAW_LIGHT_SLICE    = ConvertWeaponType(19)
constant weapontype         WEAPON_TYPE_CLAW_MEDIUM_SLICE   = ConvertWeaponType(20)
constant weapontype         WEAPON_TYPE_CLAW_HEAVY_SLICE    = ConvertWeaponType(21)
constant weapontype         WEAPON_TYPE_AXE_MEDIUM_CHOP     = ConvertWeaponType(22)
constant weapontype         WEAPON_TYPE_ROCK_HEAVY_BASH     = ConvertWeaponType(23)
*/

export const SwordSlashComponents = [
  // copy from here
  { 
    name: "slash shining sword attack",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 40,
    damageData: {
      multiplier: BASE_DMG.KAME_DPS * 3,
      attribute: bj_HEROSTAT_INT,
      attackType: 6, 
      damageType: 4, 
      weaponType: 0, 
    },
    maxDistance: 400,
    // -1 means triggers all the time
    minDistance: -1,
    aoe: 225,
    delayBetweenDamageTicks: 4,
    sfxList: [
      {
        model: "animeslashfinal.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.5,
        endScale: -1,
        startHeight: 50,
        endHeight: 50,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 155,
          z: 105,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
    attachedSfxList: [
      {
        model: "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl",
        repeatInterval: 0,
        group: 0,
        scale: 1.0,
        endScale: -1,
        startHeight: 0,
        endHeight: 0,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 155,
          z: 55,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "weapon",
      },
    ],
  },
  // dart double slash
  { 
    name: "slash double slash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 16,
    damageData: {
      multiplier: BASE_DMG.KAME_DPS * 5.4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6, 
      damageType: 4, 
      weaponType: 0, 
    },
    maxDistance: 300,
    // -1 means triggers all the time
    minDistance: -1,
    aoe: 350,
    delayBetweenDamageTicks: 8,
    sfxList: [
      {
        model: "animeslashfinal.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.5,
        endScale: -1,
        startHeight: 50,
        endHeight: 50,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 125,
          z: 75,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
    attachedSfxList: [
    ],
  },
  // dart burning rush
  { 
    name: "slash burning rush",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 24,
    damageData: {
      multiplier: BASE_DMG.KAME_DPS * 4.6,
      attribute: bj_HEROSTAT_INT,
      attackType: 6, 
      damageType: 4, 
      weaponType: 0, 
    },
    maxDistance: 300,
    minDistance: -1,
    aoe: 350,
    delayBetweenDamageTicks: 8,
    sfxList: [
      {
        model: "animeslashfinal.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.5,
        endScale: -1,
        startHeight: 50,
        endHeight: 50,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 125,
          z: 75,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
    attachedSfxList: [
    ],
  },
  // dart madness slash
  { 
    name: "slash madness slash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 24,
    damageData: {
      multiplier: BASE_DMG.KAME_DPS * 4.6,
      attribute: bj_HEROSTAT_INT,
      attackType: 6, 
      damageType: 4, 
      weaponType: 0, 
    },
    maxDistance: 300,
    minDistance: -1,
    aoe: 350,
    delayBetweenDamageTicks: 8,
    sfxList: [
      {
        model: "animeslashfinal.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.5,
        endScale: -1,
        startHeight: 50,
        endHeight: 50,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 205,
          y: 25,
          z: 255,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
    attachedSfxList: [
    ],
  },
  // to here, and replace with unique name
  { 
    name: "sword slash pink",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    damageData: {
      multiplier: 0.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6, 
      damageType: 4, 
      weaponType: 0, 
    },
    maxDistance: 700,
    minDistance: 0,
    aoe: 225,
    delayBetweenDamageTicks: 4,
    sfxList: [
      {
        model: "animeslashfinal.mdl",
        repeatInterval: 1,
        group: 0,
        scale: 1.5,
        endScale: -1,
        startHeight: 25,
        endHeight: 25,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 255,
          y: 105,
          z: 205,
        },
        updateCoordsOnly: false,
        persistent: false,
        attachmentPoint: "origin",
      },
    ],
    attachedSfxList: [
      {
        model: "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl",
        repeatInterval: 0,
        group: 0,
        scale: 1.0,
        endScale: -1,
        startHeight: 0,
        endHeight: 0,
        extraDirectionalYaw: 0,
        extraPitch: 0,
        extraRoll: 0,
        animSpeed: 1.0,
        color: {
          x: 55,
          y: 0,
          z: 55,
        },
        updateCoordsOnly: false,
        persistent: true,
        attachmentPoint: "weapon",
      },
    ],
  },
];