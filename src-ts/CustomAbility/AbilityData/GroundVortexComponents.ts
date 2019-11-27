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


// note: ground vortex comes with its own
// knock-in and progressive damage components
export const GroundVortexComponents = [
  // copy from here
  {
    name: "ground vortex blue hurricane",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageData: {
      multiplier: 0.02,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6, 
      damageType: 0, 
      weaponType: 0, 
    },
    angle: 70,
    distance: 40,
    aoe: 650,
    closenessAngle: 90 + 12,
    closenessDistanceMult: -0.25,
    closenessDamageMult: 1.0,
    durationDamageMult: 1.0,
  },
  // to here, and replace with unique name
  {
    name: "ground vortex fast spin",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageData: {
      multiplier: 0.06,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6, 
      damageType: 0, 
      weaponType: 0, 
    },
    angle: 60,
    distance: 45,
    aoe: 350,
    closenessAngle: 90 + 30,
    closenessDistanceMult: -0.4,
    closenessDamageMult: 2.0,
    durationDamageMult: 1.0,
  },
];