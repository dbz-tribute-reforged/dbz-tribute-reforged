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
  // used for kame
  // note: i named the dmg components differently
  // so it'd be easier to fiddle with the numbers without having to constantly
  // rechange the name of the component in the beam/ability
  // copy from here
  {
    name: "damage kame dps",
    repeatInterval: 1,
    aoe: 400,
    damageData: {
      multiplier: 0.02,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // to here, and replace with unique name
  {
    name: "damage kame explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 2,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // used for spirit bomb
  {
    name: "damage spirit bomb dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.03,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage spirit bomb explosion",
    repeatInterval: -1,
    aoe: 600,
    damageData: {
      multiplier: 3,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // used for dfist
  {
    name: "damage dragon fist dps",
    repeatInterval: 1,
    aoe: 300,
    damageData: {
      multiplier: 0.15,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage dragon fist explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // big bang attack
  {
    name: "damage big bang attack explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // final flash
  {
    name: "damage final flash dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.1,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage final flash explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 3.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // twin dragon shot
  {
    name: "damage twin dragon shot dps",
    repeatInterval: 1,
    aoe: 400,
    damageData: {
      multiplier: 0.01,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage twin dragon shot explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // masenko
  {
    name: "damage masenko dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.04,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // energy punch
  {
    name: "damage energy punch dps",
    repeatInterval: 1,
    aoe: 300,
    damageData: {
      multiplier: 0.1,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // power level rising
  {
    name: "damage power level rising explosion",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.66,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // planet crusher
  {
    name: "damage planet crusher dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.03,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage planet crusher explosion",
    repeatInterval: -1,
    aoe: 600,
    damageData: {
      multiplier: 3,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // gigantic roar dps
  {
    name: "damage gigantic roar dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.1,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // gigantic omegastorm
  {
    name: "damage gigantic omegastorm dps",
    repeatInterval: 1,
    aoe: 500,
    damageData: {
      multiplier: 0.1,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage gigantic omegastorm explosion",
    repeatInterval: -1,
    aoe: 500,
    damageData: {
      multiplier: 2.0,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
];