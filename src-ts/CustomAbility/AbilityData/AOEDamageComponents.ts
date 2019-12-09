import { AOEDamage } from "CustomAbility/AbilityComponent/AOEDamage";

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
export module BASE {
  export const KAME_DPS = 0.006;
  export const KAME_EXPLOSION = 0.04;
  export const SPIRIT_BOMB_DPS = 0.003;
  export const SPIRIT_BOMB_EXPLOSION = 0.4;
  export const DFIST_DPS = 0.012;
  export const DFIST_EXPLOSION = 0.3;
}

export const AOEDamageComponents = [
  // used for kame
  // note: i named the dmg components differently
  // so it'd be easier to fiddle with the numbers without having to constantly
  // rechange the name of the component in the beam/ability
  // copy from here
  {
    name: "damage kame dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // to here, and replace with unique name
  {
    name: "damage kame explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // god kame
  {
    name: "damage god kame dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage god kame explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 1.5,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_DPS,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage spirit bomb explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 600,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.DFIST_DPS,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage dragon fist explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.DFIST_EXPLOSION,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS * 5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage final flash explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS * 5 * 3,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // big bang attack
  {
    name: "damage big bang attack explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION * 0.85,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // energy blast volley
  {
    name: "damage energy blast volley dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.12,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.8,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.45,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage twin dragon shot explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 0.45,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // super dragon flight
  {
    name: "damage super dragon flight dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: 30,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.DFIST_DPS * 0.7,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // finish buster 
  {
    name: "damage finish buster dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.8,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage finish buster explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 1.6,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // heat dome attack initial explosion
  {
    name: "damage heat dome attack explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 2,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // burning attack 
  {
    name: "damage target burning attack dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_TARGET_POINT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage target burning attack explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_TARGET_POINT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 2,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // blazing rush
  {
    name: "damage blazing rush explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 250,
    damageData: {
      multiplier: BASE.DFIST_EXPLOSION * 0.35,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // special beam cannon
  {
    name: "damage special beam cannon dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // hellzone grenade
  {
    name: "damage hellzone grenade dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.04,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage hellzone grenade explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 0.4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // tyrant lancer
  {
    name: "damage tyrant lancer dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: 25,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.DFIST_DPS,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage beam tyrant lancer dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 320,
    damageData: {
      multiplier: BASE.KAME_DPS * 3,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage beam tyrant lancer explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 3,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // saiyan spirit
  {
    name: "damage saiyan spirit dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: 25,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 310,
    damageData: {
      multiplier: BASE.DFIST_DPS * 1.3,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage beam saiyan spirit dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 330,
    damageData: {
      multiplier: BASE.KAME_DPS * 4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage beam saiyan spirit explosion",
    repeatInterval: 1,
    startTick: 32,
    endTick: 32,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION * 4,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // riot javelin
  {
    name: "damage beam riot javelin dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 320,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_DPS * 2.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage beam riot javelin explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION * 0.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // rebellion spear
  {
    name: "damage rebellion spear dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 320,
    damageData: {
      multiplier: BASE.DFIST_DPS * 0.8,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // angry shout
  {
    name: "damage angry shout spear dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 900,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_DPS * 2,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // 13 energy beam beam
  {
    name: "damage energy beam dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // ss deadly hammer
  {
    name: "damage ss deadly hammer dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: 25,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.DFIST_DPS * 0.15,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // ss deadly bomber
  {
    name: "damage ss deadly bomber dps",
    repeatInterval: 16,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.5 * 16,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // 13 nuke 
  {
    name: "damage target nuke dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_TARGET_POINT,
    aoe: 900,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.66,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage target nuke explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_TARGET_POINT,
    aoe: 900,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // 13 energy beam beam
  {
    name: "damage overcharge dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 220,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.33,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // babidi
  {
    name: "damage target haretsu explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_TARGET_UNIT,
    aoe: 50,
    damageData: {
      multiplier: BASE.DFIST_EXPLOSION * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // babidi
  {
    name: "damage target haretsu explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_TARGET_UNIT,
    aoe: 50,
    damageData: {
      multiplier: BASE.DFIST_EXPLOSION * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // buu flesh attack
  {
    name: "damage target flesh attack explosion",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_TARGET_UNIT,
    aoe: 50,
    damageData: {
      multiplier: BASE.DFIST_EXPLOSION * 0.7,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // innocence breath
  {
    name: "damage innocence breath dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.2,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // angry explosion
  {
    name: "damage angry explosion dps",
    repeatInterval: 1,
    startTick: 50,
    endTick: 149,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 800,
    damageData: {
      multiplier: BASE.KAME_DPS * 0.33,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage angry explosion explosion",
    repeatInterval: 1,
    startTick: 50,
    endTick: 50,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 800,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // mankind attack
  {
    name: "damage mankind destruction attack dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.KAME_DPS * 1.5,
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
    startTick: 0,
    endTick: 20,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 400,
    damageData: {
      multiplier: BASE.DFIST_DPS * 0.75,
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
    startTick: 0,
    endTick: 0,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION * 0.75,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_DPS,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage planet crusher explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 600,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS,
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
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_DPS * 1.2,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage gigantic omegastorm explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.KAME_EXPLOSION,
      attribute: bj_HEROSTAT_STR,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // death beam
  {
    name: "damage death beam frieza dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 325,
    damageData: {
      multiplier: BASE.KAME_DPS,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // nova chariot (match with dfist but agi-version)
  {
    name: "damage nova chariot dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 300,
    damageData: {
      multiplier: BASE.DFIST_DPS * 1.4,
      attribute: bj_HEROSTAT_AGI,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  // supernova golden, upped spirit bomb dmg
  {
    name: "damage supernova golden dps",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 500,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_DPS * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
  {
    name: "damage supernova golden explosion",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    damageSource: AOEDamage.SOURCE_UNIT,
    aoe: 600,
    damageData: {
      multiplier: BASE.SPIRIT_BOMB_EXPLOSION * 1.5,
      attribute: bj_HEROSTAT_INT,
      attackType: 6,
      damageType: 0,
      weaponType: 0,
    },
  },
];