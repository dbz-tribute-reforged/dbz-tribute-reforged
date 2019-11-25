/*

// Hero stats
constant integer   bj_HEROSTAT_STR             = 0
constant integer   bj_HEROSTAT_AGI             = 1
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

export const AOEDamageComponents = [
  // copy from here
  {
    name: "damage 1tick 0.5int 250aoe",
    repeatInterval: 1,
    damageData: {
      multiplier: 0.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 250,
  },
  // to here, and replace with unique name
  {
    name: "damage 1tick 0.5str 250aoe",
    repeatInterval: 1,
    damageData: {
      multiplier: 0.5,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 250,
  },
  // to here, and replace with unique name
  {
    name: "damage 1tick 0.5agi 250aoe",
    repeatInterval: 1,
    damageData: {
      multiplier: 0.5,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 250,
  },
  {
    name: "damage 5tick 2int 250aoe",
    repeatInterval: 5,
    damageData: {
      multiplier: 2,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 250,
  },
  {
    name: "damage final 5str 300aoe",
    repeatInterval: -1,
    damageData: {
      multiplier: 5,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 300,
  },
  {
    name: "damage final 5agi 300aoe",
    repeatInterval: -1,
    damageData: {
      multiplier: 5,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 300,
  },
  {
    name: "damage final 5int 300aoe",
    repeatInterval: -1,
    damageData: {
      multiplier: 5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
    aoe: 300,
  },
];