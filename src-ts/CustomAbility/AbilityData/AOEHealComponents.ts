import { AOEHeal } from "CustomAbility/AbilityComponent/AOEHeal";
import { BASE_DMG } from "Common/Constants";

export const AOEHealComponents = [
  {
    name: "heal caster bankai hollow",
    repeatInterval: 5,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 1,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: true,
    canHealCaster: true,
    maxHealTicks: AOEHeal.UNLIMITED_HEAL_TICKS,
    healMult: 0.0,
    healAttribute: bj_HEROSTAT_AGI,
    maxHealthHealPercent: 0.006,
    requireBuff: false,
    buffId: 0,
  },
  // frog slurp
  {
    name: "heal frog slurp",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 300,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: false,
    canHealCaster: true,
    maxHealTicks: 3,
    healMult: BASE_DMG.KAME_DPS * 2,
    healAttribute: bj_HEROSTAT_INT,
    maxHealthHealPercent: 0.0,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "heal frog slurp bonus",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 300,
    maxHealTargets: 1,
    onlyHealHeroes: true,
    onlyHealCaster: false,
    canHealCaster: false,
    maxHealTicks: 1,
    healMult: 0.0,
    healAttribute: bj_HEROSTAT_INT,
    maxHealthHealPercent: 0.04,
    requireBuff: false,
    buffId: 0,
  },
  // robo heal beam
  {
    name: "heal robo heal beam",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 800,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: false,
    canHealCaster: true,
    maxHealTicks: 10,
    healMult: BASE_DMG.KAME_DPS * 0.6,
    healAttribute: bj_HEROSTAT_INT,
    maxHealthHealPercent: 0.002,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "heal marle aura",
    repeatInterval: 11,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 600,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: false,
    canHealCaster: true,
    maxHealTicks: 15,
    healMult: BASE_DMG.KAME_DPS * .05,
    healAttribute: bj_HEROSTAT_INT,
    maxHealthHealPercent: 0.004,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "heal marle cure",
    repeatInterval: 1,
    startTick: 66,
    endTick: 66,
    healSource: AOEHeal.SOURCE_TARGET_POINT_FIXED,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 800,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: false,
    canHealCaster: true,
    maxHealTicks: 1,
    healMult: BASE_DMG.KAME_DPS * 0.8,
    healAttribute: bj_HEROSTAT_INT,
    maxHealthHealPercent: 0.08,
    requireBuff: false,
    buffId: 0,
  },
  // rust gobble
  {
    name: "heal caster rust gobble",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    healSource: AOEHeal.SOURCE_UNIT,
    sourceHPHealScale: 0,
    useInverseHealScale: true,
    useLastCastPoint: false,
    aoe: 1,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: true,
    canHealCaster: true,
    maxHealTicks: AOEHeal.UNLIMITED_HEAL_TICKS,
    healMult: 0.0,
    healAttribute: bj_HEROSTAT_STR,
    maxHealthHealPercent: 0.08,
    requireBuff: false,
    buffId: 0,
  },
];